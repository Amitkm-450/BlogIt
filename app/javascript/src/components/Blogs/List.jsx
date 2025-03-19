import React, { useEffect, useState, useRef } from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Card from "./Card";

import authApi from "../../apis/auth";
import { resetAuthTokens } from "../../apis/axios";
import postsApi from "../../apis/posts";
import { getFromLocalStorage, setToLocalStorage } from "../../utils/storage";

const List = ({ selectedCategories }) => {
  logger.log(selectedCategories);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef();

  const history = useHistory();
  const userName = getFromLocalStorage("authUserName");

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch({ selectedCategories });
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };
  logger.log(posts);
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchPosts();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCategories]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <Typography>Loading..</Typography>
      </div>
    );
  }

  return (
    <div className="m-4 w-full p-4">
      <div className="flex items-center justify-between px-4">
        <Typography
          className="flex items-center justify-center"
          style="h1"
          weight="bold"
        >
          Blog posts
        </Typography>
        <div className="flex justify-between gap-4">
          <Button
            className="bg-black text-white"
            label="Add new blog post"
            size="medium"
            onClick={() => history.push("/posts/create")}
          />
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-x-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 focus:shadow-md"
              onClick={toggleMenu}
            >
              <span className="font-bold italic text-indigo-600">
                {userName}
              </span>
              <i className="ri-arrow-down-s-line" />
            </button>
            {isMenuVisible && (
              <div className="absolute right-0 mt-2 w-24 rounded-md border border-gray-300 bg-white py-2 shadow-lg">
                <button
                  className="block w-full rounded-md  text-sm text-gray-800 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default List;
