const formatMessageTime = (timestamp: string) => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const timeDiff = now.getTime() - messageDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert ms to hours

  if (hoursDiff < 24) {
    // Show time if less than 24 hours ago
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (hoursDiff < 48) {
    // Show "Yesterday" if between 24-48 hours
    return "Yesterday";
  } else {
    // Show date if more than 48 hours ago
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export default formatMessageTime;
