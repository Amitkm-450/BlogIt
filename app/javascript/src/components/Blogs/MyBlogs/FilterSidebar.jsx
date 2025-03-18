import React, { useEffect, useState } from "react";

import {
  Pane,
  Input,
  Select,
  Button,
  Typography,
  Spinner,
} from "@bigbinary/neetoui";

import categoriesApi from "../../../apis/categories";

const FilterSidebar = ({ isOpen, onClose, handleFilterApplied }) => {
  const [filters, setFilters] = useState({
    title: "",
    selectedCategories: [],
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const {
          data: { categories },
        } = await categoriesApi.fetch();

        setCategories(
          categories.map(category => ({
            label: category.name,
            value: category.id,
          }))
        );
      } catch (error) {
        logger.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (key === "status") {
          return value?.value === "draft" || value?.value === "published";
        }

        return Array.isArray(value) ? value.length > 0 : value.trim() !== "";
      })
    );
    handleFilterApplied(validFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetValues = { title: "", selectedCategories: [], status: "" };
    setFilters(resetValues);
  };

  return (
    <Pane className="h-full" isOpen={isOpen} onClose={onClose}>
      <Pane.Body className="flex flex-col gap-y-4 p-6">
        <Typography style="h2">Filters</Typography>
        <div>
          <Input
            className="mb-4"
            label="Title"
            placeholder="Search by title"
            value={filters.title}
            onChange={e => handleFilterChange("title", e.target.value)}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <Select
              isMulti
              className="mb-4"
              label="Category"
              options={categories}
              value={filters.selectedCategories}
              onChange={selected =>
                handleFilterChange("selectedCategories", selected)
              }
            />
          </div>
        )}
        <div>
          <Select
            className="mb-4"
            label="Status"
            value={filters.status}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
            onChange={selected => handleFilterChange("status", selected)}
          />
        </div>
      </Pane.Body>
      <Pane.Footer className="flex gap-3 px-6 py-4">
        <Button
          className="bg-black text-white"
          label="Done"
          onClick={handleApplyFilters}
        />
        <Button
          label="Clear Filters"
          style="secondary"
          onClick={resetFilters}
        />
      </Pane.Footer>
    </Pane>
  );
};

export default FilterSidebar;
