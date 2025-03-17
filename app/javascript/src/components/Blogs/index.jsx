import React, { useState } from "react";

import BlogList from "./List";

import { CategorySidebar, Sidebar } from "../commons";

const BlogPage = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = categoryId => {
    setSelectedCategories(
      prevCategories =>
        prevCategories.includes(categoryId)
          ? prevCategories.filter(id => id !== categoryId) // Remove if present
          : [...prevCategories, categoryId] // Add if not present
    );
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-shrink-0">
        <Sidebar onCategoryClick={() => setIsCategoryOpen(!isCategoryOpen)} />
        {isCategoryOpen && (
          <CategorySidebar onSelectCategory={handleCategorySelect} />
        )}
      </div>
      <div className="flex-grow">
        <BlogList selectedCategories={selectedCategories} />
      </div>
    </div>
  );
};

export default BlogPage;
