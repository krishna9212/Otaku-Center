import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { auth, signInWithPopup, googleProvider, db } from "./firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore"; // Import Firestore methods
import qrImage from "./../assets/HeroImages/qr_img.jpg"; // Path to the QR code image

const Cart = () => {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [dontHaveAddress, setdontHaveAddress] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    landmark: "",
    alternativePhone: "",
    city: "",
    postalCode: "",
    state: "",
  });
  const dropdownRef = useRef(null);

  // Move handleAddressSubmit function here
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("customerAddress", JSON.stringify(formData));
    // Prepare cart information
    const cartDetails = cart.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    // Calculate total price
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Combine form data and cart details
    const payload = {
      ...formData,
      cartDetails,
      totalPrice,
    };
    setdontHaveAddress(false);
    setShowAddressForm(false);
    console.log(dontHaveAddress);
    console.log(payload);
  };

  // UseEffect hooks
  useEffect(() => {
    const storedAddress = JSON.parse(localStorage.getItem("customerAddress"));
    if (storedAddress) {
      setFormData(storedAddress);
      setShowAddressForm(false);
      setdontHaveAddress(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("customerAddress")) {
      setdontHaveAddress(true);
    } else {
      setdontHaveAddress(false);
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dontHaveAddress]);

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const userData = userCredential.user;
      setUser(userData);
      alert("Successfully signed in with Google.");
    } catch (error) {
      setError(error.message);
      console.error("Google login failed:", error);
    }
  };

  const handleProceedPayment = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const savedAddress = localStorage.getItem("customerAddress");

    if (user && savedAddress) {
      const cartDetails = cart.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const payload = {
        cartDetails,
        totalPrice,
        userId: user,
        timestamp: new Date().toISOString(),
      };

      try {
        const ordersRef = collection(db, "orders");
        await setDoc(doc(ordersRef), payload);
        console.log("Order saved to Firestore successfully!");

        localStorage.setItem("customerAddress", JSON.stringify(savedAddress));
        alert("Your order is placed!");

        setdontHaveAddress(false);
        setShowQR(true); // Show the QR code after successful order
      } catch (error) {
        console.error("Error saving order to Firestore:", error);
        setWarningMessage(
          "There was an issue processing your order. Please try again."
        );
      }
    } else {
      setdontHaveAddress(true);
      setWarningMessage(
        "Please login and provide your address to proceed with payment."
      );
    }
  };

  // Close QR code
  const closeQR = () => {
    setShowQR(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="relative z-30 mt-2" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
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
                <div className="deli">
                  {dontHaveAddress ? (
                    <div className="address-summary">
                      <p className="text-xl font-bold pb-2 -tracking-tight">
                        Your Address:
                      </p>
                      <div className="address-details">
                        <p>
                          <strong>Name:</strong> {formData.name}
                        </p>
                        <p>
                          <strong>Address:</strong> {formData.address}
                        </p>
                        <p>
                          <strong>Phone Number:</strong>{" "}
                          {formData.alternativePhone}
                        </p>
                        <p>
                          <strong>Nearby:</strong> {formData.nearby}
                        </p>
                        <p>
                          <strong>Postal Code:</strong> {formData.postalCode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p>No address found:</p>
                      <button
                        className="bg-gray-800 py-2 px-4 rounded-xl pt-2 text-white"
                        onClick={() => setShowAddressForm(true)}
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <div className="h-4 w-full">
                    <button
                      onClick={handleProceedPayment}
                      className="bg-black text-white p-3 mb-6 w-full rounded-xl"
                    >
                      Pay
                    </button>
                  </div>

                  {/* Show QR Code if the condition is true */}
                  {showQR && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-20">
                      <div className="relative">
                        <button
                          onClick={closeQR}
                          className="absolute top-3 text-2xl right-5 text-black "
                        >
                          X
                        </button>
                        <img
                          src={qrImage}
                          alt="QR Code"
                          className="w-[400px] h-[550px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delivery Address Form */}
      {showAddressForm && (
        <div className="fixed inset-0  bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#f6cd54]  p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => {
                setShowAddressForm(false);
              }}
              className="absolute top-2 right-2 text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
            <form
              onSubmit={handleAddressSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                pattern="^[a-zA-Z\s]+$"
                title="Please enter a valid full name (letters and spaces only)."
                required
                className="border p-2 rounded "
              />

              <input
                type="text"
                name="address"
                placeholder="Address (Area and Street) and City"
                value={formData.address}
                onChange={handleInputChange}
                pattern="^[a-zA-Z0-9\s,.'-]{10,}$"
                title="Please enter a valid address (minimum 10 characters)."
                required
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="nearby"
                placeholder="Nearby Landmark"
                value={formData.nearby}
                onChange={handleInputChange}
                pattern="^[a-zA-Z0-9\s,.'-]{5,}$"
                title="Please enter a valid landmark (minimum 5 characters)."
                required
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                pattern="^[a-zA-Z\s]+$"
                title="Please enter a valid state name (letters and spaces only)."
                required
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                pattern="^\d{5,6}$"
                title="Please enter a valid postal code (5 or 6 digits)."
                required
                className="border p-2 rounded"
              />

              <input
                type="tel"
                name="alternativePhone"
                placeholder="Phone Number"
                value={formData.alternativePhone}
                onChange={handleInputChange}
                pattern="^\d{10}$"
                title="Please enter a valid 10-digit phone number."
                required
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-black text-white py-2 rounded-md hover:bg-gray-900 hover:border-white  transition-all duration-500  "
              >
                Submit Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
