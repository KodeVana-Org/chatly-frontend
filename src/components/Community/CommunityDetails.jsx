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
    <div className="p-4 w-full md:w-2/3">
      <h2 className="text-2xl font-bold mb-4">{community.name}</h2>
      <p className="text-gray-600 mb-4">{community.description}</p>
      <div className="mb-4">
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
      <div>
        <h3 className="text-lg font-semibold mb-2">Posts</h3>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a post..."
            className="w-full p-2 border rounded mb-2"
          />

          {/*ADDED THIS */}
          <input
            type="file"
            accept="image/*" // Restrict to image files
            onChange={(e) => setImageFile(e.target.files[0])} // Set the selected file
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleCreatePost}
            disabled={loading} //added this
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Posting..." : "Post"}
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
