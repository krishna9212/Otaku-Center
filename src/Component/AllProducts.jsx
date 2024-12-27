import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext"; // Import useCart hook

function AllProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart, removeFromCart, cart } = useCart(); // Access addToCart, removeFromCart, and cart from context

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
          };
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product); // Add product to cart using context
  };

  const handleRemoveFromCart = (product) => {
    removeFromCart(product.id); // Remove product from cart using context
  };

  const isProductInCart = (productId) => {
    return cart.some((item) => item.id === productId); // Check if product is in the cart
  };

  return (
    <>
      {/* Header */}
      <h1
        id="products"
        className="capitalize bg-[#faeb8a] text-center font-normal text-[3rem] pt-3"
      >
        All Products
      </h1>

      {/* Product List */}
      <div className="grid h-min-full bg-[#faec94] grid-cols-1 sm:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white h-min-[100%] p-6 rounded-lg shadow-lg transform transition-all"
          >
            {/* Product Image */}
            <img
              src={product.imageURL || "https://via.placeholder.com/150"}
              alt={product.productName}
              className="w-full h-[70%] md:h-[60%] object-cover rounded-lg mb-1 shadow-md"
            />

            {/* Product Info */}
            <h3
              className="text-2xl h-[10%] font-semibold text-gray-900 mb-1 line-clamp-2"
              title={product.productName}
            >
              {product.productName}
            </h3>
            <p
              className="text-gray-600 h-[10%]  overflow-hidden overflow-ellipsis  line-clamp-3 scrollbar-thin scrollbar-thumb-gray-300"
              title={product.description}
            >
              {product.description}
            </p>

            {/* Product Action */}
            <div className="flex h-[10%]  justify-between items-start py-2 ">
              <span className="text-xl font-semibold text-[#4E4C50]">
                ₹{product.price}
              </span>
              <div className="flex items-center gap-4">
                {/* Add/Remove to Bag Button */}
                <button
                  onClick={() => {
                    if (isProductInCart(product.id)) {
                      handleRemoveFromCart(product); // Remove from cart if already added
                    } else {
                      handleAddToCart(product); // Add to cart if not already added
                    }
                  }}
                  className={`${
                    isProductInCart(product.id)
                      ? "bg-gradient-to-r from-[#FF7043] to-[#F44336]"
                      : "bg-gradient-to-r from-[#FF9F6A] to-[#F57C60]"
                  } text-white border-none px-6 py-2 rounded-xl text-sm hover:opacity-80 transition-all duration-300`}
                >
                  {isProductInCart(product.id)
                    ? "Remove from Cart"
                    : "Add to Bag"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AllProducts;
