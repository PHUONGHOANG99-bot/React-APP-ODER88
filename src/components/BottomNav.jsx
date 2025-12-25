import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import { openMessengerApp } from "../utils/messenger.js";

export default function BottomNav() {
  const { isCartModalOpen, openCart, closeCart, cart } = useCart();
  const { shuffleProducts, reloadProducts } = useApp();
  const [activeItem, setActiveItem] = useState("home");
  
  // Calculate cart badge count
  const cartBadgeCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);


  useEffect(() => {
    const handleScroll = () => {
      if (isCartModalOpen) return;
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        setActiveItem("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCartModalOpen]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    // Reload sản phẩm
    if (reloadProducts) {
      reloadProducts();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveItem("home");
    if (isCartModalOpen) closeCart();
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    openMessengerApp();
    setActiveItem("contact");
    if (isCartModalOpen) closeCart();
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (isCartModalOpen) {
      closeCart();
    } else {
      openCart();
      setActiveItem("cart");
    }
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    // Toggle mobile menu - will be handled by mobile menu component
    const event = new CustomEvent("toggleMobileMenu");
    window.dispatchEvent(event);
    setActiveItem("category");
    if (isCartModalOpen) closeCart();
  };

  const handleRandomClick = (e) => {
    e.preventDefault();
    // Shuffle products randomly
    if (shuffleProducts) {
      shuffleProducts();
    }
    // Scroll to products section
    const productsSection = document.querySelector(".products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
    if (isCartModalOpen) closeCart();
  };

  return (
    <nav className="bottom-nav" id="bottomNav" role="navigation" aria-label="Điều hướng chính">
      <a
        href="#top"
        className={`bottom-nav-item ${activeItem === "home" ? "active" : ""}`}
        aria-label="Trang chủ"
        onClick={handleHomeClick}
      >
        <i className="fas fa-home" aria-hidden="true"></i>
        <span>Trang chủ</span>
      </a>
      <a
        href="javascript:void(0)"
        onClick={handleContactClick}
        className={`bottom-nav-item ${activeItem === "contact" ? "active" : ""}`}
        aria-label="Liên hệ"
      >
        <i className="fab fa-facebook-messenger" aria-hidden="true"></i>
        <span>Liên hệ</span>
      </a>
      <button
        className={`bottom-nav-item ${activeItem === "cart" ? "active" : ""}`}
        aria-label="Giỏ hàng"
        onClick={handleCartClick}
        type="button"
        id="cartBtn"
      >
        <i className="fas fa-shopping-cart" aria-hidden="true"></i>
        <span>Giỏ hàng</span>
        {cartBadgeCount > 0 && (
          <span className="cart-badge" id="cartBadge">
            {cartBadgeCount > 99 ? "99+" : cartBadgeCount}
          </span>
        )}
      </button>
      <button
        className="bottom-nav-trend-btn"
        aria-label="Ngẫu nhiên"
        onClick={handleRandomClick}
        type="button"
      >
        <span>Ngẫu nhiên</span>
      </button>
      <button
        className={`bottom-nav-item ${activeItem === "category" ? "active" : ""}`}
        aria-label="Danh mục"
        onClick={handleCategoryClick}
        type="button"
      >
        <div className="category-icon-wrapper">
          <i className="fas fa-bars" aria-hidden="true"></i>
          <i className="fas fa-search category-search-icon" aria-hidden="true"></i>
        </div>
        <span>Danh mục</span>
      </button>
    </nav>
  );
}
