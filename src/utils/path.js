// ==================== PATH UTILITIES ====================

// Hàm normalize đường dẫn cho GitHub Pages và Vite
export function normalizePath(path) {
  if (!path) return path;
  
  // Lấy base URL từ Vite (sẽ là '/React-APP-ODER88/' trên GitHub Pages, '/' ở local)
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Nếu path đã bắt đầu bằng /, thêm base URL vào
  if (path.startsWith("/")) {
    // Loại bỏ / đầu tiên và thêm base URL
    return `${baseUrl}${path.slice(1)}`;
  }
  
  // Nếu path bắt đầu bằng assets/, thêm base URL vào
  if (path.startsWith("assets/")) {
    return `${baseUrl}${path}`;
  }
  
  // Các trường hợp khác, thêm base URL vào
  return `${baseUrl}${path}`;
}

