import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { normalizePath } from "../utils/path.js";

export default function SizeSelectionModal() {
  const { addToCart, needsSize, getSizesForCategory } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const handleShowSizeSelection = (e) => {
      const { product: prod } = e.detail;
      if (!prod) return;

      const sizes = getSizesForCategory(prod.category);
      if (sizes.length === 0) {
        // No size needed, add directly
        addToCart(prod, null, null);
        return;
      }

      setProduct(prod);
      setSelectedSize(null);
      setIsOpen(true);
    };

    window.addEventListener("showSizeSelection", handleShowSizeSelection);
    
    // Also listen for cart size selection
    const handleShowSizeSelectionCart = (e) => {
      const { item } = e.detail;
      // This will be handled differently - for now just handle product selection
    };

    window.addEventListener("showSizeSelectionCart", handleShowSizeSelectionCart);
    
    return () => {
      window.removeEventListener("showSizeSelection", handleShowSizeSelection);
      window.removeEventListener("showSizeSelectionCart", handleShowSizeSelectionCart);
    };
  }, [addToCart, getSizesForCategory]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setProduct(null);
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!product || !selectedSize) return;

    addToCart(product, null, selectedSize);
    handleClose();
  };

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on overlay, not on content
    if (e.target === e.currentTarget || e.target.classList.contains("size-selection-overlay")) {
      handleClose();
    }
  };

  if (!isOpen || !product) return null;

  const sizes = getSizesForCategory(product.category);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="size-selection-modal show"
      onClick={handleOverlayClick}
    >
      <div className="size-selection-overlay"></div>
      <div 
        className="size-selection-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="size-selection-header">
          <h3>Chọn size</h3>
          <button
            className="size-selection-close"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            type="button"
            aria-label="Đóng"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="size-selection-product">
          <img
            src={normalizePath(product.image)}
            alt={product.name}
            onError={(e) => {
              e.target.src = normalizePath("/assets/logo/favicon.png");
            }}
          />
          <p>{product.name}</p>
        </div>
        <div className="size-selection-options">
          {sizes.map((size) => (
            <button
              key={size}
              className={`size-option ${selectedSize === size ? "selected" : ""}`}
              data-size={size}
              onClick={(e) => {
                e.stopPropagation();
                handleSizeSelect(size);
              }}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
        <button
          className="size-selection-confirm"
          onClick={(e) => {
            e.stopPropagation();
            handleConfirm(e);
          }}
          type="button"
          disabled={!selectedSize}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}

