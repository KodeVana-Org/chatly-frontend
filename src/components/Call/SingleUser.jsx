import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCall } from "./CallContext";

const SingleUser = () => {
  const { userList, userId } = useSelector((state) => state.auth);
  const { callToUser, callAccept, myVideo, userVideo, leaveCall } = useCall();

  useEffect(() => {
    if (callAccept && myVideo.current && userVideo.current) {
      console.log("Call accepted, ensuring video streams are attached");
      // No need to reattach stream here since it's handled in CallContext
    }
  }, [callAccept, myVideo, userVideo]);

  if (!userList || userList.length === 0) {
    return <p>No users available to call</p>;
  }

  return (
    <div className="w-full p-7">
      <h2 className="mb-2.5 text-2xl font-semibold leading-[48px] text-black dark:text-white">
        Available Users
      </h2>
      <div className="flex flex-col gap-7">
        {userList
          .filter((user) => user.id !== userId) // Exclude current user
          .map((user) => (
            <div
              key={user.id}
              className="flex w-full justify-between cursor-pointer items-center rounded px-4 py-3 bg-gray dark:bg-boxdark-2 dark:hover:bg-strokedark hover:bg-gray-2 dark:hover:bg-boxdark-2/90"
            >
              <div className="flex flex-col gap-2">
                <p className="text-md font-medium text-black dark:text-white">
                  {user.name}
                </p>
                <p
                  className={`text-sm font-medium ${user.status === "Online" ? "text-green-500" : "text-red-500"}`}
                >
                  {user.status}
                </p>
              </div>
              <div>
                <button
                  onClick={() => callToUser(user.id, false)} // Video call only
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
              muted={false}
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
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "#fff",
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
      )}
    </div>
  );
};

export default SingleUser;
