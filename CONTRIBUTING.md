# Contributing to VNBuilder

Cảm ơn bạn đã quan tâm và muốn đóng góp cho **VNBuilder** 🎉

Tài liệu này mô tả **quy ước làm việc, Git Flow, coding standards và quy trình review** để đảm bảo codebase luôn **clean – maintainable – scalable**.

---

## 1. Nguyên tắc cốt lõi

VNBuilder là **schema-first, architecture-driven project**. Mọi đóng góp cần tuân thủ các nguyên tắc sau:

1. **Schema là nguồn sự thật duy nhất**
2. **Code sinh ra phải clean, readable, có thể mở rộng**
3. **Không hack, không quick fix phá kiến trúc**
4. **Ưu tiên long-term maintainability hơn tốc độ**

---

## 2. Yêu cầu trước khi bắt đầu

* Node.js >= 18
* pnpm (khuyến nghị)
* Hiểu cơ bản:

  * React / Next.js App Router
  * TypeScript
  * Tailwind CSS
  * Zustand

---

## 3. Cài đặt môi trường local

```bash
pnpm install
pnpm dev
```

Ứng dụng chạy tại:

```
http://localhost:3000
```

---

## 4. Git Flow & Branch Convention

### 4.1 Branch chính

| Branch    | Mục đích                |
| --------- | ----------------------- |
| `main`    | Production (đã release) |
| `dev` | Development / Staging   |

❌ Không commit trực tiếp vào `main`

---

### 4.2 Branch phụ

```text
feature/*   → phát triển tính năng
bugfix/*    → sửa bug trên develop
release/*   → chuẩn bị release
hotfix/*    → sửa lỗi production
```

#### Naming convention

```text
feature/<domain>-<short-desc>
```

Ví dụ:

* `feature/builder-canvas-dnd`
* `feature/auth-rbac`
* `feature/codegen-nextjs`

---

## 5. Commit Message Convention

Áp dụng **Conventional Commits**:

```text
feat(scope): description
fix(scope): description
refactor(scope): description
chore(scope): description
docs(scope): description
```

Ví dụ:

```bash
feat(builder): add node selection
fix(auth): prevent session crash
refactor(schema): normalize layout tree
```

---

## 6. Quy ước code (Coding Standards)

### 6.1 TypeScript

* ❌ Không dùng `any`
* ✅ Prefer `type` hơn `interface` (trừ khi cần extend)
* ✅ Define type trong `*.types.ts`

---

### 6.2 Domain-driven structure

Mỗi domain nằm trong `src/features/*`

```text
features/
 ├─ builder/
 ├─ auth/
 ├─ workspace/
 └─ project/
```

❌ Không import chéo domain nếu không cần thiết

---

### 6.3 Builder-specific rules

* Mọi UI trong Builder **phải render từ schema**
* ❌ Không hardcode JSX ngoài registry
* ❌ Không mutate schema trực tiếp
* ✅ Mọi thay đổi schema thông qua store / utils

---

## 7. Pull Request (PR) Guidelines

### 7.1 Khi tạo PR

* Base branch:

  * `feature/*` → `develop`
  * `release/*` → `main`
* PR phải có:

  * Mô tả rõ ràng
  * Screenshot / video (nếu là UI)
  * Checklist hoàn thành

---

### 7.2 PR Checklist (bắt buộc)

```text
- [ ] Không breaking schema hiện tại
- [ ] Code tuân thủ kiến trúc domain
- [ ] Không console.log dư thừa
- [ ] TypeScript không error
- [ ] Đã test manual builder canvas
```

---

## 8. Release & Versioning

VNBuilder dùng **Semantic Versioning**:

```text
vMAJOR.MINOR.PATCH
```

Ví dụ:

* `v0.1.0` – Builder MVP
* `v0.2.0` – Code generation
* `v1.0.0` – Stable release

---

## 9. Schema Change & Migration

Nếu PR **thay đổi schema**:

* Phải document rõ ràng
* Không được phá schema cũ nếu chưa có migration
* Update trong:

  ```text
  features/builder/schema/
  ```

---

## 10. Những điều KHÔNG được làm

❌ Commit trực tiếp vào `main`
❌ Hardcode UI ngoài registry
❌ Bypass schema để render UI
❌ Quick fix phá kiến trúc
❌ Merge PR khi chưa review

---

## 11. Cần hỗ trợ?

* Tạo issue với label phù hợp
* Thảo luận trước nếu là thay đổi kiến trúc lớn

---

> VNBuilder được xây dựng như **một sản phẩm thật**, không phải demo. Mọi đóng góp đều phải phản ánh tinh thần đó.

Cảm ơn bạn đã đóng góp ❤️