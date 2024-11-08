"use client";
import GlobalApi from "@/app/api/_services/GlobalApi";
import { useChildren } from "@/context/CreateContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

const PostComponent = ({ post }) => {
  const { selectedChildId, selectedAge } = useChildren();

  const [liked, setLiked] = useState(post.likedByUser); // Initially set based on the prop
  
  const handleLike = async (action) => {
    try {
      const response = await GlobalApi.KidsLikes({
        postId: post.postId,
        action,
        childId: selectedChildId
      });

      if (response && response.data) {
        setLiked(!liked); // Toggle like status
        toast.success("Successfully updated your like status.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to update like status.");
    }
  };

  return (
    <motion.div
      
      className="p-4 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-2">
        {post.childname && (
          <h2 className="text-lg font-semibold text-gray-800">
            {post.childname} has added{" "}
            {post.post_type === "image" ? "an image" : "a post"}
          </h2>
        )}

        <p className="text-gray-700">
          <Image
            className="rounded-lg"
            src={post.content}
            width={600}
            height={300}
            alt={post.caption || "Post Image"}
          />
        </p>

        <div className="flex gap-3 items-center">
          <button onClick={() => handleLike("like")} className="text-xl">
            {liked ? <FcLike /> : <FcLikePlaceholder />}
          </button>

          <Link href={`/communities/comments/${post.slug}`} className="text-xl">
            <FaComment />
          </Link>
        </div>

        {post.caption && (
          <p className="text-gray-500 italic">{post.caption}</p>
        )}

        <p className="text-xs text-gray-400">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default PostComponent;
