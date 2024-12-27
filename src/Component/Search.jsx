// import React, { useState } from "react";

// const Search = () => {
//   const [search, setSearch] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   const handleSearch = () => {
//     if (inputValue.trim()) {
//       alert(`Searching for: ${inputValue}`);
//     } else {
//       alert("Please enter a search term.");
//     }
//   };

//   return (
//     <>
//       <button
//         className={
//           search ? "outline-none opacity-0" : "outline-none opacity-100"
//         }
//         onClick={() => setSearch(true)}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           role="img"
//           width="40px"
//           height="40px"
//           viewBox="0 0 24 24"
//           stroke="#000"
//           strokeWidth="0.6"
//           strokeLinecap="square"
//           fill="none"
//         >
//           <path d="M14.412 14.412L20 20" />
//           <circle cx="10" cy="10" r="6" />
//         </svg>
//       </button>

//       {search && (
//         <div className="flex flex-col font-thin shadow-md bg-[#EDE9D0] z-50 absolute top-0 left-0 w-full h-full">
//           <div className="top flex justify-end px-3 py-2">
//             <button onClick={() => setSearch(false)}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 role="img"
//                 width="40px"
//                 height="40px"
//                 viewBox="0 0 24 24"
//                 stroke="#000"
//                 strokeWidth="0.6"
//                 strokeLinecap="square"
//                 fill="none"
//               >
//                 <path d="M6.343 6.343L17.657 17.657M6.343 17.657L17.657 6.343" />
//               </svg>
//             </button>
//           </div>
//           <div className="bottom flex justify-center bg-[#EDE9D0] shadow-xl items-start px-8 pb-10 w-full">
//             <div className="searchbar relative rounded-md overflow-hidden text-gray-600 h-14 w-[80%] sm:w-[45%] flex items-center">
//               <input
//                 type="search"
//                 className="w-full bg-gray-300 px-2 py-6 text-black outline-none"
//                 placeholder="Type product name"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//               />
//               {inputValue && (
//                 <p className="absolute top-1 left-1 text-[0.70rem] capitalize">
//                   Type product name
//                 </p>
//               )}
//               <button
//                 onClick={handleSearch}
//                 className="h-full px-4 bg-[#074799] text-white hover:bg-[#001A6E]"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Search;
