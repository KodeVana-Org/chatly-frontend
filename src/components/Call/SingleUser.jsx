import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCall } from "./CallContext";

const SingleUser = () => {
  const { userList, userId } = useSelector((state) => state.auth);
  const { callToUser, callAccept, myVideo, userVideo, leaveCall, stream } =
    useCall();

  useEffect(() => {
    console.log("SingleUser useEffect", {
      callAccept,
      myVideoCurrent: myVideo.current,
      stream,
    });
    if (callAccept && myVideo.current && userVideo.current) {
      console.log("Call accepted, myVideo ref:", myVideo.current);
      console.log("My video stream:", myVideo.current.srcObject);
      if (!myVideo.current.srcObject && stream) {
        console.log("Attaching stream from context to myVideo");
        myVideo.current.srcObject = stream;
        myVideo.current
          .play()
          .catch((err) => console.error("Play error:", err));
      } else if (!myVideo.current.srcObject) {
        console.error(
          "Stream missing after call accepted, and no stream in context",
        );
      }
    } else {
      console.log("Conditions not met:", {
        callAccept,
        myVideoCurrent: myVideo.current,
        userVideoCurrent: userVideo.current,
      });
    }
  }, [callAccept, myVideo, userVideo, stream]);

  if (!userList || userList.length === 0) {
    return <p>No users available to call</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#1f2937" }}>
        Available Users
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {userList
          .filter((user) => user.id !== userId)
          .map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: "500", color: "#1f2937" }}>
                  {user.name}
                </p>
                <p style={{ margin: 0, fontWeight: "500", color: "red" }}>
                  {user.status}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  UserId: {user.id}
                </p>
              </div>
              <div>
                <button
                  onClick={() => callToUser(user.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                  }
                >
                  Video Call
                </button>
              </div>
            </div>
          ))}
      </div>

      {callAccept && (
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              My Video
            </h3>
            <video
              ref={myVideo}
              autoPlay
              muted
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
                backgroundColor: "#000",
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              User Video
            </h3>
            <video
              ref={userVideo}
              autoPlay
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
                backgroundColor: "#000",
              }}
            />
          </div>
          <button
            onClick={leaveCall}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleUser;
