import axios from "axios";

// NOTE: Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: "http://localhost:6969/api/",
  timeout: 120000,
});

// Retrieve user ID
const user = JSON.parse(localStorage.getItem("user") || "{}");
const myId = user?._id;

// TODO: Attach token dynamically using an interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const { token } = useAuth();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// NOTE: Authentication API functions
const loginUser = (email: string, password: string) => {
  return apiClient.post("v1/auth/login", { email, password });
};

const registerUser = (email: string) => {
  return apiClient.post("v1/auth/register", { email });
};

const verifyRegisterEmail = (
  username: string,
  email: string,
  password: string,
  otp: number,
) => {
  return apiClient.post("v1/auth/verify-email", {
    username,
    email,
    password,
    otp,
  });
};

const verifyResetOtp = (email: string, otp: number) => {
  return apiClient.post("v1/auth/verify-otp", { email, otp });
};

const forgotPassword = (email: string) => {
  return apiClient.post("v1/auth/forgot-password", { email });
};

const resetPassword = (email: string, new_password: string) => {
  return apiClient.post("v1/auth/new-password", { email, new_password });
};

const logoutUser = () => {
  return apiClient.post("/users/logout");
};

/*_*\ NOTE: User API functions \*_*/
// Get all users
const getAllUsers = (userId: string) => {
  return apiClient.get("v1/users/all-users/" + userId);
};
// Get single user
const getUserData = (userId: string | null) => {
  return apiClient.get("v1/users/user/" + userId);
};
// Search users
const searchUser = (text: string) => {
  return apiClient.get("v1/users/search?search=" + text);
};
// Update my info
const updateMyInfo = () => {
  return apiClient.patch("v1/users/update-user/userid");
};
// Get all incoming friend requests
const getIncomingReqUsers = (userId: string) => {
  return apiClient.get("v1/friend/all-req/" + userId);
};

/*_*\ NOTE: Connections \*_*/
// Get friends
const getFriends = () => {
  return apiClient.get("v1/friend/friends/" + myId);
};
// Send friend request
const sendFdReq = (senderId: string | null, friendId: string) => {
  return apiClient.post("v1/friend/sent-req/" + friendId, {
    senderId,
  });
};
// Cencel friend request
const cancelFdReq = (senderId: string | null, recipientId: string) => {
  return apiClient.delete("v1/friend/cancel-friend-req", {
    data: { senderId, recipientId },
  });
};
// Accept/reject friend request
const incomingFdReq = (requestId: string, action: string) => {
  return apiClient.put("v1/friend/action-req/" + myId, {
    requestId,
    action,
  });
};

/*_*\ NOTE: Chat API functions \*_*/
// Start conversation
const startMessaging = (isGroup: boolean, members: Array<string>) => {
  return apiClient.post("v1/conversation/" + myId, {
    isGroup,
    members,
  });

  // return apiClient.post("v1/xyz/", formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });
};
// Get messages
const getMessages = (conversationId: string | null) => {
  return apiClient.get("v1/message/" + conversationId);
};
// Send message
const sendMessages = (
  conversationId: string | null,
  sender: string,
  type: string,
  content: any,
) => {
  return apiClient.post("v1/message/", {
    conversationId,
    type,
    sender,
    content,
  });
};
const getUserChats = () => apiClient.get(`/chat-app/chats`);
const createUserChat = (receiverId: string) =>
  apiClient.post(`/chat-app/chats/c/${receiverId}`);
const createGroupChat = (data: { name: string; participants: string[] }) =>
  apiClient.post(`/chat-app/chats/group`, data);
const getGroupInfo = (chatId: string) =>
  apiClient.get(`/chat-app/chats/group/${chatId}`);
const updateGroupName = (chatId: string, name: string) =>
  apiClient.patch(`/chat-app/chats/group/${chatId}`, { name });
const deleteGroup = (chatId: string) =>
  apiClient.delete(`/chat-app/chats/group/${chatId}`);
const deleteOneOnOneChat = (chatId: string) =>
  apiClient.delete(`/chat-app/chats/remove/${chatId}`);
const addParticipantToGroup = (chatId: string, participantId: string) =>
  apiClient.post(`/chat-app/chats/group/${chatId}/${participantId}`);
const removeParticipantFromGroup = (chatId: string, participantId: string) =>
  apiClient.delete(`/chat-app/chats/group/${chatId}/${participantId}`);

const getChatMessages = (chatId: string) =>
  apiClient.get(`/chat-app/messages/${chatId}`);
const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) formData.append("content", content);
  attachments?.forEach((file) => formData.append("attachments", file));
  return apiClient.post(`/chat-app/messages/${chatId}`, formData);
};

const deleteMessage = (chatId: string, messageId: string) =>
  apiClient.delete(`/chat-app/messages/${chatId}/${messageId}`);

// Export all API functions
export {
  loginUser,
  registerUser,
  forgotPassword,
  verifyRegisterEmail,
  verifyResetOtp,
  resetPassword,
  logoutUser,
};
export {
  getAllUsers,
  getFriends,
  getIncomingReqUsers,
  getUserData,
  searchUser,
  updateMyInfo,
};
export { sendFdReq, cancelFdReq, incomingFdReq };
export { startMessaging, getMessages, sendMessages };
