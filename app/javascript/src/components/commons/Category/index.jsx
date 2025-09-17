import React, { useEffect, useState } from "react";

import { Plus, Search } from "@bigbinary/neeto-icons";
import { Input, Button, Spinner, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import Logger from "js-logger";
import { includes, without, append } from "ramda";
import { useTranslation } from "react-i18next";

import categoriesApi from "../../../apis/categories";

const Sidebar = ({ isCategorySidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleSelectedCategory = ({ name }) => {
    setSelectedCategories(prevSelected =>
      includes(name, prevSelected)
        ? without([name], prevSelected)
        : append(name, prevSelected)
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
        <Button icon={Plus} style="icon" onClick={() => {}} />
      </div>
      <div className="mt-4">
        <Input
          placeholder={t("categorySidebar.searchInput.placeholder")}
          prefix={<Search size={16} />}
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <Input
          readOnly
          placeholder={t("categorySidebar.selectedCategories.placeholder")}
          value={selectedCategories.join(", ")}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {filteredCategories.map(category => (
          <li
            key={category.id}
            className={`cursor-pointer rounded p-2 text-gray-700 shadow-sm hover:shadow-lg ${
              selectedCategories?.includes(category.name)
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
    </div>
  );
};

export default Sidebar;
