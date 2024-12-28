import React, { memo, useRef, useState } from "react";
import img from "./../assets/HeroImages/AB.png";
import img1 from "./../assets/HeroImages/AB (2).png";

const AboutUs = () => {
  return (
    <div
      id="about"
      className="min-h-screen md:pb-5 pb-10 flex items-center justify-center bg-gradient-to-r bg-[#fcec83] text-black "
    >
      <div className="max-w-7xl w-full  grid md:grid-cols-2 gap-10">
        {/* Left Section - 3D Object */}
        <div className="flex h-[300px] pb-80 md:pb-0 md:-mt-72 md:h-[450px] w-full   items-center justify-center">
          <img src={img1} alt="" />
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-col items-center justify-center  space-y-6 ">
          <h1 className="text-4xl text-center whitespace-nowrap md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">Otaku Center</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed px-5">
            Otaku Center is India's premier destination for anime and pop
            culture enthusiasts. We bring your favorite characters to life with
            a curated selection of premium action figures and collectibles. From
            classic anime to the latest hits, we have something for every otaku
            out there.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed px-5">
            Based in India, we pride ourselves on delivering authentic products
            and a seamless shopping experience. Whether you're a dedicated
            collector or just starting your journey, Otaku Center is here to
            help you build your dream collection.
          </p>
          <button
            onClick={() => (window.location.href = "#products")} // Navigate to the link
            className=" py-3 w-[90%] hover:w-[95%]   bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-lg transform transition-all duration-1000 ease-in-out focus:outline-none  focus:ring-yellow-500 focus:ring-opacity-50 "
            aria-label="Explore our collection button"
          >
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to optimize rendering performance
export default memo(AboutUs);
