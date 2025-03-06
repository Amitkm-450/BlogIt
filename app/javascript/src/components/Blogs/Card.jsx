import React from "react";

import { Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Card = ({ title, description, slug }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/posts/${slug}/show`);
  };

  return (
    <div className="border-b p-4">
      <Typography style="h3" weight="semibold" onClick={handleClick}>
        {title}
      </Typography>
      <Typography className="mt-1 text-gray-600">{description}</Typography>
    </div>
  );
};

export default Card;
