import { Dot, Globe, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function UserInfo({
  user,
  group,
  handleToggleUserInfo,
  sendDirectMessage,
  handleSendMessage,
  currentConversation,
  setScheduledMessages,
  scheduledMessages,
}) {
  const { userId } = useSelector((state) => state.auth);

  // Scheduler state
  const [messageContent, setMessageContent] = useState("");
  const [sendAt, setSendAt] = useState("");

  // Handle scheduling a message
  const handleScheduleMessage = () => {
    if (!messageContent || !sendAt) {
      alert("Please enter a message and select a time.");
      return;
    }

    const now = new Date();
    const scheduledTime = new Date(sendAt);
    if (scheduledTime <= now) {
      alert("Please select a future time.");
      return;
    }

    const scheduledMessage = {
      id: Date.now().toString(), // Unique ID
      content: messageContent,
      sendAt: scheduledTime.toISOString(),
      conversationId: currentConversation,
    };

    setScheduledMessages((prev) => [...prev, scheduledMessage]);
    setMessageContent("");
    setSendAt("");
    alert("Message scheduled successfully!");
  };

  // Format date for display
  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString(); // e.g., "3/19/2025, 2:30:00 PM"
  };

  // Determine if it's a group chat (group exists and has participants)
  const isGroup =
    group &&
    Array.isArray(group?.participants) &&
    group?.participants.length > 2;
  // Check if the user is the group admin
  const isAdmin = isGroup && userId === group?.groupAdmin?._id;
  const participants = isGroup ? group?.participants : [];

  return (
    <>
      {/* Show this Below LG */}
      <div
        className={`lg:hidden fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-end bg-black/90 py-2`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "8px",
        }}
      >
        <div
          className="md:px-7.5 w-full max-w-142.5 bg-white dark:bg-boxdark md:py-4 px-4 py-6 min-h-screen"
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            maxWidth: "570px",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <UserProfile
            user={user}
            handleToggleUserInfo={handleToggleUserInfo}
          />
        </div>
      </div>

      {/* Show this Above LG */}
      <div
        className="lg:border-l hidden lg:flex flex-col h-full border-stroke dark:border-strokedark"
        style={{
          borderLeft: "1px solid #e5e7eb",
          minWidth: "300px", // Ensure it’s visible in split-screen
        }}
      >
        <div
          className="sticky border-b border-stroke dark:border-strokedark flex flex-row items-center justify-between w-full px-6 py-7.5"
          style={{
            padding: "30px 24px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            position: "sticky",
            top: 0,
          }}
        >
          <div
            className="text-black dark:text-white font-semibold text-lg"
            style={{
              color: "#000000",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {isGroup ? "Group Member Profile" : "Profile"}
          </div>
          <button onClick={handleToggleUserInfo}>
            <X size={24} />
          </button>
        </div>

        <div
          className="mx-auto my-8"
          style={{
            margin: "32px auto",
            textAlign: "center",
          }}
        >
          {user?.avatar ? (
            <img
              src={user?.avatar}
              className="w-44 h-44 rounded-lg object-cover object-center"
              style={{
                width: "176px",
                height: "176px",
                borderRadius: "8px",
                objectFit: "cover",
                border: "2px solid #e5e7eb",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            />
          ) : (
            <div
              className={`h-44 w-44 rounded-lg border border-stroke dark:border-strokedark bg-gray dark:bg-boxdark flex items-center justify-center text-body dark:text-white capitalize text-4xl`}
              style={{
                width: "176px",
                height: "176px",
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                fontSize: "40px",
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {user?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div
          className="px-6 space-y-1"
          style={{
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "auto",
          }}
        >
          <div
            className={`text-black dark:text-white font-medium ${
              isGroup ? "text-2xl" : "text-xl"
            }`}
            style={{
              color: "#000000",
              fontSize: isGroup ? "24px" : "20px",
              fontWeight: 500,
              lineHeight: "1.2",
            }}
          >
            {user?.name || (group?.groupName ?? "Unnamed Group")}
            {isGroup && (
              <span
                className="text-sm font-normal ml-2 text-gray-500"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  marginLeft: "8px",
                  color: "#6b7280",
                }}
              >
                {isAdmin ? "(Group Admin)" : "(Member)"}
              </span>
            )}
          </div>
          <div
            className={`text-sm font-medium ${
              user?.status === "Online" ? "text-green-500" : "text-red"
            }`}
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: user?.status === "Online" ? "#22c55e" : "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Dot
              size={16}
              color={user?.status === "Online" ? "#22c55e" : "#ef4444"}
            />
            {user?.status || "Offline"}
          </div>
          {/* Render participants list if it's a group chat */}
          {isGroup && participants.length > 0 && (
            <div
              className="px-6 my-6"
              style={{
                margin: "24px 0",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                className="text-black dark:text-white font-medium text-lg mb-2"
                style={{
                  color: "#000000",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Group Participants
              </h3>
              <ul
                className="space-y-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {participants.map((participant) => (
                  <li
                    key={participant._id}
                    className="text-black dark:text-white text-sm flex items-center space-x-2"
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{participant.name}</span>
                    {participant._id === userId && (
                      <span
                        className="text-xs text-gray-500"
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          backgroundColor: "#e5e7eb",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        (You)
                      </span>
                    )}
                    {participant._id === group?.groupAdmin?._id && (
                      <span
                        className="text-xs text-gray-500"
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          backgroundColor: "#e5e7eb",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        (Admin)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <span
            className="text-body text-md"
            style={{
              color: "#6b7280",
              fontSize: "16px",
              fontStyle: "italic",
            }}
          >
            {user?.jobTitle || "No job title"}
          </span>
        </div>
        {/* Message Scheduler */}
        <div
          className="mt-6"
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <h3
            className="text-black dark:text-white font-medium text-lg mb-2"
            style={{
              color: "#000000",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Schedule a Message
          </h3>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark dark:text-white"
            style={{ minHeight: "80px", resize: "vertical" }}
          />
          <input
            type="datetime-local"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
          <button
            onClick={handleScheduleMessage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            style={{ backgroundColor: "#3b82f6" }}
          >
            Schedule
          </button>
        </div>

        {/* Scheduled Messages List */}
        {scheduledMessages.length > 0 && (
          <div className="mt-4">
            <h4
              className="text-black dark:text-white font-medium text-md mb-2"
              style={{
                color: "#000000",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Scheduled Messages
            </h4>
            <ul
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {scheduledMessages
                .filter((msg) => msg.conversationId === currentConversation)
                .map((msg) => (
                  <li
                    key={msg.id}
                    className="text-black dark:text-white text-sm flex items-center justify-between"
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      padding: "8px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div>
                      <span>"{msg.content}"</span>
                      <span
                        style={{
                          color: "#6b7280",
                          marginLeft: "8px",
                          fontStyle: "italic",
                        }}
                      >
                        - {formatDateTime(msg.sendAt)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setScheduledMessages((prev) =>
                          prev.filter((m) => m.id !== msg.id),
                        )
                      }
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div
          className="px-6 my-6"
          style={{
            padding: "24px 24px 0",
          }}
        >
          {user?.country && (
            <div
              className="flex flex-row items-center space-x-2"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#000000",
              }}
            >
              <Globe size={20} />
              <div className="dark:text-white">{user?.country}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// User profile
const UserProfile = ({ user, handleToggleUserInfo }) => {
  return (
    <div className="flex flex-col h-full border-stroke dark:border-strokedark">
      <div className="sticky border-b border-stroke dark:border-strokedark flex flex-row items-center justify-between w-full px-6 py-7.5">
        <div className="text-black dark:text-white font-semibold text-lg">
          Profile
        </div>

        <button onClick={handleToggleUserInfo}>
          <X size={24} />
        </button>
      </div>

      <div className="mx-auto my-8">
        {user?.avatar ? (
          <img
            src={user?.avatar}
            className="w-44 h-44 rounded-lg object-cover object-center"
          />
        ) : (
          <div
            className={`h-44 w-44 rounded-lg border border-stroke dark:border-strokedark bg-gray dark:bg-boxdark flex items-center justify-center text-body dark:text-white capitalize text-4xl`}
          >
            {user?.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      <div className="px-6 space-y-1">
        <div className="text-black dark:text-white text-xl font-medium">
          {user?.name}
        </div>
        <div
          className={`text-sm font-medium ${
            user?.status === "Online" ? "text-green-500" : "text-red"
          }`}
        >
          {user?.status || "Offline"}
        </div>

        <span className="text-body text-md">
          {user?.jobTitle || "No job title"}
        </span>
      </div>

      <div className="px-6 my-6">
        {user?.country && (
          <div className="flex flex-row items-center space-x-2">
            <Globe size={20} />
            <div>{user?.country}</div>
          </div>
        )}
      </div>
    </div>
  );
};
