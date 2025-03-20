import io from "socket.io-client";
import { BASE_URL } from "../utils/axios";

let socket = null;

export const connectWithSocketServer = (userDetails) => {
  const jwtToken = userDetails.token;

  socket = io(BASE_URL, {
    auth: {
      token: jwtToken,
    },
  });

  return socket;
};
// Function to get the existing socket instance
export const getSocket = () => {
  if (!socket) {
    console.warn(
      "⚠️ Socket not initialized. Call connectWithSocketServer() first.",
    );
  }
  return socket;
};

export const sendDirectMessage = (data) => {
  // ? DATA FORMAT

  // const { message, conversationId } = data;
  // where message is 👇
  // const { author, content, media, audioUrl, documentUrl, type, giphyUrl } = message;

  socket.emit("new-message", data);
};

export const getDirectChatHistory = (data) => {
  // ? DATA FORMAT

  console.log(data, "direct-chat-history");

  // const { conversationId } = data;

  socket.emit("direct-chat-history", data);
};

export const emitStartTyping = (data) => {
  // ? DATA FORMAT

  // const { userId, conversationId } = data;

  // This is the userId of the other participant in the conversation who should receive typing status

  socket.emit("start-typing", data);
};

export const emitStopTyping = (data) => {
  // ? DATA FORMAT

  // const { userId, conversationId } = data;

  // This is the userId of the other participant in the conversation who should receive typing status

  socket.emit("stop-typing", data);
};

// THIS three inside the useEffect hook

export const callToUser = (id) => {
  if (!stream) {
    console.error("Stream is not available yet");
    return;
  }

  //Initiating peer
  const peer = new SimplePeer({
    initiator: true,
    trickle: false,
    stream: stream,
  });

  // I need to send this signals to backend
  peer.on("signal", (data) => {
    console.log("🛠 Emitting callToUser event with:", {
      callToUserId: id,
      signalData: data,
      from: localStorage.getItem("userId"),
      name: localStorage.getItem("userName"),
    });
    // ✅ Ensure `socket` is defined before using it
    if (typeof socket !== "undefined") {
      socket.emit("callToUser", {
        callToUserId: id,
        signalData: data,
        from: socket.id,
        name: localStorage.getItem("userName"),
      });
    } else {
      console.error("Socket is not defined");
    }
  });

  //I need to attach stream (video) to peer
  peer.on("stream", (stream) => {
    //userVideo.current.srcObject = stream;
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
      userVideo.current
        .play()
        .catch((error) => console.error("Autoplay failed:", error));
    }
  });

  //This event is run only once when call is accepted
  socket.once("callAccepted", (data) => {
    console.log("call is accepted", data);
    setCallAccepted(true);
    setCaller(data.from);
    peer.signal(data.signal);
  });

  connectionRef.current = peer;
};

//reject call
export const handleRejectCall = () => {
  console.log("call rejectred");
  setReceivedCall(false);
  setCallAccepted(false);
  socket.emit("reject-call", {
    to: caller,
    name: localStorage.getItem("userName"), // this is username which wil popup with name in alrt
  });
};

// accept Call
export const handleAcceptCall = () => {
  setCallAccepted(true);

  const peer = new SimplePeer({
    initiator: false,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (data) => {
    socket.emit("answerCall", { signal: data, to: caller, from: socket.id });
  });

  peer.on("stream", (stream) => {
    //userVideo.current.srcObject = stream;
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
      userVideo.current
        .play()
        .catch((error) => console.error("Autoplay failed:", error));
    }
  });

  connectionRef.current = peer;

  // ✅ Ensure this runs last
  peer.signal(callerSignal);
};

//End call
export const leaveCall = () => {
  setReceivedCall(false);
  setCallAccepted(false);
  setCallEnded(false);
  connectionRef.current.destroy();
  if (userVideo.current) {
    userVideo.current.srcObject = null;
  }

  socket.emit("call-ended", {
    to: caller,
    name: localStorage.getItem("userName"),
  });
};

export default socket;
