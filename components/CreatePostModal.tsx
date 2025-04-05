"use client";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "@/public/avatar.jpg";
import { ArrowUpFromLine } from "lucide-react";
import { ImagePlay } from "lucide-react";
import { MapPinPlus } from "lucide-react";
import ImageUpload from "./ImageUpload";

Modal.setAppElement("body");

export default function CreatePostModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // 🔥 IF ANY ERROR OCCURS WITH HANDLING THE INPUT DATA THROUGH MODAL TRY THIS OR REMOVE IT LATER
  // useEffect(() => {
  //   if (modalIsOpen) {
  //     const textarea = document.getElementById("content") as HTMLTextAreaElement;
  //     if (textarea) {
  //       textarea.style.height = "auto";
  //       textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
  //     }
  //   }
  // }, [modalIsOpen]);
  

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!content.trim()) {
      throw new Error("Content cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }), // Wrap content in an object
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("response not ok");
        return;
      }

      {file && handleUpload()};

      setContent(""); // Clear the textarea
      setModalIsOpen(false); // Close the modal
    } catch (error: any) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      setPreview(null);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {/* Button to open the modal */}
      <button
        onClick={() => setModalIsOpen(true)}
        className=" rounded-xl w-[12rem] h-12 text-xl bg-amber-200 text-black hover:opacity-90 transition duration-300 ease-in-out"
      >
        Post
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal-content" // Apply animation class
        overlayClassName="modal-overlay" // Custom overlay styling
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[300px] max-h-[80vh] overflow-hidden">
          <textarea
            name="content"
            id="content"
            placeholder="What's on your mind?"
            className="flex-grow ml-[3rem] text-white rounded-md p-2 resize-none focus:outline-none overflow-y-auto"
            value={content}
            onChange={(e) => {
              const textarea = e.target;
              textarea.style.height = "auto"; // reset first
              textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px"; // max height = 300px
              setContent(e.target.value);
            }}
            style={{ lineHeight: "1.5", minHeight: "100px" }}
          ></textarea>
          <div>
            {/* image preview will come here for creating the post and we need to send it to the carouesl as a prop*/}
            {preview && <div  className="mt-4 flex-grow overflow-y-auto border border-gray-600 rounded-md p-2"><Image src={preview} alt="Preview" width={200} height={200} unoptimized /></div>}
          </div>
          <div className="flex justify-between mt-4 items-center">
            <div className="flex space-x-2">
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                style={{ cursor: "pointer" }}
              >
                <ArrowUpFromLine />
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <ImagePlay /> {/* this is for giphy */}
              <MapPinPlus />
              {/* this is for marking the location of the post */}
            </div>
            <button
              type="submit"
              disabled={!content.trim() && !preview}
              className={`bg-amber-200 text-black text-md px-4 py-2 rounded-md hover:opacity-90 transition duration-300 ease-in-out ${
                content.trim() || preview
                  ? "bg-amber-200 text-black hover:opacity-90"
                  : "bg-white text-gray-700 cursor-not-allowed"
              }`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
          <div className="w-[2.5rem] h-[2.5rem] absolute">
            <Image
              src={avatar}
              alt="User Image"
              className="rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </form>
      </Modal>

      {/* Tailwind + CSS for Modal Animation */}
      <style jsx global>{`
        .modal-overlay {
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Align modal to the top */
          padding-top: 20px; /* Add some space from the top */
          margin-top: 9rem;
          z-index: 1050;
        }

        .modal-content {
          width: 800px;
          /*height: 300px*/
          padding: 20px;
          background: black; /* Changed background to black */
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
          transform: translateY(100%);
          animation: slide-up 0.3s ease-out forwards;
          color: white;
          z-index: 1100;
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(-20%);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
