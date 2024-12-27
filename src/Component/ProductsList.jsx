import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./CartContext"; // Import Cart Context

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const { addToCart, removeFromCart, cart } = useCart(); // Access cart functions and state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            imageURL: data.imageURL || "",
            productName: data.productName || "Unknown Product",
            price: data.price || 0,
            description: data.description || "No description available.",
            isFavorite: false,
          };
        });

        // Repeat products to simulate infinite scrolling
        setProducts([fetchedProducts, fetchedProducts, fetchedProducts].flat());
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

  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId); // Check if product is in cart
  };

  return (
    <div className="relative bg-[#f9e98a] p-10 pb-20 md:pb-16  bg-no-repeat bg-cover ">
      {/* Title */}
      <h2 className="text-[2.29rem]   whitespace-nowrap md:text-5xl font-bold text-center text-[#2E2C2F] mb-12 tracking-wide">
        Featured Products
      </h2>

      {/* Scrollable Product List */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar gap-12 items-center"
        style={{
          scrollBehavior: "smooth",
          padding: "0 40px", // Ensure space for buttons
          scrollSnapType: "x mandatory", // Ensure products snap to position
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[300px] h-[440px] p-6 bg-white rounded-2xl shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              scrollSnapAlign: "center", // Snap to center
            }}
          >
            {/* Product Image */}
            <img
              src={product.imageURL || "https://via.placeholder.com/150"}
              alt={product.productName}
              className="w-full h-[60%] object-cover rounded-lg mb-6 shadow-md"
            />

            {/* Product Info */}
            <h3 className="text-4xl md:text-2xl font-semibold text-[#2E2C2F] mb-3 truncate">
              {product.productName}
            </h3>
            <p className="text-[#777] text-xl md:text-base mb-4 truncate">
              {product.description}
            </p>

            {/* Price and Buttons */}
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-[#4E4C50]">
                ${product.price}
              </span>
              <div className="flex items-center gap-4">
                {/* Add to Bag or Remove from Bag Button */}
                <button
                  onClick={
                    () =>
                      isInCart(product.id)
                        ? removeFromCart(product.id) // Remove from cart if already in cart
                        : addToCart(product) // Add to cart if not already in cart
                  }
                  className="bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] text-white border-none px-6 py-2 rounded-xl text-sm hover:bg-gradient-to-r hover:from-[#FF7043] hover:to-[#F44336] transition-all duration-300"
                >
                  {isInCart(product.id) ? "Remove from Bag" : "Add to Bag"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={() => scrollBy(-330)} // Adjust scroll distance
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-2xl md:text-4xl text-white bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] shadow-xl rounded-full p-2 md:p-4 hover:bg-gradient-to-r hover:from-[#FF7043] hover:to-[#F44336] transition-all duration-300"
      >
        &lt;
      </button>

      {/* Right Button */}
      <button
        onClick={() => scrollBy(330)} // Adjust scroll distance
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-2xl md:text-4xl text-white bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] shadow-xl rounded-full p-2 md:p-4 hover:bg-gradient-to-r hover:from-[#FF7043] hover:to-[#F44336] transition-all duration-300"
      >
        &gt;
      </button>
    </div>
  );
};

export default ProductsList;
