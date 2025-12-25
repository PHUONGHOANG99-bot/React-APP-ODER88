import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { normalizePath } from "../utils/path.js";

const CATEGORIES = [
  {
    id: "all",
    name: "Tất cả",
    icon: "fa-border-all",
    image: "/assets/logo/tatca.jpg",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "set-do",
    name: "Sét Đồ",
    icon: "fa-tshirt",
    image: "/assets/logo/setdonu.JPG",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "ao-nu",
    name: "Áo nữ",
    icon: "fa-tshirt",
    image: "/assets/image/ao-nu/ao-dong-nu/adg1.jpg",
    color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
  },
  {
    id: "ao-nam",
    name: "Áo Nam",
    icon: "fa-tshirt",
    image: "/assets/image/ao-nam/ao-dong-nam/adt1.jpg",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "tui-xach",
    name: "Túi xách",
    icon: "fa-shopping-bag",
    image: "/assets/logo/logotuixachnu.JPG",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "giay",
    name: "Giày",
    icon: "fa-shoe-prints",
    image: "/assets/logo/logogiay.JPG",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "vay",
    name: "Váy",
    icon: "fa-heart",
    image: "/assets/image/vay/chan-vay/cv1.jpg",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "quan-nam",
    name: "Quần Nam",
    icon: "fa-user",
    image: "/assets/logo/quannam.JPG",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "quan-dai-nu",
    name: "Quần Nữ",
    icon: "fa-female",
    image: "/assets/image/quan-dai-nu/qd1.jpg",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "phu-kien",
    name: "Phụ Kiện",
    icon: "fa-gift",
    image: "/assets/image/phu-kien/mu/IMG_1236.JPG",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
];

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

export default function CategoriesSection() {
  const { currentCategory, setCurrentCategory } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState(currentCategory);
  const subcategories = SUBCATEGORIES_MAP[selectedCategoryId] || [];

  const handleCategoryClick = (categoryId, e) => {
    // Defensive: sometimes handlers can be triggered without an event object
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    
    // Check if category has subcategories
    const hasSubcategories = SUBCATEGORIES_MAP[categoryId] && 
                            Array.isArray(SUBCATEGORIES_MAP[categoryId]) && 
                            SUBCATEGORIES_MAP[categoryId].length > 0 && 
                            categoryId !== "all";
    
    if (hasSubcategories) {
      // Show subcategories panel but don't select category yet
      setSelectedCategoryId(categoryId);
      return;
    }
    
    // No subcategories or "all" - select category immediately
    setCurrentCategory(categoryId);
    setSelectedCategoryId("all"); // Hide subcategories panel
    
    // Scroll to products section
    setTimeout(() => {
      const productsTabs = document.querySelector(".products-tabs");
      if (productsTabs) {
        const targetPosition = productsTabs.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  const handleSubcategoryClick = (subcategoryId, subcategoryName) => {
    setCurrentCategory(subcategoryId);
    setSelectedCategoryId("all"); // Hide subcategories panel
    
    // Scroll to products section
    setTimeout(() => {
      const productsTabs = document.querySelector(".products-tabs");
      if (productsTabs) {
        const targetPosition = productsTabs.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }, 150);
  };

  const handleImageError = (e) => {
    const img = e?.target;
    if (!img) return;

    img.style.display = "none";

    const parent = img.parentElement;
    if (!parent) return;

    // Support both category and subcategory icon fallbacks
    const icon =
      parent.querySelector(".category-icon") ||
      parent.querySelector(".subcategory-icon");
    if (icon) icon.style.display = "flex";
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="categories-header">
          <h2>
            <i className="fas fa-th-large" aria-hidden="true"></i> DANH SÁCH SẢN PHẨM
          </h2>
        </div>
        <div className={`categories-wrapper ${subcategories.length > 0 ? "has-subcategories" : ""}`}>
          <div className="categories-grid" id="categoriesGrid">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className={`category-item ${currentCategory === category.id ? "active" : ""}`}
                data-category={category.id}
                role="button"
                tabIndex={0}
                onClick={(e) => handleCategoryClick(category.id, e)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryClick(category.id, e);
                  }
                }}
                aria-selected={currentCategory === category.id}
              >
                <div className="category-image-wrapper">
                  <div
                    className="category-image-bg"
                    style={{ background: category.color }}
                  ></div>
                  <img
                    src={normalizePath(category.image)}
                    alt={category.name}
                    className="category-image"
                    loading="lazy"
                    decoding="async"
                    width="200"
                    height="200"
                    onError={handleImageError}
                  />
                  <div className="category-icon" style={{ display: "none" }}>
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                </div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
          {subcategories.length > 0 && (
            <div className="subcategories-panel active" id="subcategoriesPanel">
              <div className="subcategories-grid">
                {subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className={`subcategory-item ${currentCategory === sub.id ? "active" : ""}`}
                    data-category={sub.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSubcategoryClick(sub.id, sub.name)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSubcategoryClick(sub.id, sub.name);
                      }
                    }}
                    aria-selected={currentCategory === sub.id}
                  >
                    <div className="subcategory-image-wrapper">
                      <div
                        className="subcategory-image-bg"
                        style={{ background: sub.color }}
                      ></div>
                      <img
                        src={normalizePath(sub.image)}
                        alt={sub.name}
                        className="subcategory-image"
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                      />
                      <div className="subcategory-icon" style={{ display: "none" }}>
                        <i className={`fas ${sub.icon}`}></i>
                      </div>
                    </div>
                    <div className="subcategory-name">{sub.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
