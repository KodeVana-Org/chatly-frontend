import { useCallback, useRef, useEffect, useState } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { TbPhotoPlus } from "react-icons/tb";
import { FaSmile } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface TextControlBoxProps {
  onMessageSend: (data: {
    textMessage?: string;
    images?: string[];
    caption?: string;
  }) => void;
  onTyping: () => void; // Notify parent when typing starts
  onStopTyping: () => void; // Notify parent when typing stops
}

const TextControlBox: React.FC<TextControlBoxProps> = ({
  onMessageSend,
  onTyping,
  onStopTyping,
}) => {
  const [textMessage, setTextMessage] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          setPreviews((prev) => [...prev, base64Image]);
          setCaption(textMessage);
          setTextMessage("");
        };
        reader.readAsDataURL(file);
      });
    },
    [textMessage],
  );

  // NOTE: Input props for drag and drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  // NOTE: Handle typing state
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping();
    }

    // Clear the previous timeout (if any)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to detect when typing stops
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping();
    }, 1000);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextMessage(e.target.value);
    handleTyping();
  };
  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
    handleTyping();
  };

  // NOTE: Handle send messages
  const handleSendMessage = () => {
    if (!textMessage.trim() && previews.length === 0 && !caption.trim()) return;

    const messageData: {
      textMessage?: string;
      images?: string[];
      caption?: string;
    } = {};

    if (textMessage.trim() !== "") {
      messageData.textMessage = textMessage;
    }
    if (previews.length > 0) {
      messageData.images = previews;
    }
    if (caption.trim() !== "") {
      messageData.caption = caption;
    }

    // NOTE: Send data to parent component
    onMessageSend(messageData);

    // NOTE: Reset input fields after sending message
    setTextMessage("");
    setCaption("");
    setPreviews([]);
    setSelectedFiles(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const getDisplayText = () => {
    if (!selectedFiles) return "";
    if (selectedFiles.length === 1) return selectedFiles[0].name;
    return `${selectedFiles.length} files selected`;
  };

  const handleEmojiSelect = (emoji: any) => {
    setTextMessage((prev) => prev + emoji.native);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mx-10 mb-5 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-[#007BFF]">
      {previews.length === 0 ? (
        <div className="relative text-left">
          {/* Input Box */}
          <div className="relative flex items-center border rounded-[1.8rem]">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-[6rem] left-0 z-50"
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light dark:dark"
                />
              </div>
            )}

            {/* Emoji Picker Button */}
            <button
              className="absolute left-0 bottom-[0.9rem] ml-2 p-2 text-[2rem] text-blue-500"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <FaSmile />
            </button>

            {/* Text Input */}
            <textarea
              className="w-full max-h-[20rem] h-[5rem] py-6 ml-[4rem] mr-[14rem] text-lg outline-none overflow-y-scroll"
              value={textMessage}
              onChange={handleTextChange}
              placeholder="Type a message"
            />
          </div>

          {/* File Picker */}
          <label className="absolute right-[8rem] bottom-[0.9rem] p-2 text-[1.8rem]">
            <HiOutlineDocumentAdd />
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <span className="text-[18px]">{getDisplayText()}</span>
          </label>

          {/* Image Picker */}
          <span
            className="absolute right-[5rem] bottom-[0.9rem] p-2 text-[1.8rem]"
            {...getRootProps()}
          >
            <TbPhotoPlus />
            <input {...getInputProps()} multiple />
          </span>

          {/* Send Button */}
          <button
            className={`absolute right-[1.5rem] bottom-[0.9rem] p-3 text-[1.5rem] text-white rounded-full bg-[#007bff]`}
            onClick={handleSendMessage}
          >
            <IoSend />
          </button>
        </div>
      ) : (
        <div className="relative h-[80vh] justify-center text-center">
          <div className="h-[65vh] overflow-y-scroll">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto mb-5"
              />
            ))}
          </div>
          {/* Caption Box */}
          <div className="relative mt-5">
            <textarea
              className="w-[95%] mb-5 py-3 pl-3 pr-12 rounded-[7px] h-5vh resize-none shadow-sm"
              placeholder="Add a caption"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>
            <button
              className="absolute right-8 top-2 p-1 text-[25px] bg-blue-100"
              onClick={handleSendMessage}
            >
              <IoSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextControlBox;
