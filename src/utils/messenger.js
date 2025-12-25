// ==================== MESSENGER UTILITIES ====================

// Hàm escape message cho HTML
export function escapeMessageForHTML(message) {
  // Escape cho việc sử dụng trong single-quoted string
  return message
    .replace(/\\/g, "\\\\") // Escape backslashes trước
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/\n/g, "\\n") // Escape newlines
    .replace(/\r/g, "\\r"); // Escape carriage returns
}

// Hàm mở Messenger App
export function openMessengerApp(message = "") {
  // Facebook page username của oder88shop
  const pageUsername = "oder88shop";

  // URL để mở Messenger page (m.me tự động mở app nếu có, nếu không thì mở web)
  let messengerUrl = `https://m.me/${pageUsername}`;

  // Thêm message vào URL nếu có
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    messengerUrl += `?text=${encodedMessage}`;
  }

  // Kiểm tra xem có phải mobile không
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Trên mobile, sử dụng window.location.href để đảm bảo mở được Messenger app
  // Trên desktop, sử dụng window.open để mở tab mới
  if (isMobile) {
    // Trên mobile: chuyển hướng trực tiếp để mở Messenger app
    window.location.href = messengerUrl;
  } else {
    // Trên desktop: mở tab mới
    window.open(messengerUrl, "_blank");
  }
}

// Hàm tạo link Messenger cho đơn hàng
export function createMessengerOrderLink(productName, productPrice, categoryName) {
  const message = `Xin chào, tôi muốn đặt hàng:\n\nSản phẩm: ${productName}\nGiá: ${productPrice}\nDanh mục: ${categoryName}\n\nVui lòng xác nhận đơn hàng. Cảm ơn bạn!`;
  return message;
}

