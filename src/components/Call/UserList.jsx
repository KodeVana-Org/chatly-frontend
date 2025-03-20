import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UserList = ({ callUser }) => {
  const { userList, userId } = useSelector((state) => state.auth);

  // Add a loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(userList) && userId) {
      setLoading(false);
    }
  }, [userList, userId]);

  if (loading) {
    return <p>Loading users...</p>;
  }
  const handleCallClick = (userId) => {
    console.log("callign user id", userId);
    callUser(userId);
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: "15px",
          textAlign: "center",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "10px",
        }}
      >
        Audio Call
        <br />
        <br />
        User List
      </h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {userList
          .filter((user) => user.id !== userId) // Exclude current user
          .map((user) => (
            <li
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 15px",
                marginBottom: "10px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      user.status === "Online" ? "#22c55e" : "#ef4444",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  {user.name}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: user.status === "Online" ? "#16a34a" : "#dc2626",
                    textTransform: "capitalize",
                  }}
                >
                  {user.status}
                </span>
                <button
                  onClick={() => handleCallClick(user.id)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#ffffff",
                    backgroundColor: "#3b82f6",
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
                  Call
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
