# Thông Tin Thanh Toán VNPay

Dự án Museart sử dụng VNPay làm cổng thanh toán trực tuyến. Tài liệu này cung cấp thông tin về các thẻ ngân hàng test có thể sử dụng trong môi trường phát triển.

## Cấu Hình VNPay

Hệ thống sử dụng các biến môi trường để cấu hình VNPay:
- `VNPAY_TMN_CODE`: Mã website của merchant trên hệ thống VNPay
- `VNPAY_SECURE_SECRET`: Chuỗi bí mật để tạo chữ ký điện tử
- `VNPAY_HOST`: URL của cổng thanh toán VNPay

## Thông Tin Thẻ Test

Dưới đây là danh sách các thẻ ngân hàng có thể sử dụng để test thanh toán VNPay:

| STT | Thông tin thẻ | Ghi chú |
|-----|--------------|---------|
| 1 | **Ngân hàng**: NCB<br>**Số thẻ**: 9704198526191432198<br>**Tên chủ thẻ**: NGUYEN VAN A<br>**Ngày phát hành**: 07/15<br>**Mật khẩu OTP**: 123456 | Thành công |
| 2 | **Ngân hàng**: NCB<br>**Số thẻ**: 9704195798459170488<br>**Tên chủ thẻ**: NGUYEN VAN A<br>**Ngày phát hành**: 07/15<br>**Mật khẩu OTP**: 123456 | Thẻ không đủ số dư |
| 3 | **Ngân hàng**: NCB<br>**Số thẻ**: 9704192181368742<br>**Tên chủ thẻ**: NGUYEN VAN A<br>**Ngày phát hành**: 07/15<br>**Mật khẩu OTP**: 123456 | Thẻ chưa kích hoạt |
| 4 | **Ngân hàng**: NCB<br>**Số thẻ**: 9704193370791314<br>**Tên chủ thẻ**: NGUYEN VAN A<br>**Ngày phát hành**: 07/15<br>**Mật khẩu OTP**: 123456 | Thẻ bị khóa |
| 5 | **Ngân hàng**: NCB<br>**Số thẻ**: 9704194841945513<br>**Tên chủ thẻ**: NGUYEN VAN A<br>**Ngày phát hành**: 07/15<br>**Mật khẩu OTP**: 123456 | Thẻ bị hết hạn |

## Quy Trình Thanh Toán

1. Người dùng chọn phương thức thanh toán VNPay trong ứng dụng
2. Hệ thống tạo URL thanh toán và chuyển hướng người dùng đến cổng thanh toán VNPay
3. Người dùng nhập thông tin thẻ test từ bảng trên
4. Nhập mã OTP: 123456
5. Hệ thống sẽ xử lý thanh toán dựa trên loại thẻ đã chọn
6. Người dùng được chuyển hướng trở lại ứng dụng với kết quả thanh toán

## Lưu Ý

- Số tiền thanh toán được cố định ở mức 10,000 VND cho mục đích kiểm thử
- Sau khi thanh toán thành công, tất cả các mặt hàng trong giỏ hàng sẽ được xóa
- Môi trường thanh toán hiện đang được cấu hình ở chế độ test (`testMode: true`)

## Xử Lý Lỗi

Các mã lỗi phổ biến từ VNPay:
- `00`: Giao dịch thành công
- `01`: Giao dịch đã tồn tại
- `02`: Merchant không hợp lệ
- `03`: Dữ liệu gửi sang không đúng định dạng
- `04`: Khởi tạo GD không thành công do Website đang bị tạm khóa
- `13`: Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa
- `24`: Khách hàng hủy giao dịch
- `51`: Tài khoản không đủ số dư để thực hiện giao dịch
- `65`: Tài khoản của quý khách đã vượt quá hạn mức giao dịch trong ngày
- `75`: Ngân hàng thanh toán đang bảo trì
- `99`: Các lỗi khác
