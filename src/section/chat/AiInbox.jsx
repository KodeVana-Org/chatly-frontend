import { useState } from "react";
import { PaperPlaneTilt, OpenAiLogo } from "@phosphor-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./temp/style.css";

export default function ChatWithCodeRendering() {
  const [userText, setUserText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userText.trim()) return;

    const userMessage = { text: userText, sender: "user" };
    setMessages([userMessage, ...messages]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:6996/user/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { text: data.response, sender: "ai" };
      setMessages([aiMessage, userMessage, ...messages]);
      setUserText("");
    } catch (error) {
      console.error("Error sending message to AI server:", error);
      setMessages([
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
        },
        userMessage,
        ...messages,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch((err) => console.error("Failed to copy to clipboard:", err));
  };

  const renderMessageContent = (text, sender) => {
    // Extract code blocks with language (e.g., ```javascript\ncode\n```)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(renderText(beforeText));
      }

      // Add the code block
      const language = match[1] || "plaintext"; // Default to plaintext if no language specified
      const code = match[2].trim();
      parts.push(
        <div key={`code-${match.index}`} className="code-block">
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(code)}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              padding: "4px 8px",
              backgroundColor: "#4b5563",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Copy
          </button>
          <SyntaxHighlighter language={language} style={atomDark}>
            {code}
          </SyntaxHighlighter>
        </div>,
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last code block
    if (lastIndex < text.length) {
      parts.push(renderText(text.slice(lastIndex)));
    }

    return parts.length > 0 ? parts : renderText(text);
  };

  const renderText = (text) => {
    // Simple markdown-like parsing for bold and italic
    const lines = text.split("\n").map((line, i) => {
      let formattedLine = line;

      // Bold: **text**
      formattedLine = formattedLine.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>",
      );
      // Italic: *text*
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");

      return (
        <p
          key={i}
          style={{
            margin: "0 0 8px 0",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });

    return lines;
  };

  return (
    <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark w-full">
      <div className="sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5">
        <div className="flex items-center">
          <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full flex items-center justify-center">
            <OpenAiLogo size={32} />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white text-nowrap">
              Chat with AI
            </h5>
          </div>
        </div>
      </div>

      <div className="chat-box p-5 overflow-y-auto" style={{ flexGrow: 1 }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`relative max-w-[80%] chat-message ${msg.sender === "user" ? "bg-primary text-white self-end" : "bg-[#1f2937] text-white self-start"} mb-4 px-3 py-4 rounded-lg`}
          >
            {renderMessageContent(msg.text, msg.sender)}
          </div>
        ))}
        {loading && (
          <div className="max-w-[80%] chat-message ai mb-3 px-2 py-3 rounded-lg bg-[#1f2937] text-white self-start">
            Thinking...
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between space-x-4.5">
          <div className="relative w-full">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Send Message..."
              className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userText}
            className={`flex items-center justify-center h-13 w-13 rounded-md hover:bg-opacity-90 ${
              !userText
                ? "bg-gray text-body dark:bg-boxdark-2 dark:text-body"
                : "bg-primary text-white"
            }`}
          >
            <PaperPlaneTilt size={24} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
