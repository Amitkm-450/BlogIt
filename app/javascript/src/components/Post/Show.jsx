import React, { useEffect, useState } from "react";

import { Avatar, Spinner, Tag, Typography } from "@bigbinary/neetoui";
import { useParams, useHistory } from "react-router-dom";

import postsApi from "../../apis/posts";
import { fromatDate } from "../../utils/date";
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
        <div className="flex space-x-2">
          {post.categories?.map(({ id, name }) => (
            <Tag className="bg-gray-100 text-gray-700" key={id} label={name} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <Typography className="font-bold" style="h1">
              {post.title}
            </Typography>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-gray-500">
          <div>
            <Avatar size="large" />
          </div>
          <div className="flex-col">
            <Typography className="font-bold text-black" style="body2">
              {post.user.name}
            </Typography>
            <Typography style="body2">{fromatDate(post.created_at)}</Typography>
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
