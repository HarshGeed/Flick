"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/imageUpload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setUploadedUrl(data.url);
    } else {
      alert("Upload failed");
    }
  };

  useEffect(() => {
    if (uploadedUrl) {
      console.log("Uploaded URL:", uploadedUrl);
    }
  }, [uploadedUrl]);

  return (
    <>
      <div onClick={() => document.getElementById("fileInput")?.click()} style={{ cursor: "pointer" }}>
      <ArrowUp/>
      </div>
      <input
      id="fileInput"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      style={{ display: "none" }}
      />
      {preview && <Image src={preview} alt="Preview" width={200} height={200} unoptimized />}
      {/* <button onClick={handleUpload}>Upload</button> */}

      {uploadedUrl && (
      <div>
        <p>Uploaded Image:</p>
        <Image src={uploadedUrl} alt="Uploaded" width={200} height={200} unoptimized />
      </div>
      )}
    </>
  );
}
