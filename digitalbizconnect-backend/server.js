import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_TEST;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://digitalbizconnect.com',
  'https://www.digitalbizconnect.com',
  ...(process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not configured. Payment intent creation will fail until it is set.');
}

const stripe = new Stripe(stripeSecretKey || 'sk_missing');

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'DigitalBizConnect payment backend',
  });
});

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

    const checkoutType = productType || 'website-template';
    const isWebsiteCheckout = checkoutType === 'website-template' || checkoutType === 'website-template-reservation';
    const amountInDollars = Number(amount);

    if (!isWebsiteCheckout) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported product type for DigitalBizConnect checkout.',
      });
    }

    if (!Number.isFinite(amountInDollars) || amountInDollars <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount.',
      });
    }

    const checkoutId = orderId || `website-${templateId || 'template'}-${Date.now()}`;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInDollars * 100),
      currency: 'USD',
      description: checkoutType === 'website-template-reservation'
        ? `Website reservation - ${businessName || checkoutId}`
        : `Website setup checkout - ${businessName || checkoutId}`,
      receipt_email: customerEmail,
      metadata: {
        orderId: checkoutId,
        productType: checkoutType,
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
    console.error('Stripe payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment intent creation failed.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`DigitalBizConnect payment backend running on port ${PORT}`);
});
