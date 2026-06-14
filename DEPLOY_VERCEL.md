# Triển khai dự án lên Vercel

Tài liệu này hướng dẫn deploy frontend React + TypeScript + Vite trong repo này lên Vercel.

## 1. Điều kiện cần

- Có tài khoản Vercel: <https://vercel.com>
- Source code đã được đẩy lên GitHub, GitLab hoặc Bitbucket
- Máy local đã kiểm tra build thành công:

```bash
npm install
npm run build
```

## 2. Cấu hình hiện tại của dự án

Project này dùng:

- `Vite`
- `React`
- `TypeScript`
- `React Router`

Script build hiện tại trong [package.json](/home/truongvu/Documents/vdt/design/package.json):

```json
"build": "tsc -b && vite build"
```

Output build nằm trong thư mục:

```bash
dist
```

Repo cũng đã có sẵn file [vercel.json](/home/truongvu/Documents/vdt/design/vercel.json) để xử lý SPA routing cho React Router.

## 3. Deploy bằng giao diện Vercel

### Bước 1: Import project

1. Đăng nhập Vercel
2. Chọn `Add New...`
3. Chọn `Project`
4. Chọn repository chứa project này

### Bước 2: Kiểm tra build settings

Vercel thường tự nhận diện đúng vì đây là dự án Vite. Nếu cần cấu hình tay, dùng:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Bước 3: Deploy

1. Nhấn `Deploy`
2. Đợi Vercel build xong
3. Sau khi hoàn tất, mở domain Vercel được cấp

## 4. Deploy bằng Vercel CLI

Nếu muốn deploy từ terminal:

### Cài Vercel CLI

```bash
npm install -g vercel
```

### Đăng nhập

```bash
vercel login
```

### Deploy lần đầu

Chạy trong thư mục project:

```bash
vercel
```

Khi CLI hỏi:

- Set up and deploy: chọn `Y`
- Scope: chọn tài khoản/team của bạn
- Link to existing project: chọn `N` nếu là project mới
- Project name: nhập tên mong muốn
- Directory: giữ nguyên thư mục hiện tại

### Deploy production

```bash
vercel --prod
```

## 5. Vì sao cần `vercel.json`

Dự án dùng `React Router`, tức là route như:

- `/home`
- `/map`
- `/report`
- `/profile`
- `/admin`

Nếu không có rewrite, khi refresh trực tiếp ở các route này Vercel có thể trả về `404`.

File [vercel.json](/home/truongvu/Documents/vdt/design/vercel.json) đang cấu hình mọi request trả về `index.html`, để React Router tự xử lý phía client.

## 6. Biến môi trường

Hiện tại project này dùng mock data và chưa cần backend thật, nên:

- chưa cần cấu hình `.env`
- chưa cần thêm Environment Variables trên Vercel

Nếu sau này tích hợp API thật:

1. Vào `Project Settings`
2. Chọn `Environment Variables`
3. Thêm các biến như:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

Lưu ý với Vite: biến môi trường dùng ở frontend phải bắt đầu bằng `VITE_`.

## 7. Kiểm tra sau deploy

Sau khi deploy, nên test nhanh các mục sau:

1. Mở trang `/auth`
2. Đăng nhập user và admin
3. Refresh ở các route:
   - `/home`
   - `/map`
   - `/report`
   - `/route-planner`
   - `/admin`
4. Kiểm tra bản đồ Leaflet hiển thị bình thường
5. Kiểm tra toast, routing và fullscreen navigation

## 8. Nếu deploy lỗi

### Lỗi build fail

Chạy local trước:

```bash
npm run build
```

Nếu local fail thì sửa lỗi trong code trước khi deploy lại.

### Lỗi 404 khi refresh trang con

Kiểm tra file [vercel.json](/home/truongvu/Documents/vdt/design/vercel.json) còn đúng không.

### Leaflet hiển thị sai style

Kiểm tra import CSS Leaflet đã có trong [src/main.tsx](/home/truongvu/Documents/vdt/design/src/main.tsx).

## 9. Khuyến nghị

- Dùng branch riêng cho production nếu cần demo ổn định
- Bật auto deploy từ branch chính
- Gắn custom domain nếu dùng cho báo cáo/đồ án/demo chính thức

## 10. Lệnh nhanh

```bash
npm install
npm run build
vercel
vercel --prod
```
