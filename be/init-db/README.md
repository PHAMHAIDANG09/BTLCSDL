# NextHR - Tài liệu Database Demo

## 1. Mục đích thư mục init-db

Thư mục `init-db` chứa các tài nguyên phục vụ database của dự án NextHR:

- Schema chính để dựng database từ đầu.
- Các file update SQL lưu lịch sử thay đổi trong quá trình phát triển.
- Dữ liệu seed phục vụ demo nghiệp vụ nhân sự, chấm công, nghỉ phép và tính lương.
- Script demo database dùng để trình bày các tính năng CSDL nâng cao.

## 2. File chính

`SchemaNEXTHR.sql` là file dựng hoặc reset database local từ đầu.

File này thực hiện các việc chính:

- Tạo database `NextHR`.
- Tạo bảng, khóa chính, khóa ngoại, ràng buộc `UNIQUE`, ràng buộc `CHECK`.
- Tạo index phục vụ truy vấn.
- Seed dữ liệu mẫu.
- Tạo trigger audit log.
- Tạo view báo cáo.
- Tạo stored procedure tính lương.

Cảnh báo: chạy `SchemaNEXTHR.sql` sẽ reset dữ liệu local trong database NextHR. Không chạy file này trên database đang có dữ liệu cần giữ lại.

## 3. Cách chạy schema bằng Docker

Nếu container SQL Server đang chạy với tên `nexthr-db`, chạy lệnh sau:

```bash
docker exec -it nexthr-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Dang@12345 -C -i /init-db/SchemaNEXTHR.sql
```

## 4. Cách chạy update riêng lẻ

Thư mục `updates` lưu lịch sử thay đổi SQL trong quá trình phát triển.

Nếu đã chạy `SchemaNEXTHR.sql` mới nhất thì không cần chạy toàn bộ các file trong `updates`, vì các thay đổi mới đã được merge vào schema chính.

Không chạy toàn bộ `updates` theo thứ tự nếu không hiểu rõ trạng thái database hiện tại. Một số update dùng để nâng cấp database đã tồn tại, trong khi `SchemaNEXTHR.sql` dùng để dựng database mới từ đầu.

Chỉ chạy một update riêng lẻ khi database đang tồn tại và cần bổ sung đúng thay đổi trong file đó. Ví dụ:

```bash
docker exec -it nexthr-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Dang@12345 -C -i /init-db/updates/009_add_audit_triggers.sql
docker exec -it nexthr-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Dang@12345 -C -i /init-db/updates/010_add_reporting_views.sql
```

## 5. Tài khoản seed demo

Tài khoản đăng nhập demo chính:

- Email: `admin@nexthr.com`
- Mật khẩu demo: `123456`

Một số nhân viên demo có trong schema:

- `admin@nexthr.com` - Nguyễn Văn Hùng
- `lan.tran@nexthr.vn` - Trần Thị Lan
- `khoa.le@nexthr.vn` - Lê Minh Khoa
- `ha.pham@nexthr.vn` - Phạm Thu Hà
- `bao.do@nexthr.vn` - Đỗ Quốc Bảo

## 6. Dữ liệu demo tháng 3/2026

Dữ liệu demo tốt nhất để trình bày là tháng `3/2026`.

Các tình huống nghiệp vụ đã có:

- Nguyễn Văn Hùng đi làm đủ công.
- Trần Thị Lan nghỉ phép có lương 1 ngày.
- Lê Minh Khoa có ngày đi muộn và có làm thêm giờ cuối tuần.
- Phạm Thu Hà có làm thêm giờ ngày thường.
- Đỗ Quốc Bảo nghỉ không lương và thiếu công.

## 7. Các điểm CSDL nâng cao đã có

- Stored procedure `dbo.sp_CalculatePayroll`: tính lương theo tháng, xử lý công chuẩn, công thực tế, nghỉ phép, làm thêm giờ, bảo hiểm, thuế, khấu trừ và trạng thái phiếu lương.
- Transaction và rollback trong stored procedure: đảm bảo nếu tính lương lỗi thì không ghi dữ liệu dở dang.
- Trigger audit log: các trigger trên `dbo.NhanVien`, `dbo.DonNghiPhep`, `dbo.PhieuLuong` ghi log vào `dbo.NhatKyHeThong`.
- View báo cáo: `dbo.vw_BangLuongTongHop`, `dbo.vw_ChamCongThang`, `dbo.vw_ThongKeNghiPhep`, `dbo.vw_OrgChart`.
- Constraint: có khóa chính, khóa ngoại, `UNIQUE`, `CHECK` để bảo vệ toàn vẹn dữ liệu.
- Index phục vụ truy vấn: có index cho các quan hệ và truy vấn thường dùng.
- Seed demo có nghiệp vụ: dữ liệu mẫu không chỉ để hiển thị, mà còn dùng được cho chấm công, nghỉ phép, làm thêm giờ và tính lương.

## 8. Thứ tự demo đề xuất

1. Chạy `SchemaNEXTHR.sql`.
2. Chạy `demo_queries.sql`.
3. Chạy procedure tính lương.
4. Xem view báo cáo.
5. Test trigger audit.
6. Test constraint rollback.

## 9. Lưu ý khi làm việc với frontend

- Frontend không cần tự tính lương. Backend và database đã có procedure tính lương.
- Frontend gọi API payroll calculate với tháng và năm.
- Dữ liệu demo tốt nhất là tháng `3/2026`.
- Không sửa trực tiếp dữ liệu bằng tay nếu đang demo chung với backend, vì có thể làm lệch dữ liệu seed và kết quả tính lương.

