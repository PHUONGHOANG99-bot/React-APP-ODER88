import { useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPriceToYen, formatPriceWithVND, getYenAmount, convertYenToVND, formatVND } from "../utils/price.js";
import { normalizePath } from "../utils/path.js";
import { getCartItemKey } from "../utils/cart.js";
import { openMessengerApp } from "../utils/messenger.js";

export default function CartModal() {
  const {
    cart,
    isCartModalOpen,
    closeCart,
    selectedItems,
    toggleSelectItem,
    toggleSelectAll,
    removeFromCart,
    updateQuantity,
    changeSize,
    getCartTotal,
    needsSize,
    getSizesForCategory,
  } = useCart();

  useEffect(() => {
    const modal = document.getElementById("cartModal");
    if (!modal) return;

    if (isCartModalOpen) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }, [isCartModalOpen]);

  const handleClose = () => {
    closeCart();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      handleClose();
    }
  };

  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
  };

  const handleQuantityChange = (productId, newQuantity, size) => {
    if (newQuantity < 1) newQuantity = 1;
    updateQuantity(productId, newQuantity, size);
  };

  const handleSizeChange = (productId, oldSize, newSize, category) => {
    changeSize(productId, oldSize, newSize, category);
  };

  const handleCheckout = () => {
    const selectedCartItems = cart.filter((item) =>
      selectedItems.has(getCartItemKey(item))
    );

    if (selectedCartItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng");
      return;
    }

    let message = "Xin chao, toi muon dat hang:\n\n";
    selectedCartItems.forEach((item) => {
      const itemTotalYen = getYenAmount(item.price) * item.quantity;
      const itemTotalVND = convertYenToVND(itemTotalYen);

      message += `${item.name}\n`;
      if (item.size) {
        message += `   Size: ${item.size}\n`;
      }
      message += `   Gia: ${formatPriceToYen(item.price)}\n`;
      message += `   So luong: ${item.quantity}\n`;
      message += `   Thanh tien: ¥${formatVND(itemTotalYen)} (VND ${formatVND(itemTotalVND)})\n`;
    });

    const total = getCartTotal();
    message += "================================\n";
    message += `TONG CONG: ¥${formatVND(total.yen)} (VND ${formatVND(total.vnd)})\n`;
    message += "Vui long xac nhan don hang. Cam on ban!";

    openMessengerApp(message);
  };

  const total = getCartTotal();
  const allSelected = cart.length > 0 && selectedItems.size === cart.length;

  return (
    <div className="cart-modal" id="cartModal" onClick={handleOverlayClick}>
      <div className="cart-overlay"></div>
      <div className="cart-content">
        <button
          className="cart-close-btn"
          onClick={handleClose}
          aria-label="Đóng giỏ hàng"
          type="button"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
        <div className="cart-header">
          <h2>
            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            Giỏ hàng của tôi
          </h2>
        </div>
        <div className="cart-body" id="cartBody">
          {cart.length === 0 ? (
            <div className="cart-empty" id="cartEmpty">
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              <p>Giỏ hàng của bạn đang trống</p>
              <button className="cart-continue-shopping" onClick={handleClose}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-items" id="cartItems">
              {cart.map((item) => {
                const itemKey = getCartItemKey(item);
                const isSelected = selectedItems.has(itemKey);
                const priceInfo = formatPriceWithVND(item.price);
                const itemTotalYen = getYenAmount(item.price) * item.quantity;
                const itemTotalVND = convertYenToVND(itemTotalYen);

                return (
                  <div
                    key={itemKey}
                    className="cart-item"
                    data-product-id={item.id}
                    data-item-key={itemKey}
                  >
                    <label className="cart-item-checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="cart-item-checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(itemKey)}
                        aria-label="Chọn sản phẩm"
                      />
                      <span className="cart-item-checkbox-custom"></span>
                    </label>
                    <img
                      src={normalizePath(item.image)}
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = "/assets/logo/favicon.png";
                      }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-header-row">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-quantity-and-size">
                          <div className="cart-item-quantity">
                            <button
                              className="cart-quantity-btn"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1, item.size)
                              }
                              type="button"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="cart-quantity-value">{item.quantity}</span>
                            <button
                              className="cart-quantity-btn"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1, item.size)
                              }
                              type="button"
                            >
                              +
                            </button>
                          </div>
                          {needsSize(item.category) && (
                            <p className="cart-item-size">
                              {item.size ? (
                                <span
                                  className="size-value"
                                  onClick={() =>
                                    handleSizeChange(
                                      item.id,
                                      item.size,
                                      null,
                                      item.category
                                    )
                                  }
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {item.size}
                                </span>
                              ) : (
                                <span
                                  className="size-value"
                                  onClick={() => {
                                    // Show size selection modal
                                    const event = new CustomEvent("showSizeSelectionCart", {
                                      detail: { item },
                                    });
                                    window.dispatchEvent(event);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "#ff6600",
                                    fontWeight: "700",
                                  }}
                                >
                                  Chọn size
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="cart-item-details-row">
                        <div className="cart-item-price-wrapper">
                          <p className="cart-item-price">{formatPriceToYen(item.price)}</p>
                          <p className="cart-item-price-vnd">{priceInfo.vnd}</p>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => handleRemove(item.id, item.size)}
                          aria-label="Xóa sản phẩm"
                          type="button"
                        >
                          <i className="fas fa-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer" id="cartFooter">
            <div className="cart-shipping-row">
              <button
                className="cart-shipping-btn"
                type="button"
                aria-label="Xem cách thức đặt hàng và phí ship"
                onClick={(e) => {
                  e.preventDefault();
                  const event = new CustomEvent("showShippingInfo");
                  window.dispatchEvent(event);
                }}
              >
                <i className="fas fa-shipping-fast" aria-hidden="true"></i>
                Cách thức đặt hàng và Phí Ship
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
            <div className="cart-footer-content">
              <button
                className={`cart-select-all-btn ${allSelected ? "selected" : ""}`}
                onClick={toggleSelectAll}
                type="button"
                aria-label="Chọn tất cả sản phẩm"
              >
                <span
                  className="cart-select-all-checkbox-custom"
                  id="selectAllCheckbox"
                ></span>
                <span>Chọn tất cả</span>
              </button>
              <div className="cart-total-info">
                <div className="cart-total-label">Tổng:</div>
                <div className="cart-total-prices">
                  <span className="cart-total-price" id="cartTotalPrice">
                    {total.yenFormatted}
                  </span>
                  <span className="cart-total-vnd" id="cartTotalVND">
                    {total.vndFormatted}
                  </span>
                </div>
              </div>
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                type="button"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
