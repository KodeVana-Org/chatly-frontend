import React, { useState } from "react";
import axios from "axios";

const ToonifyPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageUrls, setImageUrls] = useState({
    original_url: "",
    generated_url: "",
  });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");
      setImageUrls({ original_url: "", generated_url: "" });

      const response = await axios.post(
        "http://localhost:6969/api/v1/friend/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setImageUrls({
        original_url: response.data.original_url,
        generated_url: response.data.generated_url,
      });

      setSuccessMessage("Image uploaded successfully!");
    } catch (error) {
      setError("Failed to upload image.");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark w-full content-center justify-center items-center pb-96">
      <h2 className="mb-2.5 text-3xl font-black leading-[48px] text-black dark:text-white">
        Upload an Image
      </h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="block w-full max-w-xs px-4 py-2 border border-stroke dark:border-strokedark rounded-md bg-white text-gray-700 cursor-pointer shadow-sm focus:ring focus:ring-blue-300"
      />

      {/* Upload Button */}
      <button
        onClick={() => selectedFile && uploadImage(selectedFile)}
        disabled={!selectedFile || uploading}
        className={`mt-4 px-6 py-2 text-black dark:text-white border-2 border-stroke dark:border-strokedark font-semibold rounded-md shadow-md transition ${
          selectedFile && !uploading
            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-3">{successMessage}</p>
      )}

      {/* Display Images */}
      {imageUrls.original_url && imageUrls.generated_url && (
        <div className="mt-6 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700">
              Original Image
            </h3>
            <img
              src={imageUrls.original_url}
              alt="Original"
              className="w-80 h-96 rounded-md shadow-md mt-2"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700">
              Generated Image
            </h3>
            <img
              src={imageUrls.generated_url}
              alt="Generated"
              className="w-80 h-96 rounded-md shadow-md mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToonifyPage;
