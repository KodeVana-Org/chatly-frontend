import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    createProfile,
    joinProfile,
    leaveProfile,
    getAllCommunities,
} from "./api";

export default function ProfileList() {
    const { user } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    const [profiles, setProfiles] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [selectedCommunityId, setSelectedCommunityId] = useState(null); // Track selected community
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [joinForm, setJoinForm] = useState({
        reason: "",
        location: "",
        message: "",
        phoneNumber: "",
        gender: "",
    });

    // Fetch all profiles
    const fetchProfiles = async () => {
        try {
            const { data } = await getAllCommunities(token);
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
            await createProfile(name, description, token);
            await fetchProfiles();
            setName("");
            setDescription("");
            setShowPopup(false);
        } catch (error) {
            console.error("Error creating profile:", error);
            setShowPopup(false);
            alert(error.message || "Failed to create profile");
        }
    };

    // Join profile
    const handleJoin = async () => {
        if (
            !joinForm.reason ||
            !joinForm.location ||
            !joinForm.message ||
            !joinForm.phoneNumber ||
            !joinForm.gender ||
            !selectedCommunityId
        ) {
            return alert("All fields are required!");
        }
        try {
            const formData = { ...joinForm };
            await joinProfile(selectedCommunityId, formData, token);
            await fetchProfiles();
            setShowJoinForm(false);
            setJoinForm({
                reason: "",
                location: "",
                message: "",
                phoneNumber: "",
                gender: "",
            });
            setSelectedCommunityId(null);
        } catch (error) {
            console.error("Failed to join profile:", error);
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
            await leaveProfile(communityId, token);
            await fetchProfiles();
        } catch (error) {
            console.error("Failed to leave profile:", error);
            alert(error.message || "Failed to leave profile");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col p-8 items-center bg-gray-100 dark:bg-gray-900">
            <button
                onClick={() => setShowPopup(true)}
                className="mb-12 px-6 py-3 bg-blue-600 text-lg text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
                Create Service Profile
            </button>

            {/* Popup for Profile Creation */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                            Create Profile Forum
                        </h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Profile Name"
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Service Details"
                            className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Form */}
            {showJoinForm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full flex flex-col gap-4">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            Join Profile
                        </h3>
                        <input
                            type="text"
                            value={joinForm.reason}
                            onChange={(e) =>
                                setJoinForm({ ...joinForm, reason: e.target.value })
                            }
                            placeholder="Reason for joining"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            value={joinForm.location}
                            onChange={(e) =>
                                setJoinForm({ ...joinForm, location: e.target.value })
                            }
                            placeholder="Location"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            value={joinForm.message}
                            onChange={(e) =>
                                setJoinForm({ ...joinForm, message: e.target.value })
                            }
                            placeholder="Message"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="tel"
                            value={joinForm.phoneNumber}
                            onChange={(e) =>
                                setJoinForm({ ...joinForm, phoneNumber: e.target.value })
                            }
                            placeholder="Phone Number"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            value={joinForm.gender}
                            onChange={(e) =>
                                setJoinForm({ ...joinForm, gender: e.target.value })
                            }
                            placeholder="Gender"
                            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleJoin}
                                className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setShowJoinForm(false);
                                    setSelectedCommunityId(null);
                                }}
                                className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile List */}
            <h2 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 tracking-tight">
                🌟 Profiles
            </h2>
            <div className="flex flex-wrap gap-10 w-full max-w-7xl">
                {profiles.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic text-xl w-full text-center">
                        No profiles available
                    </p>
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

                        return (
                            <div
                                key={comm._id}
                                className="w-full sm:w-[48%] lg:w-[38%] bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                style={{ minHeight: "180px" }}
                            >
                                <Link
                                    to={`/dashboard/network/${comm._id}`}
                                    className="block mb-3"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-wide">
                                        {comm.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                        {comm.description}
                                    </p>
                                </Link>
                                {isMember ? (
                                    <button
                                        onClick={() => handleLeave(comm._id)}
                                        className="px-6 py-2 text-sm font-medium bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Leave
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowJoinForm(true);
                                            setSelectedCommunityId(comm._id);
                                        }}
                                        className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
