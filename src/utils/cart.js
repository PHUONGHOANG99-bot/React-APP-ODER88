// ==================== CART UTILITIES ====================

const CART_STORAGE_KEY = "shoppingCart";

// Hàm normalize ID
export function normalizeId(id) {
  return String(id || "").trim().toLowerCase();
}

// Hàm kiểm tra category có cần size không
export function needsSize(category) {
  return getSizesForCategory(category).length > 0;
}

// Hàm lấy sizes cho category
export function getSizesForCategory(category) {
  if (!category) return [];

  // Theo code HTML cũ: quần áo / set đồ / váy đều chọn size S-M-L-XL
  const clothingCategories = [
    "ao-nam",
    "ao-nu",
    "ao-dong-nam",
    "ao-dong-nu",
    "ao-thu-dong",
    "quan-nam",
    "quan-jean-nam",
    "quan-bo-nam",
    "quan-dai-nu",
    "quan-nu",
    "set-do",
    "set-do-nam",
    "set-do-nu",
    "vay",
    "chan-vay",
  ];

  // Theo code HTML cũ: giày dép chọn 35-44
  const shoeCategories = [
    "giay",
    "giay-nam",
    "giay-nu",
    "boot-nu",
    "giay-the-thao",
    "giay-sneaker-nam",
  ];

  if (clothingCategories.includes(category)) {
    return ["S", "M", "L", "XL"];
  }

  if (shoeCategories.includes(category)) {
    return ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
  }

  return [];
}

// Hàm normalize cart item
export function normalizeCartItem(raw) {
  return {
    id: normalizeId(raw.id),
    productId: raw.productId || raw.id,
    name: raw.name || "",
    price: raw.price || "",
    image: raw.image || "",
    category: raw.category || "",
    categoryName: raw.categoryName || "",
    size: raw.size || null,
    quantity: parseInt(raw.quantity || 1, 10),
  };
}

// Hàm load cart từ localStorage
export function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed
        .map(normalizeCartItem)
        .filter((i) => i && i.id && i.name); // Filter items that have id and name
    }
    return [];
  } catch (error) {
    console.error("Lỗi load cart:", error);
    return [];
  }
}

// Hàm save cart vào localStorage
export function saveCart(cart) {
  try {
    if (Array.isArray(cart)) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  } catch (error) {
    console.error("Lỗi save cart:", error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn("LocalStorage quota exceeded. Cart may not be saved.");
    }
  }
}

// Hàm tạo item key cho cart (giống code cũ: id_size hoặc id_nosize)
export function getCartItemKey(item) {
  const id = normalizeId(item.productId || item.id);
  const sizePart = item.size || "nosize";
  return `${id}_${sizePart}`;
}

