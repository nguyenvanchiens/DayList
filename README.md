# DayList (ToDoLife)

Ứng dụng việc cần làm trong ngày theo phong cách tờ lịch bloc: biết hôm nay làm gì, mỗi việc mất bao lâu, và đã làm được gì. Chạy như một ứng dụng trên điện thoại (PWA), dùng được khi không có mạng, dữ liệu lưu trong `localStorage`, không cần server.

## Tính năng

- **Hôm nay**: tờ lịch có ngày âm lịch và câu tục ngữ, dải thời gian trong ngày, danh sách việc theo giờ. Làm xong thì tích.
- **Việc lặp lại**: hằng ngày, Thứ 2 – Thứ 6, cuối tuần hoặc chọn từng thứ. Mỗi ngày app tự tạo danh sách của hôm đó.
- **Sắp tới**: việc theo ngày, tìm kiếm không cần gõ dấu, quản lý việc lặp lại.
- **Nhật ký**: biểu đồ 7 ngày và lịch sử việc đã xong.
- Vuốt phải để tích xong, vuốt trái để xóa (có hoàn tác). Giao diện sáng/tối. Responsive cho điện thoại, tablet và máy tính.

## Chạy dự án

```bash
npm install
npm run dev       # chạy khi phát triển
npm run build     # build ra thư mục dist/
npm run preview   # xem bản build (có PWA) tại http://localhost:4173
npm run icons     # tạo lại icon từ public/logo.svg
```

Muốn cài lên điện thoại, cần đưa lên hosting có HTTPS, ví dụ Cloudflare (bên dưới).

## Deploy lên Cloudflare

Repo đã có sẵn `wrangler.jsonc`, `.node-version` (Node 22) và `public/_headers` (cache cho service worker).

**Cách 1 – Workers (khuyên dùng), tự deploy mỗi lần push:**
Cloudflare Dashboard → Workers & Pages → Create → Import a repository → chọn repo này.

| Mục | Giá trị |
|---|---|
| Project name | `daylist` (trùng `name` trong `wrangler.jsonc`) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

**Cách 2 – Pages:** Create → Pages → Connect to Git, chọn preset **Vite** hoặc điền tay: build command `npm run build`, output directory `dist`.

**Deploy từ máy:** `npx wrangler login` một lần, sau đó `npm run deploy`.

## Cấu trúc

```
src/
  App.jsx               trạng thái chung, sinh việc lặp lại mỗi ngày
  data/schedule.js      lịch mặc định (tăng SCHEDULE_VERSION khi sửa)
  views/                Hôm nay, Sắp tới, Nhật ký
  components/           tờ lịch, dải thời gian, dòng việc, form thêm/sửa
  utils/                ngày tháng, âm lịch, xử lý việc
```

Công nghệ: React 19, Vite, vite-plugin-pwa (Workbox).
