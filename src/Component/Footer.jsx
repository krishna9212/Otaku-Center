import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 w-screen flex-col text-white py-8">
      <div className="flex w-full  flex-col md:flex-row justify-between space-y-6 md:space-y-0">
        {/* Left Column */}
        <div className="w-full md:w-5/12 px-4   mb-8 md:mb-0">
          <h4 className="text-4xl font-semibold text-[#FBBF24] mb-4 transition-all duration-300 hover:text-[#EDE9D0]">
            Stay Connected
          </h4>
          <p className="text-lg text-white mb-6">
            Join our vibrant community and never miss out on updates.
          </p>
          <div className="flex space-x-6">
            <button
              className="bg-[#FBBF24] text-gray-800 hover:bg-[#EDE9D0] p-4 rounded-full shadow-lg transition-all duration-300"
              type="button"
            >
              <i className="fab fa-linkedin-in"></i>
            </button>
            <button
              className="bg-[#FBBF24] text-gray-800 hover:bg-[#EDE9D0] p-4 rounded-full shadow-lg transition-all duration-300"
              type="button"
            >
              <a href="https://github.com/krishna9212/Otaku-Center.git">
                <i className="fab fa-github"></i>
              </a>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-5/12 md:px-14 px-4   flex flex-col md:items-end  ">
          <h5 className="text-lg font-semibold text-[#FBBF24] mb-4">
            Useful Links
          </h5>
          <ul className="space-y-2 pb-4  flex flex-col items-start md:px-4">
            <li>
              <a
                className="text-white hover:text-[#FBBF24] transition-all duration-300"
                href="#home"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="text-white hover:text-[#FBBF24] transition-all duration-300"
                href="#products"
              >
                Products
              </a>
            </li>
            <li>
              <a
                className="text-white hover:text-[#FBBF24] transition-all duration-300"
                href="#about"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                className="text-white hover:text-[#FBBF24] transition-all duration-300"
                href="#contact"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                className="text-white hover:text-[#FBBF24] transition-all duration-300"
                href="https://wa.me/918595927668"
                target="_blank"
                rel="noopener noreferrer"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <hr className="border-t border-[#FBBF24] my-8" />
      <div className="text-center text-sm text-gray-500">
        <p>&copy; {currentYear} Otaku Center. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
