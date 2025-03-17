import React, { useState, useEffect } from "react";

import { Down } from "@bigbinary/neeto-icons";
import {
  ActionDropdown,
  Checkbox,
  Spinner,
  Typography,
} from "@bigbinary/neetoui";

import postsApi from "apis/posts";

import BlogList from "./BlogList";

import PageLayout from "../../commons/PageLayout";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState({
    title: true,
    categories: true,
    lastPublishedAt: true,
    status: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleColumn = column => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetch({});
      logger.log(posts);
      setPosts(posts);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async id => {
    try {
      await postsApi.update(id, { status: "published" });
      setPosts(prev =>
        prev.map(post =>
          post.slug === id
            ? {
                ...post,
                status: "Published",
                lastPublishedAt: new Date().toISOString(),
              }
            : post
        )
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const handleUnpublish = async id => {
    logger.log("Unpublish");
    try {
      await postsApi.update(id, { status: "draft" });
      setPosts(prev =>
        prev.map(post =>
          post.slug === id ? { ...post, status: "Draft" } : post
        )
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDelete = async slug => {
    try {
      await postsApi.destroy(slug);
      setPosts(prev => prev.filter(post => post.slug !== slug));
    } catch (error) {
      logger.error(error);
    }
  };

  const { Menu, MenuItem, Divider } = ActionDropdown;

  if (loading) return <Spinner />;

  return (
    <PageLayout>
      <div className="mb-6">
        <Typography style="h2">My blog posts</Typography>
        <div className="flex items-center">
          <Typography className="text-gray-500" style="body2">
            {posts.length} articles
          </Typography>
          <div className="flex flex-grow justify-end">
            <ActionDropdown
              buttonStyle="secondary"
              icon={Down}
              label="Column"
              position="bottom-end"
              strategy="fixed"
            >
              <Menu className="space-y-2 p-2">
                <MenuItem>
                  <Checkbox checked disabled label="Title" />
                </MenuItem>
                <Divider />
                <MenuItem>
                  <Checkbox
                    checked={selectedColumns.categories}
                    label="Category"
                    onChange={() => toggleColumn("categories")}
                  />
                </MenuItem>
                <Divider />
                <MenuItem>
                  <Checkbox
                    checked={selectedColumns.lastPublishedAt}
                    label="Last published at"
                    onChange={() => toggleColumn("lastPublishedAt")}
                  />
                </MenuItem>
                <Divider />
                <MenuItem>
                  <Checkbox
                    checked={selectedColumns.status}
                    label="Status"
                    onChange={() => toggleColumn("status")}
                  />
                </MenuItem>
              </Menu>
            </ActionDropdown>
          </div>
        </div>
      </div>
      <BlogList
        handleDelete={handleDelete}
        handlePublish={handlePublish}
        handleUnpublish={handleUnpublish}
        posts={posts}
        selectedColumns={selectedColumns}
      />
    </PageLayout>
  );
};

export default MyPosts;
