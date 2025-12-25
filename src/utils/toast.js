// Toast notification utility

export function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) {
    console.warn("Toast container not found");
    return null;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info} toast-icon" aria-hidden="true"></i>
    <div class="toast-content">${message}</div>
    <button class="toast-close" aria-label="Đóng thông báo" type="button">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector(".toast-close");
  const closeToast = () => {
    toast.classList.add("hiding");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };

  closeBtn.addEventListener("click", closeToast);

  if (duration > 0) {
    setTimeout(closeToast, duration);
  }

  return toast;
}

// Export to window for global access (like old code)
if (typeof window !== "undefined") {
  window.showToast = showToast;
}

