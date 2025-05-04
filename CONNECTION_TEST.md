# Kiểm tra kết nối giữa Frontend và Backend

## Cài đặt và chạy backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động backend:
```bash
npm run dev
```

Backend sẽ chạy ở cổng 3000: http://localhost:3000

## Cài đặt và chạy frontend

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động frontend:
```bash
npm start
```

4. Sử dụng Expo Go trên điện thoại di động hoặc máy ảo Android/iOS để chạy ứng dụng.

## Kiểm tra kết nối

1. Đảm bảo rằng backend và frontend đều đang chạy.

2. Trong ứng dụng frontend, hãy đăng ký hoặc đăng nhập để kiểm tra kết nối.

3. Nếu bạn muốn kiểm tra kết nối từ mã:
   
   ```javascript
   import { testBackendConnection } from './services/connectionTest';
   
   const testConnection = async () => {
     const result = await testBackendConnection();
     if (result.success) {
       console.log('Kết nối thành công!', result.data);
     } else {
       console.log('Kết nối thất bại!', result.error);
     }
   };
   
   testConnection();
   ```

## Lưu ý về địa chỉ IP

Nếu bạn đang thử nghiệm trên thiết bị thật, hãy đảm bảo rằng địa chỉ IP trong `frontend/services/api.js` đã được cấu hình đúng:

```javascript
export const backendUrl = 'http://[địa_chỉ_IP_của_bạn]:3000/api';
```

Ví dụ:
```javascript
export const backendUrl = 'http://192.168.1.100:3000/api';
``` 