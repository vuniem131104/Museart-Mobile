# 🎨 Museart - Museum Art Mobile Application

Museart là một ứng dụng di động hiện đại dành cho việc khám phá và tương tác với các tác phẩm nghệ thuật, triển lãm và bài viết nghệ thuật. Ứng dụng được xây dựng với React Native và Node.js, tích hợp AI và các tính năng thông minh.

## 📱 Tính năng chính

### 🎯 Core Features
- **Khám phá Tác phẩm Nghệ thuật**: Duyệt qua hàng nghìn tác phẩm nghệ thuật từ Art Institute of Chicago API
- **Chi tiết Tác phẩm**: Xem thông tin chi tiết, lịch sử, và mô tả của từng tác phẩm
- **Triển lãm**: Khám phá các triển lãm nghệ thuật với thông tin đầy đủ
- **Bài viết Nghệ thuật**: Đọc các bài viết và tin tức về nghệ thuật
- **Hệ thống Xác thực**: Đăng ký, đăng nhập với JWT authentication
- **Chế độ Khách**: Truy cập ứng dụng mà không cần đăng ký

### 🤖 AI & Smart Features
- **Chatbot AI**: Trợ lý AI sử dụng Groq LLM để trả lời câu hỏi về nghệ thuật
- **Tìm kiếm bằng Hình ảnh**: Upload ảnh để tìm tác phẩm tương tự sử dụng CLIP model
- **Voice Search**: Tìm kiếm bằng giọng nói với Whisper STT
- **RAG System**: Retrieval-Augmented Generation cho câu trả lời chính xác

### 🛒 Shopping & Commerce
- **Smart Cart System**: Thêm/xóa sản phẩm với tính toán tự động
- **VNPay Integration**: Thanh toán an toàn với VNPay gateway
- **Cart Persistence**: Giỏ hàng được lưu trữ và đồng bộ
- **Price Management**: Hiển thị giá gốc và giá khuyến mãi
- **Quantity Control**: Điều chỉnh số lượng sản phẩm dễ dàng

### 💫 Social & Interaction Features
- **Bookmark System**: Lưu tác phẩm yêu thích với phân loại
- **Reaction System**: Like/Unlike với thống kê real-time
- **Comment System**: Bình luận và thảo luận có threaded replies
- **User Profiles**: Quản lý thông tin cá nhân và preferences
- **Activity History**: Theo dõi lịch sử hoạt động của người dùng

### 🎵 Rich Multimedia Experience
- **IIIF Image Viewer**: Xem ảnh độ phân giải cao với zoom/pan
- **Audio Guides**: Hướng dẫn âm thanh chuyên nghiệp
- **Video Integration**: Video giới thiệu và documentary
- **Interactive Gallery**: Slideshow và carousel view
- **Download Options**: Tải ảnh chất lượng cao (có bản quyền)

## 🏗️ Kiến trúc Hệ thống

### Frontend (React Native + Expo)
```
frontend/
├── screens/           # Các màn hình chính
│   ├── artworks/     # Màn hình tác phẩm
│   ├── exhibitions/  # Màn hình triển lãm
│   ├── articles/     # Màn hình bài viết
│   ├── auth/         # Xác thực
│   └── shopping/     # Mua sắm
├── components/       # Components tái sử dụng
├── navigation/       # Điều hướng
├── context/          # Context API
├── store/           # Redux store
└── services/        # API services
```

### Backend (Node.js + Express)
```
backend/
├── controllers/     # Business logic
├── models/         # Database models (Sequelize)
├── routes/         # API routes
├── middleware/     # Authentication middleware
└── database/       # Database configuration
```

### AI Services (Python + FastAPI)
```
backend/
├── main.py         # FastAPI server
├── image_retrieval.py  # Image search
└── art_products/   # Vector database
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **React Native 0.76.9** - Framework di động
- **Expo 52.0.0** - Development platform
- **React Navigation 7.x** - Điều hướng
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **NativeWind** - Styling với Tailwind CSS

### Backend
- **Node.js + Express** - Web server
- **Sequelize + MySQL** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & ML
- **Python + FastAPI** - AI services
- **Groq LLM** - Large Language Model
- **LangChain** - LLM framework
- **ChromaDB** - Vector database
- **CLIP Model** - Image similarity
- **Whisper** - Speech-to-text
- **Ollama Embeddings** - Text embeddings

### External APIs
- **Art Institute of Chicago API** - Artwork data
- **VNPay** - Payment gateway

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+
- Python 3.8+
- MySQL 8.0+
- Expo CLI
- Android Studio / Xcode (cho development)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/museart-mobile.git
cd museart-mobile
```

### 2. Cài đặt Backend
```bash
cd backend
npm install

# Tạo database MySQL
mysql -u root -p
CREATE DATABASE muse_art;

# Chạy backend
npm run dev
```

### 3. Cài đặt AI Services
```bash
cd backend
pip install -r requirements.txt

# Chạy AI server
python main.py
```

### 4. Cài đặt Frontend
```bash
cd frontend
npm install

# Chạy ứng dụng
npm start
```

### 5. Cấu hình Environment
Tạo file `.env` trong thư mục backend:
```env
GROQ_API_KEY=your_groq_api_key
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=muse_art
JWT_SECRET=your_jwt_secret
```

## 📱 Giao diện và Trải nghiệm Người dùng

### 🎨 Artworks Screen
- **Grid Layout**: Hiển thị tác phẩm dạng lưới với lazy loading
- **Advanced Filters**: Lọc theo nghệ sĩ, thời kỳ, thể loại, kích thước
- **Sort Options**: Sắp xếp theo tên, ngày, độ phổ biến
- **Detail View**: Thông tin chi tiết với zoom, audio guide, video
- **Related Works**: Gợi ý tác phẩm liên quan dựa trên AI

### 🏛️ Exhibitions Screen
- **Current & Upcoming**: Triển lãm hiện tại và sắp diễn ra
- **Virtual Tours**: Tour ảo với 360° view
- **Exhibition Map**: Bản đồ triển lãm tương tác
- **Artwork Collections**: Bộ sưu tập tác phẩm trong triển lãm
- **Event Calendar**: Lịch sự kiện và workshop

### 📰 Articles & News
- **Curated Content**: Bài viết được tuyển chọn về nghệ thuật
- **AI-Powered Summary**: Tóm tắt thông minh bằng AI
- **Reading Progress**: Theo dõi tiến độ đọc
- **Bookmark Articles**: Lưu bài viết để đọc sau
- **Share & Discuss**: Chia sẻ và thảo luận bài viết

### 🛒 Shopping Experience
- **Product Catalog**: Catalog sản phẩm nghệ thuật đa dạng
- **Smart Cart**: Giỏ hàng thông minh với tính năng gợi ý
- **Secure Payment**: Thanh toán an toàn với VNPay
- **Order Management**: Quản lý đơn hàng và theo dõi vận chuyển
- **Wishlist**: Danh sách yêu thích với thông báo giá

### 👤 User Profile & Settings
- **Account Management**: Quản lý thông tin tài khoản
- **Personalization**: Tùy chỉnh giao diện và preferences
- **Activity Dashboard**: Bảng điều khiển hoạt động cá nhân
- **Bookmark Collections**: Bộ sưu tập bookmark được phân loại
- **Privacy Settings**: Cài đặt quyền riêng tư và bảo mật

## 🔧 API Endpoints

### Authentication APIs
- `POST /api/auth/signup` - Đăng ký tài khoản mới
- `POST /api/auth/signin` - Đăng nhập với email/password
- `POST /api/auth/signout` - Đăng xuất và invalidate token
- `GET /api/auth/test` - Kiểm tra kết nối backend

### User Management
- `GET /api/user/profile` - Lấy thông tin profile người dùng
- `PUT /api/user/profile` - Cập nhật thông tin profile

### Artwork APIs
- `GET /api/artwork/reactions/:id` - Lấy số lượng reactions
- `POST /api/artwork/reactions/:id` - Toggle like/unlike artwork
- `GET /api/artwork/comments/:id` - Lấy comments của artwork
- `POST /api/artwork/comments/:id` - Thêm comment mới

### Exhibition APIs
- `GET /api/exhibition/reactions/:id` - Lấy reactions của exhibition
- `POST /api/exhibition/reactions/:id` - Toggle reaction exhibition
- `GET /api/exhibition/comments/:id` - Lấy comments exhibition

### Bookmark APIs
- `GET /api/bookmarks` - Lấy danh sách bookmark của user
- `POST /api/bookmarks` - Thêm bookmark mới
- `DELETE /api/bookmarks/:id` - Xóa bookmark

### Shopping APIs
- `GET /api/cart` - Lấy giỏ hàng hiện tại
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/items/:id` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/items/:id` - Xóa sản phẩm khỏi giỏ
- `POST /api/payment/vnpay` - Tạo payment URL VNPay

### AI & ML Services
- `POST /chat` - Chatbot AI với context history
- `POST /image_search` - Tìm kiếm tương tự bằng hình ảnh
- `POST /speech-to-text` - Chuyển đổi giọng nói thành text
- `POST /summary` - Tóm tắt nội dung bài viết bằng AI

### External Data APIs
- Art Institute of Chicago API - Artwork và exhibition data
- IIIF Image API - High-resolution artwork images

## � Tính năng nâng cao

### 🎨 Artwork Management
- **Detailed Information**: Hiển thị đầy đủ thông tin tác phẩm (artist, date, dimensions, credit line)
- **High-Quality Images**: Ảnh độ phân giải cao từ IIIF Image API
- **Publication History**: Lịch sử xuất bản và triển lãm của tác phẩm
- **Related Artworks**: Gợi ý tác phẩm liên quan

### 🔍 Advanced Search
- **Multi-modal Search**: Kết hợp text, voice và image search
- **Filter & Sort**: Lọc theo thể loại, thời gian, nghệ sĩ
- **Search History**: Lưu lịch sử tìm kiếm
- **Auto-complete**: Gợi ý từ khóa thông minh

### 🎵 Interactive Experience
- **Audio Guides**: Hướng dẫn âm thanh cho từng tác phẩm
- **Video Content**: Video giới thiệu và behind-the-scenes
- **360° View**: Xem tác phẩm từ nhiều góc độ
- **AR Preview**: Xem trước tác phẩm trong không gian thực

### 💳 E-commerce Features
- **Smart Cart**: Tự động tính toán giá và thuế
- **Multiple Payment**: VNPay, credit card, digital wallet
- **Order Tracking**: Theo dõi đơn hàng real-time
- **Wishlist**: Danh sách mong muốn với thông báo giá

### � Analytics & Insights
- **User Behavior**: Theo dõi tương tác người dùng
- **Popular Content**: Thống kê tác phẩm được xem nhiều
- **Recommendation Engine**: Gợi ý cá nhân hóa
- **Usage Statistics**: Báo cáo sử dụng chi tiết

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## � Cấu hình và Triển khai

### Environment Variables
```env
# Backend (.env)
GROQ_API_KEY=your_groq_api_key
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=muse_art
JWT_SECRET=your_jwt_secret
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECURE_SECRET=your_vnpay_secret
```

### Database Schema
- **Users**: Quản lý tài khoản người dùng
- **Artworks**: Metadata tác phẩm nghệ thuật
- **Exhibitions**: Thông tin triển lãm
- **Articles**: Bài viết và tin tức
- **Reactions**: Like/Unlike system
- **Comments**: Hệ thống bình luận
- **Bookmarks**: Lưu trữ bookmark
- **Cart Items**: Giỏ hàng và sản phẩm
- **Store Items**: Catalog sản phẩm

### Performance Optimization
- **Image Caching**: Cache ảnh với Expo Image
- **API Caching**: Cache API responses
- **Lazy Loading**: Load content theo yêu cầu
- **Vector Database**: ChromaDB cho similarity search
- **Connection Pooling**: MySQL connection pooling

## 🚀 Production Deployment

### Frontend (Expo/React Native)
```bash
# Build for production
expo build:android
expo build:ios

# Deploy to app stores
expo submit:android
expo submit:ios
```

### Backend (Node.js)
```bash
# Production build
npm run build
npm start

# Using PM2
pm2 start app.js --name museart-backend
```

### AI Services (Python)
```bash
# Production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📊 Monitoring và Analytics

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real-time metrics
- **User Analytics**: Usage patterns và behavior
- **API Monitoring**: Response times và error rates
- **Database Performance**: Query optimization

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

⭐ **Star this repository if you find it helpful!**
