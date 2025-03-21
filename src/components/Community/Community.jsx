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

  //fetch all communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await getAllCommunities();
        setCommunities(data.communities || []);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    };
    fetchCommunities();
  }, []);

  // Create communities
  const handleCreate = async () => {
    if (!name || !description)
      return alert("Name and description are required");
    try {
      const newCommunity = await createCommunity(name, description, token);
      setCommunities((prev) => [...prev, newCommunity]);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create community:", error);
      alert(error.message);
    }
  };

  //Join communities
  const handleJoin = async (communityId) => {
    try {
      const updatedCommunity = await joinCommunity(communityId, token);
      setCommunities((prev) =>
        prev.map((comm) =>
          comm._id === communityId ? updatedCommunity.data.community : comm,
        ),
      );
    } catch (error) {
      console.error("Failed to join community:", error);
      alert(error.message);
    }
  };

  //Leave communities
  const handleLeave = async (communityId) => {
    try {
      const updatedCommunity = await leaveCommunity(communityId, token);
      setCommunities((prev) =>
        prev.map((comm) =>
          comm._id === communityId ? updatedCommunity.data.community : comm,
        ),
      );
    } catch (error) {
      console.error("Failed to leave community:", error);
      alert(error.message);
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="p-5 h-full items-center border-r border-stroke dark:border-strokedark">
        <h3 className="text-xl font-semibold mb-5">Create new community</h3>
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
            className="w-full p-2 bg-primary text-white rounded hover:bg-blue-600"
          >
            Create Community
          </button>
        </div>
      </div>
      <div className="w-full p-5">
        <h2 className="text-xl font-bold mb-4">Communities</h2>
        <ul className="space-y-2">
          {communities.map((comm) => (
            <li
              key={comm._id}
              className="flex cursor-pointer items-center rounded px-4 py-2 dark:hover:bg-strokedark bg-gray dark:bg-boxdark-2 hover:bg-gray-2 dark:hover:bg-boxdark-2/90"
            >
              <Link to={`/dashboard/community/${comm._id}`} className="flex-1">
                <span className="font-medium">{comm.name}</span>
                <p className="text-sm text-gray-600">{comm.description}</p>
              </Link>
              {comm.members.includes(user._id) ? (
                <button
                  onClick={() => handleLeave(comm._id)}
                  className="ml-2 py-1 px-2 bg-rose-500 text-white rounded hover:bg-rose-600"
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
          ))}
        </ul>
      </div>
    </div>
  );
}
