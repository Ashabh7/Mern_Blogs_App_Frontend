import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-purple-800 text-indigo-100">
        <h1 className="text-lg md:text-x1 font-extrabold">
          <Link to={"/"}>Blogesh</Link>
        </h1>
      </div>
      Navbar
    </div>
  );
}

export default Navbar;
