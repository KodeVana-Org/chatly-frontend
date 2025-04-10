import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllCommunities, createPost, getPostsByCommunityId } from "./api";
import { PaperPlaneTilt, Paperclip } from "@phosphor-icons/react";

export default function CommunityDetail() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(""); //changed this name
  const [loading, setLoading] = useState(false); //added this

  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      try {
        // Fetch communities
        const { data } = await getAllCommunities();
        const selected = data.communities.find((comm) => comm._id === id);
        if (selected) setCommunity(selected);

        // Fetch posts
        const postsData = await getPostsByCommunityId(id);
        console.log("Posts data:", postsData); // Debug log
        setPosts(postsData.data.posts || []); // Extract nested posts array
      } catch (error) {
        console.error("Failed to fetch community or posts:", error);
        setPosts([]); // Reset to empty array on error
      }
    };
    fetchCommunityAndPosts();
  }, [id]);

  const handleCreatePost = async () => {
    if (!content && !imageUrl)
      return alert("Post must have content or an image");
    setLoading(true);

    //NOTE:  added this
    try {
      // Create FormData to send multipart/form-data
      const formData = new FormData();
      formData.append("content", content);
      formData.append("communityId", id);
      if (imageFile) {
        formData.append("image", imageFile); // Append the image file
      }

      // Call the API with FormData
      const newPost = await createPost(formData, token);
      setPosts((prev) => [...prev, newPost]);
      setContent("");
      setImageFile(null); // Reset file input
      setLoading(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error.message || "Failed to create post");
      setLoading(false);
    }
  };

  if (!community) return <div className="p-4">Loading...</div>;
  console.log("community", community);

  return (
    <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark w-full">
      <div className="sticky flex items-center justify-between flex-row border-b border-stroke dark:border-strokedark px-6 py-4.5">
        <div className="w-full flex flex-col justify-center content-center items-center">
          <h2 className="text-2xl text-black dark:text-white font-bold">
            {community.name}
          </h2>
          <p className="text-gray-600">{community.description}</p>
        </div>
        {/*
        <div className="pl-7">
          <h3 className="text-lg font-semibold">
            Members ({community.members.length})
          </h3>
          <ul className="list-disc pl-5">
            {community.members.map((member) => (
              <li key={member._id} className="text-sm">
                {member._id === user._id ? "You" : member.name}
                {community.admins.some((admin) => admin._id === member._id) &&
                  " (Admin)"}
                {community.creator._id === member._id && " (Creator)"}
              </li>
            ))}
          </ul>
        </div>
          */}
      </div>
      <div className="max-h-full space-y-3.5 overflow-y-auto no-scrollbar px-6 py-7.5 grow">
        {posts.map((post) => (
          <div key={post._id} className="p-2 border-b overflow-y-scroll">
            <p className="text-lg font-medium text-black dark:text-white">
              {post.content}
            </p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" className="max-w-xs mt-2" />
            )}
            <span className="text-xs text-gray-500">
              Posted by {post.author.name} at{" "}
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between space-x-4.5">
          <div className="relative w-full">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreatePost(e);
              }}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a post..."
              className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
            />

            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-4">
              {/*ADDED THIS */}
              <div className="relative">
                {/* Hidden file input */}
                <span className="absolute right-7 top-0">
                  <Paperclip size={24} />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="opacity-0" // Hide the default input
                  id="imageUpload" // Add an ID to connect with the label
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleCreatePost}
            disabled={!content}
            className={`flex items-center justify-center h-13 w-13 rounded-md hover:bg-opacity-90 ${
              !content
                ? "bg-gray text-body dark:bg-boxdark-2 dark:text-body"
                : "bg-primary text-white"
            }`}
          >
            <PaperPlaneTilt size={24} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
