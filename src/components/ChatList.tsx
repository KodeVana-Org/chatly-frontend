import { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  getFriends,
  sendFdReq,
  cancelFdReq,
  getIncomingReqUsers,
  incomingFdReq,
} from "../api";
import formatMessageTime from "../utils/setMessageTime";

interface ChatListProps {
  isMyChatList: boolean;
  isIncomingReq: boolean;
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  isMyChatList,
  isIncomingReq,
  onChatSelect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [myId, setMyId] = useState(null);
  const [allFriendList, setAllFriendList] = useState<any[]>([]);
  const [userListWithoutFR, setUserListWithoutFR] = useState<any[]>([]);
  const [userListWithFR, setUserListWithFR] = useState<any[]>([]);
  const [incomingFRUsers, setIncomingFRUsers] = useState<any[]>([]);

  // Retrieve user ID
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?._id) {
      setMyId(storedUser._id);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!myId) return; // Prevent API call if myId is not available

    setIsLoading(true);
    try {
      if (isMyChatList && !isIncomingReq) {
        const response = await getFriends();
        if (response.data.statusCode === 200) {
          setAllFriendList(response.data.data?.friends);
          setUserListWithoutFR([]);
          setUserListWithFR([]);
          setIncomingFRUsers([]);
        }
      } else if (!isMyChatList && !isIncomingReq) {
        const response = await getAllUsers(myId);
        if (response.data.statusCode === 200) {
          setUserListWithoutFR(response.data.data?.usersWithoutSentRequests);
          setUserListWithFR(response.data.data?.usersWithSentRequests);
          setAllFriendList([]);
          setIncomingFRUsers([]);
        }
      } else {
        const response = await getIncomingReqUsers(myId);
        if (response.data.statusCode === 200) {
          setIncomingFRUsers(response.data.data?.incomingRequests);
          setAllFriendList([]);
          setUserListWithoutFR([]);
          setUserListWithFR([]);
        }
      }
    } catch (err: any) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isMyChatList, isIncomingReq, myId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 100);

    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  // Handle send friend request
  const handleSendFriendReq = async (friendId: string) => {
    try {
      const response = await sendFdReq(myId, friendId);
      if (response.data.statusCode === 200) {
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error:", err); // TODO: handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel friend request
  const handleCancelFriendReq = async (friendId: string) => {
    try {
      const response = await cancelFdReq(myId, friendId);
      if (response.data.statusCode === 200) {
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error:", err); // TODO: handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accept / reject request
  const handleIncomingFriendReq = async (requestId: string, action: string) => {
    try {
      const response = await incomingFdReq(requestId, action);
      if (response.data.statusCode === 200) {
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error:", err); // TODO: handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ul className="p-2 bg-white dark:bg-black">
      {allFriendList?.map((user) => (
        <li
          key={user._id}
          className="flex flex-row gap-5 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
          onClick={() => onChatSelect(user._id)}
        >
          <img
            className="h-10 w-10 rounded-[50%]"
            src={user.avatar?.url}
            alt={user?.username[0]}
          />
          <span className="w-full flex flex-col gap-2">
            <span className="flex flex-row justify-between">
              <h4 className="my-auto text-black dark:text-white">
                {user?.username}
              </h4>
              <p className="text-[15px] text-gray-500">
                {formatMessageTime(user.lastMessage?.createdAt)}
              </p>
            </span>
            <p className="text-[14px] text-gray-400">
              {user.lastMessage?.content}
            </p>
          </span>
        </li>
      ))}
      {userListWithoutFR.map((user) => (
        <li
          key={user._id}
          className="flex flex-row gap-5 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <img
            className="h-10 w-10 rounded-[50%]"
            src={user.avatar?.url}
            alt={user?.username[0]}
          />
          <span className="w-full flex flex-col gap-2">
            <span className="flex flex-row justify-between">
              <h4 className="my-auto text-black dark:text-white">
                {user?.username}
              </h4>
              <button
                onClick={() => handleSendFriendReq(user._id)}
                className="py-2 px-2 font-medium text-white bg-[#007BFF] hover:bg-[#026fe3] rounded-xl cursor-pointer"
              >
                Send Friend Request
              </button>
            </span>
          </span>
        </li>
      ))}
      {userListWithFR.map((user) => (
        <li
          key={user._id}
          className="flex flex-row gap-5 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <img
            className="h-10 w-10 rounded-[50%]"
            src={user.avatar?.url}
            alt={user?.username[0]}
          />
          <span className="w-full flex flex-col gap-2">
            <span className="flex flex-row justify-between">
              <h4 className="my-auto text-black dark:text-white">
                {user?.username}
              </h4>
              <button
                onClick={() => handleCancelFriendReq(user._id)}
                className="py-2 px-2 font-medium text-white bg-red-500 dark:bg-red-700 rounded-xl"
              >
                Cancel Request
              </button>
            </span>
          </span>
        </li>
      ))}
      {incomingFRUsers.map((user) => (
        <li
          key={user.sender._id}
          className="flex flex-row gap-5 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <img
            className="h-10 w-10 rounded-[50%]"
            src={user.sender.avatar?.url}
            alt={user.sender?.username[0]}
          />
          <span className="w-full flex flex-col gap-2">
            <span className="flex flex-row justify-between">
              <h4 className="my-auto text-black dark:text-white">
                {user.sender?.username}
              </h4>
              <span className="flex gap-3">
                <button
                  onClick={() => handleIncomingFriendReq(user._id, "accept")}
                  className="py-2 px-2 font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleIncomingFriendReq(user._id, "reject")}
                  className="py-2 px-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                >
                  Reject
                </button>
              </span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
