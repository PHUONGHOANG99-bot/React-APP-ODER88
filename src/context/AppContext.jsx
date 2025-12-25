import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { loadProducts, getPurchaseCount } from "../utils/products.js";
import { productMatchesSearch } from "../utils/search.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("all");
  const [previousTab, setPreviousTab] = useState("all"); // Lưu tab trước đó
  const [tabRefreshKey, setTabRefreshKey] = useState(0); // Key để force refresh khi click tab
  const [resetVisibleCountKey, setResetVisibleCountKey] = useState(0); // Key để reset visible count khi reload
  const [lastCategory, setLastCategory] = useState("all"); // Lưu category trước đó để phát hiện thay đổi
  const [lastSearchQuery, setLastSearchQuery] = useState(""); // Lưu search query trước đó

  const productsPerPage = 50; // Số sản phẩm hiển thị ban đầu và mỗi lần load thêm

  // Load products on mount
  useEffect(() => {
    async function initProducts() {
      setLoading(true);
      try {
        const loadedProducts = await loadProducts();
        setProducts(loadedProducts);
        setOriginalProducts(loadedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    initProducts();
  }, []);

  // Filter products based on category, search, and tab
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (currentCategory !== "all") {
      if (currentCategory === "tui-xach") {
        filtered = filtered.filter(
          (p) =>
            p.category === "tui-xach" ||
            p.category === "tui-xach-nam" ||
            p.category === "tui-xach-nu"
        );
      } else if (currentCategory === "vay") {
        filtered = filtered.filter(
          (p) => p.category === "vay" || p.category === "chan-vay"
        );
      } else if (currentCategory === "ao-nu") {
        filtered = filtered.filter(
          (p) =>
            p.category === "ao-nu" ||
            p.category === "ao-dong-nu" ||
            p.category === "ao-thu-dong"
        );
      } else if (currentCategory === "ao-nam") {
        filtered = filtered.filter(
          (p) => p.category === "ao-nam" || p.category === "ao-dong-nam"
        );
      } else if (currentCategory === "set-do") {
        filtered = filtered.filter(
          (p) => p.category === "set-do-nu" || p.category === "set-do-nam"
        );
      } else if (currentCategory === "giay") {
        filtered = filtered.filter(
          (p) =>
            p.category === "giay-nu" ||
            p.category === "giay-nam" ||
            p.category === "boot-nu" ||
            p.category === "giay-the-thao" ||
            p.category === "giay-sneaker-nam"
        );
      } else if (currentCategory === "phu-kien") {
        filtered = filtered.filter(
          (p) =>
            p.category === "phu-kien" ||
            p.category === "non" ||
            p.category === "khan" ||
            p.category === "no-buoc-toc" ||
            p.category === "tat"
        );
      } else if (currentCategory === "quan-nam") {
        filtered = filtered.filter(
          (p) => p.category === "quan-nam" || p.category === "quan-jean-nam"
        );
      } else {
        filtered = filtered.filter((p) => p.category === currentCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) => productMatchesSearch(p, searchQuery));
    }

    // Filter by tab - Apply tab filtering after category and search filtering
    if (currentTab === "hot") {
      // Bán chạy: Sắp xếp theo bestSeller và purchaseCount, giới hạn 30 sản phẩm
      filtered = [...filtered]
        .sort((a, b) => {
          // Ưu tiên bestSeller
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          // Sau đó sắp xếp theo purchaseCount
          const diff = getPurchaseCount(b) - getPurchaseCount(a);
          return diff;
        })
        .slice(0, Math.min(filtered.length, 30));
    } else if (currentTab === "trending") {
      // Xu hướng: Sắp xếp theo purchaseCount cao nhất, sau đó shuffle để đa dạng
      filtered = [...filtered]
        .sort((a, b) => {
          const diff = getPurchaseCount(b) - getPurchaseCount(a);
          if (diff !== 0) return diff;
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        })
        .slice(0, Math.min(filtered.length, 30))
        .sort(() => Math.random() - 0.5); // Shuffle để đa dạng
    } else if (currentTab === "recommended") {
      // Gợi ý: Shuffle ngẫu nhiên và lấy 30 sản phẩm đầu
      filtered = [...filtered]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(filtered.length, 30));
    } else {
      // Tab "all" (Tất cả): Hiển thị tất cả sản phẩm, có thể shuffle để đa dạng
      // Shuffle để mỗi lần xem có thứ tự khác nhau
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    return filtered;
  }, [products, currentCategory, searchQuery, currentTab, tabRefreshKey]);

  // Lưu tab hiện tại khi chọn category hoặc search (để có thể khôi phục khi quay lại)
  // Chỉ lưu khi category hoặc search thay đổi từ trạng thái mặc định sang có giá trị
  // Không ghi đè previousTab nếu đã có giá trị (để giữ tab trước khi chuyển tab)
  useEffect(() => {
    const categoryChanged = lastCategory === "all" && currentCategory !== "all";
    const searchChanged = lastSearchQuery === "" && searchQuery !== "";
    
    if (categoryChanged || searchChanged) {
      // Chỉ lưu nếu previousTab chưa được set (tức là chưa có tab nào được chọn trước đó)
      // Hoặc nếu previousTab là "all" (tức là chưa có tab nào được chọn)
      if (previousTab === "all" || !previousTab) {
        setPreviousTab(currentTab);
      }
    }
    
    // Cập nhật lastCategory và lastSearchQuery
    setLastCategory(currentCategory);
    setLastSearchQuery(searchQuery);
  }, [currentCategory, searchQuery]); // Chỉ chạy khi category hoặc search thay đổi

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory, searchQuery, currentTab]);

  // Function to handle tab change with refresh
  const handleTabChange = (tab) => {
    // Lưu tab hiện tại vào previousTab trước khi chuyển
    setPreviousTab(currentTab);
    setCurrentTab(tab);
    setCurrentPage(1);
    // Force refresh by updating key - this will trigger useMemo to recalculate
    setTabRefreshKey(prev => prev + 1);
  };

  // Function to shuffle products randomly
  const shuffleProducts = () => {
    setCurrentPage(1);
    // Force refresh by updating key - this will trigger useMemo to recalculate with new random order
    setTabRefreshKey(prev => prev + 1);
  };

  // Function to reload products
  const reloadProducts = async () => {
    setLoading(true);
    try {
      const loadedProducts = await loadProducts();
      setProducts(loadedProducts);
      setOriginalProducts(loadedProducts);
      // Reset filters
      setCurrentCategory("all");
      setSearchQuery("");
      setCurrentTab("all");
      setCurrentPage(1);
      setTabRefreshKey(prev => prev + 1);
      // Reset visible count về 50 khi reload
      setResetVisibleCountKey(prev => prev + 1);
    } catch (error) {
      console.error("Error reloading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    originalProducts,
    loading,
    currentCategory,
    setCurrentCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    currentTab,
    setCurrentTab,
    previousTab,
    setPreviousTab,
    handleTabChange,
    shuffleProducts,
    reloadProducts,
    tabRefreshKey,
    setTabRefreshKey,
    resetVisibleCountKey,
    productsPerPage,
    filteredProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
