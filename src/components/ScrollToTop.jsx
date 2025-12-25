import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="scroll-to-top"
      id="scrollToTop"
      aria-label="Cuộn lên đầu trang"
      type="button"
      style={{ display: visible ? "block" : "none" }}
      onClick={scrollToTop}
    >
      <i className="fas fa-arrow-up" aria-hidden="true"></i>
    </button>
  );
}

