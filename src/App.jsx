import { AppProvider, useApp } from "./context/AppContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import FeaturedSlider from "./components/FeaturedSlider.jsx";
import ProductsSection from "./components/ProductsSection.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import CartModal from "./components/CartModal.jsx";
import ProductGallery from "./components/ProductGallery.jsx";
import ShippingInfoModal from "./components/ShippingInfoModal.jsx";
import SizeSelectionModal from "./components/SizeSelectionModal.jsx";
import MobileCategoriesMenu from "./components/MobileCategoriesMenu.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import PageLoader from "./components/PageLoader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function AppContent() {
    const { loading } = useApp();

    return (
        <div className="app">
            <ErrorBoundary>
                <Header />
            </ErrorBoundary>
            <main>
                <ErrorBoundary>
                    <FeaturedSlider />
                </ErrorBoundary>
                <ErrorBoundary>
                    <ProductsSection />
                </ErrorBoundary>
            </main>
            <ErrorBoundary>
                <Footer />
            </ErrorBoundary>
            <ErrorBoundary>
                <BottomNav />
            </ErrorBoundary>
            <ErrorBoundary>
                <CartModal />
            </ErrorBoundary>
            <ErrorBoundary>
                <ProductGallery />
            </ErrorBoundary>
            <ErrorBoundary>
                <ShippingInfoModal />
            </ErrorBoundary>
            <ErrorBoundary>
                <SizeSelectionModal />
            </ErrorBoundary>
            <ErrorBoundary>
                <MobileCategoriesMenu />
            </ErrorBoundary>
            <ErrorBoundary>
                <ScrollToTop />
            </ErrorBoundary>
            <ErrorBoundary>
                <ToastContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <PageLoader loading={loading} />
            </ErrorBoundary>
        </div>
    );
}

function App() {
    return (
        <AppProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AppProvider>
    );
}

export default App;
