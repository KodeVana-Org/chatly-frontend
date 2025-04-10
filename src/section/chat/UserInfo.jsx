import { Dot, Globe, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

//NOTE: css issue in this function when the splite screen and open two screen then details is not visible
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
    group && Array.isArray(group.participants) && group.participants.length > 2;
  // Check if the user is the group admin
  const isAdmin = isGroup && userId === group.groupAdmin?._id;
  const participants = isGroup ? group.participants : [];

  return (
    <>
      {/* Show this Below LG */}
      <div
        className={`xl:hidden fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-end bg-black/90 py-2`}
      >
        <div className="md:px-7.5 w-full max-w-142.5 bg-white dark:bg-boxdark md:py-4 px-4 py-6 min-h-screen">
          <UserProfile
            user={user}
            handleToggleUserInfo={handleToggleUserInfo}
          />
        </div>
      </div>

      {/* Show this Above LG */}
      <div className="xl:border-l hidden xl:flex flex-col h-full border-stroke dark:border-strokedark">
        <div className="sticky border-b border-stroke dark:border-strokedark flex flex-row items-center justify-between w-full px-6 py-7.5">
          <div className="text-black dark:text-white font-semibold text-lg">
            {isGroup ? "Group Info" : "Profile"}
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
            {user?.name || group.groupName}
            {isGroup && (
              <span className="text-sm font-normal ml-2 text-gray-500">
                {isAdmin ? "(Group Admin)" : "(Member)"}
              </span>
            )}
          </div>
          <div
            className={`text-sm font-medium ${
              user?.status === "Online" ? "text-green-500" : "text-red"
            }`}
          >
            {/*
            <Dot
              size={16}
              color={user?.status === "Online" ? "#22c55e" : "#ef4444"}
            />
            */}
            {!isGroup && (user?.status || "Offline")}
          </div>
          {/* Render participants list if it's a group chat */}
          {isGroup && participants.length > 0 && (
            <div className="px-6 my-6">
              <h3 className="text-black dark:text-white font-medium text-lg mb-2">
                Group Participants
              </h3>
              <ul className="space-y-2">
                {participants.map((participant) => (
                  <li
                    key={participant._id}
                    className="text-sm flex items-center space-x-2"
                  >
                    <span>{participant.name}</span>
                    {participant._id === userId && (
                      <span className="text-xs text-gray-500">(You)</span>
                    )}
                    {participant._id === group.groupAdmin._id && (
                      <span className="text-xs text-gray-500">(Admin)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!isGroup && (
            <span className="text-body text-md">
              {user?.jobTitle || "No job title"}
            </span>
          )}
        </div>

        {/* Message Scheduler */}
        <div className="m-3 p-3 border border-stroke dark:border-strokedark">
          <h3 className="text-black dark:text-white font-medium text-lg mb-2">
            Schedule a Message
          </h3>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
          <input
            type="datetime-local"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
          <button
            onClick={handleScheduleMessage}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
          >
            Schedule
          </button>
        </div>

        {/* Scheduled Messages List */}
        {scheduledMessages.length > 0 && (
          <div className="m-3 p-5 border border-strok dark:border-strokedark">
            <h4 className="text-black dark:text-white font-medium text-md mb-2">
              Scheduled Messages
            </h4>
            <ul className="flex flex-col gap-2">
              {scheduledMessages
                .filter((msg) => msg.conversationId === currentConversation)
                .map((msg) => (
                  <li
                    key={msg.id}
                    className="text-sm flex items-center justify-between"
                  >
                    <div>
                      <span>"{msg.content}"</span>
                      <span className="ml-2">
                        - {formatDateTime(msg.sendAt)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setScheduledMessages((prev) =>
                          prev.filter((m) => m.id !== msg.id),
                        )
                      }
                      className="ml-2 px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600"
                    >
                      Cancel
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="px-6 my-6">
          {user?.country && (
            <div className="flex flex-row items-center space-x-2">
              <Globe size={20} />
              <div className="dark:text-white">{user?.country}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

//User profile
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
            {user?.name.charAt(0)}
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
          {user?.status}
        </div>

        <span className="text-body text-md">{user?.jobTitle}</span>
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
