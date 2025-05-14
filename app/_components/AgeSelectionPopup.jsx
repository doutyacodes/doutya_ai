// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";

// const AgeSelectionPopup = ({ onSubmit, onClose }) => {
//   const [age, setAge] = useState("");

//   const handleSubmit = () => {
//     if (age >= 3 && age <= 12) {
//       onSubmit(Number(age));
//     } else {
//       alert("Please select an age between 3 and 12.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 h-screen z-[999999999999] bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         {/* Logo with proper padding/margin for better appearance */}
//         <div className="mb-4 sm:mb-6 flex justify-center">
//           <Link href="/" className="flex justify-center items-center">
//             <div className="rounded-full bg-white p-2 sm:p-3 shadow-lg">
//               <Image
//                 src="/images/logo5.png"
//                 width={300}
//                 height={300}
//                 alt="logo"
//                 className="w-28 sm:w-32 h-auto"
//                 priority
//               />
//             </div>
//           </Link>
//         </div>
        
//         {/* Enhanced popup container */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: 20, opacity: 0 }}
//           transition={{ type: "spring", stiffness: 100, damping: 15 }}
//           className="bg-white rounded-xl shadow-xl p-5 sm:p-6 border border-gray-100"
//         >
//           <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-4 text-center">
//             Select your child&apos;s age
//           </h2>
          
//           <div className="mb-5">
//             <select
//               id="age"
//               name="age"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//               className="w-full border-2 border-red-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base appearance-none"
//               style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23991b1b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 0.75rem center",
//                 backgroundSize: "1.25em 1.25em",
//                 paddingRight: "2.5rem"
//               }}
//             >
//               <option value="" disabled>Select age (3-12)</option>
//               {Array.from({ length: 10 }, (_, i) => (
//                 <option key={i} value={i + 3}>
//                   {i + 3} years
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-between space-x-3">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all w-1/2"
//             >
//               Cancel
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSubmit}
//               className="px-4 py-2 text-white bg-red-800 rounded-lg text-sm font-medium hover:bg-red-900 transition-all w-1/2 shadow-sm"
//               disabled={!age}
//             >
//               Continue
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AgeSelectionPopup;

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const AgeSelectionPopup = ({ onSubmit, onClose }) => {
  const [age, setAge] = useState("");

  const handleSubmit = () => {
    if (age >= 4 && age <= 12) {
      onSubmit(Number(age));
    } else {
      alert("Please select an age between 4 and 12.");
    }
  };

  return (
    <div className="fixed inset-0 h-screen z-[999999999999] bg-gradient-to-br from-red-50 to-white flex flex-col">
      {/* Logo in navbar style */}
      <div className="w-full bg-white shadow-sm py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="relative h-[7.6vh] w-[35vw] md:h-[9vh] md:w-[20vw]">
            <Image
              src="/images/logo5.png"
              fill
              objectFit="contain"
              alt="Doutya Kids logo"
              className="object-center"
            />
          </div>
        </div>
      </div>
      
      {/* Content area */}
       <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 border border-gray-100">
            {/* Heading */}
            <h2 className="text-lg font-semibold text-center text-red-800 mb-4">
              How old is your child?
            </h2>
            
            {/* Description */}
            <p className="text-center text-gray-700 text-sm mb-6">
              Select your child's age to receive customized news content tailored specifically for them.
            </p>
            
            {/* Age selection */}
            <div className="mb-6">
              <div className="relative">
                <select
                  id="age"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full rounded-lg border-2 border-red-200 bg-white py-2 pl-4 pr-10 text-gray-700 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none"
                >
                  <option value="" disabled>Select age (4-12)</option>
                  {Array.from({ length: 9 }, (_, i) => (
                    <option key={i} value={i + 4}>
                      {i + 4} years
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <ChevronDown className="h-5 w-5 text-red-800" />
                </div>
              </div>
            </div>
            
            {/* Single continue button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!age}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white shadow-sm ${
                  !age 
                    ? 'bg-red-800 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AgeSelectionPopup;