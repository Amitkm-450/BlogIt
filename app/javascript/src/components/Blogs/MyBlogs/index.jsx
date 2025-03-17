import React, { useState, useEffect } from "react";

import { Spinner, Typography, Toastr } from "@bigbinary/neetoui";

import postsApi from "apis/posts";

import BlogList from "./BlogList";

import PageLayout from "../../commons/PageLayout";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

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
      Toastr.success("Post published successfully");
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
      Toastr.success("Post unpublished successfully");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDelete = async slug => {
    try {
      await postsApi.destroy(slug);
      setPosts(prev => prev.filter(post => post.slug !== slug));
      Toastr.success("Post deleted successfully");
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <PageLayout>
      <div className="mb-6">
        <Typography style="h2">My blog posts</Typography>
        <Typography className="text-gray-500" style="body2">
          {posts.length} articles
        </Typography>
      </div>
      <BlogList
        handleDelete={handleDelete}
        handlePublish={handlePublish}
        handleUnpublish={handleUnpublish}
        posts={posts}
      />
    </PageLayout>
  );
};

export default MyPosts;
