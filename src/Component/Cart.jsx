import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";

import { auth, signInWithPopup, googleProvider, db } from "./firebaseConfig"; // Import Firebase-related functions once
import { doc, setDoc, collection } from "firebase/firestore"; // Firestore methods

const Cart = () => {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [dontHaveAddress, setdontHaveAddress] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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
  
  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
  
    try {
      const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      if (!totalAmount || !formData.address) {
        alert("Please enter a valid address and add items to the cart.");
        return;
      }
  
      const amountInPaise = Math.round(totalAmount * 100);
  
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh and try again.");
        return;
      }
  
      const response = await fetch("https://otakucentre.com/.netlify/functions/createPaymentOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, currency: "INR" }),
      });
  
      if (!response.ok) throw new Error(`Server error! Status: ${response.status}`);
      const data = await response.json();
      if (!data.id) throw new Error(data.message || "Failed to create Razorpay order.");
  
      console.log("🟢 Razorpay Order Created:", data);
  
      const options = {
        key: "rzp_live_grwDvSZE8zNbH9", // Replace with your actual Razorpay Key
        amount: data.amount,
        currency: "INR",
        name: "OtakuCenter",
        description: "Order Payment",
        order_id: data.id,
        handler: async (paymentResponse) => {
          console.log("✅ Payment Successful:", paymentResponse);
  
          try {
            // Verify Payment
            const verifyResponse = await fetch("https://otakucentre.com/.netlify/functions/verifyPayment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResponse),
            });
  
            const verifyData = await verifyResponse.json();
            console.log("Verify Payment Response:", verifyData);
  
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed.");
            }
  
            // Store order details in Firebase after verification
            const orderRef = doc(collection(db, "orders")); // Using collection and auto-generated ID
            await setDoc(orderRef, {
              userId: user?.uid || "guest",
              email: user?.email || "",
              cartDetails: cart.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
              })),
              totalPrice: totalAmount,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              paymentSignature: paymentResponse.razorpay_signature || "",
              shippingDetails: formData,
              timestamp: new Date().toISOString(),
            });
  
            console.log("✅ Order saved to Firestore successfully!");
            alert("Payment successful! Your order has been placed.");
            clearCart();
          } catch (error) {
            console.error("❌ Payment Verification or Order Save Error:", error);
            alert("Payment verification failed or there was an error placing the order. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },
        theme: { color: "#F6CF5A" },
        method: { upi: true, qr: true, card: true, netbanking: true, wallet: true },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (response) => {
        console.error("❌ Payment Failed:", response);
        alert("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Move handleAddressSubmit function here
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("customerAddress", JSON.stringify(formData));

    setdontHaveAddress(false);
    setShowAddressForm(false);
    console.log(formData);
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
    let savedAddress = localStorage.getItem("customerAddress");

    if (user && savedAddress) {
      // Check the size of the saved address
      if (new TextEncoder().encode(savedAddress).length > 5000) {
        // Assuming 5 KB as a limit
        console.warn("Address data too large to store in localStorage");
        setWarningMessage(
          "Address data is too large. Please review your address."
        );
        return;
      }

      // Store only essential data if necessary
      setdontHaveAddress(false);
      setShowQR(true); // Show the QR code after successful order
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
  
  const handleWhatsAppClick = () => {
    // Retrieve customer address data from localStorage
    const customerAddress = JSON.parse(localStorage.getItem("customerAddress"));

    // Check if customerAddress exists and is valid
    if (
      !customerAddress ||
      !customerAddress.name ||
      !customerAddress.address ||
      !customerAddress.postalCode ||
      !customerAddress.state ||
      !customerAddress.nearby
    ) {
      alert("Please fill in all the required fields before proceeding.");
      return;
    }

    // Define the message with order details and user inputs
    const message = `
Hello Myself ${customerAddress.name || "Customer"},

I have placed an order on your website. Here are the details:

*Order Details:*
${cart
  .map(
    (item, index) =>
      `${index + 1}. ${item.productName} - Quantity: ${
        item.quantity
      }, Price: ₹${item.price * item.quantity}`
  )
  .join("\n")}

*Total Price:* ₹${cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )}

*Delivery Address:*
Name: ${customerAddress.name || "N/A"}
Address: ${customerAddress.address || "N/A"}
Nearby: ${customerAddress.nearby || "N/A"}
Postal Code: ${customerAddress.postalCode || "N/A"}
State: ${customerAddress.state || "N/A"}
Phone: ${customerAddress.alternativePhone || "N/A"}

*Additional Note:* ${customMessage || "No additional notes."}

*Payment Status:* **I am sending a screenshot of the payment made using the QR code on your website for payment confirmation.**

Thank you!
`;

    // Encode the message for use in the URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/918595927668?text=${encodedMessage}`, "_blank");
    setShowConfirmationBox(false);
  };

  const handleChangeAddress = () => {
    setShowAddressForm(true);
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
        <div className="absolute -right-8 md:-right-2 bottom-12 md:w-[24rem] w-[20rem] md:h-[32rem] h-[28rem] shadow-2xl bg-[#f6cd54] text-black rounded-lg px-4 pb-12 no-scrollbar pt-4 overflow-auto">
          {/* Cart content goes here */}
          <div className="w-full h-full flex flex-col space-y-4">
            <h2 className=" text-xl md:text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                <p className="text-sm md:text-xl text-gray-400">No items in your cart</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-200 p-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="flex flex-col space-y-2">
                      <h3 className=" font-semibold text-[0.9rem] md:text-lg">
                        {item.productName}
                      </h3>
                      <p className="text-[0.8rem] md:text-sm text-gray-600">₹{item.price}</p>
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
                        className="bg-gray-900 text-white text-[0.95rem] rounded-md px-4 py-1 hover:bg-gray-800 transition-all"
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

                  {showQR && (
  <div
    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 overflow-hidden"
    onClick={(e) => {
      if (e.target.classList.contains("fixed")) closeQR(); // Prevent accidental clicks inside modal
    }}
  >
    <div className="main w-[95%] sm:w-[90%] p-2  md:-mb-0 h-min-[83%] md:p-4 text-black flex flex-col-reverse sm:flex-row bg-white rounded-lg overflow-auto">
      
      

      {/* Right Section: Order Details */}
      <div className="right w-full  h-full bg-white p-4 z-[999999] relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeQR}
          className="absolute top-2 right-2 text-black font-bold text-2xl"
        >
          ✖
        </button>

        <h1 className="text-3xl -ml-1 font-semibold tracking-[0.001rem]">
          Checkout
        </h1>

        {/* Product Details */}
        <h2 className="text-black text-lg font-semibold mb-4">Product Details</h2>
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-600 py-2"
          >
            <div>
              <p className="text-black">{item.productName}</p>
              <p className="text-black text-sm">Quantity: {item.quantity}</p>
            </div>
            <p className="text-black font-medium">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

        {/* Total Price */}
        <div className="flex justify-between items-center mt-4 font-bold text-xl">
          <span>Total:</span>
          <span>₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
        </div>

        {/* Delivery Address */}
        <h2 className="text-black text-lg font-semibold mt-6 mb-4">Delivery Address</h2>
        <p className="text-gray-400 break-words rounded">
          <p>
            <strong>Name:</strong> {formData.name} <br />
            <strong>Address:</strong> {formData.address} <br />
            <strong>Phone:</strong> {formData.alternativePhone} <br />
            <strong>Nearby:</strong> {formData.nearby} <br />
            <strong>Postal Code:</strong> {formData.postalCode}
          </p>
        </p>

        <button onClick={handleChangeAddress} className="text-blue-500 hover:underline mt-2">
          Change Address
        </button>

        {/* Place Order Button */}
        {/* // Updated Button to Disable During Processing */}
<button
  onClick={handlePayment}
  disabled={cart.length === 0 || !formData.address || isProcessing}
  className={`w-full text-white py-2 mt-6 rounded ${
    cart.length === 0 || !formData.address || isProcessing
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {isProcessing ? "Processing..." : cart.length === 0 ? "Cart is Empty" : "Place Order"}
</button>

      </div>
    </div>
  </div>
)}

                  {showConfirmationBox && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-70 z-50">
                      <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] md:w-[60%] max-w-lg">
                        <h2 className="text-3xl font-semibold text-center text-green-600 mb-6">
                          Order Confirmation
                        </h2>
                        <p className="text-[1.05rem] text-gray-700 mb-6 text-center">
                          Thank you for placing your order! Please confirm by
                          sending the order details and payment screenshot via
                          WhatsApp. Feel free to add any extra instructions
                          below.
                        </p>

                        {/* Custom Message Textarea */}
                        <textarea
                          className="w-full h-[4rem] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out mb-4"
                          placeholder="Enter any additional message (optional)"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                        ></textarea>

                        {/* Send WhatsApp Button */}
                        <div className="mt-6">
                          <button
                            onClick={handleWhatsAppClick} // Trigger WhatsApp with pre-filled message
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out"
                          >
                            Send Order via WhatsApp
                          </button>
                        </div>
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
          <div className="bg-[#F6CD54] p-6 rounded-lg shadow-lg w-[90%] max-w-md relative z-50">
            <button
              onClick={() => {
                setShowAddressForm(false);
              }}
              className="absolute top-2 right-2 text-gray-700 text-2xl font-bold z-50"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4 z-50">
              Delivery Details
            </h2>
            <form
              onSubmit={handleAddressSubmit}
              className="flex flex-col gap-4 z-50"
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
                className="border p-2 rounded  z-50"
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
