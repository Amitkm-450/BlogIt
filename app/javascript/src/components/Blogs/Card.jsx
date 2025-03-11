import React from "react";

import { Tag, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Card = ({ post }) => {
  const history = useHistory();
  const { title, slug, created_at, author_name } = post;
  const handleClick = () => {
    history.push(`/posts/${slug}/show`);
  };

  const createdDate = new Date(created_at).toDateString();

  return (
    <div className="border-b p-4">
      <Typography style="h3" weight="semibold" onClick={handleClick}>
        {title}
      </Typography>
      <div className="flex items-center justify-start gap-4">
        {post.categories.map(category => (
          <Tag key={category.id} label={category.name} />
        ))}
      </div>
      <Typography className="mt-1 text-gray-600">{author_name}</Typography>
      <Typography className="text-sm text-gray-400">{createdDate}</Typography>
    </div>
  );
};

export default Card;
