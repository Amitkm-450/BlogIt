// import React, { useState } from "react";

// import { UpArrow, DownArrow } from "@bigbinary/neeto-icons";
// import { Button, Tag, Typography } from "@bigbinary/neetoui";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// const Card = ({
//   post: { title, slug, created_at, author_name, categories, net_votes },
// }) => {
//   const [voteCounts, setVoteCounts] = useState(net_votes);
//   const [votingStatus, setVotingStatus] = useState({
//     upvote: false,
//     downvote: false,
//   });
//   const history = useHistory();

//   const handleClick = () => {
//     history.push(`/posts/${slug}/show`);
//   };

//   const handleUpVote = () => {
//     if (!votingStatus.upvote) {
//       if (votingStatus.downvote) setVoteCounts(prev => prev + 2);
//       else setVoteCounts(prev => prev + 1);
//       setVotingStatus({ downvote: false, upvote: true });
//     }
//   };

//   const handleDownVote = () => {
//     if (!votingStatus.downvote) {
//       if (votingStatus.upvote) setVoteCounts(prev => prev - 2);
//       else setVoteCounts(prev => prev - 1);
//       setVotingStatus({ upvote: false, downvote: true });
//     }
//   };

//   const createdDate = new Date(created_at).toDateString();
//   const upArrowClass = `text-gray-600 ${voteCounts > 0 && "text-green-600"}`;
//   const downArrowClass = `text-gray-600 ${voteCounts < 0 && "text-red-700"}`;

//   return (
//     <div className="flex justify-between border-b p-4">
//       <div className="flex flex-col gap-x-1">
//         <Typography style="h3" weight="semibold" onClick={handleClick}>
//           {title}
//         </Typography>
//         <div className="flex items-center justify-start gap-4">
//           {categories.map(category => (
//             <Tag key={category.id} label={category.name} />
//           ))}
//         </div>
//         <Typography className="mt-1 text-gray-600">{author_name}</Typography>
//         <Typography className="text-sm text-gray-400">{createdDate}</Typography>
//       </div>
//       <div className="mr-2 flex flex-col items-center  p-4">
//         <Button
//           className="font-bold"
//           icon={() => <UpArrow className={upArrowClass} />}
//           style="link"
//           onClick={handleUpVote}
//         />
//         <Typography>{voteCounts}</Typography>
//         <Button
//           className="font-bold"
//           icon={() => <DownArrow className={downArrowClass} />}
//           style="link"
//           onClick={handleDownVote}
//         />
//       </div>
//     </div>
//   );
// };

// export default Card;

import React, { useEffect, useState } from "react";

import { UpArrow, DownArrow } from "@bigbinary/neeto-icons";
import { Button, Tag, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "../../apis/posts";
import { votesApi } from "../../apis/votes";

const Card = ({
  post: {
    title,
    slug,
    created_at,
    author_name,
    categories,
    net_votes,
    id,
    is_bloggable,
  },
}) => {
  const [voteCounts, setVoteCounts] = useState(net_votes);
  const [votingStatus, setVotingStatus] = useState({
    upvote: false,
    downvote: false,
  });
  const history = useHistory();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsApi.show(slug);
        const { user_vote } = response.data;
        setVoteCounts(net_votes);
        setVotingStatus({
          upvote: user_vote === "upvote",
          downvote: user_vote === "downvote",
        });
      } catch (error) {
        logger.error("Error fetching post data:", error);
      }
    };

    fetchPost();
  }, []);

  const handleClick = () => {
    history.push(`/posts/${slug}/show`);
  };

  const handleVote = async voteType => {
    try {
      const response = await votesApi.create(id, voteType);
      const { net_votes, user_vote } = response.data;

      setVoteCounts(net_votes);
      setVotingStatus({
        upvote: user_vote === "upvote",
        downvote: user_vote === "downvote",
      });
    } catch (error) {
      logger.error("Error voting:", error);
    }
  };

  const createdDate = new Date(created_at).toDateString();
  const upArrowClass = `text-gray-600 ${
    votingStatus.upvote && "text-green-600"
  }`;

  const downArrowClass = `text-gray-600 ${
    votingStatus.downvote && "text-red-700"
  }`;

  return (
    <div className="flex justify-between border-b p-4">
      <div className="flex flex-col gap-y-1">
        <div className="flex gap-x-2">
          <Typography style="h3" weight="semibold" onClick={handleClick}>
            {title}
          </Typography>
          {is_bloggable && (
            <Tag label="Blog it" style="success" type="outline" />
          )}
        </div>
        <div className="flex items-center justify-start gap-4">
          {categories.map(category => (
            <Tag key={category.id} label={category.name} style="success" />
          ))}
        </div>
        <Typography className="mt-1 text-gray-600">{author_name}</Typography>
        <Typography className="text-sm text-gray-400">{createdDate}</Typography>
      </div>
      <div className="mr-2 flex flex-col items-center p-4">
        <Button
          className="font-bold"
          icon={() => <UpArrow className={upArrowClass} />}
          style="link"
          onClick={() => handleVote("upvote")}
        />
        <Typography>{voteCounts}</Typography>
        <Button
          className="font-bold"
          icon={() => <DownArrow className={downArrowClass} />}
          style="link"
          onClick={() => handleVote("downvote")}
        />
      </div>
    </div>
  );
};

export default Card;
