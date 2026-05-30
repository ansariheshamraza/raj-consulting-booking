# Raj Consulting Booking Platform

A modern, full-stack booking management system for Raj Consulting. Built with React, Firebase, and serverless architecture on Vercel. Includes real-time notifications via email and Telegram.

## 🎯 Overview

This platform enables clients to book consultations online while providing admins with instant notifications through multiple channels. The system is designed to be scalable, secure, and requires minimal maintenance.

## ✨ Features

### For Clients
- **Easy Booking Form** - Simple, intuitive interface to schedule consultations
- **Service Selection** - Choose from multiple service offerings (Business Strategy, Marketing Audit, Growth Planning, Coaching)
- **Instant Confirmation** - Automatic email confirmation immediately after booking
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Professional UI** - Clean, modern design with brand logo and navigation

### For Admins
- **Email Notifications** - Instant email alerts for new bookings (via Resend)
- **Telegram Alerts** - Real-time Telegram notifications with full booking details
- **Booking Management** - View all bookings, today's schedule, and upcoming reminders
- **Password Protection** - Secure Telegram bot with authentication
- **Firestore Database** - All bookings stored in Firebase for easy access and backup

### Technical Features
- **Serverless Architecture** - Deployed on Vercel with zero server maintenance
- **Auto-Deploy** - Push to GitHub, Vercel automatically deploys changes
- **Email Integration** - Gmail SMTP for user confirmations, Resend for admin alerts
- **Real-time Updates** - Firebase Firestore for instant data synchronization
- **Secure API** - CORS-enabled serverless functions with input validation
- **Session Management** - Secure Telegram bot with in-memory session storage

## 🛠 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- React Hook Form
- Firebase SDK

**Backend:**
- Node.js
- Firebase Admin SDK
- Nodemailer (Gmail SMTP)
- Resend (Email API)
- node-telegram-bot-api

**Infrastructure:**
- Vercel (Hosting & Serverless Functions)
- Firebase Firestore (Database)
- GitHub (Version Control)

## 📁 Project Structure

```
raj-consulting-booking/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation with logo
│   │   ├── Hero.jsx            # Landing section with CTA
│   │   ├── Services.jsx        # Service offerings
│   │   ├── About.jsx           # About section
│   │   ├── BookingModal.jsx    # Booking form modal
│   │   └── Footer.jsx          # Footer
│   ├── pages/
│   │   └── Home.jsx            # Main landing page
│   ├── config/
│   │   └── firebase.js         # Firebase configuration
│   ├── App.jsx
│   └── index.js
├── api/
│   ├── bookings.js             # Booking API endpoint
│   ├── telegram-notify.js      # Telegram notification handler
│   └── package.json            # Backend dependencies
├── public/
│   └── index.html              # HTML template
├── telegram-bot.js             # Telegram bot (runs locally)
├── package.json                # Frontend dependencies
├── vercel.json                 # Vercel configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account
- Telegram bot token (from @BotFather)
- Gmail account (for SMTP)
- Resend account (for admin emails)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ansariheshamraza/raj-consulting-booking.git
cd raj-consulting-booking
```

2. **Install dependencies**
```bash
npm install
cd api && npm install && cd ..
```

3. **Set up environment variables**

Create `.env.local` for local development:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Create `backend/.env` for Telegram bot:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_CHAT_ID=your_chat_id
BOT_PASSWORD=your_secure_password
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

4. **Run locally**
```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Telegram bot (optional)
node telegram-bot.js
```

Visit http://localhost:3000

## 🌐 Deployment

### Frontend & API (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Vercel automatically deploys on every push

**Live Site:** https://raj-consulting.vercel.app

### Telegram Bot

The Telegram bot runs locally and cannot be deployed to Vercel (see "Known Limitations" below).

## ⚙️ Configuration

### Firebase Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create service account key
4. Add credentials to environment variables

### Gmail SMTP
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Add to environment variables:
   - `GMAIL_USER` - Your Gmail address
   - `GMAIL_APP_PASSWORD` - Generated app password

### Resend Email
1. Create account at https://resend.com
2. Get API key
3. Add to environment variables:
   - `RESEND_API_KEY` - Your API key
   - `YOUR_EMAIL` - Admin email for notifications

### Telegram Bot
1. Search for @BotFather on Telegram
2. Create new bot with `/newbot`
3. Get bot token
4. Send `/start` to your bot
5. Get chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Add to `backend/.env`:
   - `TELEGRAM_BOT_TOKEN` - Bot token
   - `ADMIN_CHAT_ID` - Your chat ID
   - `BOT_PASSWORD` - Secure password

## 📖 Usage

### For Clients
1. Visit https://raj-consulting.vercel.app
2. Click "Book Now" button
3. Fill in booking details
4. Submit form
5. Receive confirmation email

### For Admins (Telegram Bot)
1. Open Telegram
2. Search for your bot
3. Send `/start`
4. Authenticate: `/auth your_password`
5. Use commands:
   - `/bookings` - View all bookings
   - `/today` - View today's bookings
   - `/remind` - View 2-hour reminders
   - `/help` - Show help menu
   - `/logout` - End session

## 🔌 API Endpoints

### POST /api/bookings
Create a new booking

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234",
  "date": "2026-06-15",
  "time": "2:00 PM",
  "service": "Business Strategy",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed!",
  "bookingId": "abc123def456",
  "emailsSent": { "user": true, "admin": true },
  "telegramSent": true
}
```

### GET /api/bookings
Fetch all bookings

## 📧 Notification Flow

```
User submits booking
        ↓
Firestore saves booking
        ↓
    ┌───┴───┬──────────┬──────────┐
    ↓       ↓          ↓          ↓
  Gmail  Resend    Telegram   Success
  (User) (Admin)   (Admin)    Message
```

## ⚠️ Known Limitations

### Telegram Bot - 24/7 Availability Issue

**Important:** The Telegram bot currently cannot run 24/7 due to infrastructure constraints.

#### Why?
- The bot uses polling (continuously asking Telegram for new messages)
- Polling requires a continuous server connection
- Vercel serverless functions are stateless and cannot maintain persistent connections
- Purchasing a dedicated server for 24/7 operation is not currently feasible

#### Current Behavior
- Bot runs locally on your machine
- Must be manually started: `node telegram-bot.js`
- Stops when your computer shuts down or loses internet connection
- Requires manual restart after system reboot

#### Workarounds
1. **Keep Bot Running Locally**
   - Run on a dedicated machine/laptop that stays on
   - Use process manager like PM2 to auto-restart on crash
   ```bash
   npm install -g pm2
   pm2 start telegram-bot.js
   pm2 startup
   pm2 save
   ```

2. **Use Email as Primary Alert**
   - Admin emails work 24/7 (via Resend)
   - Telegram is supplementary when bot is running
   - Check email for all booking notifications

3. **Future Solutions** (not implemented yet)
   - Convert to webhook-based bot (requires public URL)
   - Deploy to dedicated VPS/cloud server
   - Use AWS Lambda with CloudWatch for scheduled checks
   - Implement Heroku deployment (free tier no longer available)

#### Recommendation
For production use, rely on email notifications (which work 24/7) and run the Telegram bot on a dedicated machine for supplementary alerts.

## 🔧 Troubleshooting

### Bookings not saving to Firestore
- Check Firebase credentials in environment variables
- Verify Firestore database exists and is accessible
- Check Vercel function logs for errors
- Ensure Firebase security rules allow writes

### Emails not sending
- Verify Gmail app password is correct
- Check Resend API key is valid
- Review email templates for syntax errors
- Check spam folder for emails

### Telegram bot not responding
- Verify bot token is correct in `.env`
- Check bot is running: `node telegram-bot.js`
- Ensure password is set in `.env`
- Verify Telegram bot hasn't been blocked
- Check internet connection

### Booking form not submitting
- Check browser console for errors (F12)
- Verify API endpoint is accessible
- Check all required fields are filled
- Ensure CORS is properly configured
- Check Vercel function logs

## 📊 Performance

- **Frontend Load Time:** < 2 seconds
- **Booking Submission:** < 1 second
- **Email Delivery:** 1-2 minutes
- **Telegram Notification:** Instant (when bot is running)
- **Database Query:** < 500ms

## 🔒 Security

- ✅ Password-protected Telegram bot
- ✅ Environment variables for sensitive data
- ✅ CORS enabled for API endpoints
- ✅ Firebase security rules configured
- ✅ Input validation on all forms
- ✅ No sensitive data in version control
- ✅ `.env` files in `.gitignore`

## 📈 Monitoring

### What to Monitor
- Booking submission success rate
- Email delivery status
- Telegram bot connectivity (when running)
- Firebase quota usage
- Vercel function performance

### Logs Location
- **Vercel:** Dashboard → Deployments → Functions
- **Firebase:** Console → Firestore → Logs
- **Telegram Bot:** Console output when running locally

## 🎨 Customization

### Change Services
Edit `src/components/BookingModal.jsx`:
```javascript
const services = [
  'Your Service 1',
  'Your Service 2',
  'Your Service 3',
];
```

### Change Time Slots
Edit `src/components/BookingModal.jsx`:
```javascript
const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  // Add more times
];
```

### Change Colors
Edit `tailwind.config.js` or modify Tailwind classes in components.

## 🚀 Future Enhancements

- [ ] Admin dashboard for booking management
- [ ] Calendar integration for availability
- [ ] Payment processing
- [ ] SMS notifications
- [ ] Booking cancellation/rescheduling
- [ ] Email templates customization
- [ ] Multi-language support
- [ ] Analytics and reporting
- [ ] Webhook-based Telegram bot for 24/7 operation

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Push to GitHub
5. Create pull request

## 📄 License

This project is private and proprietary to Raj Consulting.

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review environment variables
3. Check logs in Vercel/Firebase
4. Verify all credentials are correct
5. Contact: theheshamraza@gmail.com

---

**Last Updated:** May 30, 2026  
**Status:** Production Ready (with Telegram bot 24/7 limitation)  
**Version:** 1.0.0  
**Live Site:** https://raj-consulting.vercel.app
