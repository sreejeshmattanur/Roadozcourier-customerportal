import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Headers from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Franchise from "./pages/Franchise";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Skeleton from "./components/Loader/Skeleton";
// import TrackOrderPage from "./pages/TrackOrderPage";
// import TrackOrderView from "./pages/TrackOrderView";
import { motion } from "framer-motion";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? <Skeleton /> : children}
    </motion.div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <div className="min-h-screen flex flex-col font-sans">
        {/* MaintenanceWarning removed from here */}
        
        <Headers />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/franchise" element={<PageWrapper><Franchise /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            {/* <Route path="/track-order" element={<PageWrapper><TrackOrderPage /></PageWrapper>} />
            <Route path="/track-order/:orderId" element={<TrackOrderView />} /> */}
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}