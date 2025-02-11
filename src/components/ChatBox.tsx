import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { TextControlBox } from "./index.ts";
import { getMessages, sendMessages, getUserData } from "../api";
import { useChat } from "../context/ChatContext";

interface MessageData {
  senderId: string;
  textMessage?: string;
  images?: string[];
  caption?: string;
}

const ChatBox: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [receiverData, setReceiverData] = useState<{
    username: string;
    avatar: string;
  }>({ username: "", avatar: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = user?._id;

  const { conversationId, receiverId } = useChat();

  useEffect(() => {
    // NOTE:  Initialize socket connection
    const newSocket = io("http://localhost:6969", {
      query: { userId: myId },
    });
    setSocket(newSocket);

    // NOTE: Cleanup socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [myId]);

  useEffect(() => {
    if (!socket) return;

    // NOTE: Join the conversation room when conversationId changes
    socket.emit("joinConversation", conversationId);

    // NOTE:  Listen for incoming messages
    socket.on("receiveMessage", (message: any) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // NOTE:  Listen for typing events
    socket.on("userTyping", ({ senderId }: { senderId: string }) => {
      if (senderId !== myId) {
        setIsTyping(true);
      }
    });

    // NOTE:  Listen for stop typing events
    socket.on("userStopTyping", () => {
      setIsTyping(false);
    });

    // NOTE:  Listen for user status updates
    socket.on("updateUserStatus", ({ status }: { status: string }) => {
      if (status === "online") {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("updateUserStatus");
      socket.off("joinConversation");
    };
  }, [socket, conversationId, myId]);

  // NOTE: Send message to the backend API
  const handleSendMessage = async (message: Omit<MessageData, "senderId">) => {
    if (message.textMessage) {
      try {
        await sendMessages(conversationId, myId, "Text", message.textMessage);
      } catch (error: any) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // NOTE: Handle typing events
  const handleTyping = () => {
    socket?.emit("typing", { conversationId, senderId: myId });
  };
  const handleStopTyping = () => {
    socket?.emit("stopTyping", { conversationId });
  };

  // NOTE: Fetch old messages and receiver data (unchanged)
  const fetchMessages = async () => {
    if (!conversationId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getMessages(conversationId);
      if (response.data.statusCode === 200) {
        setMessages(response.data.data.data || []);
        fetchReceiverData();
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NOTE: Fetch reciever's data
  const fetchReceiverData = async () => {
    setIsLoading(true);
    try {
      const response = await getUserData(receiverId);
      if (response.data.statusCode === 200) {
        setReceiverData({
          username: response.data.data.username,
          avatar: response.data.data.avatar.url,
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // NOTE: Scroll to the bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-7 w-full bg-white dark:bg-black rounded-t-[2rem]">
      {/* Chat Header */}
      {conversationId ? (
        <div className="flex justify-between items-center border-b border-slate-50">
          <div className="p-7 flex flex-row gap-5">
            <img
              className="h-14 w-14 rounded-full"
              src={receiverData.avatar}
              alt={receiverData.username[0]}
            />
            <span className="flex gap-7 items-center">
              <h4 className="font-medium text-[1.4rem] text-black dark:text-white">
                {receiverData.username}
              </h4>
              {isOnline ? (
                isTyping ? (
                  <p className="text-[0.8rem] text-gray-400">Typing...</p>
                ) : (
                  <p className="text-[0.8rem] text-gray-400">Online</p>
                )
              ) : (
                <p className="text-[0.8rem] text-gray-400">Offline</p>
              )}
            </span>
          </div>
        </div>
      ) : (
        <span></span>
      )}

      {/* Chat Messages */}
      <div className="w-full h-[88vh] flex flex-col relative justify-between">
        {conversationId ? (
          <div className="h-full flex flex-col justify-between">
            <div className="mx-5 mb-1 bg-white dark:bg-black text-black dark:text-white h-full overflow-y-scroll">
              <div className="mx-5 flex-1 overflow-y-auto p-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isSentByMe =
                      msg.sender?._id === myId || msg.sender === myId;
                    return (
                      <div
                        key={index}
                        className={`mb-4 p-3 rounded-t-xl shadow-md max-w-[75%] ${
                          isSentByMe
                            ? "w-fit max-w-[24rem] ml-auto bg-blue-500 text-white rounded-bl-xl"
                            : "w-fit max-w-[24rem] mr-auto bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-br-xl"
                        }`}
                      >
                        {(msg.textMessage || msg.content) && (
                          <p className="text-lg break-words whitespace-pre-wrap">
                            {msg.textMessage || msg.content}
                          </p>
                        )}
                        {msg.images &&
                          msg.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="mt-2">
                              <img
                                src={img}
                                alt={`Uploaded ${imgIndex}`}
                                className="max-w-[300px] rounded-md"
                              />
                            </div>
                          ))}
                        {msg.caption && (
                          <p className="text-gray-500 italic mt-1 break-words whitespace-pre-wrap">
                            {msg.caption}
                          </p>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-400 mt-10">
                    No messages yet
                  </p>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="mt-auto mb-7">
              <TextControlBox
                onMessageSend={handleSendMessage}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
              />
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex justify-center content-center items-center">
            <h4 className="text-2xl font-semibold">
              Welcome to the TAWK, it's an online conversation community.
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
