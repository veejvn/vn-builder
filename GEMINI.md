# Product Context

## Tại sao dự án tồn tại?
Việc xây dựng giao diện website thường mất nhiều thời gian lặp đi lặp lại các công việc boilerplate. Các công cụ builder hiện tại thường sinh ra code "rác" khó bảo trì hoặc khóa người dùng vào nền tảng của họ. VNBuilder ra đời để cung cấp một công cụ trực quan nhưng vẫn đảm bảo đầu ra là code React/Next.js chuẩn, sạch và có thể mở rộng.

## Các vấn đề cần giải quyết
- **Tốc độ & Hiệu quả**: Rút ngắn thời gian từ thiết kế đến sản phẩm thực tế (Time-to-market).
- **Chất lượng code**: Đảm bảo code sinh ra tuân thủ các best practices của React/Next.js.
- **Tính sở hữu**: Người dùng có thể xuất code và tự phát triển tiếp mà không bị phụ thuộc vào builder.
- **Quản lý tập trung**: Hỗ trợ mô hình Workspace/Project cho các đội nhóm hoặc cá nhân quản lý nhiều dự án.

## Trải nghiệm người dùng mong muốn
- **Trực quan & WYSIWYG**: Những gì thấy trên builder phải khớp hoàn toàn với kết quả cuối cùng.
- **Mượt mà**: Thao tác kéo thả (Drag and Drop) tự nhiên và phản hồi tức thì.
- **Chuyên nghiệp**: Dashboard quản lý gọn gàng, mang lại cảm giác của một công cụ làm việc chuyên sâu (tương tự Vercel Dashboard).
- **Kiểm soát chi tiết**: Chỉnh sửa style qua các tham số (Input, Select, Slider) mà không cần viết code trực tiếp nhưng vẫn hiểu được logic CSS đằng sau.

## Luồng người dùng chính
1. **Đăng nhập**: Truy cập vào hệ thống qua tài khoản được Admin cấp.
2. **Workspace**: Chọn hoặc tạo Workspace, quản lý danh sách dự án.
3. **Builder**:
   - Thiết kế layout bằng cách kéo thả component từ Registry vào Canvas.
   - Sắp xếp thứ tự, cấu trúc cây (Layout Tree).
   - Tùy chỉnh thuộc tính và style qua Property Panel.
4. **Xem trước & Xuất bản**: Xem trước website và thực hiện xuất code hoặc deploy lên Vercel.

# System Patterns

## Kiến trúc tổng thể
Dự án tuân thủ kiến trúc **Next.js App Router** kết hợp với **Feature-based structure** trong thư mục `src/features`. Mỗi module tính năng được đóng gói hoàn chỉnh bao gồm API, services, components và state.

## Các mẫu thiết kế quan trọng (Key Patterns)

### 1. Schema-driven Rendering (Core Builder)
- **Single Source of Truth**: Mọi thành phần trên Canvas được định nghĩa bởi một JSON layout tree.
- **Recursive Rendering**: `NodeRenderer` nhận schema và đệ quy để hiển thị toàn bộ cây component.
- **Component Registry**: Một bản đồ tập trung (`src/features/builder/registry/index.ts`) đăng ký các component có sẵn.

### 2. State Management
- **Zustand**: Sử dụng để quản lý trạng thái phức tạp của Builder (schema, active node, history) và các thông tin toàn cục khác (Auth, UI).
- **Immutability**: Đảm bảo schema luôn được cập nhật một cách bất biến để hỗ trợ Undo/Redo và đồng bộ dữ liệu.

### 3. Component Architecture
- **Common UI**: Sử dụng **shadcn/ui** (Radix UI + Tailwind) cho các thành phần giao diện cơ bản.
- **Registry Components**: Các component nguyên tử (Text, Button, Flex, Grid) mà người dùng có thể sử dụng trong builder.
- **Feature Isolation**: Logic của từng module (Admin, Auth, Builder, Workspace) được giữ tách biệt.

### 4. Data Access & Security
- **RBAC (Role-Based Access Control)**: Phân quyền người dùng (ADMIN, USER) và quyền trong workspace (OWNER, EDITOR, VIEWER).
- **Services Layer**: Tách biệt logic nghiệp vụ khỏi API Routes để dễ dàng kiểm thử và tái sử dụng.
- **Mongoose Models**: Định nghĩa schema dữ liệu cho User, Workspace, Project.

## Cấu trúc thư mục (Feature-based)
- `src/app`: Routes, Layouts và Pages (Next.js App Router).
- `src/features`: Logic nghiệp vụ theo module (ví dụ: `builder/`, `auth/`, `admin/`).
- `src/components`: UI chung và layout tổng thể.
- `src/lib`: Cấu hình thư viện (DB connection, Auth options).
- `src/stores`: Quản lý state toàn cục.
- `src/utils`: Các hàm tiện ích (xử lý cây dữ liệu, định dạng).
- `src/models`: Mongoose schemas.

# Tech Context

## Công nghệ sử dụng
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1.18](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag and Drop**: [dnd-kit](https://dndkit.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose 9.1.3](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js 4.24.13](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Runtime/Tools**: Node.js, npm, ts-node, ESLint.

## Môi trường phát triển
- **Node.js**: Phiên bản mới nhất tương thích với Next.js 16.
- **Package Manager**: npm.
- **Linter/Formatter**: ESLint 9.

## Các ràng buộc kỹ thuật
- **Schema-driven UI**: Mọi thay đổi trên builder phải được ánh xạ vào JSON schema.
- **Clean Code Output**: Code React được xuất ra phải tuân thủ các tiêu chuẩn mã nguồn sạch (ESLint, Prettier).
- **Responsive Preview**: Hỗ trợ xem trước giao diện trên Mobile, Tablet và Desktop.
- **No Lock-in**: Đảm bảo người dùng có thể tải code về và chạy độc lập.

## Cấu hình & Chạy dự án
- Cài đặt dependency: `npm install`
- Chạy môi trường dev: `npm run dev`
- Seed dữ liệu Admin: `npm run seed`
- Build dự án: `npm run build`