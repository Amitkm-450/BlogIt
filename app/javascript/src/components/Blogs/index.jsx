import React, { useState } from "react";

import BlogList from "./List";

import { CategorySidebar, Sidebar } from "../commons";

const BlogPage = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = categoryId => {
    setSelectedCategories([...selectedCategories, categoryId]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar and CategorySidebar in a flex container */}
      <div className="flex">
        <Sidebar onCategoryClick={() => setIsCategoryOpen(!isCategoryOpen)} />
        {isCategoryOpen && (
          <CategorySidebar onSelectCategory={handleCategorySelect} />
        )}
      </div>
      {/* Main content */}
      <div className="flex w-full flex-col">
        <BlogList category={selectedCategories} />
      </div>
    </div>
  );
};

export default BlogPage;
