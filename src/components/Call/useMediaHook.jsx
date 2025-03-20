// useMediaHook.js
import { useState, useEffect } from "react";

export const useUserMedia = (videoRef) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current
            .play()
            .catch((err) => console.error("Play error:", err));
        }
      } catch (error) {
        console.error("Failed to get user media:", error);
      }
    };
    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return { stream };
};
