import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllCommunities, createPost, getPostsByCommunityId } from "./api";
import { PaperPlaneTilt, Paperclip } from "@phosphor-icons/react";
import { Link } from "react-router-dom"

//NOTE: put this in the backend socketHandler.js
// socket.on("joinCommunity", (communityId) => {
//     socket.join(communityId); // Join room for this community
// });
//
// socket.on("newPost", (post) => {
//     io.to(post.communityId).emit("postAdded", post); // Broadcast to community
// });

export default function CommunityDetail() {
    const { token, socket, socketId } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.user);
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const postsContainerRef = useRef(null);

    useEffect(() => {
        const fetchCommunityAndPosts = async () => {
            try {
                const { data } = await getAllCommunities();
                const selected = data.communities.find((comm) => comm._id === id);
                if (selected) setCommunity(selected);

                const postsData = await getPostsByCommunityId(id);
                setPosts(postsData.data.posts || []);
            } catch (error) {
                console.error("Failed to fetch community or posts:", error);
                setPosts([]);
            }
        };

        // Connect to WebSocket and join community room
        socket.emit("joinCommunity", id);

        // Listen for new posts
        socket.on("postAdded", (newPost) => {
            setPosts((prev) => {
                // Avoid duplicates
                if (prev.some((p) => p._id === newPost._id)) return prev;
                return [newPost, ...prev];
            });
            // Scroll to top only if it's the current user's post
            if (
                newPost.author.name === (user.name || "You") &&
                postsContainerRef.current
            ) {
                postsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        fetchCommunityAndPosts();

        // Cleanup on unmount
        return () => {
            socket.off("postAdded");
            socket.disconnect();
        };
    }, [id, user.name]);

    const handleCreatePost = async () => {
        if (!content && !imageFile) {
            return alert("Post must have content or an image");
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("communityId", id);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await createPost(formData, token);
            const postData = response.data || response;

            const newPost = {
                _id: postData._id || Date.now().toString(),
                content: content,
                author: { name: user.name || "You" },
                createdAt: new Date().toISOString(),
                imageUrl: postData.imageUrl || null,
                communityId: id, // Include for WebSocket
            };

            // Emit to WebSocket server
            socket.emit("newPost", newPost);

            // Local update (for current user)
            setPosts((prev) => [newPost, ...prev]);
            setContent("");
            setImageFile(null);
            document.getElementById("imageUpload").value = null;

            // Scroll to top for current user
            if (postsContainerRef.current) {
                postsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }

            // Optional: Re-fetch to sync (can remove with WebSocket)
            try {
                const postsData = await getPostsByCommunityId(id);
                setPosts(postsData.data.posts || []);
            } catch (fetchError) {
                console.error("Failed to re-fetch posts:", fetchError);
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("you are not member");
        } finally {
            setLoading(false);
        }
    };

    if (!community) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-800 dark:bg-gray-900">
                <div className="text-xl text-gray-400 dark:text-gray-500 animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col w-full bg-gray-800 dark:bg-gray-900">
            {/* Header Section */}
            <div className="sticky top-0 z-20 bg-gray-700 dark:bg-gray-800 border-b border-gray-600 dark:border-gray-700 px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <Link to='/dashboard/network'>Back</Link>
                    <h2 className="text-3xl font-bold text-gray-100 dark:text-gray-200 tracking-tight">
                        {community.name}
                    </h2>
                    <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm leading-relaxed max-w-md">
                        {community.description}
                    </p>
                </div>
            </div>

            {/* Posts Section (Scrollable) */}
            <div
                ref={postsContainerRef}
                className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 overflow-y-auto h-[calc(100vh-240px)]"
            >
                {posts.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-gray-500 italic text-lg py-10">
                        No posts yet. Be the first to share something!
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-gray-700 dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-600 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mb-6"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200">
                                        {post.author?.name || "Unknown User"}
                                    </p>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {post.content ? (
                                    <p className="text-gray-200 dark:text-gray-300 leading-relaxed mb-4">
                                        {post.content}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 dark:text-gray-500 italic">
                                        No text content
                                    </p>
                                )}
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="w-full max-w-md rounded-lg mt-2 object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Post Input (Sticky Bottom) */}
            <div className="sticky bottom-0 z-10 bg-gray-700 dark:bg-gray-800 border-t border-gray-600 dark:border-gray-700 px-6 py-4 shadow-md">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) handleCreatePost();
                                }}
                                placeholder="What's on your mind?"
                                className="w-full p-4 pr-16 rounded-lg border border-gray-500 dark:border-gray-600 bg-gray-600 dark:bg-gray-700 text-gray-100 dark:text-gray-200 text-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200"
                                disabled={loading}
                            />
                            <label
                                htmlFor="imageUpload"
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-teal-400 dark:hover:text-teal-400 transition-colors duration-200"
                            >
                                <Paperclip size={28} />
                            </label>
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                        <button
                            onClick={handleCreatePost}
                            disabled={loading || (!content && !imageFile)}
                            className={`flex items-center justify-center h-14 w-14 rounded-full shadow-sm transition-all duration-200 ${loading || (!content && !imageFile)
                                ? "bg-gray-500 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-teal-500 text-white hover:bg-teal-600"
                                }`}
                        >
                            <PaperPlaneTilt size={28} weight="bold" />
                        </button>
                    </div>
                    {imageFile && (
                        <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            Selected: {imageFile.name}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
