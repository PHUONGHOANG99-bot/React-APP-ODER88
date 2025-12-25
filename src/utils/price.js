// ==================== HÀM FORMAT GIÁ TIỀN ====================
// Tỷ giá: 1¥ = 170 VND (theo App dcom)
export const YEN_TO_VND_RATE = 170;

// Hàm lấy số Yên từ chuỗi giá
export function getYenAmount(price) {
  if (!price) return 0;
  let priceStr = String(price);
  // Loại bỏ tất cả ký tự không phải số
  priceStr = priceStr.replace(/[^0-9]/g, "");
  return parseInt(priceStr) || 0;
}

// Hàm quy đổi Yên sang VND
export function convertYenToVND(yenAmount) {
  return Math.round(yenAmount * YEN_TO_VND_RATE);
}

// Hàm format số VND với dấu chấm ngăn cách
export function formatVND(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm format giá Yên (giữ nguyên format hiện tại)
export function formatPriceToYen(price) {
  if (!price) return "¥0";

  // Normalize price string
  let priceStr = String(price);
  priceStr = priceStr.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  priceStr = priceStr.replace(/Â(?=\s*[¥₫đ])/g, "");

  // Nếu đã có ký hiệu yên (¥ hoặc y), giữ nguyên
  if (
    priceStr.includes("¥") ||
    priceStr.includes("y") ||
    priceStr.includes("Y")
  ) {
    // Thay "y" hoặc "Y" thành "¥"
    priceStr = priceStr.replace(/[yY]/g, "¥");
    // Đảm bảo "¥" ở đầu
    if (!priceStr.startsWith("¥")) {
      priceStr = priceStr.replace(/¥/g, "").replace(/[đ₫]/g, "");
      return `¥${priceStr}`;
    }
    return priceStr;
  }

  // Loại bỏ ký hiệu VND (đ, ₫)
  priceStr = priceStr.replace(/[đ₫]/g, "").trim();

  // Thêm ký hiệu yên ở đầu
  return `¥${priceStr}`;
}

// Hàm format giá hiển thị cả Yên và VND
export function formatPriceWithVND(price) {
  const yenAmount = getYenAmount(price);
  const yenFormatted = formatPriceToYen(price);
  const vndAmount = convertYenToVND(yenAmount);
  const vndFormatted = formatVND(vndAmount);

  return {
    yen: yenFormatted,
    vnd: `VND ${vndFormatted}`,
  };
}

