import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext"; // Import useCart hook
import LoginSignup from "./LoginSignup"; // Import the LoginSignup component

const Cart = ({ showLoginModal, setShowLoginModal }) => {
  const { cart, removeFromCart, changeQuantity } = useCart(); // Access cart and actions from context
  const [showDropdown, setShowDropdown] = useState(false);
  const [warningMessage, setWarningMessage] = useState(""); // For warning message
  const dropdownRef = useRef(null);

  // Check if the user is registered/authenticated
  const isUserRegistered = localStorage.getItem("user");

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

  // Handle the payment button click
  const handlePayment = () => {
    if (isUserRegistered) {
      // Proceed with payment logic here
      alert("Proceeding with payment...");
    } else {
      setWarningMessage("Please log in first to proceed with the payment.");
      setShowLoginModal(true); // Open the login modal directly
    }
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
        <div className="absolute -right-2 bottom-12 w-[24rem] h-[35rem] shadow-2xl  bg-[#F6CF5A] text-black rounded-lg  px-4 pb-12 no-scrollbar pt-4 overflow-auto">
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
                <div className="flex justify-between items-center mt-6 border-t  boder-2 border-black  text-black p-4 ">
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
                  <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                    {warningMessage}
                  </div>
                )}

                <div className="h-4 w-full ">
                  <button
                    onClick={handlePayment}
                    className="bg-black text-white p-3 mb-6 w-full rounded-xl"
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
