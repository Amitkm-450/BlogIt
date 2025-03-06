import React, { useEffect, useState } from "react";

import { Spinner, Typography } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "../../apis/posts";

const Show = () => {
  const [post, setPost] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);
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

  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Typography style="h2">{post.title}</Typography>
      <Typography style="h5" weight="light">
        {post.description}
      </Typography>
    </div>
  );
};

export default Show;
