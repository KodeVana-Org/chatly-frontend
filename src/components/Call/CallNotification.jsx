import React from "react";
import { Modal, Button } from "react-bootstrap";

const CallNotification = ({ callerName, onAccept, onReject }) => {
  return (
    <Modal
      show={true}
      centered
      backdrop="static"
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slight transparency
        backdropFilter: "blur(5px)", // Glassmorphism effect (if supported)
      }}
    >
      <Modal.Header
        style={{
          background: "linear-gradient(135deg, #4b6cb7, #182848)", // Gradient header
          borderBottom: "none",
          padding: "20px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <Modal.Title
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "600",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {callerName} is calling...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          textAlign: "center",
          padding: "30px",
          backgroundColor: "#f9fafb", // Light gray background
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      >
        <Button
          variant="success"
          onClick={onAccept}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "500",
            backgroundColor: "#22c55e",
            border: "none",
            borderRadius: "8px",
            marginRight: "15px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(34, 197, 94, 0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#16a34a";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#22c55e";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✅ Accept
        </Button>
        <Button
          variant="danger"
          onClick={onReject}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "500",
            backgroundColor: "#ef4444",
            border: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(239, 68, 68, 0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ❌ Reject
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default CallNotification;
