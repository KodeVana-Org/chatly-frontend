import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { IoIosSearch } from "react-icons/io";
import { ChatList, ChatBox, Navbar, ProfilePreview } from "../components";
import { startMessaging } from "../api";

function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMyChatList, setIsMyChatList] = useState(true);
  const [isIncomingReq, setIsIncomingReq] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [user, setUser] = useState<any>({});
  const [showProfile, setShowProfile] = useState(false);

  // NOTE: Chat context
  const { setConversationId, setRecieverId } = useChat();

  // NOTE: Function to receive conversationId from ChatList
  const handleChatSelect = async (userId: string) => {
    setRecieverId(userId); // NOTE: Set reciever's id in the context
    try {
      const response = await startMessaging(isGroupChat, [userId]);
      if (response.data.statusCode === 200) {
        setConversationId(response.data.data._id);
      }
    } catch (err: any) {
      console.error("Error:", err); // TODO: handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
    setProfileUrl(user?.avatar?.url || "");
  }, []);

  return (
    <div className="pr-3 h-screen w-screen flex flex-row gap-7 bg-[#E0E9F8] overflow-hidden">
      {/* Navbar */}
      <Navbar activeButton="chat" />

      {/* Page container */}
      <div className="w-full flex flex-row gap-7">
        <div className="flex flex-col gap-7">
          <div className="min-w-[30rem] max-w-[35rem] bg-white dark:bg-black rounded-b-[2rem]">
            <div className="p-5 flex flex-col gap-7">
              <span className="flex gap-3 items-center justify-between">
                <h3 className="text-[1.8rem] text-black dark:text-white font-medium">
                  Messages
                </h3>
                <img
                  onClick={() => setShowProfile(true)}
                  className="h-10 aspect-square rounded-full"
                  src={profileUrl}
                  alt={user.username}
                />
              </span>
              <div className="mx-5 flex flex-row justify-between">
                <button
                  onClick={() => {
                    setIsMyChatList(true);
                    setIsIncomingReq(false);
                  }}
                  className={`text-black dark:text-white hover:font-semibold ${
                    isMyChatList ? (!isIncomingReq ? "font-semibold" : "") : ""
                  }`}
                >
                  My chats
                </button>
                <button
                  onClick={() => {
                    setIsMyChatList(false);
                    setIsIncomingReq(false);
                  }}
                  className={`text-black dark:text-white hover:font-semibold ${
                    !isMyChatList ? (!isIncomingReq ? "font-semibold" : "") : ""
                  }`}
                >
                  Find friends
                </button>
                <button
                  onClick={() => {
                    setIsMyChatList(false);
                    setIsIncomingReq(true);
                  }}
                  className={`text-black dark:text-white hover:font-semibold ${
                    !isMyChatList ? (isIncomingReq ? "font-semibold" : "") : ""
                  }`}
                >
                  Incoming requests
                </button>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="h-full min-w-[30rem] max-w-[35rem] bg-white dark:bg-black rounded-t-[2rem]">
            <div className="p-7 pt-7 flex flex-col gap-4">
              <span className="relative w-full border border-[#007BFF] rounded-[2rem]">
                <span className="absolute left-3 top-3 text-[2rem]">
                  <IoIosSearch />
                </span>
                <input
                  className="w-full pr-6 pl-14 py-2 h-[50px] rounded-[2rem] focus:outline-none"
                  placeholder="Search here"
                  type="search"
                />
              </span>
              <span className="h-[72vh] overflow-y-scroll rounded-[7px]">
                <ChatList
                  isMyChatList={isMyChatList}
                  isIncomingReq={isIncomingReq}
                  onChatSelect={handleChatSelect}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <ChatBox />
        {/* Profile container */}
        {showProfile && (
          <ProfilePreview user={user} onClose={() => setShowProfile(false)} />
        )}
      </div>
    </div>
  );
}

export default Chat;
