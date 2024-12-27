import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from "./firebaseConfig";

const RegisterLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false); // State to toggle between login and register

  // Regex validation for email and password
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const adminEmail = "krishna@gmail.com";
  const adminPassword = "77777777aA";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least 8 characters and one number");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (email == adminEmail && password == adminPassword) {
      console.log("admin ji aap aaye");
      alert("admin");
      localStorage.setItem("admin", "true");
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password); // Login
        alert("Login successful");
      } else {
        await createUserWithEmailAndPassword(auth, email, password); // Register
        alert("Registration successful");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 text-black font-thin border-gray-400 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded-md"
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-400 rounded-md"
          />
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p
        className="text-center mt-4 cursor-pointer text-blue-500"
        onClick={() => {
          setIsLogin(!isLogin);
          setError(""); // Clear error on switch
        }}
      >
        {isLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </p>
    </div>
  );
};

export default RegisterLogin;
