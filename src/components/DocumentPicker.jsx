import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToggleDocumentModal } from "../redux/slices/app";
import FlieDropZone from "./FlieDropZone";
import { uploadToSupabase } from "../utils/supabase";
import { sendDirectMessage } from "../socket/socketConnection";

export default function DocumentPicker() {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { currentConversation } = useSelector((state) => state.chat);

  const [isLoading, setIsLoading] = useState(false);

  // Logged In user - ME
  const { user } = useSelector((state) => state.user);

  const [selectedFiles, setSelectedFiles] = useState([]);

  // State for controlled input
  const [message, setMessage] = useState("");

  // Function to handle file selection from child
  const handleFilesSelected = (files) => {
    // Only keep the first 8 files
    const limitedFiles = files.slice(0, 8);
    setSelectedFiles(limitedFiles);
  };

  const { doc } = useSelector((state) => state.app.modals);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!doc || keyCode !== 27) return;

      dispatch(ToggleDocumentModal(false));
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Function to upload files to Supabase
  const uploadFilesToSupabase = async () => {
    console.log(selectedFiles);
    try {
      const uploadedFileUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const supabaseUrl = await uploadToSupabase(file); // Pass file directly if it's a File object
          return {
            url: supabaseUrl,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2), // Size in MB
          };
        })
      );

      console.log("Files uploaded successfully!", uploadedFileUrls);
      return uploadedFileUrls;
    } catch (error) {
      console.error("Error uploading files:", error.message);
    }
  };

  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      const uploadedUrls = await uploadFilesToSupabase();
      setIsLoading(false);

      console.log(uploadedUrls);

      const data = {
        conversationId: currentConversation,
        message: {
          author: user._id,
          type: "Document",
          content: message,
          document: uploadedUrls[0],
        },
      };

      sendDirectMessage(data);

      setMessage(""); // Clear the input after sending

      // close modal window after sending message
      dispatch(ToggleDocumentModal(false));
    } else {
      alert("Please select file!");
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value); // Update message state
  };

  return (
    <div
      className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        doc ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className="md:px-17.5 w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12 max-h-203"
      >
        <div className="flex flex-row items-center justify-between mb-8 space-x-2">
          <div className="text-md font-medium text-black dark:text-white">
            Choose Files to send
          </div>

          <button
            onClick={() => {
              //
              dispatch(ToggleDocumentModal(false));
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* FileDropzone */}
        <FlieDropZone
          acceptedFiles=".pdf,.ppt,.doc,.docx,.xls,.xlsx,.txt,.csv,.fig,.mp4,.mov"
          maxFileSize={64 * 1024 * 1024}
          multiple={false}
          onFilesSelected={handleFilesSelected}
        />
        <div className="flex flex-row items-center space-x-2 justify-between mt-4">
          <input
            type="text"
            disabled={isLoading}
            value={message} // Bind input value to state
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(e);
            }}
            onChange={handleInputChange} // Handle input changes
            className="border rounded-lg hover:border-primary outline-none w-full p-2 border-stroke dark:border-strokedark bg-transparent dark:bg-form-input"
            placeholder="Type your message..."
          />
          <button
            disabled={isLoading}
            onClick={handleSendMessage}
            className="p-2.5 border border-primary flex items-center justify-center rounded-lg bg-primary hover:bg-opacity-90 text-white"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-gray-200 border-t-primary rounded-full animate-spin"></div> // Tailwind spinner
            ) : (
              <PaperPlaneTilt size={20} weight="bold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
