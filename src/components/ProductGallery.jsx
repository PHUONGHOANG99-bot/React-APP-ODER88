import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPriceToYen, formatPriceWithVND } from "../utils/price.js";
import { getCategoryDisplayName } from "../utils/products.js";
import { normalizePath } from "../utils/path.js";
import { escapeMessageForHTML, createMessengerOrderLink, openMessengerApp } from "../utils/messenger.js";
import { getProductImages, isYouTubeUrl, convertToYouTubeEmbed } from "../utils/gallery.js";

export default function ProductGallery() {
  const { originalProducts } = useApp();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [isYouTube, setIsYouTube] = useState(false);

  const mainImageRef = useRef(null);
  const mainVideoRef = useRef(null);
  const mainVideoIframeRef = useRef(null);
  const wrapperRef = useRef(null);
  const pendingOpenRef = useRef(null);

  const openGallery = useCallback((productId, imageIndex = 0) => {
    const productsToSearch = originalProducts && originalProducts.length > 0 ? originalProducts : [];
    
    if (productsToSearch.length === 0) {
      // Queue open request until products load
      pendingOpenRef.current = { productId, imageIndex };
      return;
    }
    
    // Match both number/string ids reliably
    const product = productsToSearch.find((p) => String(p.id) === String(productId));
    if (!product) {
      return;
    }

    const images = getProductImages(product);
    if (images.length === 0) {
      return;
    }

    // Set all states together to ensure consistency
    setCurrentProduct(product);
    setGalleryImages(images);
    const validImageIndex = Math.max(0, Math.min(imageIndex, images.length - 1));
    setCurrentIndex(validImageIndex);
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    setIsOpen(true);

    // Check if product has video
    if (product.video) {
      const videoUrl = normalizePath(product.video);
      const youtube = isYouTubeUrl(videoUrl);
      setIsYouTube(youtube);
      setVideoSrc(videoUrl);
      // Show video if on first image
      if (imageIndex === 0) {
        setShowVideo(true);
      }
    } else {
      setShowVideo(false);
    }

    document.body.style.overflow = "hidden";
  }, [originalProducts]);

  // Old-code style: click handler on document for product images
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const img = e.target?.closest?.("img[data-product-id]");
      if (!img) return;

      if (
        !img.classList.contains("product-image") &&
        !img.classList.contains("slider-img")
      ) {
        return;
      }

      const pid = img.getAttribute("data-product-id");
      if (!pid) return;
      openGallery(pid, 0);
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [openGallery]);

  // If user clicked before products loaded, open after load completes
  useEffect(() => {
    if (!originalProducts || originalProducts.length === 0) return;
    if (!pendingOpenRef.current) return;

    const { productId, imageIndex } = pendingOpenRef.current;
    pendingOpenRef.current = null;
    openGallery(productId, imageIndex ?? 0);
  }, [originalProducts, openGallery]);

  const closeGallery = useCallback(() => {
    setIsOpen(false);
    setCurrentProduct(null);
    setGalleryImages([]);
    setCurrentIndex(0);
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    setShowVideo(false);
    document.body.style.overflow = "";

    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
      mainVideoRef.current.currentTime = 0;
    }
    if (mainVideoIframeRef.current) {
      const currentSrc = mainVideoIframeRef.current.src;
      if (currentSrc) {
        mainVideoIframeRef.current.src = currentSrc
          .replace(/[?&]autoplay=1/g, "")
          .replace("autoplay=1", "");
      }
    }
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < galleryImages.length - 1) {
        const newIndex = prevIndex + 1;
        setZoomLevel(1);
        setPanX(0);
        setPanY(0);
        setShowVideo(false);
        return newIndex;
      }
      return prevIndex;
    });
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        setZoomLevel(1);
        setPanX(0);
        setPanY(0);
        // Show video if going back to first image and product has video
        if (newIndex === 0 && currentProduct?.video) {
          setShowVideo(true);
        } else {
          setShowVideo(false);
        }
        return newIndex;
      }
      return prevIndex;
    });
  }, [currentProduct]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < galleryImages.length) {
      setCurrentIndex(index);
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
      // Show video only on first image
      if (index === 0 && currentProduct?.video) {
        setShowVideo(true);
      } else {
        setShowVideo(false);
      }
    }
  }, [galleryImages.length, currentProduct]);

  const handleZoom = useCallback((direction) => {
    if (direction === "in") {
      setZoomLevel((prev) => Math.min(prev + 0.25, 5));
    } else if (direction === "out") {
      setZoomLevel((prev) => {
        const newZoom = Math.max(prev - 0.25, 1);
        if (newZoom <= 1) {
          setPanX(0);
          setPanY(0);
        }
        return newZoom;
      });
    } else if (direction === "reset") {
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
    }
  }, []);

  const handlePlayVideo = () => {
    if (isYouTube && mainVideoIframeRef.current) {
      const embedUrl = convertToYouTubeEmbed(videoSrc, true, false);
      mainVideoIframeRef.current.src = embedUrl;
    } else if (mainVideoRef.current) {
      mainVideoRef.current.muted = false;
      mainVideoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (currentProduct) {
      addToCart(currentProduct, e.target.closest(".add-to-cart-btn"));
    }
  };

  const handleOrderNow = (e) => {
    e.preventDefault();
    if (currentProduct) {
      const message = createMessengerOrderLink(
        currentProduct.name,
        formatPriceToYen(currentProduct.price),
        getCategoryDisplayName(currentProduct.category, currentProduct.categoryName)
      );
      openMessengerApp(message);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeGallery();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "+" || e.key === "=") {
        handleZoom("in");
      } else if (e.key === "-") {
        handleZoom("out");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeGallery, prevImage, nextImage, handleZoom]);

  // Fix index if it's out of bounds - must be before using currentIndex
  useEffect(() => {
    if (galleryImages.length > 0 && currentIndex >= galleryImages.length) {
      setCurrentIndex(0);
    } else if (galleryImages.length > 0 && currentIndex < 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, galleryImages.length]);

  // Ensure currentIndex is valid for rendering
  const validIndex = galleryImages.length > 0 
    ? Math.max(0, Math.min(currentIndex, galleryImages.length - 1))
    : 0;
  const currentImage = galleryImages[validIndex];
  
  // Safe price formatting - only if we have product
  let priceData = { yen: "¥0", vnd: "VND 0" };
  if (currentProduct) {
    try {
      priceData = formatPriceWithVND(currentProduct.price || "0");
      if (!priceData || !priceData.yen || !priceData.vnd) {
        priceData = { yen: "¥0", vnd: "VND 0" };
      }
    } catch (error) {
      console.error("Error formatting price:", error, currentProduct);
      priceData = { yen: "¥0", vnd: "VND 0" };
    }
  }

  // Update image transform
  useEffect(() => {
    if (!isOpen || !mainImageRef.current) return;
    
    if (zoomLevel <= 1) {
      mainImageRef.current.style.transform = "scale(1)";
      mainImageRef.current.classList.remove("zoomed");
    } else {
      mainImageRef.current.style.transform = `scale(${zoomLevel}) translate(${
        panX / zoomLevel
      }px, ${panY / zoomLevel}px)`;
      mainImageRef.current.classList.add("zoomed");
    }
    mainImageRef.current.style.transition = "transform 0.3s ease";
  }, [zoomLevel, panX, panY, isOpen]);

  // Always render modal, but only show when we have data
  const shouldShow = isOpen && currentProduct && galleryImages.length > 0 && currentImage;
  
  // Don't render content if we don't have data
  if (!shouldShow) {
    return (
      <div
        className="product-gallery-modal"
        id="productGalleryModal"
      ></div>
    );
  }
  
  return (
    <div
      className="product-gallery-modal show"
      id="productGalleryModal"
    >
      <div
        className="gallery-modal-overlay"
        onClick={closeGallery}
      ></div>
      <div className="gallery-modal-content">
        <button
          className="gallery-close-btn"
          onClick={closeGallery}
          aria-label="Đóng gallery"
          type="button"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
        <div className="gallery-main">
          <button
            className="gallery-nav-btn gallery-prev"
            onClick={prevImage}
            aria-label="Ảnh trước"
            type="button"
            disabled={validIndex === 0}
          >
            <i className="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          <div className="gallery-main-image-wrapper" ref={wrapperRef}>
            {!showVideo && currentImage ? (
              <img
                ref={mainImageRef}
                id="galleryMainImage"
                className="gallery-main-image"
                src={normalizePath(currentImage)}
                alt="Ảnh sản phẩm"
                onError={handleImageError}
                style={{ display: "block" }}
              />
            ) : showVideo ? (
              <div
                className="gallery-video-container"
                id="galleryVideoContainer"
                style={{ display: "flex" }}
              >
                {isYouTube ? (
                  <iframe
                    ref={mainVideoIframeRef}
                    id="galleryMainVideoIframe"
                    className="gallery-main-video-iframe"
                    src={convertToYouTubeEmbed(videoSrc, false, false)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: "block" }}
                  ></iframe>
                ) : (
                  <>
                    <video
                      ref={mainVideoRef}
                      id="galleryMainVideo"
                      className="gallery-main-video"
                      src={normalizePath(videoSrc)}
                      poster={normalizePath(galleryImages[0])}
                      playsInline
                      preload="metadata"
                      controls
                    >
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </>
                )}
              </div>
            ) : null}
            {currentProduct.video && validIndex === 0 && (
              <button
                className="gallery-video-toggle"
                id="galleryVideoToggle"
                onClick={() => setShowVideo(!showVideo)}
                aria-label={showVideo ? "Xem ảnh" : "Xem video"}
                type="button"
                style={{ display: "block" }}
              >
                <i className={`fas ${showVideo ? "fa-image" : "fa-video"}`} aria-hidden="true"></i>
                <span>{showVideo ? "Xem ảnh" : "Xem video"}</span>
              </button>
            )}
            <div className="gallery-zoom-controls">
              <button
                className="gallery-zoom-btn"
                onClick={() => handleZoom("in")}
                aria-label="Phóng to"
                type="button"
              >
                <i className="fas fa-search-plus" aria-hidden="true"></i>
              </button>
              <button
                className="gallery-zoom-btn"
                onClick={() => handleZoom("out")}
                aria-label="Thu nhỏ"
                type="button"
              >
                <i className="fas fa-search-minus" aria-hidden="true"></i>
              </button>
              <button
                className="gallery-zoom-btn"
                onClick={() => handleZoom("reset")}
                aria-label="Đặt lại"
                type="button"
              >
                <i className="fas fa-expand-arrows-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <button
            className="gallery-nav-btn gallery-next"
            onClick={nextImage}
            aria-label="Ảnh sau"
            type="button"
            disabled={validIndex === galleryImages.length - 1}
          >
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
        {galleryImages.length > 1 && (
          <div className="gallery-thumbnails" id="galleryThumbnails">
            {galleryImages.map((image, index) => (
              <img
                key={index}
                className={`gallery-thumbnail ${index === validIndex ? "active" : ""}`}
                src={normalizePath(image)}
                alt={`Ảnh ${index + 1}`}
                onClick={() => goToImage(index)}
                loading="lazy"
              />
            ))}
          </div>
        )}
        <div className="gallery-info">
          <div className="gallery-info-header">
            <div className="gallery-product-details">
              <h3 id="galleryProductName">{currentProduct?.name || "Sản phẩm"}</h3>
              <div className="gallery-price-wrapper">
                <p id="galleryProductPrice" className="gallery-price">
                  <span className="gallery-price-yen">{priceData.yen}</span>
                  <span className="gallery-price-vnd">{priceData.vnd}</span>
                </p>
                <div className="gallery-shipping">
                  <i className="fas fa-shipping-fast" aria-hidden="true"></i>
                  <span className="flag-japan">🇯🇵</span>
                  <span>7-10 ngày</span>
                </div>
              </div>
            </div>
            <p className="gallery-image-counter">
              <span id="galleryCurrentIndex">{validIndex + 1}</span> /
              <span id="galleryTotalImages">{galleryImages.length}</span>
            </p>
          </div>
          <div className="product-actions gallery-product-actions">
            <button
              id="galleryAddToCartBtn"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              aria-label="Thêm vào giỏ hàng"
              type="button"
            >
              <span className="cart-icon-wrap" aria-hidden="true">
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-plus-badge">+</span>
              </span>
            </button>
            <a
              id="galleryOrderBtn"
              href="javascript:void(0)"
              onClick={handleOrderNow}
              className="order-btn"
              aria-label="Đặt hàng sản phẩm"
            >
              <span>ĐẶT HÀNG NGAY</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
