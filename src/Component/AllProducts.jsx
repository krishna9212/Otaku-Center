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
      <div className="grid h-min-full bg-[#faec94] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8">
  {products.map((product) => (
    <div
      key={product.id}
      className="bg-white p-6 rounded-xl shadow-lg transition-transform transform   cursor-pointer flex flex-col h-[400px]" // Fixed height
      onClick={() => handleProductClick(product)}
    >
      {/* Product Image */}
      <div className="w-full h-[60%] overflow-hidden rounded-lg mb-4 ">
        <img
          src={product.imageURL || "https://via.placeholder.com/300"}
          alt={product.productName}
          className="w-full h-full object-contain transition-transform duration-300 "
        />
      </div>

      {/* Product Info */}
      <h3
        className="text-lg font-bold text-gray-900 truncate"
        title={product.productName}
      >
        {product.productName}
      </h3>
      <p
        className="text-sm text-gray-600 truncate"
        title={product.description}
      >
        {product.description}
      </p>

      {/* Product Action */}
      <div className="mt-auto flex justify-between items-center">
        <span className="text-xl font-semibold text-[#4E4C50]">
          ₹{product.price}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal opening on button click
            isProductInCart(product.id)
              ? handleRemoveFromCart(product)
              : handleAddToCart(product);
          }}
          className={`px-6 py-2 rounded-lg text-sm text-white font-medium transition-all duration-300 ${
            isProductInCart(product.id)
              ? "bg-gradient-to-r from-[#FF7043] to-[#F44336] hover:opacity-80"
              : "bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] hover:opacity-80"
          }`}
        >
          {isProductInCart(product.id) ? "Remove from Cart" : "Add to Bag"}
        </button>
      </div>
    </div>
  ))}
</div>



      {/* Modal for Product Details */}
      {selectedProduct && (
  <div className="fixed inset-0 h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
    <div className="bg-white w-[95%] md:w-[40%] lg:w-[30%] max-h-[90%] p-6 rounded-xl shadow-2xl relative flex flex-col">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold"
      >
        &times;
      </button>

      {/* Product Image */}
      <div className="w-full h-[250px] p-1 md:h-[300px] overflow-hidden rounded-lg mb-4">
        <img
          src={selectedProduct.imageURL || "https://via.placeholder.com/300"}
          alt={selectedProduct.productName}
          className="w-full h-full object-contain rounded-lg transition-transform duration-300 "
        />
      </div>

      {/* Product Details */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        {selectedProduct.productName}
      </h2>
      <p className="text-gray-600 text-center mb-4">{selectedProduct.description}</p>

      {/* Price & Action Button */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xl font-bold text-[#4E4C50]">₹{selectedProduct.price}</span>
        <button
          onClick={() => {
            isProductInCart(selectedProduct.id)
              ? handleRemoveFromCart(selectedProduct)
              : handleAddToCart(selectedProduct);
          }}
          className={`px-6 py-2 rounded-lg text-sm text-white font-medium transition-all duration-300 ${
            isProductInCart(selectedProduct.id)
              ? "bg-gradient-to-r from-[#FF7043] to-[#F44336] hover:opacity-80"
              : "bg-gradient-to-r from-[#FF9F6A] to-[#F57C60] hover:opacity-80"
          }`}
        >
          {isProductInCart(selectedProduct.id) ? "Remove from Cart" : "Add to Bag"}
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default AllProducts;
