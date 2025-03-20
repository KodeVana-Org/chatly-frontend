import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { Container } from "react-bootstrap";
import SimplePeer from "simple-peer";

import { useUserMedia } from "./useMediaHook";
import UserList from "./UserList";
//import CallNotification from "./CallNotification";
import { useSelector } from "react-redux";
import CallNotification from "./CallNotification";

const AudioCall = () => {
  const [receivedCall, setReceivedCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState("");
  const [callAccept, setCallAccepted] = useState(false);
  //const [callSocketId, setCallerSocketId] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const { isLoggedIn, token, socket, socketId } = useSelector(
    (state) => state.auth,
  );
  //const { user } = useSelector((state) => state.user);

  const location = useLocation();
  const { user } = location.state || {};
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const { stream } = useUserMedia(myVideo);
  const connectionRef = useRef();

  useEffect(() => {
    console.log("socketId:", socketId);
    console.log("socket:", socket);
    console.log("user from redux:", user);
    console.log("Token from redux:", token);

    if (!isLoggedIn) return;

    socket.on("onlineUsers", (onlineUsers) => {
      console.log("Received onlineUsers:", onlineUsers);
      setUsers(onlineUsers);
    });

    const handleInconningCall = (data) => {
      console.log("📞 Incoming call event received!", data);
      setReceivedCall(true);
      setCaller(data.from); // this is the socket id
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
      alert(`Call is Ended from ${data.name}`);
      setReceivedCall(false);
      setCallAccepted(false);
      setCallEnded(false);
      connectionRef.current.destroy();
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
    };

    socket.on("callToUser", handleInconningCall);
    socket.on("callRejected", handleRejectedCall);
    socket.on("callEnded", handleCallEnd);

    return () => {
      if (socket) {
        socket.off("callToUser", handleInconningCall);
        socket.off("callRejected", handleRejectedCall);
        socket.off("connect_error");
        socket.off("userList");
        socket.off("onlineUsers");
        socket.disconnect();
      }
    };
  }, [isLoggedIn, token, socket]);

  const callToUser = (id) => {
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
          from: socketId,
          name: "dinesh",
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
  const handleRejectCall = () => {
    console.log("call rejectred");
    setReceivedCall(false);
    setCallAccepted(false);
    socket.emit("reject-call", {
      to: caller,
      name: localStorage.getItem("userName"), // this is username which wil popup with name in alrt
    });
  };

  // accept Call
  const handleAcceptCall = () => {
    setCallAccepted(true);

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller, from: socketId });
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
  const leaveCall = () => {
    setReceivedCall(false);
    setCallAccepted(false);
    setCallEnded(false);
    connectionRef.current.destroy();
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    socket.emit("call-ended", {
      to: caller,
      name: "dinesh",
    });
  };

  if (!isLoggedIn) {
    return <div>Please log in to use audio calls</div>;
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f3f4f6",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "1000px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* User List */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <UserList callUser={callToUser} />
      </div>

      {/* Call Notification */}
      {/*{receivedCall && !callAccept ? (
        <div
          style={{
            backgroundColor: "#fefcbf",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #fbbf24",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#b45309",
            }}
          >
            Incoming call from {callerName}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleAcceptCall}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#fff",
                backgroundColor: "#22c55e",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#16a34a")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#22c55e")
              }
            >
              Accept
            </button>
            <button
              onClick={handleRejectCall}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#fff",
                backgroundColor: "#ef4444",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#dc2626")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#ef4444")
              }
            >
              Reject
            </button>
          </div>
        </div>
      ) : null} */}
      {receivedCall && !callAccept ? (
        <CallNotification
          callerName={callerName}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      ) : null}

      {/* End Call Button */}
      {callAccept && !callEnded ? (
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={leaveCall}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: "#ef4444",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc2626")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#ef4444")
            }
          >
            End Call
          </button>
        </div>
      ) : null}

      {/* Video Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: "1 1 45%",
            minWidth: "300px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            My Video
          </h2>
          <video
            ref={myVideo}
            autoPlay
            muted
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              borderRadius: "8px",
              backgroundColor: "#000",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            flex: "1 1 45%",
            minWidth: "300px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            User Video
          </h2>
          <video
            id="remove-video"
            ref={userVideo}
            autoPlay
            muted
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              borderRadius: "8px",
              backgroundColor: "#000",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
