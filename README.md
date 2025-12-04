# Zalo AI Chat Backend (Node.js + Gemini API)

Dự án này cung cấp Backend API cho Zalo Mini App, cho phép người dùng tương tác với mô hình ngôn ngữ lớn (LLM) của Google Gemini và lưu trữ lịch sử cuộc trò chuyện vào cơ sở dữ liệu MySQL.

Được xây dựng bằng Node.js (Express).
✨ Tính Năng ChínhTích hợp API Google Gemini (gemini-1.5-flash).Xử lý tin nhắn POST qua endpoint /chat.Lưu trữ lịch sử chat tự động vào MySQL.Tự động tạo hồ sơ người dùng Zalo (User) trong DB.🛠️ Yêu Cầu và Thiết Lập Ban ĐầuYêu Cầu Phần MềmBạn cần cài đặt các phần mềm sau trên máy tính của mình:Node.js & npm (Phiên bản ổn định mới nhất).MySQL Server (XAMPP, WAMP, hoặc MySQL Workbench).Git (để clone dự án).Thiết lập Mã NguồnBướcLệnh (Terminal/PowerShell)Mục đích1. Clone dự ángit clone https://github.com/NHTuan2602/zalo_mini_app_aiTải mã nguồn về máy2. Truy cập thư mụccd zalo_mini_app_ai3. Cài đặt thư việnnpm installTải các dependencies (Express, MySQL2, Gemini SDK)⚙️ Cấu Hình Dự Án1. Cơ Sở Dữ Liệu (MySQL)Tạo Database và các Bảng cần thiết:Tạo Database mới tên là zalo_ai_app.Chạy các lệnh SQL sau để tạo bảng users và messages:SQLCREATE TABLE users ( ... );
CREATE TABLE messages ( ... );
-- (Chèn mã SQL đầy đủ vào đây)
2. Biến Môi Trường (.env)Tạo file .env bằng cách sao chép file .env.example và điền thông tin:Tên biếnGiá trị MẫuMô tảPORT3000Cổng Backend sẽ chạyDB_USERrootTên người dùng MySQL của bạnDB_PASSWORD[Mật khẩu thật]Mật khẩu MySQL của bạnGEMINI_API_KEYAIzaSy...Khóa API Gemini lấy từ Google AI Studio🚀 Cách Sử DụngChạy Server: Đảm bảo MySQL Server đang hoạt động, sau đó chạy lệnh sau trong Terminal:Bashnode server.js
Server sẽ chạy tại http://localhost:3000.Endpoint API:Phương thức: POSTURL: http://localhost:3000/chatNội dung (Body JSON):JSON{
  "zaloUserId": "unique_zalo_id",
  "message": "Câu hỏi gửi tới AI",
  "displayName": "Tên người dùng"
}
Phản hồi: Server sẽ trả về một đối tượng JSON chứa câu trả lời của AI:JSON{
  "reply": "Câu trả lời của AI"
}
