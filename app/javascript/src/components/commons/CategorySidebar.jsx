import React, { useEffect, useState } from "react";

import { Plus, Search } from "@bigbinary/neeto-icons";
import { Input, Button, Spinner } from "@bigbinary/neetoui";

import AddCategory from "./AddCategory";

import categoriesApi from "../../apis/categories";

const CategorySidebar = ({ onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const {
          data: { categories },
        } = await categoriesApi.fetch();
        setCategories(categories);
      } catch (error) {
        logger.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCategoryAdded = newCategory => {
    setCategories([...categories, newCategory]);
  };

  if (loading) {
    return <Spinner />;
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full w-72 flex-col border-r bg-gray-100 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button icon={Plus} style="icon" onClick={handleAddCategory} />
      </div>
      <div className="mt-4">
        <Input
          placeholder="Search categories"
          prefix={<Search size={16} />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {filteredCategories.map(category => (
          <li
            className="cursor-pointer rounded bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-200"
            key={category.id}
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
          </li>
        ))}
      </ul>
      <AddCategory
        isOpen={isModalOpen}
        onCategoryAdded={handleCategoryAdded}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CategorySidebar;
