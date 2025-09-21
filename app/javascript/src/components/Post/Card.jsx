import React, { useEffect, useState } from "react";

import { DownArrow, UpArrow } from "@bigbinary/neeto-icons";
import { Button, Tag, Typography } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import votesApi from "apis/votes";
import classNames from "classnames";
import Logger from "js-logger";
import { useHistory } from "react-router-dom";
import { fromatDate } from "utils/date";

const Card = ({ id, title, user, created_at, slug, categories }) => {
  const [postVotesCount, setPostVotesCount] = useState(0);
  const [userVote, setUserVote] = useState(0);
  const [isBloggable, setIsBloggable] = useState(false);

  const creationDate = fromatDate(created_at);

  const history = useHistory();

  const handleVote = async type => {
    let value = type === "up" ? 1 : -1;

    if (userVote === value) value = 0;

    try {
      const { vote } = await votesApi.create(
        { post_id: id },
        { vote: { value } }
      );
      const { post } = await postsApi.show(slug);

      setIsBloggable(post.is_bloggable);
      setPostVotesCount(vote.net_votes);
      setUserVote(vote.user_vote);
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    const fetchPostVotesCount = async () => {
      try {
        const { vote } = await votesApi.fetch({
          post_id: id,
        });
        const { post } = await postsApi.show(slug);

        setIsBloggable(post.is_bloggable);
        setPostVotesCount(vote.net_votes);
        setUserVote(vote.user_vote);
      } catch (error) {
        Logger.error(error);
      }
    };

    fetchPostVotesCount();
  }, []);

  return (
    <div className="flex cursor-default justify-between border-b p-4">
      <div
        className="flex flex-col gap-y-1"
        onClick={() => history.push(`/posts/${slug}`)}
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex space-x-2">
            <Typography style="h3" weight="semibold">
              {title}
            </Typography>
            {isBloggable && <Tag label="Blog It" style="success" />}
          </div>
          <div className="flex items-center justify-start gap-4">
            {categories.map(category => (
              <Tag key={category.id} label={category.name} style="success" />
            ))}
          </div>
        </div>
        <Typography className="mt-1 text-gray-600">{user.name}</Typography>
        <Typography className="text-sm text-gray-400">
          {creationDate}
        </Typography>
      </div>
      <div className="flex flex-col items-center">
        <Button
          icon={UpArrow}
          style="text"
          className={classNames("font-extrabold text-green-900", {
            "bg-green-200": userVote === 1,
          })}
          tooltipProps={{
            content: "Up",
            position: "left",
          }}
          onClick={() => {
            handleVote("up");
          }}
        />
        <Typography style="body2" weight="bold">
          {postVotesCount}
        </Typography>
        <Button
          icon={DownArrow}
          style="text"
          className={classNames("font-bold text-red-900", {
            "bg-red-200": userVote === -1,
          })}
          tooltipProps={{
            content: "Down",
            position: "right",
          }}
          onClick={() => {
            handleVote("down");
          }}
        />
      </div>
    </div>
  );
};

export default Card;
