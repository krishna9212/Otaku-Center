import React, { useState } from "react";
import Menu from "./Menu";
// import Search from "./Search";
import LoginSignup from "./LoginSignup";
import Cart from "./Cart";
import logo from "./../assets/HeroImages/OTA.png";
function Navigation() {
  const [slidebar, setSlidebar] = useState(false);

  return (
    <div
      id="home"
      className="h-[14%] relative shadow-xl bg-[#f6cf5a] w-full flex justify-between items-center"
    >
      <div className="left h-full w-1/3 flex items-center justify-cente ">
        <Menu slidebar={slidebar} setSlidebar={setSlidebar} />
      </div>
      <div className="middle h-full  ml-2 md:ml-0 whitespace-nowrap md:w-1/3 flex items-center justify-center">
        <img
          src={logo}
          alt="logo"
          className="h-[160%] md:h-[190%] object-cover"
        />
      </div>
      <div className="right w-1/3 h-full flex items-center justify-end gap- md:gap-10 px-2 md:px-12">
        {/* <Search /> */}
        <LoginSignup />
        <Cart />
      </div>
    </div>
  );
}

export default Navigation;
