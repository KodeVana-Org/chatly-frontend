import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createProfile,
  joinProfile,
  leaveProfile,
  getAllProfiles,
} from "./api";

export default function ProfileList() {
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const [profiles, setProfiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const { data } = await getAllProfiles(token);
      setProfiles(data.communities || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      alert("Could not load profiles");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [token]);

  // Create profile
  const handleCreate = async () => {
    if (!name || !description) {
      return alert("Name and description are required");
    }
    try {
      await createProfile(name, description, token); // Replace with createProfile
      await fetchProfiles(); // Refetch
      setName("");
      setDescription("");
      setShowPopup(false); // Close popup
    } catch (error) {
      console.error("Error creating profile:", error);
      alert(error.message || "Failed to create profile");
    }
  };

  // Join profile
  const handleJoin = async (profileId) => {
    try {
      await joinProfile(profileId, token); // Replace with joinProfile
      await fetchProfiles(); // Refetch
    } catch (error) {
      console.error("Error joining profile:", error);
      alert(error.message || "Failed to join profile");
    }
  };

  // Leave profile
  const handleLeave = async (profileId) => {
    try {
      await leaveProfile(profileId, token); // Replace with leaveProfile
      await fetchProfiles(); // Refetch
    } catch (error) {
      console.error("Error leaving profile:", error);
      alert(error.message || "Failed to leave profile");
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-5 p-5">
      {/* Create Profile Button */}
      <div className="w-full justify-center content-center">
        <button
          onClick={() => setShowPopup(true)}
          className="px-3 py-2 bg-primary text-lg text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Create Profile
        </button>
      </div>

      {/* Popup for Profile Creation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-boxdark-2 p-7 rounded-md shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Create Profile Forum</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Profile Name"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Service Details"
              className="w-full p-2 mb-10 border rounded"
            />
            <div className="flex justify-center gap-7">
              <button
                onClick={handleCreate}
                className="px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 py-2 text-white bg-rose-500 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile List */}
      <h2 className="text-xl font-bold mb-4">Profiles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {profiles.length === 0 ? (
          <p>No profiles available</p>
        ) : (
          profiles.map((profile) => {
            let isMember = false;
            try {
              // Debugging member and user IDs
              console.log("Profile members:", profile.members);
              console.log("Current user ID:", user?._id);

              if (
                user &&
                user._id &&
                profile.members &&
                Array.isArray(profile.members)
              ) {
                isMember = profile.members.some((member) => {
                  if (member && member._id) {
                    return member._id.toString() === user._id.toString();
                  }
                  console.warn("Member missing _id:", member);
                  return false;
                });
              } else {
                console.warn("Invalid user or members data:", {
                  user,
                  members: profile.members,
                });
              }
            } catch (error) {
              console.error("Error checking membership:", error);
              isMember = false; // Default to false to avoid breaking the UI
            }

            return (
              <Link
                to={`/dashboard/network/${profile._id}`}
                key={profile._id}
                className="w-60 h-50 flex flex-col gap-7 items-center content-center justify-center p-7 bg-gray dark:bg-boxdark-2 rounded-md hover:bg-gray-200 dark:hover:bg-strokedark border border-gray dark:border-graydark"
              >
                <div className="text-center">
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-sm">{profile.description}</p>
                </div>
                {isMember ? (
                  <button
                    onClick={() => handleLeave(profile._id)}
                    className="py-1 px-3 bg-rose-500 text-white rounded hover:bg-rose-600"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(profile._id)}
                    className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Join
                  </button>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
