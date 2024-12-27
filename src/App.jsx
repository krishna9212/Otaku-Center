import React from "react";

import ErrorBoundary from "./Component/ErrorBoundary";
import AboutUs from "./Component/AboutUs";
import ContactUs from "./Component/ContactUs";
import Footer from "./Component/Footer";
import HeroPage from "./Component/HeroPage";
import Navigation from "./Component/Navigation";
import ProductsList from "./Component/ProductsList";
import "animate.css";
import AllProducts from "./Component/AllProducts";
import Testimonial from "./Component/Testimonial";
import { CartProvider } from "./Component/CartContext"; // Import CartProvider

function App() {
  return (
    <>
      <CartProvider>
        <ErrorBoundary>
          <Navigation />
          <HeroPage />
          <ProductsList />
          <AboutUs />
          <AllProducts></AllProducts>
          <Testimonial></Testimonial>
          <ContactUs />
          <Footer />
        </ErrorBoundary>
      </CartProvider>
    </>
  );
}

export default App;
