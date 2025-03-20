import { useState, useEffect } from "react";

export const useUserMedia = (videoRef) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mediaStream = null;

    const getUserMedia = async () => {
      try {
        // ✅ Check if media devices are available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Media devices not supported.");
          return;
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("❌ Error accessing media devices:", err);
      }
    };

    getUserMedia();

    return () => {
      // ✅ Proper cleanup: Stop all tracks when component unmounts
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // ✅ Removed unnecessary dependencies to prevent multiple calls

  return { stream };
};
