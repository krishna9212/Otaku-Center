import React, { useState } from "react";
import image1 from "./../assets/HeroImages/download.jpeg";
import video1 from "./../assets/videos/demonSlayer.mp4";
import image2 from "./../assets/HeroImages/levi.jpeg";
import video2 from "./../assets/videos/AOT.mp4";
import image4 from "./../assets/HeroImages/luffy.jpeg";
import video4 from "./../assets/videos/onePiece.mp4";
import Cart from "./Cart";

function HeroPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState(video1);

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
        <h1 className="text-[2.1rem] md:text-[6rem] font-black text-white">
          Relive the Madness!
        </h1>
        <p className="text-[0.9rem] text-white">
          Grab Goku, Luffy, and All the Icons — Because True Fans Don't Just
          Watch, They Collect!
        </p>
        <button className="border-white outline-none border-[1px] p-3 mt-5 rounded-3xl hover:rounded-md ml-1 text-white font-black transition-all duration-700 hover:bg-white hover:text-black">
          <a href="#products">Shop Now</a>
        </button>
      </div>

      {/* Hero Options */}
      <div className="HeroOptions z-10 w-full mt-[2rem] p-1 flex justify-center items-center gap-2 relative">
        {/* Video selection images */}
        {[
          { image: image1, video: video1 },
          { image: image2, video: video2 },
          { image: image4, video: video4 },
        ].map(({ image, video }, index) => (
          <div
            key={index}
            className={`box h-full w-[25%] md:w-[15%] rounded-xl p-[0.20rem] transition-all duration-300 overflow-hidden ${
              activeVideo === video
                ? "border-white opacity-100 border-2"
                : "opacity-50 border-none"
            }`}
            onClick={() => changeVideo(video)}
          >
            <img
              src={image}
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Cart Icon */}
      <div className="carticon fixed bottom-8 right-8 h-14 w-14 bg-[#F6CF5A] rounded-full flex justify-center items-center cursor-pointer">
        <Cart />
      </div>

      {/* WhatsApp Button */}
      <div
        className="whatsapp-icon fixed bottom-24 right-8 text-2xl h-14 w-14 bg-[#25D366] rounded-full flex justify-center items-center cursor-pointer"
        onClick={() => handleWhatsAppClick()}
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
      >
        <i className="fa-brands fa-whatsapp" />
      </div>
    </div>
  );
}

export default HeroPage;
