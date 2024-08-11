import { useCallback, useState } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { TbPhotoPlus } from "react-icons/tb";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { useDropzone } from "react-dropzone";

interface TextControlBoxProps {
  onMessageSend: (data: {
    textMessage?: string;
    images?: string[];
    caption?: string;
  }) => void;
}

const TextControlBox: React.FC<TextControlBoxProps> = ({ onMessageSend }) => {
  const [textMessage, setTextMessage] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        setPreviews((prev) => [...prev, base64Image]); // Add each image to the previews array
        console.log("Msge", textMessage, caption);
        setCaption(textMessage); // Set textMessage to the image caption
        setTextMessage(""); // Clear the text message if an image is selected
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSendMessage = () => {
    const messageData: {
      textMessage?: string;
      images?: string[];
      caption?: string;
    } = {};

    if (textMessage.trim() !== "") {
      messageData.textMessage = textMessage; // Add text message if it's not empty
    }

    if (previews.length > 0) {
      messageData.images = previews; // Add images if there are any
    }

    if (caption.trim() !== "") {
      messageData.caption = caption; // Add caption if it's not empty
    }

    // if (Object.keys(messageData).length > 0) {
    //   onMessageSend(messageData); // Send message data if any field is present
    //   setPreviews([]); // Clear the previews after sending
    //   setCaption(""); // Clear the caption after sending
    //   setTextMessage(""); // Clear the text message after sending
    // }
    console.log(messageData); // TODO: remove
  };

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const getDisplayText = () => {
    if (!selectedFiles) return "";
    if (selectedFiles.length === 1) return selectedFiles[0].name;
    return `${selectedFiles.length} files selected`;
  };

  const isSendButtonDisabled = textMessage.trim() === "";

  return (
    <div className="relative mx-10 mb-5 rounded-[10px] border-2 border-white shadow-md hover:shadow-lg">
      {previews.length === 0 ? (
        <div>
          <div className="px-4 py-3 flex flex-row gap-4 border-b border-slate-300">
            <span className="p-1 text-[25px] border border-white shadow-md hover:shadow-lg rounded-[7px]">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                id="fileInput"
                className="hidden"
              />
              <label htmlFor="fileInput" className="flex flex-row">
                <HiOutlineDocumentAdd />
                <span className="text-[18px] justify-center content-center text-center">
                  {getDisplayText()}
                </span>
              </label>
            </span>

            <button className="p-1 text-[25px] border border-white shadow-md hover:shadow-lg rounded-[7px]">
              <span {...getRootProps()}>
                <TbPhotoPlus />
                <input {...getInputProps()} multiple />
              </span>
            </button>
            <button className="p-1 text-[25px] border border-white shadow-md hover:shadow-lg rounded-[7px]">
              <AiOutlineVideoCameraAdd />
            </button>
          </div>

          <div className="relative mt-5 justify-center content-center text-center">
            <textarea
              className="w-[95%] mx-5 mb-5 py-3 pl-3 pr-12 rounded-[7px] h-5vh resize-none focus:outline-none shadow-sm hover:shadow-md"
              placeholder="Write a message"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
            ></textarea>
            <button
              className={`absolute right-8 top-2 p-1 text-[25px] border border-white shadow-md rounded-[7px] bg-blue-100 ${isSendButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
              onClick={handleSendMessage}
              disabled={isSendButtonDisabled}
            >
              <IoSend />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-[80vh] justify-center content-center text-center mt-3 mx-5">
          <div className="h-[65vh] overflow-y-scroll">
            {previews.map((preview, index) => (
              <div key={index} className="mb-5">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
          <div className="relative mt-5 justify-center text-center content-center">
            <textarea
              className="w-[95%] mx-5 mb-5 py-3 pl-3 pr-12 rounded-[7px] h-5vh resize-none focus:outline-none shadow-sm hover:shadow-md"
              placeholder="Add a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
            <button
              className="absolute right-8 top-2 p-1 text-[25px] border border-white shadow-md hover:shadow-lg rounded-[7px] bg-blue-100"
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
