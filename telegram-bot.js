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
const BOT_PASSWORD = process.env.BOT_PASSWORD;

console.log('🤖 Telegram Bot Started with Password Protection');

// ============================================
// AUTHENTICATION SYSTEM
// ============================================

// Store authorized users in memory (Set of chat IDs)
const authorizedUsers = new Set();

/**
 * Check if a user is authenticated
 * @param {number} chatId - Telegram chat ID
 * @returns {boolean} - True if user is authenticated
 */
function isAuthenticated(chatId) {
  return authorizedUsers.has(chatId.toString());
}

/**
 * Authenticate a user with password
 * @param {number} chatId - Telegram chat ID
 * @param {string} password - Password provided by user
 * @returns {boolean} - True if password is correct
 */
function authenticate(chatId, password) {
  if (password === BOT_PASSWORD) {
    authorizedUsers.add(chatId.toString());
    console.log(`✅ User ${chatId} authenticated`);
    return true;
  }
  console.log(`❌ Failed authentication attempt from ${chatId}`);
  return false;
}

// ============================================
// COMMAND: /start
// ============================================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (isAuthenticated(chatId)) {
    // User is already authenticated - show admin menu
    const welcomeText = `
🔐 <b>Welcome Back, Admin!</b>

You are authenticated. Available commands:
/bookings - View all bookings
/today - View today's bookings
/remind - View upcoming reminders (2 hours)
/help - Show help menu
/logout - Logout from this session
    `.trim();
    bot.sendMessage(chatId, welcomeText, { parse_mode: 'HTML' });
  } else {
    // User not authenticated - ask for password
    const startText = `
🔐 <b>Raj Consulting Admin Bot</b>

This is a private admin bot. You must authenticate to access commands.

Please authenticate using:
<code>/auth YOUR_PASSWORD</code>

Example: <code>/auth raj@2025</code>
    `.trim();
    bot.sendMessage(chatId, startText, { parse_mode: 'HTML' });
  }
});

// ============================================
// COMMAND: /auth PASSWORD
// ============================================
bot.onText(/\/auth(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const password = match[1];

  // Check if password was provided
  if (!password) {
    bot.sendMessage(
      chatId,
      '❌ <b>Password required</b>\n\nUsage: <code>/auth your_password</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  // Try to authenticate
  if (authenticate(chatId, password)) {
    const successText = `
✅ <b>Authentication Successful!</b>

You are now authenticated. You can use:
/bookings - View all bookings
/today - View today's bookings
/remind - View upcoming reminders
/help - Show help menu
/logout - Logout
    `.trim();
    bot.sendMessage(chatId, successText, { parse_mode: 'HTML' });
  } else {
    bot.sendMessage(
      chatId,
      '❌ <b>Wrong Password</b>\n\nPlease try again with the correct password.',
      { parse_mode: 'HTML' }
    );
  }
});

// ============================================
// COMMAND: /bookings (AUTH REQUIRED)
// ============================================
bot.onText(/\/bookings/, async (msg) => {
  const chatId = msg.chat.id;

  // Check authentication
  if (!isAuthenticated(chatId)) {
    bot.sendMessage(
      chatId,
      '❌ <b>Unauthorized</b>\n\nPlease authenticate first:\n<code>/auth password</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  try {
    const snapshot = await db
      .collection('bookings')
      .orderBy('date', 'asc')
      .get();

    if (snapshot.empty) {
      bot.sendMessage(chatId, '📭 <b>No bookings found</b>', { parse_mode: 'HTML' });
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
    bot.sendMessage(chatId, '❌ <b>Error fetching bookings</b>\n\nPlease try again later.', {
      parse_mode: 'HTML',
    });
  }
});

// ============================================
// COMMAND: /today (AUTH REQUIRED)
// ============================================
bot.onText(/\/today/, async (msg) => {
  const chatId = msg.chat.id;

  // Check authentication
  if (!isAuthenticated(chatId)) {
    bot.sendMessage(
      chatId,
      '❌ <b>Unauthorized</b>\n\nPlease authenticate first:\n<code>/auth password</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const snapshot = await db
      .collection('bookings')
      .where('date', '==', today)
      .orderBy('time', 'asc')
      .get();

    if (snapshot.empty) {
      bot.sendMessage(chatId, `📭 <b>No bookings for today (${today})</b>`, {
        parse_mode: 'HTML',
      });
      return;
    }

    let message = `📅 <b>Today's Bookings (${today}):</b>\n\n`;
    let count = 0;

    snapshot.forEach((doc) => {
      const booking = doc.data();
      count++;
      message += `<b>${count}. ${booking.name}</b>\n`;
      message += `📧 ${booking.email}\n`;
      message += `📞 ${booking.phone}\n`;
      message += `🎯 ${booking.service}\n`;
      message += `⏰ ${booking.time}\n`;
      message += `---\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error fetching today bookings:', error);
    bot.sendMessage(chatId, '❌ <b>Error fetching bookings</b>\n\nPlease try again later.', {
      parse_mode: 'HTML',
    });
  }
});

// ============================================
// COMMAND: /remind (AUTH REQUIRED)
// ============================================
bot.onText(/\/remind/, async (msg) => {
  const chatId = msg.chat.id;

  // Check authentication
  if (!isAuthenticated(chatId)) {
    bot.sendMessage(
      chatId,
      '❌ <b>Unauthorized</b>\n\nPlease authenticate first:\n<code>/auth password</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  try {
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const todayDate = now.toISOString().split('T')[0];

    const snapshot = await db
      .collection('bookings')
      .where('date', '==', todayDate)
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

    if (reminders.length === 0) {
      bot.sendMessage(chatId, '✅ <b>No upcoming reminders</b>\n\nNo bookings within the next 2 hours.', {
        parse_mode: 'HTML',
      });
      return;
    }

    let reminderMessage = `⏰ <b>Upcoming Bookings (Next 2 Hours):</b>\n\n`;

    reminders.forEach((booking, index) => {
      reminderMessage += `${index + 1}. <b>${booking.name}</b>\n`;
      reminderMessage += `📧 ${booking.email}\n`;
      reminderMessage += `🎯 ${booking.service}\n`;
      reminderMessage += `⏰ ${booking.date} ${booking.time}\n`;
      reminderMessage += `---\n`;
    });

    bot.sendMessage(chatId, reminderMessage, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    bot.sendMessage(chatId, '❌ <b>Error fetching reminders</b>\n\nPlease try again later.', {
      parse_mode: 'HTML',
    });
  }
});

// ============================================
// COMMAND: /help
// ============================================
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  if (isAuthenticated(chatId)) {
    const helpText = `
<b>🤖 Raj Consulting Bot - Commands</b>

<b>Authenticated Commands:</b>
/bookings - View all bookings
/today - View today's bookings
/remind - View bookings needing reminders (within 2 hours)
/logout - Logout from this session
/help - Show this help menu

<b>Authentication:</b>
/auth PASSWORD - Authenticate with password
/start - Show welcome message
    `.trim();
    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  } else {
    const helpText = `
<b>🤖 Raj Consulting Bot</b>

This is a private admin bot. You must authenticate first.

<b>To authenticate:</b>
<code>/auth your_password</code>

After authentication, you can use:
/bookings - View all bookings
/today - View today's bookings
/remind - View upcoming reminders
/help - Show help menu
    `.trim();
    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  }
});

// ============================================
// COMMAND: /logout
// ============================================
bot.onText(/\/logout/, (msg) => {
  const chatId = msg.chat.id;

  if (!isAuthenticated(chatId)) {
    bot.sendMessage(chatId, '❌ <b>You are not authenticated</b>', { parse_mode: 'HTML' });
    return;
  }

  // Remove user from authorized set
  authorizedUsers.delete(chatId.toString());
  console.log(`🚪 User ${chatId} logged out`);

  bot.sendMessage(
    chatId,
    '👋 <b>Logged out successfully</b>\n\nTo access commands again, use:\n<code>/auth password</code>',
    { parse_mode: 'HTML' }
  );
});

// ============================================
// AUTOMATIC REMINDER JOB (Every 30 minutes)
// ============================================
setInterval(async () => {
  try {
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const todayDate = now.toISOString().split('T')[0];

    const snapshot = await db
      .collection('bookings')
      .where('date', '==', todayDate)
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

      // Send to admin if authenticated
      if (isAuthenticated(ADMIN_CHAT_ID)) {
        bot.sendMessage(ADMIN_CHAT_ID, reminderMessage, {
          parse_mode: 'HTML',
        });
        console.log(`✅ Automatic reminder sent for ${reminders.length} booking(s)`);
      }
    }
  } catch (error) {
    console.error('Reminder job error:', error);
  }
}, 30 * 60 * 1000); // Run every 30 minutes

console.log('✅ Bot commands registered with password protection');