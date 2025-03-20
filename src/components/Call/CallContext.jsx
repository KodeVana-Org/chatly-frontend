import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import SimplePeer from "simple-peer";
import { useUserMedia } from "./useMediaHook";
import { useSelector } from "react-redux";
import CallNotification from "./CallNotification";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [receivedCall, setReceivedCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState("");
  const [callAccept, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const { isLoggedIn, token, socket, socketId } = useSelector(
    (state) => state.auth,
  );
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const { stream } = useUserMedia(myVideo); // Stream should include video
  const connectionRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !socket) {
      console.warn("User not logged in or socket not available");
      return;
    }

    console.log("CallContext - Socket ID:", socketId);
    console.log("CallContext - Token from redux:", token);

    const handleIncomingCall = (data) => {
      console.log("📞 Incoming call event received!", data);
      setReceivedCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    };

    const handleRejectedCall = (data) => {
      console.log("callRejected invoked", data);
      alert(`Call Rejected from ${data.name}`);
      setReceivedCall(false);
      setCallAccepted(false);
    };

    const handleCallEnd = (data) => {
      console.log("callEnded invoked", data);
      alert(`Call Ended by ${data.name}`);
      setReceivedCall(false);
      setCallAccepted(false);
      setCallEnded(false);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
    };

    socket.on("callToUser", handleIncomingCall);
    socket.on("callRejected", handleRejectedCall);
    socket.on("callEnded", handleCallEnd);

    return () => {
      socket.off("callToUser", handleIncomingCall);
      socket.off("callRejected", handleRejectedCall);
      socket.off("callEnded", handleCallEnd);
    };
  }, [isLoggedIn, socket, socketId, token]);

  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
      myVideo.current
        .play()
        .catch((err) => console.error("MyVideo play error:", err));
    }
  }, [stream]);

  const callToUser = (id) => {
    if (!stream) {
      console.error("Stream is not available yet");
      return;
    }

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log("🛠 Emitting callToUser event with:", {
        callToUserId: id,
        signalData: data,
        from: socketId,
        name: localStorage.getItem("userName") || "dinesh",
      });
      socket.emit("callToUser", {
        callToUserId: id,
        signalData: data,
        from: socketId,
        name: localStorage.getItem("userName") || "dinesh",
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
        userVideo.current
          .play()
          .catch((err) => console.error("UserVideo play error:", err));
      }
    });

    socket.once("callAccepted", (data) => {
      console.log("call is accepted", data);
      setCallAccepted(true);
      setCaller(data.from);
      peer.signal(data.signal);
      // No navigation for caller; they’re already on /dashboard/calls
    });

    connectionRef.current = peer;
  };

  const handleAcceptCall = () => {
    setCallAccepted(true);
    setReceivedCall(false);

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller, from: socketId });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
        userVideo.current
          .play()
          .catch((err) => console.error("UserVideo play error:", err));
      }
    });

    connectionRef.current = peer;
    peer.signal(callerSignal);
    navigate("/dashboard/calls"); // Receiver navigates to /dashboard/calls
  };

  const handleRejectCall = () => {
    console.log("call rejected");
    setReceivedCall(false);
    setCallAccepted(false);
    socket.emit("reject-call", {
      to: caller,
      name: localStorage.getItem("userName") || "dinesh",
    });
  };

  const leaveCall = () => {
    setReceivedCall(false);
    setCallAccepted(false);
    setCallEnded(false);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    socket.emit("call-ended", {
      to: caller,
      name: localStorage.getItem("userName") || "dinesh",
    });
  };

  return (
    <CallContext.Provider
      value={{
        callToUser,
        callAccept,
        myVideo,
        userVideo,
        leaveCall,
      }}
    >
      {children}
      {receivedCall && !callAccept && (
        <CallNotification
          callerName={callerName}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
