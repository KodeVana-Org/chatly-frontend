import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllCommunities, createPost, getPostsByCommunityId } from "./api";

export default function CommunityDetail() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
    try {
      const newPost = await createPost(id, content, imageUrl, token);
      setPosts((prev) => [...prev, newPost]);
      setContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error.message);
    }
  };

  if (!community) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 w-full md:w-2/3">
      <h2 className="text-2xl font-bold mb-4">{community.name}</h2>
      <p className="text-gray-600 mb-4">{community.description}</p>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Members ({community.members.length})
        </h3>
        <ul className="list-disc pl-5">
          {community.members.map((memberId) => (
            <li key={memberId} className="text-sm">
              {memberId === user._id ? "You" : memberId}
              {community.admins.includes(memberId) && " (Admin)"}
              {community.creator === memberId && " (Creator)"}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Posts</h3>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a post..."
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleCreatePost}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post
          </button>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="p-2 border-b">
              <p>{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className="max-w-xs mt-2" />
              )}
              <span className="text-xs text-gray-500">
                Posted by {post.author.name} at{" "}
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
