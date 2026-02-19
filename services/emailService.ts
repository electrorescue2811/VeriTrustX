import emailjs from '@emailjs/browser';

// Constants for EmailJS
// You need to create an account at https://www.emailjs.com/
// And create a service + template
const SERVICE_ID = 'service_uhetpzi'; 
const TEMPLATE_ID = 'template_2oksuko';
const PUBLIC_KEY = 'lngwiaKsHLOTqFefy'; 

// Spam domain blocklist
const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'temp-mail.org',
  'guerrillamail.com',
  'yopmail.com',
  '10minutemail.com',
  'sharklasers.com',
  'throwawaymail.com'
];

export const isSpamEmail = (email: string): boolean => {
  const domain = email.split('@')[1];
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.includes(domain.toLowerCase());
};

export const sendOTPEmail = async (email: string, otp: string) => {
  // If no public key is set, we simulate the email send for the prototype
  if ((PUBLIC_KEY as string) === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.log(`[SIMULATION] Email sent to ${email} with OTP: ${otp}`);
    return { status: 200, text: 'OK (Simulation)' };
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: email,
        otp_code: otp,
        message: 'Your verification code for VeriTrustX Admin Portal',
      },
      PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};