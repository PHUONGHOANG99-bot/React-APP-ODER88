import { useState, useEffect } from "react";

export default function ShippingInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowShippingInfo = () => {
      setIsOpen(true);
    };

    window.addEventListener("showShippingInfo", handleShowShippingInfo);
    return () => window.removeEventListener("showShippingInfo", handleShowShippingInfo);
  }, []);

  useEffect(() => {
    const modal = document.getElementById("shippingInfoModal");
    if (!modal) return;

    if (isOpen) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("shipping-info-overlay")) {
      handleClose();
    }
  };

  return (
    <div
      className="shipping-info-modal"
      id="shippingInfoModal"
      onClick={handleOverlayClick}
    >
      <div className="shipping-info-overlay"></div>
      <div className="shipping-info-content">
        <div className="shipping-info-header">
          <h3>
            <i className="fas fa-shipping-fast" aria-hidden="true"></i>
            Cách thức đặt hàng và Phí Ship
          </h3>
          <button
            className="shipping-info-close"
            onClick={handleClose}
            aria-label="Đóng"
            type="button"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <div className="shipping-info-body" id="shippingInfoBody">
          <div className="shipping-section">
            <h4 className="shipping-section-title">
              <i className="fas fa-shopping-cart"></i>
              Cách thức đặt hàng
            </h4>
            <ul className="shipping-list">
              <li>
                <i className="fas fa-check-circle"></i>
                Thêm sản phẩm vào giỏ hàng → nhấn Đặt Hàng
              </li>
              <li>
                <i className="fas fa-bolt"></i>
                Mua 1 sản phẩm có thể nhấn Oder ngay để gửi đơn nhanh
              </li>
            </ul>
          </div>

          <div className="shipping-section">
            <h4 className="shipping-section-title">
              <i className="fas fa-truck"></i>
              Chi phí & vận chuyển
            </h4>
            <ul className="shipping-list">
              <li>
                <i className="fas fa-money-bill-wave"></i>
                Giá trên website là giá sản phẩm (chưa gồm phí ship)
              </li>
              <li>
                <i className="fas fa-box"></i>
                Phí ship tính theo cân nặng & kích thước
              </li>
              <li>
                <i className="fab fa-facebook-messenger"></i>
                Gửi đơn qua Messenger, shop sẽ báo phí ship chính xác
              </li>
              <li>
                <i className="fas fa-check"></i>
                Phí ship đã gồm phí nội địa, không phát sinh thêm
              </li>
              <li>
                <i className="fas fa-chart-line"></i>
                Oder càng nhiều, phí ship càng rẻ
              </li>
            </ul>
          </div>

          <div className="shipping-section">
            <h4 className="shipping-section-title">
              <i className="fas fa-info-circle"></i>
              Ví dụ phí ship
            </h4>
            <div className="shipping-examples">
              <div className="shipping-example-item">
                <span className="example-label">1 SP:</span>
                <span className="example-value">~40 tệ (≈ 840 yên)</span>
              </div>
              <div className="shipping-example-item">
                <span className="example-label">2 SP:</span>
                <span className="example-value">~60 tệ (≈ 1.260 yên)</span>
              </div>
              <div className="shipping-example-item">
                <span className="example-label">3 SP:</span>
                <span className="example-value">~70 tệ (≈ 1.470 yên)</span>
              </div>
            </div>
            <p className="shipping-note">
              <i className="fas fa-info-circle"></i>
              Phí thực tế tùy cân nặng sản phẩm
            </p>
          </div>

          <div className="shipping-section">
            <h4 className="shipping-section-title">
              <i className="fas fa-clock"></i>
              Thời gian giao hàng
            </h4>
            <div className="shipping-time">
              <i className="fas fa-shipping-fast"></i>
              <span>Giao tận tay tại Nhật 7–12 ngày (thường 7–10 ngày)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
