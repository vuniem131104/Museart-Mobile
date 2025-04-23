# Museart Backend

Backend cho ứng dụng Museart với các tính năng xác thực cơ bản (đăng ký, đăng nhập, đăng xuất).

## Cài đặt

```bash
# Cài đặt các dependencies
npm install
```

## Cấu hình

- Đảm bảo MySQL đã được cài đặt và chạy
- Database MySQL cần phải được tạo trước với tên "muse_art"
- Kiểm tra thông tin kết nối database trong file `models/models.js`

## Chạy ứng dụng

```bash
# Chạy ở chế độ development với nodemon
npm run dev

# Hoặc chạy bình thường
npm start
```

Server sẽ chạy trên cổng 3000 theo mặc định: [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Đăng ký tài khoản mới
  - Body: `{ "username": "example", "email": "example@gmail.com", "password": "password" }`

- `POST /api/auth/signin`: Đăng nhập
  - Body: `{ "email": "example@gmail.com", "password": "password" }`

- `POST /api/auth/signout`: Đăng xuất

### User

- `GET /api/user/profile`: Lấy thông tin người dùng hiện tại (yêu cầu xác thực)

- `PUT /api/user/profile`: Cập nhật thông tin người dùng (yêu cầu xác thực)
  - Body: `{ "username": "new_username" }`

## Authentication

Để xác thực các API yêu cầu đăng nhập, thêm header sau vào request:

```
x-access-token: <your_jwt_token>
```

Token JWT sẽ được trả về khi đăng nhập thành công. 