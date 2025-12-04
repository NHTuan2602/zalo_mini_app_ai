Zalo AI Chat Backend (Node.js + Gemini API)

Backend API dành cho Zalo Mini App, cho phép người dùng trò chuyện với AI (Google Gemini) và lưu lịch sử hội thoại vào MySQL.

Được xây dựng bằng Node.js (Express) + Google Generative AI SDK.

🛠️ Yêu Cầu & Thiết Lập Ban Đầu
1. Clone dự án & cài thư viện
Bước	Lệnh	Mục đích
1	git clone https://github.com/NHTuan2602/zalo_mini_app_ai	Tải mã nguồn
2	cd zalo_mini_app_ai	Truy cập thư mục
3	npm install	Cài dependencies
⚙️ Cấu Hình Dự Án
1. Cơ sở dữ liệu MySQL

Tạo database:

CREATE DATABASE zalo_ai_app;


Tạo bảng users:

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zalo_user_id VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Tạo bảng messages:

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

2. Tạo file .env

Tạo file .env và điền thông tin theo mẫu:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zalo_ai_app

GEMINI_API_KEY=AIzaSy...


API key lấy từ Google AI Studio.

🚀 Khởi Chạy Server

Chạy server:

node server.js


Nếu không lỗi, console sẽ báo:

Server chạy tại http://localhost:3000

📡 API Endpoint
POST /chat

URL:

http://localhost:3000/chat

Body JSON gửi đi:
{
  "zaloUserId": "unique_zalo_id",
  "message": "Câu hỏi gửi tới AI",
  "displayName": "Tên người dùng"
}

Response nhận về:
{
  "reply": "Câu trả lời của AI"
}

📚 Ghi chú

Tất cả tin nhắn được lưu vào MySQL.

AI sử dụng mô hình Gemini 2.0 Flash (hoặc bản mới nhất)
