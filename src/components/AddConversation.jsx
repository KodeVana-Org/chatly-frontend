import React, { useEffect, useState } from "react";
import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { GetUsers, StartConversation } from "../redux/slices/chat";

export default function AddConversation({ open, handleClose }) {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]); // Array of selected user IDs
  const [groupName, setGroupName] = useState(""); // Group name input
  const { users } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  // Toggle user selection
  const handleToggleUser = (userId) => {
    setSelectedUsers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // Unmark if already selected
          : [...prev, userId], // Mark if not selected
    );
  };

  // Start 1:1 conversation
  const handleStartConversation = (userId) => {
    dispatch(
      StartConversation({
        members: [userId],
      }),
    );
    handleClose();
  };

  // Create group chat
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedUsers.length <= 1) {
      alert("Select more than one member for a group chat");
      return;
    }
    dispatch(
      StartConversation({
        group: true,
        groupName,
        members: selectedUsers,
      }),
    );
    setSelectedUsers([]);
    setGroupName("");
    handleClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        display: open ? "flex" : "none",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontWeight: "600", fontSize: "18px" }}>
            Start Conversation
          </span>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={handleCreateGroup}
              style={{
                fontWeight: "600",
                color: "#3b82f6",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Group
            </button>
            <button
              onClick={handleClose}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Enter group name (for group chat)"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        {/* User List */}
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => handleToggleUser(user._id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "5px",
                  borderRadius: "4px",
                  backgroundColor: isSelected ? "#e5e7eb" : "#fff",
                  cursor: "pointer",
                  border: isSelected ? "2px solid #3b82f6" : "1px solid #eee",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#d1d5db",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "18px",
                          textTransform: "uppercase",
                        }}
                      >
                        {user?.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: isSelected ? "600" : "400",
                      color: "#000",
                    }}
                  >
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling selection
                    handleStartConversation(user._id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                  }}
                >
                  <PaperPlaneTilt size={20} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
