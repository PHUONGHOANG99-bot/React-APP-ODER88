import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loadCart,
  saveCart,
  normalizeCartItem,
  getCartItemKey,
  needsSize,
  getSizesForCategory,
  normalizeId,
} from "../utils/cart.js";
import { getYenAmount, convertYenToVND, formatVND } from "../utils/price.js";
import { showToast } from "../utils/toast.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Initialize cart from localStorage immediately
  const [cart, setCart] = useState(() => {
    try {
      return loadCart();
    } catch (error) {
      console.error("Error loading cart on init:", error);
      return [];
    }
  });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length >= 0) { // Save even if cart is empty
      saveCart(cart);
    }
  }, [cart]);

  // Add to cart
  const addToCart = useCallback((product, triggerButton = null, selectedSize = null) => {
    const pid = normalizeId(product.id);

    // Check if needs size
    if (needsSize(product.category) && !selectedSize) {
      // Show size selection modal - will be handled by a separate component
      const event = new CustomEvent("showSizeSelection", {
        detail: { product },
      });
      window.dispatchEvent(event);
      return;
    }

    setCart((prevCart) => {
      // Check if item already exists (same id + same size if has size)
      const existingItem = prevCart.find((item) => {
        if (normalizeId(item.id) !== pid) return false;
        if (needsSize(product.category)) {
          return item.size === selectedSize;
        }
        return true; // Same product, no size needed
      });

      if (existingItem) {
        // Update quantity
        return prevCart.map((item) =>
          getCartItemKey(item) === getCartItemKey(existingItem)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        const newItem = normalizeCartItem({
          id: pid,
          productId: pid,
          name:
            product.name ||
            (product.categoryName || product.category),
          price: product.price,
          image: product.image,
          category: product.category,
          categoryName: product.categoryName,
          size: needsSize(product.category) ? selectedSize : null,
          quantity: 1,
        });
        return [...prevCart, newItem];
      }
    });

    // Animation (if triggerButton provided)
    if (triggerButton) {
      animateProductToCart(triggerButton);
    }
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((productId, size = null) => {
    const pid = normalizeId(productId);
    setCart((prevCart) => {
      const filtered = prevCart.filter((item) => {
        if (normalizeId(item.id) !== pid) return true;
        if (needsSize(item.category)) {
          return item.size !== size;
        }
        return false; // Remove if same id and no size
      });
      
      // Also remove from selected items
      const removedItem = prevCart.find((item) => {
        if (normalizeId(item.id) !== pid) return false;
        if (needsSize(item.category)) {
          return item.size === size;
        }
        return true;
      });
      
      if (removedItem) {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(getCartItemKey(removedItem));
          return newSet;
        });
      }
      
      // Show toast
      showToast("Đã xóa khỏi giỏ hàng", "info");
      
      return filtered;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, newQuantity, size = null) => {
    if (newQuantity < 1) newQuantity = 1; // Minimum 1, don't remove
    
    const pid = normalizeId(productId);
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (normalizeId(item.id) !== pid) return item;
        if (needsSize(item.category)) {
          if (item.size !== size) return item;
        }
        return { ...item, quantity: newQuantity };
      });
    });
  }, []);

  // Change size
  const changeSize = useCallback((productId, oldSize, newSize, category) => {
    if (oldSize === newSize) return;

    setCart((prevCart) => {
      const oldItemKey = getCartItemKey({ productId, size: oldSize });
      const oldItem = prevCart.find((item) => getCartItemKey(item) === oldItemKey);
      
      if (!oldItem) return prevCart;

      const newItem = { ...oldItem, size: newSize };
      const newItemKey = getCartItemKey(newItem);

      // Check if new size already exists
      const existingIndex = prevCart.findIndex(
        (item) => getCartItemKey(item) === newItemKey
      );

      if (existingIndex >= 0) {
        // Merge quantities
        const updated = prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + oldItem.quantity }
            : item
        );
        return updated.filter((item) => getCartItemKey(item) !== oldItemKey);
      } else {
        // Replace old item with new size
        return prevCart.map((item) =>
          getCartItemKey(item) === oldItemKey ? newItem : item
        );
      }
    });

    // Update selected items
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const oldItemKey = getCartItemKey({ productId, size: oldSize });
      const newItemKey = getCartItemKey({ productId, size: newSize });
      newSet.delete(oldItemKey);
      newSet.add(newItemKey);
      return newSet;
    });
  }, []);

  // Toggle select item
  const toggleSelectItem = useCallback((itemKey) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  }, []);

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    setSelectedItems((prev) => {
      if (prev.size === cart.length) {
        return new Set();
      } else {
        return new Set(cart.map((item) => getCartItemKey(item)));
      }
    });
  }, [cart]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    const selectedCartItems = cart.filter((item) =>
      selectedItems.has(getCartItemKey(item))
    );

    const totalYen = selectedCartItems.reduce((sum, item) => {
      return sum + getYenAmount(item.price) * item.quantity;
    }, 0);

    const totalVND = convertYenToVND(totalYen);

    return {
      yen: totalYen,
      vnd: totalVND,
      yenFormatted: `¥${formatVND(totalYen)}`,
      vndFormatted: `VND ${formatVND(totalVND)}`,
    };
  }, [cart, selectedItems]);

  // Get cart badge count
  const getCartBadgeCount = useCallback(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    return total > 99 ? 99 : total; // Max 99+
  }, [cart]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    cart,
    selectedItems,
    isCartModalOpen: isOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    changeSize,
    toggleSelectItem,
    toggleSelectAll,
    getCartTotal,
    getCartBadgeCount,
    needsSize,
    getSizesForCategory,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// Animation function - product flying to cart
function animateProductToCart(triggerButton) {
  if (!triggerButton) return;

  const cartBtn =
    document.getElementById("cartBtn") ||
    document.getElementById("headerCartBtn");
  if (!cartBtn) return;

  const buttonRect = triggerButton.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  const flyingElement = document.createElement("div");
  flyingElement.className = "product-flying-to-cart";
  flyingElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';

  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top + buttonRect.height / 2;
  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;

  flyingElement.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #ff9933, #ffaa66);
    color: #ff6600;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    pointer-events: none;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.4);
    transform: translate(-50%, -50%);
  `;

  document.body.appendChild(flyingElement);

  requestAnimationFrame(() => {
    flyingElement.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    flyingElement.style.left = `${endX}px`;
    flyingElement.style.top = `${endY}px`;
    flyingElement.style.transform = "translate(-50%, -50%) scale(0.5)";
    flyingElement.style.opacity = "0.8";
  });

  setTimeout(() => {
    if (flyingElement.parentNode) {
      flyingElement.parentNode.removeChild(flyingElement);
    }
  }, 600);

  // Animate cart badge
  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.style.animation = "none";
    setTimeout(() => {
      badge.style.animation = "cartBadgePulse 0.3s ease-out";
    }, 10);
  });
}

