import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qvqhlujufamhjdvrgjyh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cWhsdWp1ZmFtaGpkdnJnanloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMjYwMjYsImV4cCI6MjA1NTYwMjAyNn0.JLayl4GrK7vXv7SRXgTVTWLyHfsASgkYvKwmfBY6vcI";
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  
  // Determine the MIME type of the file
  const contentType = file.type || "application/octet-stream"; // Default to binary stream if no type is found
  
  const { data, error } = await supabase.storage
    .from("chatly")
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType, // Set content type explicitly
    });

  if (error) {
    throw new Error("Error uploading file: " + error.message);
  }

  const urlData = supabase.storage.from("chatly").getPublicUrl(fileName);

  return urlData?.data?.publicUrl; // Return the public URL of the uploaded file
};
