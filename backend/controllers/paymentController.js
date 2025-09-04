import crypto from 'crypto';

// Just return dummy keys from .env
const config = (req, res) =>
  res.send({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'dummyKey123',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'dummySecret456'
  });

// Fake order create (always success)
const order = async (req, res, next) => {
  try {
    const options = req.body;

    // Instead of Razorpay API, return dummy order object
    const order = {
      id: 'order_dummy_' + Date.now(),
      amount: options.amount || 50000, // 500.00 INR
      currency: options.currency || 'INR',
      status: 'created'
    };

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Fake validate (always success)
const validate = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id } = req.body;

  // Just generate a fake signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummySecret456')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Always success (skip actual comparison)
  res.status(201).json({
    id: razorpay_payment_id || 'dummy_payment_' + Date.now(),
    status: 'success',
    message: 'Payment is successful (dummy)',
    signature: generatedSignature,
    updateTime: new Date().toLocaleTimeString()
  });
};

export { config, order, validate };
