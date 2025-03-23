import React, { useEffect, useState } from "react";

import { Download, Edit } from "@bigbinary/neeto-icons";
import { Spinner, Typography, Button, Tag, Avatar } from "@bigbinary/neetoui";
import { useParams, useHistory } from "react-router-dom";

import DownloadReportModal from "./DownloadReportModal";

import postsApi from "../../apis/posts";
import { getFromLocalStorage } from "../../utils/storage";
import PageLayout from "../commons/PageLayout";

const Show = () => {
  const [post, setPost] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);
      logger.log(post);
      setPost(post);
      setPageLoading(false);
    } catch (error) {
      logger.error(error);
      history.push("/");
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  const handlePostEdit = () => {
    history.push(`/posts/${slug}/edit`);
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl p-6">
        <div className="flex space-x-2">
          {post.categories?.map(({ id, name }) => (
            <Tag className="bg-gray-100 text-gray-700" key={id} label={name} />
          ))}
        </div>
        {/* Title */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <Typography className="font-bold" style="h1">
              {post.title}
            </Typography>
            {post.status === "draft" && <Tag label="draft" style="danger" />}
          </div>
          <div className="flex justify-evenly">
            <Button
              icon={Download}
              size="medium"
              style="text"
              onClick={handleDownload}
            />
            {post.user.email === getFromLocalStorage("authEmail") && (
              <Button
                className="p-2 text-gray-500"
                icon={Edit}
                size="medium"
                style="text"
                onClick={handlePostEdit}
              />
            )}
          </div>
        </div>
        {/* Author and Date */}
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <div>
            <Avatar size="large" />
          </div>
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              {post.user.name}
            </Typography>
            <Typography style="body2">
              {new Date(post.created_at).toDateString()}
            </Typography>
          </div>
        </div>
        {/* Description */}
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {post.description}
        </Typography>
      </div>
      <DownloadReportModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </PageLayout>
  );
};

export default Show;
