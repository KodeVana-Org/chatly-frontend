import { createContext, useContext, useState, ReactNode } from "react";

// Define Context Type
interface ChatContextType {
  conversationId: string | null;
  setConversationId: (id: string) => void;
  receiverId: string | null;
  setRecieverId(id: string): void;
}

// Create Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider Component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [receiverId, setRecieverId] = useState<string | null>(null);

  return (
    <ChatContext.Provider
      value={{ conversationId, setConversationId, receiverId, setRecieverId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom Hook to use Chat Context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
