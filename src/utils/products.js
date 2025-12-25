// ==================== PRODUCT UTILITIES ====================

import { sanitizeProduct as sanitizeProductFn } from "./encoding.js";

// Hàm load products từ JSON
export async function loadProducts() {
  try {
    console.log("Đang load sản phẩm từ JSON...");
    // Sử dụng import.meta.env.BASE_URL để hỗ trợ GitHub Pages base path
    const baseUrl = import.meta.env.BASE_URL || '/';
    const response = await fetch(`${baseUrl}products.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Sanitize tất cả products
    const sanitized = Array.isArray(data)
      ? data.map(sanitizeProductFn)
      : sanitizeProductFn(data);

    console.log(`✅ Đã load ${sanitized.length} sản phẩm`);
    return sanitized;
  } catch (error) {
    console.error("❌ Lỗi load products:", error);
    // Return empty array on error
    return [];
  }
}

// Hàm lấy số lượng đã mua
export function getPurchaseCount(product) {
  if (product == null) return 0;
  const val = product.purchases;
  if (val === undefined || val === null) {
    return product.bestSeller ? 1 : 0;
  }
  const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
  if (Number.isNaN(num)) return product.bestSeller ? 1 : 0;
  return num;
}

// Hàm lấy best sellers
export function getBestSellers(products) {
  if (!products || !Array.isArray(products)) return [];
  
  return products
    .filter((p) => p.bestSeller || getPurchaseCount(p) > 0)
    .sort((a, b) => getPurchaseCount(b) - getPurchaseCount(a))
    .slice(0, 20); // Top 20 best sellers
}

// Hàm get category display name
export function getCategoryDisplayName(categoryId, fallbackName) {
  const categoryNames = {
    all: "Tất cả",
    "set-do": "Sét Đồ",
    "ao-nu": "Áo nữ",
    "ao-nam": "Áo Nam",
    "tui-xach": "Túi xách",
    giay: "Giày",
    vay: "Váy",
    "quan-dai-nu": "Quần dài nữ",
    "quan-nam": "Quần Nam",
    "phu-kien": "Phụ Kiện",
  };

  return categoryNames[categoryId] || fallbackName || categoryId;
}

