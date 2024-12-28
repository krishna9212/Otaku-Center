import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const { addToCart, removeFromCart, cart } = useCart();

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
    addToCart(product);
  };

  const handleRemoveFromCart = (product) => {
    removeFromCart(product.id);
  };

  const isProductInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Open modal with product details
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close modal
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
            onClick={() => handleProductClick(product)} // Open modal on click
          >
            {/* Product Image */}
            <img
              src={product.imageURL || "https://via.placeholder.com/150"}
              alt={product.productName}
              className="w-full h-[70%] md:h-[64%] object-cover rounded-lg mb-1 md:mb-2 shadow-md "
            />

            {/* Product Info */}
            <h3
              className="text-2xl h-min-[15%] overflow-hidden font-semibold text-gray-900 text-ellipsis whitespace-nowrap mb-1 md:mb-2 "
              title={product.productName}
            >
              {product.productName}
            </h3>
            <p
              className="text-gray-600 overflow-hidden text-ellipsis mb-1 md:mb-2 whitespace-nowrap"
              title={product.description}
            >
              {product.description}
            </p>

            {/* Product Action */}
            <div className="flex   justify-between items-start py-2">
              <span className="text-xl font-semibold text-[#4E4C50]">
                ₹{product.price}
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal opening on button click
                    if (isProductInCart(product.id)) {
                      handleRemoveFromCart(product);
                    } else {
                      handleAddToCart(product);
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

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white  h-[90%] w-[95%] flex flex-col justify-center  md:h-[90%] md:w-[30%] p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute font-bold text-[2rem] top-2 md:top-0 right-4 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            {/* Product Details */}
            <img
              src={
                selectedProduct.imageURL || "https://via.placeholder.com/150"
              }
              alt={selectedProduct.productName}
              className="w-full h-min-[75%] object-cover rounded-lg mb-4"
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
                  if (isProductInCart(selectedProduct.id)) {
                    handleRemoveFromCart(selectedProduct);
                  } else {
                    handleAddToCart(selectedProduct);
                  }
                }}
                className={`${
                  isProductInCart(selectedProduct.id)
                    ? "bg-gradient-to-r from-[#FF7043] to-[#F44336]"
                    : "bg-gradient-to-r from-[#FF9F6A] to-[#F57C60]"
                } text-white px-6 py-2 rounded-xl text-sm hover:opacity-80 transition-all duration-300`}
              >
                {isProductInCart(selectedProduct.id)
                  ? "Remove from Cart"
                  : "Add to Bag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllProducts;
