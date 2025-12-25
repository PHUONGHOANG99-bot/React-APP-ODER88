import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import BackButton from "./BackButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header() {
  const { searchQuery, setSearchQuery, currentCategory, reloadProducts } = useApp();
  const { cart, getCartBadgeCount, setIsOpen } = useCart();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [cartBadgeCount, setCartBadgeCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCartBadgeCount(getCartBadgeCount());
  }, [cart, getCartBadgeCount]);

  // Track scroll position to show/hide header content
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show compact header when scrolled down more than 100px
      setIsScrolled(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSearchQuery("");
  };

  const handleCartClick = () => {
    setIsOpen(true);
  };

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          <div className="header-categories">
            <BackButton />
            <button
              className="mobile-menu-btn"
              id="mobileMenuBtn"
              aria-label="Mở menu danh mục"
              aria-expanded="false"
              type="button"
              onClick={() => {
                const event = new CustomEvent("toggleMobileMenu");
                window.dispatchEvent(event);
              }}
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
              <span>Menu</span>
            </button>
          </div>

          <div className={`header-logo-center ${isScrolled ? "header-hidden" : ""}`}>
            <h1 
              className="header-brand-text" 
              onClick={() => {
                if (reloadProducts) {
                  reloadProducts();
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ODER88
            </h1>
          </div>

          <div className={`header-right ${isScrolled ? "header-hidden" : ""}`}>
            <div className="header-center">
              <div className="search-bar">
                <i className="fas fa-search search-icon" aria-hidden="true"></i>
                <input
                  type="search"
                  id="searchInput"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  aria-label="Tìm kiếm sản phẩm thời trang"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  enterKeyHint="search"
                  inputMode="search"
                  autoComplete="off"
                />
                {searchInputValue && (
                  <button
                    id="searchClearBtn"
                    className="search-clear-btn"
                    aria-label="Xóa tìm kiếm"
                    type="button"
                    onClick={handleClearSearch}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                )}
                <button
                  id="searchBtn"
                  className="search-btn"
                  aria-label="Tìm kiếm"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="fas fa-search" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="header-cart-btn"
                aria-label="Giỏ hàng"
                type="button"
                id="headerCartBtn"
                onClick={handleCartClick}
              >
                <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                {cartBadgeCount > 0 && (
                  <span
                    className="cart-badge"
                    id="cartBadgeDesktop"
                  >
                    {cartBadgeCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Facebook Button */}
      <a
        href="https://www.facebook.com/oder88shop/"
        target="_blank"
        rel="noopener noreferrer"
        className="header-fb-btn"
        aria-label="Xem Fanpage Facebook"
      >
        <i className="fab fa-facebook-f" aria-hidden="true"></i>
        <span>Facebook</span>
      </a>
    </header>
  );
}
