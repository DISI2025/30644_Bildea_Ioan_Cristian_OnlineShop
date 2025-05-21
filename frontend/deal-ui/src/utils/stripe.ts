// Stripe test publishable key - replace with your actual key in production
export const TEST_CARDS = {
  // 3D Secure via SMS OTP
  SMS_3DS: '4000 0000 0000 3220',
  // 3D Secure three-step (frictionless→challenge)
  THREE_STEP_3DS: '4000 0000 0000 3063',
  // Normal card without 3D Secure
  NORMAL: '4242 4242 4242 4242'
};

// Test OTP for 3D Secure verification
export const TEST_OTP = '12345'; 