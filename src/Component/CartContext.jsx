// CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // If product exists, increment quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product doesn't exist, add new product with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart completely if quantity is 1 or reduce quantity by 1 if greater than 1
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const product = prevCart.find((item) => item.id === productId);
      if (product.quantity === 1) {
        // Remove the product completely if quantity is 1
        return prevCart.filter((item) => item.id !== productId);
      } else {
        // Reduce quantity by 1 if quantity is greater than 1
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  // Change product quantity (increase/decrease)
  const changeQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount), // Prevent going below 1
            }
          : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
