import React from "react";

import { Link } from "react-router-dom";

const Sidebar = ({ onCategoryClick }) => (
  <div className="h-full w-64 bg-gray-500 text-white">
    <nav className="flex flex-col space-y-4 p-6">
      <Link className="rounded p-2 hover:bg-gray-700" to="/">
        Blogs
      </Link>
      <Link className="rounded p-2 hover:bg-gray-700" to="/about">
        Others
      </Link>
      <Link className="rounded p-2 hover:bg-gray-700" to="/posts/create">
        Add post
      </Link>
      <button
        className="w-full rounded p-2 text-left hover:bg-gray-700"
        onClick={onCategoryClick}
      >
        Categories
      </button>
    </nav>
  </div>
);

export default Sidebar;
