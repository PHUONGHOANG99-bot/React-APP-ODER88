// ==================== PATH UTILITIES ====================

// Hàm normalize đường dẫn cho GitHub Pages và Vite
export function normalizePath(path) {
  if (!path) return path;
  
  // Trong Vite, public folder được serve ở root
  // Nếu path đã bắt đầu bằng /, giữ nguyên
  if (path.startsWith("/")) {
    return path;
  }
  
  // Nếu path bắt đầu bằng assets/, thêm / ở đầu
  if (path.startsWith("assets/")) {
    return `/${path}`;
  }
  
  // Các trường hợp khác, thêm / ở đầu
  return `/${path}`;
}

