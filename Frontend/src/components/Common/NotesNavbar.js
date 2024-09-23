import React, { useState, useEffect } from "react";
import dustbin from "../Images/dustbin.png";

import Drawer from '@mui/material/Drawer';


const Navbar = ({ darkMode, onColorSelect,trashEnable,setTrashEnable,isOpen,setIsOpen }) => {
  

  const colors = [
    "bg-red-300",
    "bg-green-300",
    "bg-purple-300",
    "bg-blue-300",
    "bg-[#FFD966]",
    "bg-pink-300",
    "bg-orange-300",
  ];


  const handleColorClick = (color) => {
    onColorSelect(color);
  };

  useEffect(() => {
    console.log(darkMode);
  }, [darkMode]);

  return (
    <div className="flex flex-col h-screen NotesNavbar mt-5">


      <Drawer open={isOpen} onClose={()=>{setIsOpen(false);}}>
      <div className="flex flex-col items-center mt-10 px-3">
          <span className="text-2xl font-medium mb-6">Noteify</span>
          <div className="mt-14 flex flex-col gap-5 items-center">
            <div className="bg-white rounded-full border-2 border-black p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={30}
                width={30}
                viewBox="0 0 448 512"
              >
                <path
                  fill="#000000"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
                />
              </svg>
            </div>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {handleColorClick(color);setIsOpen(false);}}
                className="mb-2"
              >
                <div className={`w-8 h-8 ${color} rounded-full`}></div>
              </button>
            ))}
          </div>
          <div className="text-center flex justify-center mt-10">
            <button className='mt-10 ' onClick={()=>{setTrashEnable(!trashEnable);}}>
              <img className="h-[50px]" src={dustbin} alt="Trash" />
            </button>
          </div>
        </div>
      </Drawer>
    

      <div
        className={`items-center md:w-20 mt-5 md:h-screen ${
          darkMode ? "bg-black" : ""
        } hidden md:flex flex-col gap-5`}
      >
        <span
          className={`mt-4 text-2xl font-medium ${
            darkMode ? "text-white" : ""
          }`}
        >
          Noteify
        </span>
        <div className="mt-14 flex flex-col gap-5 items-center">
          <div className="bg-white rounded-full border-2 border-black p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={30}
              width={30}
              viewBox="0 0 448 512"
            >
              <path
                fill="#000000"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
              />
            </svg>
          </div>
          {colors.map((color) => (
            <button key={color} onClick={() => handleColorClick(color)} className="mb-2">
              <div className={`w-8 h-8 ${color} rounded-full`}></div>
            </button>
          ))}
        </div>
        <div className="text-center flex justify-center">
          <button className='mt-10 ' onClick={()=>{setTrashEnable(!trashEnable);}}>
            <img className='h-[50px]' src={dustbin} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
