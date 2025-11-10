import React, { useState } from "react";

import { Plus, Search } from "@bigbinary/neeto-icons";
import { Input, Button, Spinner, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useFetchCategories } from "hooks/reactQuery/useCategoriesApi";
import useQueryParams from "hooks/useQueryParams";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import routes from "routes";
import { buildUrl } from "utils/url";

import AddCategoryModel from "./AddCategoryModal";

const Sidebar = ({ isCategorySidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: { categories = [] } = {}, isLoading } = useFetchCategories();

  const { categories: queryCategories = "" } = useQueryParams();
  const selectedCategories = isEmpty(queryCategories)
    ? []
    : queryCategories.split(",");

  const { t } = useTranslation();

  const history = useHistory();

  const handleSelectedCategory = ({ name }) => {
    const isAlreadySelected = selectedCategories.includes(name);

    const newSelectedCategories = isAlreadySelected
      ? selectedCategories.filter(
          selectedCategoryName => selectedCategoryName !== name
        )
      : [...selectedCategories, name];

    const url = buildUrl(routes.posts.root, {
      categories: isEmpty(newSelectedCategories)
        ? undefined
        : newSelectedCategories.join(","),
    });
    history.replace(url);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
        {filteredCategories.map(({ id, name }) => (
          <li
            key={id}
            className={`cursor-pointer rounded p-2 text-gray-700 shadow-sm hover:shadow-lg ${
              selectedCategories.includes(name)
                ? "bg-gray-400 text-white"
                : "bg-white"
            }`}
            onClick={() => {
              handleSelectedCategory({ name });
            }}
          >
            {name}
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
