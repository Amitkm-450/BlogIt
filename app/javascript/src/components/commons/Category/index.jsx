import React, { useContext, useEffect, useState } from "react";

import { Plus, Search } from "@bigbinary/neeto-icons";
import { Input, Button, Spinner, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import Logger from "js-logger";
import { includes, without, append } from "ramda";
import { useTranslation } from "react-i18next";

import AddCategoryModel from "./AddCategoryModal";

import categoriesApi from "../../../apis/categories";
import CategoryContext from "../../../context/CategoryContext";

const Sidebar = ({ isCategorySidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedCategories, setSelectedCategories } =
    useContext(CategoryContext);

  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const categories = await categoriesApi.fetch();
        setCategories(categories);
      } catch (error) {
        Logger.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectedCategory = ({ id }) => {
    setSelectedCategories(prevSelected =>
      includes(id, prevSelected)
        ? without([id], prevSelected)
        : append(id, prevSelected)
    );
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className={classNames("h-full w-auto flex-col border-r p-4", {
          flex: isCategorySidebarOpen,
          hidden: !isCategorySidebarOpen,
        })}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={classNames("h-full w-auto flex-col border-r bg-gray-100 p-4", {
        flex: isCategorySidebarOpen,
        hidden: !isCategorySidebarOpen,
      })}
    >
      <div className="flex items-center justify-between border-b pb-2">
        <Typography className="text-lg font-semibold" style="h2">
          {t("categorySidebar.header")}
        </Typography>
        <Button
          icon={Plus}
          style="icon"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <div className="mt-4">
        <Input
          placeholder={t("categorySidebar.searchInput.placeholder")}
          prefix={<Search size={16} />}
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {filteredCategories.map(category => (
          <li
            key={category.id}
            className={`cursor-pointer rounded p-2 text-gray-700 shadow-sm hover:shadow-lg ${
              selectedCategories?.includes(category.id)
                ? "bg-green-400 text-white"
                : "bg-white"
            }`}
            onClick={() => {
              handleSelectedCategory(category);
            }}
          >
            {category.name}
          </li>
        ))}
      </ul>
      <AddCategoryModel
        {...{ isModalOpen }}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
