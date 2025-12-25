import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { normalizePath } from "../utils/path.js";

const MOBILE_CATEGORIES = [
  { id: "all", name: "Tất cả", icon: "fa-border-all" },
  { id: "set-do", name: "Sét Đồ", icon: "fa-tshirt" },
  { id: "ao-nu", name: "Áo nữ", icon: "fa-tshirt" },
  { id: "ao-nam", name: "Áo Nam", icon: "fa-tshirt" },
  { id: "tui-xach", name: "Túi xách", icon: "fa-shopping-bag" },
  { id: "giay", name: "Giày", icon: "fa-shoe-prints" },
  { id: "vay", name: "Váy", icon: "fa-heart" },
  { id: "quan-dai-nu", name: "Quần dài nữ", icon: "fa-female" },
  { id: "quan-nam", name: "Quần Nam", icon: "fa-user" },
  { id: "phu-kien", name: "Phụ Kiện", icon: "fa-gift" },
];

// Same subcategories map as CategoriesSection
const SUBCATEGORIES_MAP = {
  "set-do": [
    { id: "set-do-nu", name: "Sét Đồ Nữ", icon: "fa-tshirt", image: "/assets/logo/setdonu.JPG", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: "set-do-nam", name: "Sét Đồ Nam", icon: "fa-tshirt", image: "/assets/image/set-do-nu/sd1.jpg", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  ],
  "tui-xach": [
    { id: "tui-xach-nam", name: "Túi xách nam", icon: "fa-briefcase", image: "/assets/logo/logotuixachnam.JPG", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: "tui-xach-nu", name: "Túi xách nữ", icon: "fa-handbag", image: "/assets/logo/logotuixachnu.JPG", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  ],
  "ao-nu": [
    { id: "ao-dong-nu", name: "Áo Khoác đông nữ", icon: "fa-tshirt", image: "/assets/image/ao-nu/ao-dong-nu/adg1.jpg", color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)" },
    { id: "ao-thu-dong", name: "Thu Đông Nữ", icon: "fa-tshirt", image: "/assets/image/ao-nu/thu-dong-nu/TDG1.jpg", color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)" },
  ],
  "ao-nam": [
    { id: "ao-dong-nam", name: "Áo đông nam", icon: "fa-tshirt", image: "/assets/image/ao-nam/ao-dong-nam/adt1.jpg", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  ],
  giay: [
    { id: "boot-nu", name: "Boot nữ", icon: "fa-shoe-prints", image: "/assets/image/giay-nu/boot-nu/bn1.jpg", color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { id: "giay-the-thao", name: "Sneaker Nữ", icon: "fa-running", image: "/assets/image/giay-nu/giay-the-thao/gsg1.jpg", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "giay-sneaker-nam", name: "Sneaker Nam", icon: "fa-running", image: "/assets/image/giay-nam/giay-sneaker-nam/GST1.jpg", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  ],
  vay: [
    { id: "chan-vay", name: "Chân váy", icon: "fa-tshirt", image: "/assets/image/vay/chan-vay/cv1.jpg", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  ],
  "quan-nam": [
    { id: "quan-jean-nam", name: "Jean Nam", icon: "fa-user", image: "/assets/logo/quannam.JPG", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  ],
  "phu-kien": [
    { id: "non-nam", name: "Nón nam", icon: "fa-hat-cowboy", image: "/assets/image/phu-kien/mu/IMG_1236.JPG", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "non-nu", name: "Nón nữ", icon: "fa-hat-cowboy", image: "/assets/image/phu-kien/non-nu/NG1.jpg", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: "khan", name: "Khăn", icon: "fa-scarf", image: "/assets/logo/tatca.jpg", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "no-buoc-toc", name: "Nơ Buộc tóc", icon: "fa-ribbon", image: "/assets/image/phu-kien/no-toc/IMG_1182.JPG", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "tat", name: "Tất", icon: "fa-socks", image: "/assets/logo/tatca.jpg", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  ],
};

export default function MobileCategoriesMenu() {
  const { currentCategory, setCurrentCategory } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  useEffect(() => {
    const handleToggleMobileMenu = () => {
      setIsOpen((prev) => {
        const newValue = !prev;
        if (newValue) {
          // Set "all" as active when opening
          setSelectedCategoryId("all");
        }
        return newValue;
      });
    };

    window.addEventListener("toggleMobileMenu", handleToggleMobileMenu);
    return () => window.removeEventListener("toggleMobileMenu", handleToggleMobileMenu);
  }, []);

  useEffect(() => {
    const menuBtn = document.getElementById("mobileMenuBtn");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Reset to "all" when closing so it shows all subcategories when reopened
    setSelectedCategoryId("all");
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      // Show all subcategories
      setSelectedCategoryId("all");
      return;
    }

    // Check if category has subcategories
    if (SUBCATEGORIES_MAP[categoryId] && SUBCATEGORIES_MAP[categoryId].length > 0) {
      // Show subcategories panel
      setSelectedCategoryId(categoryId);
      return;
    }

    // No subcategories - close menu and select category directly
    setCurrentCategory(categoryId);
    handleClose();
    
    // Scroll to products
    setTimeout(() => {
      const productsTabs = document.querySelector(".products-tabs");
      if (productsTabs) {
        productsTabs.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const handleSubcategoryClick = (subcategoryId, subcategoryName) => {
    setCurrentCategory(subcategoryId);
    handleClose();
    
    // Scroll to products
    setTimeout(() => {
      const productsTabs = document.querySelector(".products-tabs");
      if (productsTabs) {
        productsTabs.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const subcategories = selectedCategoryId === "all"
    ? Object.values(SUBCATEGORIES_MAP).flat()
    : SUBCATEGORIES_MAP[selectedCategoryId] || [];

  const handleImageError = (e) => {
    e.target.style.display = "none";
    const icon = e.target.parentElement.querySelector(".mobile-category-icon-fallback");
    if (icon) icon.style.display = "flex";
  };

  return (
    <>
      {/* Overlay - created dynamically in old code, but we'll render it */}
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        id="mobileOverlay"
        onClick={handleClose}
      ></div>
      
      <div
        className={`mobile-categories ${isOpen ? "show" : ""}`}
        id="mobileCategories"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-categories-title"
        aria-hidden={!isOpen}
      >
        <div className="mobile-categories-header">
          <h3 id="mobile-categories-title">
            <i className="fas fa-list" aria-hidden="true"></i> DANH MỤC THỜI TRANG
          </h3>
          <button
            className="close-mobile-menu"
            onClick={handleClose}
            aria-label="Đóng menu danh mục"
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="mobile-categories-wrapper">
          <div className="mobile-categories-list">
            {MOBILE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`mobile-category-btn ${selectedCategoryId === category.id ? "active" : ""}`}
                data-category={category.id}
                onClick={() => handleCategoryClick(category.id)}
                type="button"
                aria-selected={selectedCategoryId === category.id}
              >
                <i className={`fas ${category.icon}`}></i> {category.name}
              </button>
            ))}
          </div>
          <div
            className={`mobile-subcategories-panel ${subcategories.length > 0 ? "active" : ""}`}
            id="mobileSubcategoriesPanel"
          >
            {subcategories.length > 0 && (
              <div className="mobile-subcategories-grid">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    className={`mobile-subcategory-item ${currentCategory === sub.id ? "active" : ""}`}
                    data-category={sub.id}
                    onClick={() => handleSubcategoryClick(sub.id, sub.name)}
                    type="button"
                    aria-selected={currentCategory === sub.id}
                  >
                    <div className="subcategory-image-wrapper">
                      <img
                        src={normalizePath(sub.image)}
                        alt={sub.name}
                        className="subcategory-image"
                        loading="lazy"
                        onError={handleImageError}
                      />
                      <div
                        className="mobile-category-icon-fallback"
                        style={{ background: sub.color, display: "none" }}
                      >
                        <i className={`fas ${sub.icon}`}></i>
                      </div>
                    </div>
                    <div className="subcategory-name">{sub.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

