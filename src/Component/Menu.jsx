import React, { useState, useEffect, useRef } from "react";
import AdminPanel from "./AdminPanel"; // Import the AdminPanel

const Menu = () => {
  const [slidebar, setSlidebar] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Track Admin Panel visibility
  const [showEditProduct, setShowEditProduct] = useState(false); // Track EditProduct visibility
  const menuRef = useRef(null);

  // Check if user is admin from localStorage
  const isAdmin = localStorage.getItem("admin") === "true";

  // Menu items with corresponding links
  const menuItems = [
    { name: "Home", link: "#home" },
    { name: "Products", link: "#products" },
    { name: "Contact Us", link: "#contact" },
    { name: "About Us", link: "#about" },
    ...(isAdmin
      ? [
          {
            name: "Add Product",
            link: "#add-product",
            onClick: () => setShowAdminPanel(!showAdminPanel),
          },
          { name: "Show Users", link: "#users" },
        ]
      : []), // Add admin items if isAdmin is true
  ];

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSlidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="left h-full w-1/3 text-black flex items-center px-12 text-3xl outline-none">
        <button
          className="p-1 outline-none opacity-100"
          onClick={() => setSlidebar(!slidebar)}
        >
          {slidebar ? (
            // Cross icon when menu is open
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              stroke="#000"
              strokeWidth="0.6"
              strokeLinecap="square"
              fill="none"
            >
              <path d="M6.343 6.343L17.657 17.657M6.343 17.657L17.657 6.343" />
            </svg>
          ) : (
            // Menu icon when menu is closed
            <svg
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              stroke="#000"
              strokeWidth="0.6"
              strokeLinecap="square"
              fill="none"
            >
              <path d="M8 10L16 10M6 6L18 6M6 14L18 14M8 18L16 18" />
            </svg>
          )}
        </button>
      </div>

      {/* The menu box */}
      {slidebar && (
        <div className="absolute z-30 top-12 left-2 text-lg cursor-pointer h-min-[35rem] w-[22rem] bg-white shadow-2xl rounded-md">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              onClick={item.onClick}
              className="block"
            >
              <span className="block bg-white text-gray-900 capitalize p-3 m-1 rounded-md">
                {item.name}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Show the Admin Panel when "Add Product" is clicked */}
      {showAdminPanel && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-semibold pr-3"
              onClick={() => setShowAdminPanel(false)} // Close Admin Panel
            >
              X
            </button>
            <AdminPanel /> {/* Admin Panel Form */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
