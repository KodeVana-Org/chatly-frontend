import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import _ from "lodash"; // Import lodash for debouncing
import AddConversation from "../../components/AddConversation";
import { useDispatch, useSelector } from "react-redux";
import {
  GetConversations,
  SetCurrentConversation,
} from "../../redux/slices/chat";

export default function ChatList({ open, handleClose }) {
  const dispatch = useDispatch();
  const [addConversation, setAddConversation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { conversations, currentConversation } = useSelector(
    (state) => state.chat,
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(GetConversations());
  }, [dispatch]);

  const handleToggleConversation = () => {
    setAddConversation((p) => !p);
  };

  const handleSelectConversation = (id) => {
    dispatch(SetCurrentConversation(id));
  };

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredConversations = conversations
    .map((el) => {
      // Ensure conversation has valid data
      if (
        !el ||
        (!el.isGroup &&
          (!Array.isArray(el.participants) || el.participants.length === 0))
      ) {
        console.warn(`Invalid conversation ${el?._id}`, el);
        return null;
      }

      // add this
      // Get the latest message (if any)
      const latestMessage =
        el.messages && el.messages.length > 0
          ? el.messages[el.messages.length - 1].content // Last message
          : "";

      // Group chat: Use groupName
      if (el.isGroup) {
        return {
          key: el._id,
          id: el._id,
          name: el.groupName || "Unnamed Group",
          imgSrc: null, // Groups typically don’t have avatars; customize if needed
          message: latestMessage,
          status: "group", // Indicate it’s a group
        };
      }

      // 1:1 chat: Find other participant
      const other_user = el.participants.find((e) => e?._id !== user._id);

      if (!other_user) {
        console.warn(
          `No other user found in conversation ${el._id} for user ${user._id}`,
          el.participants,
        );
        return {
          key: el._id,
          id: el._id,
          name: "Unknown User",
          imgSrc: null,
          message: "",
          status: "unknown",
        };
      }

      return {
        key: el._id,
        id: el._id,
        name: other_user.name || "Unnamed",
        imgSrc: other_user.avatar || null,
        message: latestMessage, // add this
        status: other_user.status || "unknown",
      };
    })
    .filter(Boolean) // Remove null entries
    .filter((conversation) =>
      conversation.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()),
    );
  console.log("filterd conversation", filteredConversations);
  return (
    <>
      <div className="hidden h-full flex-col xl:flex xl:w-1/4">
        <div className="sticky border-b border-stroke dark:border-strokedark px-6 py-7.5 flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
              Active Conversations
            </h3>
            <span className="rounded-md border-[.5px] border-stroke dark:border-strokedark bg-gray px-2 py-0.5 text-base font-medium text-black dark:bg-boxdark-2 dark:text-white">
              {filteredConversations.length}
            </span>
          </div>
          <button onClick={handleToggleConversation}>
            <Plus size={20} />
          </button>
        </div>

        <div className="flex max-h-full flex-col overflow-auto p-5">
          <form className="sticky mb-7 relative">
            <input
              placeholder="Search..."
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded border border-stroke bg-gray-2 py-2.5 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <MagnifyingGlass size={20} />
            </button>
          </form>

          {filteredConversations.length === 0 ? (
            <div className="min-h-100 flex items-center justify-center">
              <button
                onClick={handleToggleConversation}
                className="flex flex-row items-center space-x-2 text-primary"
              >
                <Plus size={24} />
                <span className="font-medium">Add Conversation</span>
              </button>
            </div>
          ) : (
            <div className="no-scrollbar overflow-auto max-h-full space-y-2.5">
              {filteredConversations.map((object) => (
                <div
                  className={`flex cursor-pointer items-center rounded px-4 py-2 dark:hover:bg-strokedark ${
                    currentConversation === object.id
                      ? "bg-gray dark:bg-boxdark-2"
                      : "hover:bg-gray-2 dark:hover:bg-boxdark-2/90"
                  }`}
                  key={object.key}
                  onClick={() => handleSelectConversation(object.id)}
                >
                  <div
                    style={{ position: "relative", marginRight: "14px" }}
                    className="h-11 w-11 rounded-full"
                  >
                    {object.imgSrc ? (
                      <img
                        src={object.imgSrc}
                        alt="profile"
                        className="h-full w-full rounded-full object-cover object-center"
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor:
                            object.status === "group" ? "#9ca3af" : "#d1d5db",
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "18px",
                          textTransform: "uppercase",
                        }}
                      >
                        {object.name.charAt(0)}
                      </div>
                    )}
                    {object.status === "Online" && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          height: "12px",
                          width: "12px",
                          backgroundColor: "#22c55e",
                          borderRadius: "50%",
                          border: "2px solid #fff",
                        }}
                      />
                    )}
                  </div>

                  <div className="w-full">
                    <h5 className="text-sm font-medium text-black dark:text-white">
                      {object.name}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {object.message ||
                        (object.status === "group"
                          ? "Group Chat"
                          : object.message)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div
        className={`xl:hidden ${
          open ? "flex" : "hidden"
        } fixed left-0 top-0 z-50 flex h-full min-h-screen w-full items-center justify-start bg-black/90 py-2`}
      >
        <div className="relative min-w-80 w-full h-full flex flex-col max-w-fit bg-white dark:bg-boxdark md:py-4 px-4 py-6 min-h-screen">
          <div
            onClick={handleClose}
            className="xl:hidden absolute -right-10 top-5 p-2 bg-white dark:bg-boxdark dark:text-white text-body border-l-0 border border-stroke dark:border-strokedark rounded-r-xl hover:cursor-pointer"
          >
            <X size={24} />
          </div>

          <div className="sticky border-b border-stroke dark:border-strokedark px-6 py-7.5 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                Active Conversations
              </h3>
              <span className="rounded-md border-[.5px] border-stroke dark:border-strokedark bg-gray px-2 py-0.5 text-base font-medium text-black dark:bg-boxdark-2 dark:text-white">
                {filteredConversations.length}
              </span>
            </div>
            <button onClick={handleToggleConversation}>
              <Plus size={20} />
            </button>
          </div>

          <div className="flex max-h-full flex-col overflow-auto p-5">
            <form className="sticky mb-7 relative">
              <input
                placeholder="Search..."
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded border border-stroke bg-gray-2 py-2.5 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <MagnifyingGlass size={20} />
              </button>
            </form>

            {filteredConversations.length === 0 ? (
              <div className="min-h-100 flex items-center justify-center">
                <button
                  onClick={handleToggleConversation}
                  className="flex flex-row items-center space-x-2 text-primary"
                >
                  <Plus size={24} />
                  <span className="font-medium">Add Conversation</span>
                </button>
              </div>
            ) : (
              <div className="no-scrollbar overflow-auto max-h-full space-y-2.5">
                {filteredConversations.map((object) => (
                  <div
                    className={`flex cursor-pointer items-center rounded px-4 py-2 dark:hover:bg-strokedark ${
                      currentConversation === object.id
                        ? "bg-gray dark:bg-boxdark-2"
                        : "hover:bg-gray-2 dark:hover:bg-boxdark-2/90"
                    }`}
                    key={object.key}
                    onClick={() => {
                      handleSelectConversation(object.id);
                      if (handleClose) handleClose();
                    }}
                  >
                    <div
                      style={{ position: "relative", marginRight: "14px" }}
                      className="h-11 w-11 rounded-full"
                    >
                      {object.imgSrc ? (
                        <img
                          src={object.imgSrc}
                          alt="profile"
                          className="h-full w-full rounded-full object-cover object-center"
                        />
                      ) : (
                        <div
                          style={{
                            backgroundColor:
                              object.status === "group" ? "#9ca3af" : "#d1d5db",
                            height: "100%",
                            width: "100%",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "18px",
                            textTransform: "uppercase",
                          }}
                        >
                          {object.name.charAt(0)}
                        </div>
                      )}
                      {object.status === "Online" && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            height: "12px",
                            width: "12px",
                            backgroundColor: "#22c55e",
                            borderRadius: "50%",
                            border: "2px solid #fff",
                          }}
                        />
                      )}
                    </div>

                    <div className="w-full">
                      <h5 className="text-sm font-medium text-black dark:text-white">
                        {object.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {object.message ||
                          (object.status === "group"
                            ? "Group Chat"
                            : "No messages yet")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {addConversation && (
        <AddConversation
          open={addConversation}
          handleClose={handleToggleConversation}
        />
      )}
    </>
  );
}
