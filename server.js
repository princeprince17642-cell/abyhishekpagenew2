const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const BOT_TOKEN = '9047608737:AAHiKjxg_BY3n7oUe8R5nWS099NmKPE4h5k';
const PIXEL_ID = '1437809538559530';
const ACCESS_TOKEN = 'EAAdqEIp1KWoBSZC2XRILr7Y2bYdhdcjUvaPNyn4CSPnjMSceECKsxl0HQ5pdk1fZAow5WWIDCSVs1U4YSxyjgH1jEBZClebFPWQRqYVBegw4axUSroMnZA1akJl8RPQgReKHbFnTLM6DJsAR9JgbGY1miGwH7BLAEzLBkCbnkGJpKfudtBM1SPW1H6OgGAZDZD';

// Express Server 24/7 active rakhne ke liye
app.get('/', (req, res) => {
    res.send('SK BY INDIA Node.js CAPI Server is Running 24/7!');
});

// Telegram Bot Setup (Polling mode)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Chat Join Request Handler
bot.on('chat_join_request', async (msg) => {
    const userId = msg.from.id;
    const date = Math.floor(Date.now() / 1000);

    try {
        const externalIdHash = crypto.createHash('sha256').update(String(userId)).digest('hex');
        
        const capiPayload = {
            data: [{
                event_name: 'Subscribe',
                event_time: date,
                action_source: 'system_generated',
                event_id: `sub_${userId}_${date}`,
                user_data: {
                    external_id: externalIdHash
                }
            }]
        };

        const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
        const response = await axios.post(url, capiPayload);
        console.log(`🚀 Meta CAPI Subscribe Response for User ${userId}:`, response.data);
    } catch (error) {
        console.error('Error firing Meta CAPI:', error.response?.data || error.message);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
