# DigitalBizConnect Backend

Dedicated Stripe payment backend for DigitalBizConnect website-template checkout.

This service is separate from the PartySavingRental backend, so rental payments can keep working without changes.

## Local Setup

```bash
cd digitalbizconnect-backend
npm install
npm start
```

Create `.env` from `.env.example`:

```env
PORT=4000
FRONTEND_ORIGINS=https://digitalbizconnect.com
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
```

## Render Setup

Create a new Render Web Service connected to the GitHub repo.

- Root Directory: `digitalbizconnect-backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

```env
FRONTEND_ORIGINS=https://digitalbizconnect.com
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
```

After Render gives you a URL, set the frontend environment variable:

```env
VITE_API_URL=https://your-digitalbizconnect-backend.onrender.com
```

Then redeploy the frontend.

## Endpoints

Health check:

```text
GET /
```

Create Stripe payment intent:

```text
POST /api/create-payment-intent
```

Supported product types:

- `website-template`
- `website-template-reservation`
