const admin = require('firebase-admin');
const { Resend } = require('resend');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request - Fetch all bookings
  if (req.method === 'GET') {
    try {
      const snapshot = await db
        .collection('bookings')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      const bookings = [];
      snapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Handle POST request - Create booking
  if (req.method === 'POST') {
    const { name, email, phone, date, time, service, message } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time || !service) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    try {
      console.log('Processing booking for:', name);

      // Save to Firestore
      const docRef = await db.collection('bookings').add({
        name,
        email,
        phone,
        date,
        time,
        service,
        message: message || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'confirmed',
      });

      console.log('Booking saved:', docRef.id);

      // Send emails using Resend SDK
      let emailsSent = { user: false, admin: false };

      // Email 1: Send confirmation to USER (entered email)
      console.log('Sending confirmation email to user:', email);
      try {
        const userEmailResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Booking Confirmation - Raj Consulting',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Booking Confirmed!</h2>
              <p>Hi ${name},</p>
              <p>Your booking has been confirmed. Here are the details:</p>
              <ul style="color: #333; line-height: 1.8;">
                <li><strong>Service:</strong> ${service}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Time:</strong> ${time}</li>
              </ul>
              <p>We'll contact you shortly to confirm. If you have any questions, feel free to reach out.</p>
              <p>Best regards,<br><strong>Raj Consulting Team</strong></p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">Booking ID: ${docRef.id}</p>
            </div>
          `,
        });
        console.log('✅ User confirmation email sent:', userEmailResult.data?.id);
        emailsSent.user = true;
      } catch (userEmailError) {
        console.error('❌ User email failed:', userEmailError.message);
        console.log('   Note: Resend test mode only allows sending to verified email');
      }

      // Email 2: Send notification to ADMIN
      console.log('Sending admin notification to:', process.env.YOUR_EMAIL);
      try {
        const adminEmailResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.YOUR_EMAIL,
          subject: `New Booking: ${name} (${service})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">🎉 New Booking Received</h2>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-top: 0;">Client Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333; width: 35%;">Name:</td>
                    <td style="padding: 12px; color: #666;">${name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 12px; color: #666;"><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333;">Phone:</td>
                    <td style="padding: 12px; color: #666;"><a href="tel:${phone}">${phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333;">Service:</td>
                    <td style="padding: 12px; color: #666;"><strong>${service}</strong></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333;">Date:</td>
                    <td style="padding: 12px; color: #666;">${date}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; color: #333;">Time:</td>
                    <td style="padding: 12px; color: #666;">${time}</td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding: 12px; font-weight: bold; color: #333; vertical-align: top;">Message:</td>
                    <td style="padding: 12px; color: #666;">${message}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #666; font-size: 13px; margin: 0;">
                  <strong>Booking ID:</strong> ${docRef.id}<br>
                  <strong>Received:</strong> ${new Date().toLocaleString()}<br>
                  <strong>Status:</strong> ✅ Confirmed
                </p>
              </div>

              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                Raj Consulting - Booking Management System
              </p>
            </div>
          `,
        });
        console.log('✅ Admin notification email sent:', adminEmailResult.data?.id);
        emailsSent.admin = true;
      } catch (adminEmailError) {
        console.error('❌ Admin email failed:', adminEmailError.message);
      }

      // Return success response
      const responseMessage = emailsSent.admin 
        ? 'Booking confirmed! Check your email for details.'
        : 'Booking confirmed! (Email notification pending)';

      res.status(200).json({
        success: true,
        message: responseMessage,
        bookingId: docRef.id,
        emailsSent,
      });
    } catch (error) {
      console.error('Error processing booking:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process booking',
      });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};
