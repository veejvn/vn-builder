# Progress

## Key Milestones

- [x] Basic project structure setup (Next.js 15, Tailwind 4, Shadcn UI).
- [x] Project definition and roadmap defined (README.md).
- [x] Memory Bank initialized and synchronized.

## Phase Status (Roadmap)

### Phase 1 – Foundation (Completed)

- [x] Basic app deployment to Vercel.
- [x] Auth system (Login/Logout).
- [x] Admin Dashboard (User, Workspace, Project management).
- [x] Workspace & Project CRUD.

### Phase 2 – Builder MVP (In Progress)

- [x] Drag and drop components (dnd-kit).
- [x] Sidebar-to-canvas drag and drop.
- [x] Cross-parent node movement with valid drop targets.
- [x] Recursive layer deletion and safer schema mutations.
- [x] Undo/Redo for builder schema changes.
- [x] Preview mode and desktop/tablet/mobile canvas viewports.
- [x] Layout Tree display.
- [x] Searchable/collapsible Layout Tree.
- [x] Property Panel (Advanced CSS controls).
- [x] Structured color, spacing, sizing, and layout controls.
- [x] Schema Auto-save.

### Phase 3 – Code Generation (MVP Complete)

- [x] React/Next.js code generation from Schema.
- [x] Preview generated source files.
- [x] Export source code as ZIP.
- [ ] GitHub/Vercel automated deployment.

### Phase 4 – Collaboration & Advanced Features (To Do)

- [ ] Workspace member permissions.
- [ ] Version History.
- [ ] Automated Deployment integration (GitHub/Vercel API).

## Technical Status

- **Source Code**: Feature-based architecture. Core Builder logic (Canvas, NodeRenderer, Store) is operational with safer schema utilities, cross-parent drag/drop, undo/redo, preview mode, responsive canvas viewports, searchable layers, Component Registry, Advanced Property Panel, and Code Generation MVP.
- **Data**: Mongoose configured, supporting JSON Schema storage. Auto-save/Manual-save features implemented.
- **UI**: Integrated shadcn/ui and Tailwind CSS 4. Modern Dark Mode Builder interface.

## Current Issues

- Optimize rendering performance for large component trees.
- Improve generated code fidelity for advanced layout/style props.
- Add browser-level regression coverage for core builder drag/drop flows.

## Next Steps

- Create basic templates for quick start.
- Design automated deploy flow after Code Generation MVP stabilizes.
- Add asset upload/storage for image-heavy builder workflows.

---

# Tiến độ

## Các cột mốc quan trọng

- [x] Thiết lập cấu trúc dự án cơ bản (Next.js 15, Tailwind 4, Shadcn UI).
- [x] Định nghĩa mục tiêu và lộ trình dự án (README.md).
- [x] Khởi tạo và đồng bộ hóa Memory Bank.

## Trạng thái các giai đoạn (Roadmap)

### Phase 1 – Nền tảng (Hoàn thành)

- [x] Deploy app cơ bản lên Vercel.
- [x] Hệ thống Auth (Login/Logout).
- [x] Admin Dashboard (Quản lý User, Workspace, Project).
- [x] Workspace & Project CRUD.

### Phase 2 – Builder MVP (Đang thực hiện)

- [x] Kéo thả component (dnd-kit).
- [x] Kéo component từ sidebar vào canvas.
- [x] Di chuyển node giữa các parent hợp lệ.
- [x] Xóa layer đệ quy và mutation schema an toàn hơn.
- [x] Undo/Redo cho thay đổi schema trong builder.
- [x] Chế độ Preview và viewport desktop/tablet/mobile.
- [x] Hiển thị Layout Tree.
- [x] Layout Tree có tìm kiếm/thu gọn.
- [x] Bảng điều khiển thuộc tính (Property Panel nâng cao).
- [x] Control màu sắc, spacing, kích thước và layout có cấu trúc hơn.
- [x] Tự động lưu Schema.

### Phase 3 – Code generation (MVP hoàn thành)

- [x] Sinh mã nguồn React/Next.js từ Schema.
- [x] Xem trước mã nguồn được sinh.
- [x] Tải về mã nguồn dưới dạng file ZIP.
- [ ] Tích hợp deploy tự động qua GitHub/Vercel.

### Phase 4 – Collaboration & Nâng cao (Chưa bắt đầu)

- [ ] Phân quyền thành viên trong Workspace.
- [ ] Lịch sử phiên bản (Version History).
- [ ] Tích hợp Deployment tự động (GitHub/Vercel API).

## Trạng thái kỹ thuật hiện tại

- **Mã nguồn**: Cấu trúc feature-based. Logic core Builder (Canvas, NodeRenderer, Store) đã hoạt động với schema utilities an toàn hơn, drag/drop giữa parent, undo/redo, preview mode, viewport responsive, layers có tìm kiếm, Component Registry, Bảng thuộc tính nâng cao và Code Generation MVP.
- **Dữ liệu**: Đã cấu hình Mongoose, hỗ trợ lưu trữ JSON Schema. Đã có tính năng Auto-save/Manual-save.
- **UI**: Đã tích hợp shadcn/ui và Tailwind CSS 4. Giao diện Builder phong cách Dark Mode hiện đại.

## Các vấn đề cần giải quyết

- Tối ưu hóa hiệu năng render cây component lớn.
- Cải thiện độ trung thực của code sinh ra với layout/style nâng cao.
- Bổ sung regression test cấp trình duyệt cho các luồng kéo thả chính.

## Kế hoạch tiếp theo

- Tạo mẫu (Template) cơ bản để người dùng bắt đầu nhanh.
- Thiết kế luồng deploy tự động sau khi Code Generation MVP ổn định.
- Thêm upload/lưu trữ asset cho workflow builder dùng nhiều hình ảnh.
