import React, { useEffect, useState } from "react";

import { MenuHorizontal, ExternalLink } from "@bigbinary/neeto-icons";
import {
  Button,
  Input,
  Spinner,
  Textarea,
  Dropdown,
  Modal,
  Typography,
  Tooltip,
} from "@bigbinary/neetoui";
import { useParams, useHistory } from "react-router-dom";
import Select from "react-select";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import PageLayout from "../commons/PageLayout";

const EditPost = () => {
  const [title, setTitle] = useState(location.state?.title || "");
  const [description, setDescription] = useState(
    location.state?.description || ""
  );

  const [selectedCategories, setSelectedCategories] = useState(
    location.state?.selectedCategories || []
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postStatus, setPostStatus] = useState("");
  const { slug } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const {
          data: {
            post: { title, description, categories, status = "draft" },
          },
        } = await postsApi.show(slug);
        setTitle(title);
        setDescription(description);
        setSelectedCategories(
          categories.map(category => ({
            value: category.id,
            label: category.name,
          }))
        );
        setPostStatus(status);
      } catch (error) {
        logger.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await categoriesApi.fetch();
        setCategories(
          data.categories.map(category => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        logger.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
    fetchCategories();
  }, [slug]);

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await postsApi.destroy(slug);
      history.push("/posts");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await postsApi.update(slug, {
        title,
        description,
        selectedCategories,
        postStatus,
      });
      setLoading(false);
      history.push("/");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
    setTitle("");
    setDescription("");
    setCategories(null);
  };

  const handleCancel = () => history.push(`/posts/${slug}/show`);

  const handlePreview = () => {
    history.push({
      pathname: `/posts/${slug}/preview`,
      state: { title, description, selectedCategories },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">Edit blog post</h2>
          <div className="flex items-center space-x-2">
            <Tooltip content="Preview">
              <Button
                icon={() => <ExternalLink className="text-black" />}
                style="link"
                onClick={handlePreview}
              />
            </Tooltip>
            <Dropdown
              buttonStyle="secondary"
              className="bg-black"
              label={postStatus}
            >
              <li onClick={() => setPostStatus("draft")}>Save as Draft</li>
              <li onClick={() => setPostStatus("published")}>Publish</li>
            </Dropdown>
            <Dropdown buttonStyle="secondary" icon={MenuHorizontal}>
              <li
                className="text-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Post
              </li>
            </Dropdown>
          </div>
        </div>
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
          <div className="mb-4">
            <label className="block text-sm font-medium">Categories*</label>
            <Select
              isMulti
              menuPosition="fixed"
              options={categories}
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
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
            <Button label="Cancel" style="secondary" onClick={handleCancel} />
            <Button
              className="bg-black text-white"
              label="Submit"
              type="submit"
            />
          </div>
        </form>
      </div>
      <Modal
        className="p-4"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="mb-2">
          <Typography style="h2">Delete Post</Typography>
        </div>
        <div className="mb-4 space-y-2">
          <Typography lineHeight="normal" style="body2">
            Are you sure you want to delete this post? Once deleted, it cannot
            be recovered.
          </Typography>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            label="Cancel"
            style="tertiary"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <Button label="Delete" style="danger" onClick={handleDeletePost} />
        </div>
      </Modal>
    </PageLayout>
  );
};

export default EditPost;
