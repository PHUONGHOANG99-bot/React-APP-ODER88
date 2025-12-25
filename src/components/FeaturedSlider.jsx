import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getBestSellers } from "../utils/products.js";
import { formatPriceToYen, formatPriceWithVND } from "../utils/price.js";
import { getCategoryDisplayName } from "../utils/products.js";
import { normalizePath } from "../utils/path.js";
import { escapeMessageForHTML, createMessengerOrderLink, openMessengerApp } from "../utils/messenger.js";
import { useCart } from "../context/CartContext.jsx";

const ITEMS_PER_SLIDE = 3;

export default function FeaturedSlider() {
  const { products } = useApp();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderTrackRef = useRef(null);
  const bestSellers = getBestSellers(products);
  const totalSlides = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE);

  useEffect(() => {
    if (bestSellers.length === 0) return;
    updateSliderWidth();
    
    const handleResize = () => {
      updateSliderWidth();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bestSellers.length]);

  // Auto-play slider
  useEffect(() => {
    if (bestSellers.length === 0 || totalSlides <= 1) return;
    
    const autoPlayInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const maxSlide = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE) - 1;
        return prevSlide + 1 > maxSlide ? 0 : prevSlide + 1;
      });
    }, 3000); // Tự động chuyển slide sau 3 giây
    
    return () => clearInterval(autoPlayInterval);
  }, [bestSellers.length, totalSlides]);

  const updateSliderWidth = () => {
    if (!sliderTrackRef.current || !sliderTrackRef.current.children.length) return;
    
    const items = sliderTrackRef.current.children;
    const itemWidth = items[0].offsetWidth || 280;
    const gap = 20;
    const width = (itemWidth + gap) * items.length - gap;
    setSliderWidth(width);

    // Recalculate slide position after resize
    const maxSlide = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE) - 1;
    if (currentSlide > maxSlide) {
      goToSlide(Math.max(0, maxSlide));
    } else {
      goToSlide(currentSlide);
    }
  };

  const goToSlide = (slideIndex) => {
    const maxSlide = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE) - 1;
    const newSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    setCurrentSlide(newSlide);
  };

  const nextSlide = () => {
    const maxSlide = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE) - 1;
    goToSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    const maxSlide = Math.ceil(bestSellers.length / ITEMS_PER_SLIDE) - 1;
    goToSlide(currentSlide - 1 < 0 ? maxSlide : currentSlide - 1);
  };

  const handleImageError = (e) => {
    const img = e.target;
    img.classList.add("image-loading");
    const width = 400;
    const height = 400;
    img.src = `https://via.placeholder.com/${width}x${height}/FF6B6B/ffffff?text=Fashion+Item`;
    img.style.objectFit = "cover";
    img.alt = img.alt || "Sản phẩm thời trang";
    img.onload = () => {
      img.classList.remove("image-loading");
    };
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, e.target.closest(".add-to-cart-btn"));
  };

  const handleOrderNow = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = createMessengerOrderLink(
      product.name,
      formatPriceToYen(product.price),
      getCategoryDisplayName(product.category, product.categoryName)
    );
    openMessengerApp(message);
  };

  if (bestSellers.length === 0) return null;

  // Calculate translateX based on slide position
  const itemWidth = sliderTrackRef.current?.children[0]?.offsetWidth || 280;
  const gap = 20;
  const translateX = -currentSlide * (itemWidth + gap) * ITEMS_PER_SLIDE;

  return (
    <section className="featured-products-wrapper">
      <div className="featured-products-bg"></div>
      <div className="featured-products-pattern"></div>
      <div className="container">
        <div className="featured-slider">
          <div className="slider-header">
            <h2>
              <i className="fas fa-fire" aria-hidden="true"></i> THỜI TRANG ĐANG HOT
            </h2>
          </div>
          <div className="slider-container" role="region" aria-label="Slider sản phẩm đang hot">
            <button
              className="slider-btn prev-btn"
              aria-label="Slide trước"
              type="button"
              onClick={prevSlide}
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <div
              className="slider-track"
              ref={sliderTrackRef}
              role="list"
              aria-live="polite"
              style={{
                width: `${sliderWidth}px`,
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {bestSellers.map((product, index) => (
                <div
                  key={product.id}
                  className="slider-item"
                  data-id={product.id}
                  role="listitem"
                  aria-label={`Sản phẩm ${getCategoryDisplayName(
                    product.category,
                    product.categoryName
                  )}`}
                >
                  <div className="image-container">
                    <img
                      src={normalizePath(product.image)}
                      alt={`${getCategoryDisplayName(
                        product.category,
                        product.categoryName
                      )} - ${formatPriceToYen(product.price)}`}
                      className="slider-img"
                      data-product-id={product.id}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      fetchpriority={index < 3 ? "high" : "auto"}
                      width="400"
                      height="400"
                      onError={handleImageError}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className="slider-info">
                    <div className="slider-price-container">
                      <div className="slider-price">{formatPriceToYen(product.price)}</div>
                      <div className="slider-price-vnd">
                        {formatPriceWithVND(product.price).vnd}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="add-to-cart-btn"
                        aria-label="Thêm vào giỏ hàng"
                        type="button"
                      >
                        <span className="cart-icon-wrap" aria-hidden="true">
                          <i className="fas fa-shopping-cart"></i>
                          <span className="cart-plus-badge">+</span>
                        </span>
                      </button>
                      <a
                        href="javascript:void(0)"
                        onClick={(e) => handleOrderNow(product, e)}
                        className="order-btn"
                        aria-label={`Đặt hàng ${getCategoryDisplayName(
                          product.category,
                          product.categoryName
                        )}`}
                      >
                        ORDER NGAY
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="slider-btn next-btn"
              aria-label="Slide sau"
              type="button"
              onClick={nextSlide}
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
          {totalSlides > 1 && (
            <div className="slider-dots" id="sliderDots">
              {Array.from({ length: totalSlides }, (_, i) => (
                <div
                  key={i}
                  className={`dot ${i === currentSlide ? "active" : ""}`}
                  data-slide={i}
                  onClick={() => goToSlide(i)}
                  style={{
                    cursor: "pointer",
                    transform: i === currentSlide ? "scale(1.3)" : "scale(1)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
