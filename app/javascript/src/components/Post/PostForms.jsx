import React, { useEffect, useState } from "react";

import { Button, Input, Spinner, Textarea } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const history = useHistory();

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

  const categoriesOption = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await postsApi.create({ title, description, selectedCategories });
      setLoading(false);
      history.push("/");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
    setTitle("");
    setDescription("");
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    history.push("/");
  };

  const handleChange = selectedOptions => {
    setSelectedCategories(selectedOptions);
    logger.log(selectedCategories);
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h2 className="mb-4 text-2xl font-bold">New blog post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title*</label>
          <Input
            required
            placeholder="Enter title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none text-gray-800">
            Categories*
          </p>
          <div className="mb-1 mt-1 w-full">
            <Select
              isMulti
              menuPosition="fixed"
              options={categoriesOption}
              value={selectedCategories}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description*</label>
          <Textarea
            required
            placeholder="Enter description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="text-black"
            style="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button className="bg-black text-white" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
