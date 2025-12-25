import { formatPriceToYen, formatPriceWithVND } from "../utils/price.js";
import { getCategoryDisplayName } from "../utils/products.js";
import { normalizePath } from "../utils/path.js";
import { escapeMessageForHTML, createMessengerOrderLink, openMessengerApp } from "../utils/messenger.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product, index }) {
  const { addToCart } = useCart();

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, e.target.closest(".add-to-cart-btn"));
  };

  const handleOrderNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = createMessengerOrderLink(
      product.name,
      formatPriceToYen(product.price),
      getCategoryDisplayName(product.category, product.categoryName)
    );
    openMessengerApp(message);
  };

  return (
    <div
      className="product-card"
      role="listitem"
      aria-label={`Sản phẩm ${product.categoryName}`}
      data-index={index}
    >
      <div className="image-container">
        <img
          src={normalizePath(product.image)}
          alt={`${getCategoryDisplayName(
            product.category,
            product.categoryName
          )} - ${formatPriceToYen(product.price)}`}
          className="product-image"
          data-product-id={product.id}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={index < 4 ? "high" : "auto"}
          width="400"
          height="400"
          onError={handleImageError}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="product-info">
        <div className="product-price-wrapper">
          <div className="product-price-container">
            <div className="product-price">{formatPriceToYen(product.price)}</div>
            <div className="product-price-vnd">
              {formatPriceWithVND(product.price).vnd}
            </div>
          </div>
          <div className="product-meta-info">
            {product.purchases && (
              <div className="product-purchases">
                <i className="fas fa-users" aria-hidden="true"></i>
                <span>{product.purchases}+ đã mua</span>
              </div>
            )}
            <div className="product-delivery">
              <i className="fas fa-shipping-fast" aria-hidden="true"></i>
              <span>7-10 ngày</span>
            </div>
          </div>
        </div>
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
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
            onClick={handleOrderNow}
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
  );
}

