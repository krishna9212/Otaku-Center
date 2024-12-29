import React, { useState, useEffect, useRef } from "react";
import { auth, signInWithPopup, googleProvider } from "./firebaseConfig"; // Ensure correct path to firebaseConfig
import RegisterLogin from "./Register"; // The Register/Login component for email/password login

const LoginSignup = () => {
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state
  const [user, setUser] = useState(null); // Current user state
  const dropdownRef = useRef(null); // Reference to dropdown element
  const [error, setError] = useState(null); // Add error state

  // Close dropdown if clicked outside
  const handleClose = () => setShowDropdown(false);

  // Handle Google login
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user"); // Remove user info from localStorage
      setUser(null);
      handleClose(); // Close dropdown on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Manage user authentication and dropdown visibility
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Retrieve user info from localStorage
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser)); // Save user info to localStorage
      } else {
        localStorage.removeItem("user"); // Remove user info on logout
      }
      setUser(currentUser);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative z-0 inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown visibility
        className="p-2 text-2xl outline-none font-thin rounded-md transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          width="36px"
          height="34px"
          viewBox="0 0 24 24"
          aria-labelledby="userIconTitle"
          stroke="#000"
          strokeWidth="0.75"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
          className="z-0"
        >
          <title id="userIconTitle">User</title>
          <path
            strokeLinecap="round"
            d="M5.5,19.5 C7.83333333,18.5 9.33333333,17.6666667 10,17 C11,16 8,16 8,11 C8,7.66666667 9.33333333,6 12,6 C14.6666667,6 16,7.66666667 16,11 C16,16 13,16 14,17 C14.6666667,17.6666667 16.1666667,18.5 18.5,19.5"
          />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </button>

      {/* Dropdown content */}
      {showDropdown && (
        <div className="p-5 absolute z-0 right-[0rem] top-16 bg-white text-black shadow-2xl rounded-md">
          {user ? (
            <>
              <h2 className="text-2xl font-bold mb-4 whitespace-nowrap">
                Welcome, {user.displayName || "User"}!
              </h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button
                onClick={handleLogout} // Logout button
                className="mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleGoogleLogin} // Google login button
                className="py-2 bg-blue-500 w-full my-2 text-white rounded-md hover:bg-blue-600 transition-all"
              >
                Login with Google
              </button>

              <div className="line flex justify-around items-center pt-2">
                <h3 className="h-1 border-gray-800 border-t border-dashed w-1/3"></h3>
                <h3 className="text-xl font-semibold mb-4 w-1/3 text-center">
                  or
                </h3>
                <h3 className="h-1 border-t border-gray-800 border-dashed w-1/3"></h3>
              </div>

              {/* Register/Login component */}
              <div className="register">
                <RegisterLogin />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
