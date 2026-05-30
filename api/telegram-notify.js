const TelegramBot = require('node-telegram-bot-api');

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

/**
 * Send booking notification to Telegram
 * @param {Object} booking - Booking data
 */
async function sendTelegramNotification(booking) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
      console.log('⚠️ Telegram credentials not configured, skipping notification');
      return false;
    }

    const message = `
🎉 <b>New Booking Received!</b>

👤 <b>Name:</b> ${booking.name}
📧 <b>Email:</b> ${booking.email}
📞 <b>Phone:</b> ${booking.phone}
🎯 <b>Service:</b> ${booking.service}
📅 <b>Date:</b> ${booking.date}
⏰ <b>Time:</b> ${booking.time}
${booking.message ? `💬 <b>Message:</b> ${booking.message}` : ''}

<b>Booking ID:</b> ${booking.bookingId}
    `.trim();

    await bot.sendMessage(ADMIN_CHAT_ID, message, {
      parse_mode: 'HTML',
    });

    console.log('✅ Telegram notification sent');
    return true;
  } catch (error) {
    console.error('❌ Telegram notification error:', error.message);
    return false;
  }
}

module.exports = { sendTelegramNotification };
