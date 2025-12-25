import { openMessengerApp } from "../utils/messenger.js";

export default function Footer() {
  const handleMessengerClick = (e) => {
    e.preventDefault();
    openMessengerApp();
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>
              <i className="fas fa-headset" aria-hidden="true"></i> HỖ TRỢ 24/7
            </h4>
            <p>Tư vấn thời trang & đặt hàng</p>
            <div className="social-links">
              <a
                href="javascript:void(0)"
                onClick={handleMessengerClick}
                className="social-btn messenger"
                aria-label="Liên hệ qua Messenger"
              >
                <i className="fab fa-facebook-messenger" aria-hidden="true"></i>
                Messenger
              </a>
              <a
                href="https://www.facebook.com/oder88shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook"
                aria-label="Xem Fanpage Facebook"
              >
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                Fanpage
              </a>
              <a
                href="#!"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn tiktok"
                aria-label="Xem TikTok"
              >
                <i className="fab fa-tiktok" aria-hidden="true"></i>
                TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            <i className="far fa-copyright"></i> 2025 ODER88 - Oder Thời Trang Cao Cấp
          </p>
        </div>
      </div>
    </footer>
  );
}

