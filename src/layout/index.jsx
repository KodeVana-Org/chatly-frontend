import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectWithSocketServer } from "../socket/socketConnection";
import {
  disconnectSocket,
  initializeSocket,
  updateUserList,
} from "../redux/slices/auth";
import { toast } from "react-toastify";
import {
  AddMessage,
  FetchChatHistory,
  UpdateStatus,
  UpdateTypingStatus,
} from "../redux/slices/chat";
import { List, User } from "@phosphor-icons/react";
import SidebarMobile from "./SidebarMobile";
import ChatList from "../section/chat/ChatList";

export default function index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const socketId = useSelector((state) => state.auth.socketId);

  const [openSidebar, setOpenSidebar] = useState(false);

  const [openChatList, setOpenChatList] = useState(false);

  const handleToggleChatList = () => {
    if (!openChatList) {
      navigate("/dashboard");
    }
    setOpenChatList((p) => !p);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((p) => !p);
  };

  useEffect(() => {
    let socket;
    if (isLoggedIn) {
      socket = connectWithSocketServer({
        token: token,
      });

      // ** WORKING
      socket.on("connect", () => {
        console.log("succesfully connected with socket.io server");
        console.log(socket.id);
        dispatch(initializeSocket(socket));
      });

      // ** WORKING
      socket.on("error", (data) => {
        // ? DATA FORMAT

        // data = { message: "Conversation not found" }

        console.log(data);
        // toast.error(data?.message || "Something went wrong");
      });

      // ** WORKING
      socket.on("user-disconnected", (data) => {
        console.log(data, "user-disconnected");

        // ? DATA FORMAT

        // data = {
        // message: `User ${user.name} has gone offline.`,
        // userId: user._id,
        // status: "Offline",
        // }

        dispatch(
          UpdateStatus({
            userId: data.userId,
            status: data.status,
          }),
        );
      });

      // ** WORKING
      socket.on("user-connected", (data) => {
        console.log(data, "user-connected");
        //dispatch(updateUserList(data));

        // ? DATA FORMAT

        // data = {
        // message: `User ${user.name} has connected.`,
        // userId: user._id,
        // status: "Online",
        // };

        dispatch(
          UpdateStatus({
            userId: data.userId,
            status: data.status,
          }),
        );
      });

      // ** WORKING
      socket.on("chat-history", (data) => {
        console.log(data, "chat-history");

        // ? DATA FORMAT

        // data = {
        // conversationId,
        // history: conversation.messages,
        // };

        dispatch(FetchChatHistory(data));
      });

      // ** WORKING
      socket.on("new-direct-chat", (data) => {
        console.log(data, "new-message");

        // ? DATA FORMAT

        // data = {
        // conversationId: conversationId,
        // message: newMessage,
        // }

        dispatch(AddMessage(data));
      });

      // ** WORKING
      socket.on("start-typing", (data) => {
        console.log(data, "start-typing");

        // ? DATA FORMAT

        // const data = {
        // conversationId,
        // typing: true,
        // };

        dispatch(UpdateTypingStatus(data));
      });

      // ** WORKING
      socket.on("stop-typing", (data) => {
        console.log(data, "stop-typing");

        // ? DATA FORMAT

        // const data = {
        // conversationId,
        // typing: true,
        // };

        dispatch(UpdateTypingStatus(data));
      });
      // Add userList listener
      socket.on("userList", (userList) => {
        console.log("Received userList:", userList);
        dispatch(updateUserList(userList));
      });

      //socket.on("callToUser", (data) => {
      //  console.log("📞 Incoming call event received!", data);
      //  setReceivedCall(true);
      //  setCaller(data.from); // this is the socket id
      //  setCallerName(data.name);
      //  setCallerSignal(data.signal);
      //});
      //socket.on("callRejected", (data) => {
      //  console.log("callRejected invoked", data);
      //  alert(`Call Rejected from ${data.name}`);
      //  setReceivedCall(false);
      //  setCallAccepted(false);
      //});
      //socket.on("callEnded", (data) => {
      //  alert(`Call is Ended from ${data.name}`);
      //  setReceivedCall(false);
      //  setCallAccepted(false);
      //  setCallEnded(false);
      //  connectionRef.current.destroy();
      //  if (userVideo.current) {
      //    userVideo.current.srcObject = null;
      //  }
      //});
      //socket.on("onlineUsers", (onlineUsers) => {
      // console.log("Received onlineUsers in index.js:", onlineUsers);
      // // Optionally update userList with online users only if desired
      //});
    }

    // Cleanup when the component unmounts or when the socket is manually disconnected
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("error");
        socket.off("user-disconnected");
        socket.off("user-connected");
        socket.off("chat-history");
        socket.off("new-message");
        socket.off("start-typing");
        socket.off("stop-typing");
        socket.off("userList");
        //socket.off("callToUser");
        //socket.off("callEnded");
        //socket.off("callRejected");
        socket.disconnect();
        dispatch(disconnectSocket());
        console.log("Disconnected from socket server");
      }
    };
  }, []);
  return (
    <div className="h-[calc(100vh)] overflow-hidden sm:h-screen">
      <div className="relative h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
        <div
          onClick={handleToggleSidebar}
          className="xl:hidden absolute top-30 p-2 bg-white dark:bg-boxdark dark:text-white text-body shadow-2 border border-stroke dark:border-strokedark rounded-r-xl hover:cursor-pointer"
        >
          <List size={24} />
        </div>
        <div
          onClick={handleToggleChatList}
          className="xl:hidden absolute top-44 p-2 bg-white dark:bg-boxdark dark:text-white text-body shadow-2 border border-stroke dark:border-strokedark rounded-r-xl hover:cursor-pointer"
        >
          <User size={24} />
        </div>

        {/* Sidebar */}
        <Sidebar />

        <Outlet />
      </div>

      {openSidebar && (
        <SidebarMobile open={openSidebar} handleClose={handleToggleSidebar} />
      )}

      {openChatList && (
        <ChatList open={openChatList} handleClose={handleToggleChatList} />
      )}
    </div>
  );
}
