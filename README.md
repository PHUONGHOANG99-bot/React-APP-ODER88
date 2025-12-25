# ODER88 Shop - React App

Ứng dụng web thời trang ODER88 được chuyển đổi sang React + Vite.

## Yêu cầu

- Node.js 16+ 
- npm hoặc yarn

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

## Preview production build

```bash
npm run preview
```

## Cấu trúc dự án

```
react-app/
├── public/          # Static files (products.json, images, assets)
├── src/
│   ├── components/  # React components
│   ├── context/     # React Context (state management)
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Main App component
│   ├── main.jsx     # Entry point
│   └── style.css    # Main styles (copied from original)
```

## Tính năng

- ✅ Load sản phẩm từ JSON
- ✅ Tìm kiếm sản phẩm
- ✅ Lọc theo danh mục
- ✅ Phân trang
- ✅ Giỏ hàng (localStorage)
- ✅ Gallery sản phẩm
- ✅ Slider sản phẩm nổi bật
- ✅ Dark/Light mode
- ✅ Responsive design

## Lưu ý

- Tất cả dữ liệu được lưu trong localStorage (không có backend)
- products.json được đặt trong thư mục `public/`
- Images và assets được đặt trong `public/assets/`
