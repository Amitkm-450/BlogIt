import React, { useState } from "react";

import CategorySidebar from "./Category";
import Sidebar from "./Sidebar";

import CategoryContext from "../../context/CategoryContext";

const PageLayout = ({ children }) => {
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <CategoryContext.Provider
      value={{ selectedCategories, setSelectedCategories }}
    >
      <div className="flex h-screen w-screen">
        <div className="flex-shrink-0">
          <Sidebar {...{ setIsCategorySidebarOpen }} />
        </div>
        <CategorySidebar
          {...{
            isCategorySidebarOpen,
          }}
        />
        <div className="flex-grow p-6">{children}</div>
      </div>
    </CategoryContext.Provider>
  );
};

export default PageLayout;
