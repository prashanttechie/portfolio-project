import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = (): Razorpay => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in environment variables');
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  
  return razorpayInstance;
};

export const formatAmountForRazorpay = (amount: number): number => {
  // Razorpay expects amounts in paise (smallest currency unit)
  // For INR: 1 rupee = 100 paise
  return Math.round(amount * 100);
};

export const formatAmountFromRazorpay = (amount: number): number => {
  // Convert from paise to rupees
  return amount / 100;
};
