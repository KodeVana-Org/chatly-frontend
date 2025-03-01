import { useState } from "react";
import { PaperPlaneTilt, OpenAiLogo } from "@phosphor-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./temp/style.css";

export default function ChatWithCodeRendering() {
  const [userText, setUserText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [selectedModel, setSelectedModel] = useState("gemini");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userText.trim()) return;

    const userMessage = { text: userText, sender: "user" };
    setMessages([userMessage, ...messages]);
    setLoading(true);

    // const apiEndpoint =
    //   selectedModel === "gemini"
    //     ? "http://localhost:6969/api/v1/ai"
    //     : "http://localhost:6969/api/v1/deep";

    try {
      const response = await fetch("http://localhost:6969/api/v1/ai", {
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
      console.error("Error sending message to ai server", error);
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

  return (
    <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark w-full">
      <div className="sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5">
        <div className="flex items-center">
          <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
            <OpenAiLogo size={32} />,
          </div>

          <div>
            <h5 className="h-11 font-medium text-black dark:text-white text-nowrap">
              Chat with AI
            </h5>
          </div>
        </div>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === "ai" && msg.text.includes("```") ? (
              <div className="code-block">
                <button
                  className="copy-btn"
                  onClick={() =>
                    copyToClipboard(
                      msg.text.replace(/```[\w]*|```/g, "").trim(),
                    )
                  }
                >
                  Copy
                </button>
                <SyntaxHighlighter language="html" style={atomDark}>
                  {msg.text.replace(/```[\w]*|```/g, "").trim()}
                </SyntaxHighlighter>
              </div>
            ) : (
              msg.text.split("\n").map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    margin: "0 0 8px 0",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {paragraph}
                </p>
              ))
            )}
          </div>
        ))}
        {loading && <div className="chat-message ai">Thinking...</div>}
      </div>

      {/* Input  */}

      <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between space-x-4.5">
          <div className="relative w-full">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMsg(e);
              }}
              type=""
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Send Message..."
              className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary
                dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!userText}
            className={`flex items-center justify-center h-13 max-w-13 w-full rounded-md  hover:bg-opacity-90 ${
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
