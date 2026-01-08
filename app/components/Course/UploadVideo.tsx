import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getApiUrl } from "@/app/utils/socketConfig";

type Props = {
  onUploadComplete?: (videoUrl: string, videoLength?: number) => void;
};

const API_URL = getApiUrl();

const VideoUpload: FC<Props> = ({ onUploadComplete }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Convert video file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  // Get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(t("please-select-video"));
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const base64Video = await convertToBase64(file);
      const videoDuration = await getVideoDuration(file);
      const videoLengthInMinutes = Math.ceil(videoDuration / 60); // Convert seconds to minutes
      
      const response = await axios.post(`${API_URL}/upload-video`, { video: base64Video });

      setMessage(response.data.message);
      setVideoUrl(response.data.videoUrl);
    //  console.log(response.data.videoUrl , "response.data.videoUrl");

      // Call onUploadComplete with videoUrl and videoLength
      if (onUploadComplete) {
        onUploadComplete(response.data.videoUrl, videoLengthInMinutes);
      }

    } catch (error) {
      setMessage(t("upload-failed"));
    } finally {
      setUploading(false);
    }
  };
 // console.log(videoUrl  , "videoUrl")
  

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">{t("upload-video")}</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? t("uploading") : t("upload")}
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
      {videoUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{t("uploaded-video")}</h3>
          <video src={videoUrl} controls className="w-full max-w-lg"></video>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
