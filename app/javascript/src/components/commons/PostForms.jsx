import React, { useState } from "react";

import { Button, Input, Spinner, Textarea } from "@bigbinary/neetoui";

import postsApi from "../../apis/posts";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await postsApi.create({ title, description });
      setLoading(false);
      history.push("/");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
    setTitle("");
    setDescription("");
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
            type="button"
            variant="outline"
            onClick={() => {
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
