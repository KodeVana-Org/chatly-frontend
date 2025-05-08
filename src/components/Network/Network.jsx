import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createProfile,
  joinProfile,
  leaveProfile,
  getAllCommunities,
} from "./api";

export default function ProfileList() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const [profiles, setProfiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [commId, setCommId] = useState("");
  const [joinForm, setJoinForm] = useState({
    reason: "",
    location: "",
    message: "",
    phoneNumber: "",
    gender: "",
    communityId: null,
  });

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const { data } = await getAllCommunities(token);
      setProfiles(data.communities || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
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
      setShowPopup(false); // Close popup
      alert(error.message || "Failed to create profile");
    }
  };

  const handleJoinButton = (communityId) => {
    setShowJoinForm(true);
    setCommId(communityId);
  };

  // Join profile
  const handleJoin = async () => {
    if (
      joinForm.reason == "" ||
      joinForm.location == "" ||
      joinForm.message == "" ||
      joinForm.phoneNumber == "" ||
      joinForm.gender == ""
    ) {
      return alert("Filling all details is required!");
    }
    try {
      const formData = {
        reason: joinForm.reason,
        location: joinForm.location,
        message: joinForm.message,
        phoneNumber: joinForm.phoneNumber,
        gender: joinForm.gender,
      };

      // TODO: fix this navigation
      navigate(`/dashboard/network/${commId}`);

      const updatedCommunity = await joinProfile(communityId, formData, token);
      console.log("Joined network:", updatedCommunity.data.community);
      await fetchProfiles();
      setShowJoinForm(false);
      setJoinForm({
        reason: "",
        location: "",
        message: "",
        phoneNumber: "",
        gender: "",
        communityId: null,
      });
    } catch (error) {
      console.error("Failed to join prifile:", error);
      setShowJoinForm(false);
      alert(error.message || "Failed to join profile");
    }
  };

  // Leave profile
  const handleLeave = async (communityId) => {
    try {
      const profile = profiles.find((c) => c._id === communityId);

      if (!profile) {
        alert("Profile not found");
        return;
      }

      const isAdmin = profile.admins.some((admin) => {
        const adminId = admin._id || admin;
        return adminId.toString() === user._id.toString();
      });

      if (isAdmin) {
        alert("❗ Admin cannot leave profile.");
        return;
      }

      const updatedCommunity = await leaveProfile(communityId, token);
      await fetchProfiles();
    } catch (error) {
      console.error("Failed to leave profile:", error);
      alert(error.message || "Failed to leave profile");
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-7 items-center">
      <button
        onClick={() => setShowPopup(true)}
        className="mb-12 px-3 py-2 bg-primary text-lg text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Create Service Profile
      </button>
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

      {/* Join Form */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col gap-2 bg-white dark:bg-boxdark-2 p-7 rounded-md shadow-lg">
            <input
              type="text"
              value={joinForm.reason}
              onChange={(e) =>
                setJoinForm({ ...joinForm, reason: e.target.value })
              }
              placeholder="Reason for joining"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="text"
              value={joinForm.location}
              onChange={(e) =>
                setJoinForm({ ...joinForm, location: e.target.value })
              }
              placeholder="Location"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="text"
              value={joinForm.message}
              onChange={(e) =>
                setJoinForm({ ...joinForm, message: e.target.value })
              }
              placeholder="Message"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="number"
              value={joinForm.phoneNumber}
              onChange={(e) =>
                setJoinForm({
                  ...joinForm,
                  phoneNumber: e.target.value,
                })
              }
              placeholder="Phone Number"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="text"
              value={joinForm.gender}
              onChange={(e) =>
                setJoinForm({ ...joinForm, gender: e.target.value })
              }
              placeholder="Gender"
              className="px-2 py-1 border rounded-md"
            />
            <button
              onClick={() => handleJoin()}
              className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Submit
            </button>
            <button
              onClick={() => setShowJoinForm(false)}
              className="p-1 text-white bg-rose-500 rounded-md hover:bg-rose-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile List */}
      <h2 className="text-xl font-bold mb-4">Profiles</h2>
      <div className="flex flex-wrap gap-7">
        {profiles.length === 0 ? (
          <p>No profiles available</p>
        ) : (
          profiles.map((comm) => {
            const isMember =
              user &&
              comm.members &&
              comm.members.some((m) => {
                const memberId =
                  typeof m.user === "object" ? m.user._id : m.user;
                return memberId?.toString() === user._id?.toString();
              });

            console.log(`Community ${comm.name} members:`, comm.members); // Debug log
            return (
              <div
                key={comm._id}
                className="h-40 w-fit px-7 py-5 bg-gray-100 rounded flex gap-7 justify-between items-center border"
              >
                <Link to={`/dashboard/network/${comm._id}`} className="flex-1">
                  <span className="font-medium">{comm.name}</span>
                  <p className="text-sm text-gray-600">{comm.description}</p>
                </Link>
                {isMember ? (
                  <button
                    onClick={() => handleLeave(comm._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinButton(comm._id)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
