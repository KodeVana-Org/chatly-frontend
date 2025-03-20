import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getAllCommunities,
} from "./api";

export default function CommunityList() {
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      const { data } = await getAllCommunities(token);
      console.log("Fetched communities:", data.communities);
      console.log("User ID from Redux:", user?._id);
      setCommunities(data.communities || []);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      alert("Could not load communities");
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [token]);

  // Create community
  const handleCreate = async () => {
    if (!name || !description) {
      return alert("Name and description are required");
    }
    try {
      const newCommunity = await createCommunity(name, description, token);
      console.log("Created community:", newCommunity.data.community);
      await fetchCommunities(); // Refetch
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create community:", error);
      alert(error.message || "Failed to create community");
    }
  };

  // Join community
  const handleJoin = async (communityId) => {
    try {
      const updatedCommunity = await joinCommunity(communityId, token);
      console.log("Joined community:", updatedCommunity.data.community);
      await fetchCommunities(); // Refetch
    } catch (error) {
      console.error("Failed to join community:", error);
      alert(error.message || "Failed to join community");
    }
  };

  // Leave community
  const handleLeave = async (communityId) => {
    try {
      const updatedCommunity = await leaveCommunity(communityId, token);
      console.log("Left community:", updatedCommunity.data.community);
      await fetchCommunities(); // Refetch
    } catch (error) {
      console.error("Failed to leave community:", error);
      alert(error.message || "Failed to leave community");
    }
  };

  return (
    <div className="p-4 w-full md:w-1/3 border-r border-gray-200">
      <h2 className="text-xl font-bold mb-4">Communities</h2>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Community Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreate}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Community
        </button>
      </div>
      <ul className="space-y-2">
        {communities.length === 0 ? (
          <li>No communities available</li>
        ) : (
          communities.map((comm) => {
            const isMember =
              user &&
              comm.members &&
              comm.members.some(
                (member) => member._id.toString() === user._id?.toString(),
              );
            console.log(
              `Community: ${comm.name}, User ID: ${user?._id}, Members:`,
              comm.members,
              "Is Member:",
              isMember,
            );
            return (
              <li
                key={comm._id}
                className="p-2 bg-gray-100 rounded flex justify-between items-center"
              >
                <Link
                  to={`/dashboard/community/${comm._id}`}
                  className="flex-1"
                >
                  <span className="font-medium">{comm.name}</span>
                  <p className="text-sm text-gray-600">{comm.description}</p>
                </Link>
                {isMember ? (
                  <button
                    onClick={() => handleLeave(comm._id)}
                    className="ml-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(comm._id)}
                    className="ml-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Join
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
