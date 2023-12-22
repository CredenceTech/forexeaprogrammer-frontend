import React from "react";
import '../App.css';

export default function Tooltip({ children, text }) {

    return (
        <div className="relative ">
            <div className="group">
                {children}
                <div className="opacity-0 inse invisible max-w-lg group-hover:opacity-100 group-hover:visible transition-all duration-300 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-center py-2 px-2 rounded-md">
                    {text}
                    <span className="tooltip-arrow" />
                </div>
            </div>
        </div>
    );
}
