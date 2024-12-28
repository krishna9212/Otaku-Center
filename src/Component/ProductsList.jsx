import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./CartContext";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, removeFromCart, cart } = useCart();

  // Calculate scroll distance based on screen width
  const getScrollDistance = () => (window.innerWidth <= 768 ? 330 : 500);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            imageURL: data.imageURL || "https://via.placeholder.com/150",
            productName: data.productName || "Unknown Product",
            price: data.price || 0,
            description: data.description || "No description available.",
          };
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  // Scroll by a specific distance with smooth animation
  const scrollBy = (distance) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: distance,
        behavior: "smooth",
      });
    }
  };

  // Start auto-scrolling
  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(() => {
      scrollBy(getScrollDistance());
    }, 3000);
  };

  // Stop auto-scrolling
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };

  // Pause/restart auto-scroll on user interaction
  const handleUserInteraction = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  // Check if a product is in the cart
  const isInCart = (productId) => cart.some((item) => item.id === productId);

  // Lifecycle hooks to manage auto-scroll
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll(); // Cleanup on unmount
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div
      className="relative bg-[#f9e98a] p-10 pb-20 md:pb-16 bg-no-repeat bg-cover"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {/* Title */}
      <h2 className="text-[2.29rem] md:text-5xl font-bold text-center text-[#2E2C2F] mb-12 tracking-wide">
        Featured Products
      </h2>

      {/* Scrollable Product List */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar gap-12 items-center"
        style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory" }}
        onScroll={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[350px] md:w-[300px] h-[600px] md:h-[500px] p-6 bg-white rounded-2xl shadow-lg transition-transform duration-300 ease-in-out"
            style={{ scrollSnapAlign: "center" }}
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.imageURL}
              alt={product.productName}
              className="w-full h-[60%] md:h-[50%] object-cover rounded-lg mb-6 shadow-md"
            />
            <h3 className="text-2xl md:text-2xl font-semibold text-[#2E2C2F] mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {product.productName}
            </h3>
            <p className="text-[#777] text-lg md:text-base mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-[#4E4C50]">
                ₹{product.price}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent modal opening
                  isInCart(product.id)
                    ? removeFromCart(product.id)
                    : addToCart(product);
                }}
                className={`bg-gradient-to-r text-white px-6 py-2 rounded-xl text-sm transition-all duration-300 ${
                  isInCart(product.id)
                    ? "from-[#FF7043] to-[#F44336]"
                    : "from-[#FF9F6A] to-[#F57C60]"
                }`}
              >
                {isInCart(product.id) ? "Remove from Bag" : "Add to Bag"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Left Scroll Button */}
      <button
        onClick={() => {
          handleUserInteraction();
          scrollBy(-getScrollDistance());
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-2xl md:text-4xl text-white bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] shadow-xl rounded-full p-2 md:p-4 hover:bg-gradient-to-r hover:from-[#FF7043] hover:to-[#F44336] transition-all duration-300"
      >
        &lt;
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={() => {
          handleUserInteraction();
          scrollBy(getScrollDistance());
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-2xl md:text-4xl text-white bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] shadow-xl rounded-full p-2 md:p-4 hover:bg-gradient-to-r hover:from-[#FF7043] hover:to-[#F44336] transition-all duration-300"
      >
        &gt;
      </button>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white  h-[90%] w-[95%] md:h-[90%] md:w-[30%] p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute font-bold text-[2rem] top-2 md:top-0 right-4 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <img
              src={selectedProduct.imageURL}
              alt={selectedProduct.productName}
              className="w-full h-min-[50%] object-cover rounded-lg mb-4"
            />
            <h2 className="text-3xl font-semibold mb-2">
              {selectedProduct.productName}
            </h2>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-[#4E4C50]">
                ₹{selectedProduct.price}
              </span>
              <button
                onClick={() => {
                  isInCart(selectedProduct.id)
                    ? removeFromCart(selectedProduct.id)
                    : addToCart(selectedProduct);
                }}
                className={`text-white px-6 py-2 rounded-xl text-sm transition-all duration-300 ${
                  isInCart(selectedProduct.id)
                    ? "bg-gradient-to-r from-[#FF7043] to-[#F44336]"
                    : "bg-gradient-to-r from-[#FF9F6A] to-[#F57C60]"
                }`}
              >
                {isInCart(selectedProduct.id)
                  ? "Remove from Cart"
                  : "Add to Bag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
