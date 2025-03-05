import React from "react";

import { Link } from "react-router-dom";

const Sidebar = () => (
  <div className="flex">
    <div className="fixed left-0 top-0 h-full w-64 transform bg-gray-900 text-white">
      <nav className="flex flex-col space-y-4 p-6">
        <Link className="rounded p-2 hover:bg-gray-700" to="/">
          Blogs
        </Link>
        <Link className="rounded p-2 hover:bg-gray-700" to="/about">
          Others
        </Link>
      </nav>
    </div>
  </div>
);

export default Sidebar;
