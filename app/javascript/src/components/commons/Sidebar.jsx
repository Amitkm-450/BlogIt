import React from "react";

import {
  Book,
  List,
  Category,
  AddMenu,
  ListDetails,
} from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";
import { useLocation, Link } from "react-router-dom";

const Sidebar = ({ onCategoryClick }) => {
  const location = useLocation(); // Get the current path

  const isActive = path => location.pathname === path; // Check if path is active

  return (
    <div className="flex h-full w-auto flex-col items-center bg-gray-200 p-4 text-white">
      <Book color="black" size={40} />
      <nav className="flex flex-col space-y-4 p-6">
        <Link to="/">
          <Button
            icon={List}
            size="large"
            style="text"
            className={`active:bg-gray-600 ${
              isActive("/") ? "bg-gray-400 text-black" : ""
            }`}
          />
        </Link>
        <Link to="/posts/create">
          <Button
            icon={AddMenu}
            size="large"
            style="text"
            className={`active:bg-gray-600 ${
              isActive("/posts/create") ? "bg-gray-400 text-black" : ""
            }`}
          />
        </Link>
        <Button
          icon={Category}
          style="text"
          className={`w-full rounded p-2 text-left ${
            isActive("/categories") ? "bg-gray-400 text-black" : ""
          }`}
          onClick={onCategoryClick}
        />
        <Link to="/posts/my-blogs">
          <Button
            icon={ListDetails}
            size="large"
            style="text"
            className={`active:bg-gray-600 ${
              isActive("/posts/my-blogs") ? "bg-gray-400 text-black" : ""
            }`}
          />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
