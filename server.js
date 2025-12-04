const express = require('express');
const mysql = require('mysql2/promise');
const dns = require('dns');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
dns.setDefaultResultOrder('ipv4first');
// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Test API key khi khởi động
(async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const r = await model.generateContent("ping");
        console.log("✅ Gemini hoạt động:", r.response.text());
    } catch (err) {
        console.log("❌ Gemini không hoạt động:", err.message);
    }
})();

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// === HÀM HỖ TRỢ ===
async function getOrCreateUser(zaloUserId, displayName) {
    const [rows] = await pool.query(
        "SELECT id FROM users WHERE zalo_user_id = ?",
        [zaloUserId]
    );

    if (rows.length > 0) return rows[0].id;

    const [result] = await pool.query(
        "INSERT INTO users (zalo_user_id, display_name) VALUES (?, ?)",
        [zaloUserId, displayName]
    );

    return result.insertId;
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// === API /chat ===
app.post('/chat', async (req, res) => {
    try {
        const { zaloUserId, message, displayName } = req.body;

        if (!zaloUserId || !message) {
            return res.status(400).json({ error: 'Thiếu dữ liệu' });
        }

        console.log(`📩 Nhận tin từ ${displayName}: ${message}`);

        const userId = await getOrCreateUser(zaloUserId, displayName || 'User');

        await pool.query(
            "INSERT INTO messages (user_id, sender, message_text) VALUES (?, ?, ?)",
            [userId, 'user', message]
        );

        // Gọi AI với cơ chế thử lại (retry)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        let aiText = '';
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent(message);
                aiText = result.response.text();
                break; // Thành công, thoát khỏi vòng lặp
            } catch (err) {
                console.error(`Lỗi gọi AI lần ${attempt}:`, err.message);
                if (attempt === maxRetries) {
                    // Nếu đây là lần thử cuối cùng, thì mới báo lỗi thực sự
                    throw new Error(`Không thể gọi AI sau ${maxRetries} lần thử. Lỗi cuối: ${err.message}`);
                }
                await delay(1000 * attempt); // Chờ 1s, 2s, ... trước khi thử lại
            }
        }

        await pool.query(
            "INSERT INTO messages (user_id, sender, message_text) VALUES (?, ?, ?)",
            [userId, 'ai', aiText]
        );

        console.log(" AI hiện lên và nói :", aiText);
        res.json({ reply: aiText });

    } catch (error) {
        console.error(" Server Error:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Server chạy ngon! 🚀</h1>');
});

app.listen(3000, () =>
    console.log("🔥 Server chạy tại http://localhost:3000")
);
