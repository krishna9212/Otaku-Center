import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext"; // Import useCart hook
import { auth, signInWithPopup, googleProvider } from "./firebaseConfig"; // Ensure correct path to firebaseConfig

const Cart = () => {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart(); // Access cart and actions from context
  const [showDropdown, setShowDropdown] = useState(false);
  const [warningMessage, setWarningMessage] = useState(""); // For warning message
  const [userKey, setUserKey] = useState(null); // State to track user's key
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null); // Current user state
  const [error, setError] = useState(null); // Add error state

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown if clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider); // Only call this once
      const userData = userCredential.user;
      localStorage.setItem("user", JSON.stringify(userData)); // Save user info to localStorage
      setUser(userData);
      handleClose(); // Close dropdown after login
      alert("Google login successful");
    } catch (error) {
      setError(error.message); // Display error message
      console.error("Google login failed:", error);
    }
  };
  // Handle the payment button click
  const handlePayment = () => {
    if (!userKey) {
      setWarningMessage("You do not have a valid user key. Payment blocked.");
      return; // Block payment if no key is available
    }

    if (cart.length === 0) {
      setWarningMessage(
        "Your cart is empty! Add some items before proceeding."
      );
      return; // Block payment if the cart is empty
    }

    // Implement payment logic (assuming a successful payment here)
    alert("Proceeding with payment...");
    clearCart(); // Clear cart after payment
    setWarningMessage(""); // Reset any warnings after payment
  };

  return (
    <div className="relative z-30 mt-2" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)} // Toggle the dropdown
        className="outline-none focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          stroke="#000"
          strokeWidth="0.6"
          fill="none"
        >
          <rect width="14" height="12" x="5" y="7" />
          <path d="M8 7a4 4 0 1 1 8 0" />
        </svg>
      </button>
      {showDropdown && (
        <div className="absolute -right-2 bottom-12 w-[24rem] h-[32rem] shadow-2xl bg-[#f6cd54] text-black rounded-lg px-4 pb-12 no-scrollbar pt-4 overflow-auto">
          {/* Cart content goes here */}
          <div className="w-full h-full flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                <p className="text-xl text-gray-400">No items in your cart</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-200 p-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="flex flex-col space-y-2">
                      <h3 className="font-semibold text-lg">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          className="bg-gray-500 text-white rounded-md px-3 py-1 hover:bg-yellow-600 transition-all"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold">
                          x{item.quantity}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          className="bg-gray-500 text-white rounded-md px-3 py-1 hover:bg-green-600 transition-all"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-gray-900 text-white rounded-md px-4 py-1 hover:bg-gray-800 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {/* Cart Total */}
                <div className="flex justify-between items-center mt-6 border-t border-b border-black text-black p-4">
                  <span className="font-semibold text-xl">Total: </span>
                  <span className="font-semibold text-2xl">
                    ₹
                    {cart.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )}
                  </span>
                </div>

                {/* Warning Message */}
                {warningMessage && (
                  <div className="bg-[#f6cd54] text-red-500 p-3 rounded-lg mb-4 flex flex-col gap-2 ">
                    {warningMessage}
                    <button
                      onClick={handleGoogleLogin} // Google login button
                      className="flex justify-center text-lg font-normal items-center text-gray-800 gap-2"
                    >
                      <p> Login with Google</p>
                      <img
                        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                        alt="google"
                        className="h-10 w-7  rounded-full py-2 transition-all bg-[#f6cd54]"
                      />
                    </button>
                  </div>
                )}

                <div className="h-4 w-full">
                  <button
                    onClick={handlePayment}
                    className="bg-black text-white p-3 mb-6 w-full  rounded-xl"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
