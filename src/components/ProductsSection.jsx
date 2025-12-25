import { useMemo, useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { formatPriceToYen, formatPriceWithVND } from "../utils/price.js";
import { getCategoryDisplayName } from "../utils/products.js";
import { normalizePath } from "../utils/path.js";
import { escapeMessageForHTML, createMessengerOrderLink, openMessengerApp } from "../utils/messenger.js";
import ProductCard from "./ProductCard.jsx";

export default function ProductsSection() {
  const {
    filteredProducts,
    currentPage,
    setCurrentPage,
    productsPerPage,
    currentTab,
    handleTabChange: contextHandleTabChange,
    resetVisibleCountKey,
  } = useApp();

  // Infinite scroll: số lượng sản phẩm đang hiển thị
  const [visibleCount, setVisibleCount] = useState(productsPerPage);
  const loadingRef = useRef(false);

  // Reset visible count khi filtered products thay đổi (category, search, tab thay đổi) hoặc khi reload
  useEffect(() => {
    setVisibleCount(productsPerPage);
    setCurrentPage(1);
    loadingRef.current = false;
  }, [filteredProducts.length, currentTab, productsPerPage, resetVisibleCountKey]);

  // Lấy sản phẩm đang hiển thị
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleTabChange = (tab) => {
    // Use the handleTabChange from context which includes refresh logic
    if (contextHandleTabChange) {
      contextHandleTabChange(tab);
    } else {
      // Fallback if handleTabChange is not available
      setCurrentPage(1);
    }
  };

  // Infinite scroll: Load thêm sản phẩm khi scroll gần cuối
  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra nếu đã load hết sản phẩm
      if (visibleCount >= filteredProducts.length) {
        return;
      }

      // Kiểm tra nếu đang load
      if (loadingRef.current) {
        return;
      }

      // Tính toán khoảng cách từ cuối trang
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load thêm khi còn cách cuối 300px
      if (scrollTop + windowHeight >= documentHeight - 300) {
        loadingRef.current = true;
        
        // Load thêm productsPerPage sản phẩm
        setTimeout(() => {
          setVisibleCount((prev) => {
            const newCount = prev + productsPerPage;
            // Đảm bảo không vượt quá tổng số sản phẩm
            return Math.min(newCount, filteredProducts.length);
          });
          loadingRef.current = false;
        }, 200); // Delay nhỏ để tránh load quá nhiều lần
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredProducts.length, productsPerPage, setCurrentPage]);

  return (
    <div className="container main-container">
      <main className="products-section">
        <div
          className="products-tabs"
          id="productsTabs"
          role="tablist"
          aria-label="Lọc sản phẩm"
        >
          <button
            className={`tab-btn ${currentTab === "all" ? "active" : ""}`}
            data-tab="all"
            role="tab"
            aria-selected={currentTab === "all"}
            onClick={() => handleTabChange("all")}
          >
            <i className="fas fa-th-large" aria-hidden="true"></i>
            <span>Tất cả</span>
          </button>
          <button
            className={`tab-btn ${currentTab === "hot" ? "active" : ""}`}
            data-tab="hot"
            role="tab"
            aria-selected={currentTab === "hot"}
            onClick={() => handleTabChange("hot")}
          >
            <i className="fas fa-fire" aria-hidden="true"></i>
            <span>Bán chạy</span>
          </button>
          <button
            className={`tab-btn ${currentTab === "trending" ? "active" : ""}`}
            data-tab="trending"
            role="tab"
            aria-selected={currentTab === "trending"}
            onClick={() => handleTabChange("trending")}
          >
            <i className="fas fa-chart-line" aria-hidden="true"></i>
            <span>Xu hướng</span>
          </button>
          <button
            className={`tab-btn ${currentTab === "recommended" ? "active" : ""}`}
            data-tab="recommended"
            role="tab"
            aria-selected={currentTab === "recommended"}
            onClick={() => handleTabChange("recommended")}
          >
            <i className="fas fa-sparkles" aria-hidden="true"></i>
            <span>Gợi ý</span>
          </button>
        </div>

        <div
          className="products-grid"
          id="productsGrid"
          role="list"
          aria-label={`Danh sách ${filteredProducts.length} sản phẩm`}
        >
          {visibleProducts.length === 0 ? (
            <div
              className="no-results"
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "40px 20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              role="status"
              aria-live="polite"
            >
              <i
                className="fas fa-search"
                style={{
                  fontSize: "3rem",
                  color: "#FF6B6B",
                  marginBottom: "15px",
                }}
                aria-hidden="true"
              ></i>
              <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.2rem" }}>
                Không tìm thấy sản phẩm
              </h3>
              <p style={{ color: "#666" }}>
                Vui lòng thử từ khóa khác hoặc chọn danh mục khác
              </p>
            </div>
          ) : (
            <>
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
              
              {/* Loading indicator khi đang load thêm */}
              {visibleCount < filteredProducts.length && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "40px 20px",
                  }}
                >
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{
                      fontSize: "2rem",
                      color: "#FF6600",
                    }}
                    aria-hidden="true"
                  ></i>
                </div>
              )}
              
              {/* Hiển thị khi đã load hết */}
              {visibleCount >= filteredProducts.length && filteredProducts.length > productsPerPage && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#666",
                  }}
                >
                  <p>Đã hiển thị tất cả {filteredProducts.length} sản phẩm</p>
                </div>
              )}
            </>
          )}
        </div>

      </main>
    </div>
  );
}
