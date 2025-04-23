
# 🌱 ZoiZoiFarm - Hệ thống Quản lý Tưới tiêu Thông minh

**ZoiZoiFarm** là dự án đột phá ứng dụng công nghệ tiên tiến vào nông nghiệp, tích hợp cảm biến hiện đại và tự động hóa điều khiển thiết bị tưới tiêu, chiếu sáng thông qua nền tảng **Adafruit IO**. Hệ thống giúp giảm thiểu công sức người dùng đồng thời tối ưu hóa lượng nước và năng lượng sử dụng.  

## 🎯 Mục tiêu  
Tối ưu hóa tài nguyên thiên nhiên (nước, đất) bằng:  
- **Hệ thống tưới tiết kiệm** công nghệ cao.  
- **Giám sát môi trường thông minh**, mang lại giải pháp toàn diện cho việc chăm sóc vườn cây **từ xa**.  

## ✨ Tính năng nổi bật  

### 📲 Quản lý Thiết bị Thông minh  
- Thêm/xóa, quản lý và giám sát trạng thái thiết bị (máy bơm, đèn LED) qua ứng dụng với **giao diện thân thiện**.  

### 🌡️ Theo dõi Môi trường Thời gian Thực  
- Thu thập và lưu trữ liên tục dữ liệu từ cảm biến (nhiệt độ, độ ẩm, ánh sáng).  
- Cảnh báo tức thì khi thông số vượt ngưỡng an toàn.  

### ⚙️ Điều khiển Linh hoạt  
- **Tự động**: Dựa trên dữ liệu cảm biến hoặc lịch trình cài đặt sẵn.  
- **Thủ công**: Điều khiển trực tiếp qua ứng dụng.  

### 🔔 Cảnh báo Tức thì  
- Gửi **email thông báo** khi phát hiện bất thường, giúp người dùng phản ứng nhanh, giảm rủi ro cho cây trồng.  

### 🔒 Bảo mật & Cá nhân hóa  
- Mỗi người dùng quản lý thiết bị/cảm biến riêng, đảm bảo tính **bảo mật** và **độc lập**.  

---

## 🛠️ Cài đặt Dự án

### ✅ Yêu cầu hệ thống  
- Node.js (>= 18.x)  
- Expo CLI  
- Android Studio (dùng để chạy máy ảo)  
- Git

### 📦 Cài đặt Dependency

1. **Clone dự án**  
   ```bash
   git clone https://github.com/[username]/zoizoifarm.git
   cd zoizoifarm
   ```

2. **Cài đặt Expo CLI (nếu chưa có)**  
   ```bash
   npm install -g expo-cli
   ```

3. **Cài đặt các gói phụ thuộc**  
   ```bash
   npm install
   ```

---

## 🚀 Chạy Dự Án

1. **Khởi động server Expo**  
   ```bash
   npx expo start
   ```

2. **Chạy trên máy ảo Android (Android Studio)**  
   - Mở Android Studio → Launch AVD Manager → Chạy máy ảo.
   - Trong cửa sổ Expo, chọn `Run on Android device/emulator`.

3. **Hoặc quét QR để chạy trên điện thoại thật** (cài app Expo Go)

---

## 🧰 Công nghệ sử dụng

- **React Native + Expo**
- **Adafruit IO** (Cloud IoT platform)
- **Firebase** (hoặc service tùy chọn cho auth, nếu có)
- **Android Studio** (máy ảo test app)

---

## ❤️ Đóng góp

Mọi đóng góp, ý tưởng hay issue đều rất được hoan nghênh! Hãy tạo Pull Request hoặc Issue mới trong repo này 🙌  
