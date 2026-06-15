import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin only when credentials are configured.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;
const hasFirebaseServiceAccount = Boolean(serviceAccount?.project_id);

if (hasFirebaseServiceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.warn('Firebase Admin is not configured. Firestore admin endpoints are disabled.');
}

const db = hasFirebaseServiceAccount ? admin.firestore() : null;

function requireFirestore(res) {
  if (db) return true;

  res.status(503).json({
    success: false,
    message: 'Firebase Admin is not configured on the backend.',
  });
  return false;
}

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://digitalbizconnect.com',
  'https://www.digitalbizconnect.com',
  ...(process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Health check ---
app.get('/', (req, res) => {
  res.send('✅ Party Rental Backend is running with Firebase');
});

// --- Get all locations ---
app.get('/api/locations', async (req, res) => {
  try {
    const locationsSnapshot = await db.collection('locations').get();
    const locations = [];
    
    locationsSnapshot.forEach(doc => {
      locations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message,
    });
  }
});

// --- Create new location ---
app.post('/api/locations', async (req, res) => {
  try {
    const { name, state, latitude, longitude, address } = req.body;

    // Validate required fields
    if (!name || !state || !latitude || !longitude || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Create location ID from name (lowercase, no spaces)
    const locationId = name.toLowerCase().replace(/\s+/g, '-');

    // Check if location already exists
    const existingLocation = await db.collection('locations').doc(locationId).get();
    if (existingLocation.exists) {
      return res.status(400).json({
        success: false,
        message: 'Location with this name already exists',
      });
    }

    // Create location document
    await db.collection('locations').doc(locationId).set({
      name,
      state,
      latitude,
      longitude,
      address,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      locationId,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create location',
      error: error.message,
    });
  }
});

// --- Update location ---
app.put('/api/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, latitude, longitude, address } = req.body;

    // Validate required fields
    if (!name || !state || !latitude || !longitude || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const locationRef = db.collection('locations').doc(id);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Update location document
    await locationRef.update({
      name,
      state,
      latitude,
      longitude,
      address,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message,
    });
  }
});

// --- Delete location ---
app.delete('/api/locations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const locationRef = db.collection('locations').doc(id);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    await locationRef.delete();

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete location',
      error: error.message,
    });
  }
});

// --- Create Order/Sale in Firestore ---
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerInfo,
      cart,
      deliveryMethod,
      deliveryCity,
      eventDates,
      eventTime,
      deliveryTime,
      rentalDays,
      subtotal,
      deliveryCost,
      pickupFee,
      total,
    } = req.body;

    // Validate required fields
    if (!customerInfo || !cart || cart.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order information' 
      });
    }

    // Create order document in Firestore
    const orderData = {
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
      },
      deliveryMethod,
      deliveryCity: deliveryCity ? {
        id: deliveryCity.id,
        name: deliveryCity.name,
        state: deliveryCity.state,
      } : null,
      eventDates,
      eventTime,
      deliveryTime,
      rentalDays,
      cart: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productType: item.product.type,
        quantity: item.quantity,
        pricePerUnit: item.product.price_per_unit,
        totalPrice: item.quantity * item.product.price_per_unit,
      })),
      pricing: {
        subtotal,
        deliveryCost: deliveryCost || 0,
        pickupFee: pickupFee || 0,
        total,
      },
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection('orders').add(orderData);

    // Save customer info if not exists
    const customerRef = db.collection('customers').doc(customerInfo.email);
    const customerDoc = await customerRef.get();
    
    if (!customerDoc.exists) {
      await customerRef.set({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        addresses: [customerInfo.address],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        totalOrders: 1,
      });
    } else {
      // Update customer with new address if different and increment order count
      const existingData = customerDoc.data();
      const addresses = existingData.addresses || [];
      if (!addresses.includes(customerInfo.address)) {
        addresses.push(customerInfo.address);
      }
      await customerRef.update({
        addresses,
        totalOrders: admin.firestore.FieldValue.increment(1),
        lastOrderAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderRef.id,
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// --- Stripe Payment Intent ---
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const {
      amount,
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      businessName,
      websiteDomain,
      templateId,
      productType,
      promoPrice,
      balanceDue,
      notes,
    } = req.body;

    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required amount' 
      });
    }

    const checkoutId = orderId || `website-${Date.now()}`;
    const isWebsiteCheckout = productType === 'website-template' || productType === 'website-template-reservation';
    const amountInDollars = Number(amount);

    if (!Number.isFinite(amountInDollars) || amountInDollars <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInDollars * 100), // Convert dollars to cents
      currency: 'USD',
      description: isWebsiteCheckout
        ? `Website setup checkout - ${businessName || checkoutId}`
        : `Party Rental Order #${checkoutId}`,
      receipt_email: customerEmail,
      metadata: {
        orderId: checkoutId,
        productType: productType || 'party-rental',
        templateId: templateId || '',
        businessName: businessName || '',
        websiteDomain: websiteDomain || '',
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        promoPrice: promoPrice ? String(promoPrice) : '',
        balanceDue: balanceDue ? String(balanceDue) : '',
        notes: notes || '',
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Payment intent creation failed',
      error: error.message,
    });
  }
});

// --- Confirm Payment and Update Order ---
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order in Firestore
      await db.collection('orders').doc(orderId).update({
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentIntentId,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Record sale in sales collection
      const orderDoc = await db.collection('orders').doc(orderId).get();
      const orderData = orderDoc.data();

      await db.collection('sales').add({
        orderId,
        customerEmail: orderData.customerInfo.email,
        customerName: orderData.customerInfo.name,
        total: orderData.pricing.total,
        paymentIntentId,
        eventDate: orderData.eventDates[0],
        rentalDays: orderData.rentalDays,
        deliveryMethod: orderData.deliveryMethod,
        saleDate: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        success: true,
        message: 'Payment confirmed and order updated',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status,
      });
    }

  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
});

// --- Get Order by ID ---
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.status(200).json({
      success: true,
      order: {
        id: orderDoc.id,
        ...orderDoc.data(),
      },
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
});

// --- Get Customer Orders ---
app.get('/api/customers/:email/orders', async (req, res) => {
  try {
    const { email } = req.params;
    
    const ordersSnapshot = await db.collection('orders')
      .where('customerInfo.email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error('❌ Error fetching customer orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
});

// --- Get All Sales (Admin) ---
app.get('/api/sales', async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    
    let query = db.collection('sales').orderBy('saleDate', 'desc');
    
    if (startDate) {
      query = query.where('saleDate', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('saleDate', '<=', new Date(endDate));
    }
    
    query = query.limit(parseInt(limit));
    
    const salesSnapshot = await query.get();
    
    const sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      sales,
      count: sales.length,
    });

  } catch (error) {
    console.error('❌ Error fetching sales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch sales',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 Firebase Firestore connected for data storage`);
});
