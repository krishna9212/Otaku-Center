import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [productId, setProductId] = useState(""); // State for product ID
  const [loading, setLoading] = useState(false);

  // Function to generate a unique product ID
  const generateProductId = () => {
    const timestamp = Date.now(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    return `${timestamp}-${randomNum}`; // Return combined product ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate a unique product ID
    const generatedProductId = generateProductId();
    setProductId(generatedProductId); // Set the generated product ID in state

    try {
      await addDoc(collection(db, "products"), {
        productId: generatedProductId, // Store the generated product ID
        productName,
        price,
        description,
        imageURL,
      });

      alert("Product added successfully!");
      setProductName("");
      setPrice("");
      setDescription("");
      setImageURL("");
      setProductId(""); // Reset product ID after successful submit
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Admin Panel - Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Product ID"
          value={productId} // Display the generated product ID
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
