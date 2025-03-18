import React, { useState, useEffect } from "react";

import { Delete, Down, Filter } from "@bigbinary/neeto-icons";
import {
  ActionDropdown,
  Button,
  Checkbox,
  Dropdown,
  Spinner,
  Typography,
} from "@bigbinary/neetoui";

import postsApi from "apis/posts";

import BlogList from "./BlogList";
import FilterSidebar from "./FilterSidebar";

import PageLayout from "../../commons/PageLayout";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPaneOpen, setFilterPaneOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [bulkMode, setBulkMode] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    title: true,
    categories: true,
    lastPublishedAt: true,
    status: true,
    action: true,
  });

  useEffect(() => {
    fetchPosts(filters);
  }, [filters]);

  const handleFilterApplied = filters => {
    setFilters({
      ...filters,
      selectedCategories: filters.selectedCategories?.map(
        option => option.value
      ),
      postStatus: filters?.status?.value,
    });
  };

  const handleBulkStatusChange = async status => {
    try {
      await postsApi.bulkUpdateStatus(selectedRowKeys, status);

      setPosts(prev =>
        prev.map(post =>
          selectedRowKeys.includes(post.slug) && post.status !== status
            ? { ...post, status }
            : post
        )
      );
      setSelectedRowKeys([]);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await postsApi.bulkDelete(selectedRowKeys);
      setPosts(prev => prev.filter(post => !selectedRowKeys.includes(post.id)));
      setSelectedRowKeys([]);
    } catch (error) {
      logger.error(error);
    }
  };

  const toggleColumn = column => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const fetchPosts = async filters => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetch({ ...filters, self: true });
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
              }
            : post
        )
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const handleUnpublish = async id => {
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
        {selectedRowKeys.length > 0 ? (
          <div className="flex items-center gap-x-2">
            <Typography className="text-gray-500" style="body2">
              {selectedRowKeys.length} selected of {posts.length} articles
            </Typography>
            <Dropdown buttonStyle="secondary" icon={Down} label="Change Status">
              <Dropdown.Menu>
                <Dropdown.MenuItem>
                  <MenuItem.Button
                    onClick={() => handleBulkStatusChange("published")}
                  >
                    Publish
                  </MenuItem.Button>
                </Dropdown.MenuItem>
                <Dropdown.Divider />
                <Dropdown.MenuItem>
                  <MenuItem.Button
                    onClick={() => handleBulkStatusChange("draft")}
                  >
                    Draft
                  </MenuItem.Button>
                </Dropdown.MenuItem>
              </Dropdown.Menu>
            </Dropdown>
            <Button icon={Delete} style="danger" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Typography className="text-gray-500" style="body2">
              {posts.length} articles
            </Typography>
            <div className="flex flex-grow justify-end gap-x-2">
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
              <Button
                icon={Filter}
                style="secondary"
                onClick={() => {
                  setFilterPaneOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <BlogList
        handleDelete={handleDelete}
        handlePublish={handlePublish}
        handleUnpublish={handleUnpublish}
        posts={posts}
        selectedColumns={selectedColumns}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      <FilterSidebar
        handleFilterApplied={handleFilterApplied}
        isOpen={filterPaneOpen}
        onClose={() => setFilterPaneOpen(false)}
      />
    </PageLayout>
  );
};

export default MyPosts;
