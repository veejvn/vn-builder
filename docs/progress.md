# Progress

## Các cột mốc quan trọng

- [x] Thiết lập cấu trúc dự án cơ bản (Next.js 16, Tailwind 4, Shadcn UI).
- [x] Định nghĩa mục tiêu và lộ trình dự án (README.md).
- [x] Khởi tạo và đồng bộ hóa Memory Bank.

## Trạng thái các giai đoạn (Roadmap)

### Phase 1 – Nền tảng (Đang thực hiện)

- [x] Deploy app cơ bản lên Vercel.
- [x] Hệ thống Auth (Login/Logout).
- [x] Admin Dashboard (Quản lý User, Workspace, Project).
- [x] Workspace & Project CRUD.

### Phase 2 – Builder MVP (Chưa bắt đầu)

- [x] Kéo thả component (dnd-kit).
- [x] Hiển thị Layout Tree.
- [x] Bảng điều khiển thuộc tính (Property Panel).
- [x] Tự động lưu Schema.

### Phase 3 – Code generation (Chưa bắt đầu)

- [ ] Sinh mã nguồn React/Next.js từ Schema.
- [ ] Tải về mã nguồn dưới dạng file ZIP.

### Phase 4 – Collaboration & Nâng cao (Chưa bắt đầu)

- [ ] Phân quyền thành viên trong Workspace.
- [ ] Lịch sử phiên bản (Version History).
- [ ] Tích hợp Deployment tự động (GitHub/Vercel API).

## Trạng thái kỹ thuật hiện tại

- **Mã nguồn**: Đã có cấu trúc thư mục feature-based, một số tệp builder đã được tạo khung nhưng chưa có logic.
- **Dữ liệu**: Đã cấu hình Mongoose, có script seed dữ liệu Admin.
- **UI**: Đã tích hợp shadcn/ui và Tailwind CSS 4.

## Các vấn đề cần giải quyết

- Xác định mức độ hoàn thiện thực tế của module Auth và Workspace.
- Thiết lập kết nối MongoDB để kiểm tra tính năng.

## Kế hoạch tiếp theo

- Kiểm tra chi tiết thư mục `src/features/auth` và `src/features/workspace`.
- Chạy script seed để kiểm tra hệ thống Admin.