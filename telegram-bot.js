const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// Initialize Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

console.log('🤖 Telegram Bot Started');

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome to Raj Consulting Bot! 👋\n\nCommands:\n/bookings - See all bookings\n/today - Today's bookings\n/remind - Bookings needing reminders\n/help - Help menu`,
    { parse_mode: 'HTML' }
  );
});

// Command: /bookings
bot.onText(/\/bookings/, async (msg) => {
  const chatId = msg.chat.id;

  // Only admin can use this
  if (chatId.toString() !== ADMIN_CHAT_ID) {
    bot.sendMessage(chatId, '❌ Unauthorized');
    return;
  }

  try {
    const snapshot = await db
      .collection('bookings')
      .orderBy('date', 'asc')
      .get();

    if (snapshot.empty) {
      bot.sendMessage(chatId, '📭 No bookings found');
      return;
    }

    let message = '📋 <b>All Bookings:</b>\n\n';
    let count = 0;

    snapshot.forEach((doc) => {
      const booking = doc.data();
      count++;
      message += `<b>${count}. ${booking.name}</b>\n`;
      message += `📧 ${booking.email}\n`;
      message += `📞 ${booking.phone}\n`;
      message += `🎯 ${booking.service}\n`;
      message += `📅 ${booking.date} at ${booking.time}\n`;
      message += `---\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    bot.sendMessage(chatId, '❌ Error fetching bookings');
  }
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
<b>🤖 Raj Consulting Bot Commands:</b>

/bookings - View all bookings
/today - View today's bookings
/remind - View bookings needing reminders (within 2 hours)
/help - Show this help menu
  `;
  bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
});

// Reminder job: Check every 30 minutes
setInterval(async () => {
  try {
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const snapshot = await db
      .collection('bookings')
      .where('date', '>=', now.toISOString().split('T')[0])
      .get();

    let reminders = [];

    snapshot.forEach((doc) => {
      const booking = doc.data();
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);

      // If booking is within 2 hours
      if (bookingDateTime <= in2Hours && bookingDateTime > now) {
        reminders.push(booking);
      }
    });

    if (reminders.length > 0) {
      let reminderMessage = `⏰ <b>Upcoming Bookings (Next 2 Hours):</b>\n\n`;

      reminders.forEach((booking, index) => {
        reminderMessage += `${index + 1}. <b>${booking.name}</b>\n`;
        reminderMessage += `📧 ${booking.email}\n`;
        reminderMessage += `🎯 ${booking.service}\n`;
        reminderMessage += `⏰ ${booking.date} ${booking.time}\n`;
        reminderMessage += `---\n`;
      });

      bot.sendMessage(ADMIN_CHAT_ID, reminderMessage, {
        parse_mode: 'HTML',
      });

      console.log(`✅ Reminder sent for ${reminders.length} booking(s)`);
    }
  } catch (error) {
    console.error('Reminder job error:', error);
  }
}, 30 * 60 * 1000); // Run every 30 minutes

console.log('✅ Bot commands registered');