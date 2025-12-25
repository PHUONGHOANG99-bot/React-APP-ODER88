import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function BackButton() {
  const { 
    currentCategory, 
    setCurrentCategory, 
    searchQuery, 
    setSearchQuery,
    previousTab,
    setCurrentTab,
    setTabRefreshKey
  } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(currentCategory !== "all" || searchQuery !== "");
  }, [currentCategory, searchQuery]);

  const handleGoBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Lưu tab hiện tại trước khi reset
    const tabToRestore = previousTab || "all";
    
    // Reset category và search
    setCurrentCategory("all");
    setSearchQuery("");
    
    // Khôi phục tab trước đó và force refresh
    setCurrentTab(tabToRestore);
    setTabRefreshKey(prev => prev + 1);
    
    // Clear search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  if (!visible) return null;

  return (
    <button
      className="back-btn"
      id="backBtn"
      aria-label="Quay lại"
      onClick={handleGoBack}
      type="button"
    >
      <i className="fas fa-arrow-left" aria-hidden="true"></i>
      <span>Quay lại</span>
    </button>
  );
}

