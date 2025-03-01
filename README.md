# Chat web application using React + Vite

### Get Started

```
// Command to clone the repository
clone https://github.com/KodeVana-Org/chatly-frontend.git

```

### Navigations

```js
const NAVIGATION = [
  {
    key: 0,
    title: "chat",
    icon: <Chat size={24} />,
    path: "/dashboard",
  },
  {
    key: 1,
    title: "Calls",
    icon: <Phone size={24} />,
    path: "/dashboard/calls",
  },
  {
    key: 2,
    title: "Chat with AI",
    icon: <OpenAiLogo size={24} />,
    path: "/dashboard/ai",
  },
  {
    key: 3,
    title: "Toonify",
    icon: <FinnTheHuman size={24} />,
    path: "/dashboard/toonify",
  },
  {
    key: 4,
    title: "Profile",
    icon: <UserCircle size={24} />,
    path: "/dashboard/profile",
  },
];
```

### Socket emmits

```js
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

    socket.disconnect();
    console.log("Disconnected from socket server");
  }
};
```

### Supabase cloud storage

```js
export const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;

  // Determine the MIME type of the file
  const contentType = file.type || "application/octet-stream";

  const { data, error } = await supabase.storage
    .from("chatly")
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType,
    });

  if (error) {
    throw new Error("Error uploading file: " + error.message);
  }

  const urlData = supabase.storage.from("chatly").getPublicUrl(fileName);

  return urlData?.data?.publicUrl;
};
```

### Tools in use

- **toastify** for notification
- **emoji-mart** for emoji conversations
- **giphy** for interactive gif stickers
- **phosphor-icons** for icon packs
- **reduxjs** for state management
- **axios** for api calls
- **dropzone** for drag & drop
- **react-audio-voice-recorder** for audio sharing in the chat
- **socket.io-client** for streamlining chats
- **wavesurfer.js** to show audio in wave structure
