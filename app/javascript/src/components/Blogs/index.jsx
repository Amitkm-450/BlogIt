import React, { useState } from "react";

import List from "./List";

import { CategorySidebar, Sidebar } from "../commons";

const BlogPage = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <div className="flex h-screen">
      {/* Sidebar and CategorySidebar in a flex container */}
      <div className="flex">
        <Sidebar onCategoryClick={() => setIsCategoryOpen(!isCategoryOpen)} />
        {isCategoryOpen && (
          <CategorySidebar onSelectCategory={setSelectedCategories} />
        )}
      </div>
      {/* Main content */}
      <div className="flex w-full flex-col">
        <List category={selectedCategories} />
      </div>
    </div>
  );
};

export default BlogPage;
