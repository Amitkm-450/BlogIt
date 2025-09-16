import React, { useEffect, useState } from "react";

import { Spinner, Typography } from "@bigbinary/neetoui";
import { useParams, useHistory } from "react-router-dom";

import postsApi from "../../apis/posts";
import { PageLayout } from "../commons";

const Show = () => {
  const [post, setPost] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      const { post } = await postsApi.show(slug);
      setPost(post);
    } catch (error) {
      logger.error(error);
      history.push("/");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [slug]);

  if (pageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl p-6">
        <div className="mt-4 flex items-center justify-between">
          <div>
            <Typography className="font-bold" style="h1">
              {post.title}
            </Typography>
          </div>
        </div>
        <Typography
          className="mt-4 leading-relaxed text-gray-800"
          style="body1"
        >
          {post.description}
        </Typography>
      </div>
    </PageLayout>
  );
};

export default Show;
