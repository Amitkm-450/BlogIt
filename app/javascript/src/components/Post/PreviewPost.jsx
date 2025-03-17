import React from "react";

import { Typography, Button, Tag, Avatar } from "@bigbinary/neetoui";
import { useHistory, useLocation } from "react-router-dom";

import PageLayout from "../commons/PageLayout";

const PreviewPost = () => {
  const history = useHistory();
  const location = useLocation();
  const { title, description, selectedCategories } = location.state || {};

  // Redirect if no data is passed (prevents direct access)
  if (!title && !description) {
    history.replace("/");

    return null;
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl p-6">
        <div className="flex space-x-2">
          {selectedCategories?.map(({ value, label }) => (
            <Tag
              className="bg-gray-100 text-gray-700"
              key={value}
              label={label}
            />
          ))}
        </div>
        {/* Title */}
        <div className="mt-4 flex items-center justify-between">
          <Typography className="font-bold" style="h1">
            {title}
          </Typography>
        </div>
        {/* Placeholder for Author */}
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <Avatar size="large" />
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              User Name
            </Typography>
            <Typography style="body2">{new Date().toDateString()}</Typography>
          </div>
        </div>
        {/* Description */}
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {description}
        </Typography>
        {/* Back to Edit Button */}
        <div className="mt-6">
          <Button
            label="Back to Edit"
            style="secondary"
            onClick={() => history.goBack()}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default PreviewPost;
