import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import logo from "./Images/logo.png";

function Navbar() {
    const { loginWithPopup } = useAuth0();
    return (
        <div className=' bg-black p-6'>
            <div className='container mx-auto flex justify-between items-center'>
                <div className=' text-white font-medium text-3xl mr-auto p-1'>Noteify
                    {/* <a href="/" className="flex items-center "/>
                        <img src={logo} className=" h-[50px]" />
                        {/* <Link to="logo"><MenuItem style={{paddingLeft: 13, textDecoration: 'none'}}> Team 1 </MenuItem></Link> */}
                        </div>
                <div>
                    <button className=' text-white text-m inline-flex items-center whitespace-nowrap select-none justify-center bg-[#5169F6] font-medium gap-2 rounded-3xl px-5 md:px-7 py-2 md:py-3' onClick={(e) => loginWithPopup()}>Sign up</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar