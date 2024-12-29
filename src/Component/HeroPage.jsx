import React, { useState } from "react";
import image1 from "./../assets/HeroImages/download.jpeg";
import video1 from "./../assets/videos/demonSlayer.mp4";
import image2 from "./../assets/HeroImages/levi.jpeg";
import video2 from "./../assets/videos/AOT.mp4";
import image4 from "./../assets/HeroImages/luffy.jpeg";
import video4 from "./../assets/videos/onePiece.mp4";
import Cart from "./Cart";

function HeroPage() {
  // State for controlling mute and the active video
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState(video1); // Default video

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const changeVideo = (video) => {
    setActiveVideo(video);
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+918595927668", "_blank"); // Opens WhatsApp in a new tab
  };

  return (
    <div className="heropage h-screen w-screen z-10 relative overflow-hidden bg-black">
      {/* Full-Screen Video Background */}
      <video
        src={activeVideo}
        autoPlay
        loop
        muted={isMuted}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        type="video/mp4"
      />

      {/* Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 bg-opacity-60 bg-gray-100 opacity-60 hover:opacity-100 text-black px-4 py-2 rounded-full z-20 shadow-lg hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
      >
        {isMuted ? (
          <span className="material-icons">volume_off</span>
        ) : (
          <span className="material-icons">volume_up</span>
        )}
        <span className="font-semibold hidden md:block">
          {isMuted ? "Unmute" : "Mute"}
        </span>
      </button>

      {/* Hero Content */}
      <div className="HeroUpper z-10 w-full h-[80%] flex flex-col justify-end items-start relative px-[4rem]">
        <h1 className="text-[2.1rem] whitespace-nowrap md:text-[6rem] capitalize font-black text-white">
          Relive the Madness!
        </h1>
        <p className="font-normal text-[0.9rem] w-full pl-1 md:pl-2 text-white">
          Grab Goku, Luffy, and All the Icons — Because True Fans Don't Just
          Watch, They Collect!
        </p>
        <button className="border-white outline-none border-[1px] p-3 mt-5 rounded-3xl hover:rounded-md ml-1 text-white font-black transition-all duration-700 hover:bg-white hover:text-black">
          <a href="#products">Shop Now</a>
        </button>
      </div>

      {/* Hero Options */}
      <div className="HeroOptions z-10 w-full mt-[2rem] md:mt-0 h-[13%] md:h-[20%] p-1 flex justify-center items-center gap-2 relative">
        {/* Image 1 */}
        <div
          className={`h-full w-[25%] md:w-[15%] rounded-xl p-[0.20rem] transition-all duration-300 overflow-hidden ${
            activeVideo === video1
              ? "border-white opacity-100 border-2"
              : "opacity-50 border-none"
          }`}
          onClick={() => changeVideo(video1)}
        >
          <img src={image1} className="h-full w-full object-cover rounded-xl" />
        </div>

        {/* Image 2 */}
        <div
          className={`h-full w-[25%] md:w-[15%] rounded-xl p-[0.20rem] transition-all duration-300 overflow-hidden ${
            activeVideo === video2
              ? "border-white opacity-100 border-2"
              : "opacity-50 border-none"
          }`}
          onClick={() => changeVideo(video2)}
        >
          <img src={image2} className="h-full w-full object-cover rounded-xl" />
        </div>

        {/* Image 4 */}
        <div
          className={`h-full w-[25%] md:w-[15%] rounded-xl p-[0.20rem] transition-all duration-300 overflow-hidden ${
            activeVideo === video4
              ? "border-white opacity-100"
              : "opacity-50 border-none"
          }`}
          onClick={() => changeVideo(video4)}
        >
          <img
            src={image4}
            className="h-full w-full object-cover rounded-xl"
            alt="Luffy"
          />
        </div>
      </div>

      {/* Cart Icon in Bottom Right Corner */}
      <div className="carticon fixed bottom-8 right-8 h-14 w-14 bg-[#F6CF5A] rounded-full flex justify-center items-center cursor-pointer">
        <Cart />
      </div>

      {/* WhatsApp Button */}
      <div
        className="whatsapp-icon fixed bottom-24 z-40 right-8 text-2xl h-14 w-14 bg-[#25D366] rounded-full flex justify-center items-center cursor-pointer"
        onClick={handleWhatsAppClick}
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
      >
        <i className="fa-brands fa-whatsapp" />
      </div>
    </div>
  );
}

export default HeroPage;
