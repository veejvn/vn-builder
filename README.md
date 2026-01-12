# VNBuilder – Project Definition & Roadmap

## 1. Tổng quan dự án

**VNBuilder** là một nền tảng **Visual Website Builder (Low-code)** cho phép người dùng xây dựng website bằng cách **kéo – thả các component UI**, chỉnh sửa CSS thông qua tham số trực quan, sau đó **xuất code chuẩn (React / Next.js)**, push lên GitHub và deploy lên Vercel để review.

Dự án được định hướng như một **internal tool / workspace-based platform** (tương tự Figma, Notion, Vercel Dashboard), tập trung vào **chất lượng kiến trúc, code sinh ra sạch, có thể maintain**, phục vụ học tập, làm việc nhóm và review kỹ thuật.

---

## 2. Mục tiêu chính

### 🎯 Mục tiêu kỹ thuật

* Xây dựng một **builder thực thụ**, không chỉ demo UI
* Code sinh ra:

  * Dễ đọc
  * Dễ mở rộng
  * Có thể tiếp tục phát triển như project thật
* Kiến trúc đủ tốt để scale (multi-user, multi-project)

### 🎓 Mục tiêu học tập

* Hiểu sâu:

  * React / Next.js
  * CSS layout (Flexbox, Grid)
  * State management phức tạp
  * Auth, RBAC, workspace-based app
* Làm portfolio lớn, gần với sản phẩm công ty

---

## 3. Phạm vi hệ thống

### Các trang chính

```
/login        → Đăng nhập
/workspace    → Quản lý workspace & project
/builder/:id  → Trình xây dựng website
/admin        → Quản lý user & phân quyền
```

❌ Không có landing page
❌ Không cho đăng ký tự do

---

## 4. Mô hình người dùng & phân quyền

### User

```ts
User {
  id
  email
  name
  role: ADMIN | USER
  status: ACTIVE | DISABLED
}
```

### Workspace

```ts
Workspace {
  id
  name
  ownerId
  members: [{ userId, role: OWNER | EDITOR | VIEWER }]
}
```

### Project

```ts
Project {
  id
  workspaceId
  name
  schema   // JSON layout tree
  createdBy
  updatedAt
}
```

---

## 5. Builder – định hướng kỹ thuật

### 5.1 Schema-driven

* Mỗi website được biểu diễn bằng **JSON layout tree**
* Schema là nguồn dữ liệu duy nhất (single source of truth)

Ví dụ:

```json
{
  "type": "Flex",
  "styles": { "gap": 16, "justify": "center" },
  "children": [
    { "type": "Button", "props": { "text": "Buy now" } }
  ]
}
```

---

### 5.2 Component Registry

* Mọi component đều được đăng ký tập trung
* Builder render UI dựa trên registry

```ts
const registry = {
  Flex,
  Grid,
  Text,
  Image,
  Button
}
```

---

### 5.3 CSS Configuration

* Không cho người dùng viết CSS tự do
* Chỉ chỉnh thông qua:

  * Input
  * Select
  * Slider
* Mapping sang Tailwind class hoặc style object

---

## 6. Xuất code & deploy

### Giai đoạn đầu

* Export code (ZIP)
* Người dùng tự deploy

### Giai đoạn sau

```
Schema
 → Generate Next.js project
 → Push GitHub (API)
 → Deploy Vercel (API)
 → Trả về preview URL
```

---

## 7. Công nghệ sử dụng

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* dnd-kit

### Backend

* Next.js API Routes
* NextAuth (Credentials / OAuth)
* MongoDB + Mongoose

### DevOps

* GitHub API
* Vercel API

---

## 8. Lộ trình phát triển

### Phase 1 – Nền tảng

* Deploy app cơ bản lên Vercel
* Login
* Admin tạo user
* Workspace & project CRUD

### Phase 2 – Builder MVP

* Drag & drop component
* Layout tree
* Property panel
* Auto save schema

### Phase 3 – Code generation

* Generate React / Next.js code
* Chuẩn hoá structure

### Phase 4 – Collaboration & nâng cao

* Phân quyền member
* Version history
* Comment & review
* AI hỗ trợ layout (tương lai)

---

## 9. Định hướng dài hạn

* Template gallery
* Component reusable
* Responsive breakpoint editor
* AI: mô tả → sinh layout
* Scale thành SaaS

---

## 10. Nguyên tắc cốt lõi

1. **Schema-first**
2. **Code sinh ra phải clean**
3. **Không lock-in người dùng**
4. **Ưu tiên kiến trúc hơn giao diện**
5. **Dùng được trong môi trường thực tế**

---

> VNBuilder không chỉ là tool kéo thả, mà là một nền tảng giúp hiểu sâu cách website được xây dựng từ layout → code → deploy.