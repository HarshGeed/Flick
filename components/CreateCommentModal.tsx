"use client";
import Modal from "react-modal";
import socket from "@/lib/socket";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpFromLine } from "lucide-react";
import { ImagePlay } from "lucide-react";
import { MapPinPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Carousel from "./PostImageCarousel";
import default_userImg from "@/public/default-userImg.png";

Modal.setAppElement("body");

export default function CreateCommentModal({
  postId,
  previewContent,
  postUsername,
  postProfileImg,
  onClose,
  onOpen,
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [preview, setPreview] = useState(null);
  const MAX_IMAGES = 7;

  const resetModalState = () => {
    setContent("");
    setLoading(false);
    setFiles(null);
    setPreview(null);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    resetModalState(); // Reset the modal state
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > MAX_IMAGES) {
      alert(`You can only post ${MAX_IMAGES} at a time`);
      return;
    }

    setFiles(selectedFiles);

    const newPreview: string[] = [];
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreview.push(reader.result as string);
        if (newPreview.length === selectedFiles.length) {
          setPreview(newPreview);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // this is for image upload
  const handleUpload = async () => {
    if (!files || files.length === 0) return [];
    const urls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("The response is not OK..");
      }

      const data = await res.json();
      if (data.urls) {
        urls.push(...data.urls);
      } else {
        alert("One of the image upload failed");
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!content.trim() && (!files || files.length === 0)) {
      setLoading(false);
      alert("Oops there is not content to post");
      return;
    }

    try {
      const imageUrls = await handleUpload();
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          user: session?.user?.id,
          text: content.trim() || null,
          image: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("response not ok");
        return;
      }

      //emit the comment to data server
      socket.emit("new_comment", {
        username: session?.user?.name,
        text: content.trim() || null,
        postId,
        image: imageUrls,
        commentCount: data.commentCount,
      });

      handleCloseModal();
    } catch (error: any) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {/* Modal */}
      <Modal
        isOpen={onOpen}
        onRequestClose={handleCloseModal} // here onClose prop will come
        className="modal-content" // Apply animation class
        overlayClassName="modal-overlay" // Custom overlay styling
        bodyOpenClassName="overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[300px] max-h-[80vh] overflow-hidden">
          {/* here the preview of post will come  */}

          <div className="flex-grow overflow-y-auto">
            <div className="flex opacity-80">
              <div className="w-[2.5rem] h-[2.5rem]">
                <Image
                  src={default_userImg}
                  alt="user_profile_image"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-2">
                <p className="font-semibold text-sm">{postUsername}</p>
                <p>{previewContent}</p>
              </div>
            </div>
            <div className="flex items-start overflow-y-auto mt-[2rem]">
              <div className="w-[2.5rem] h-[2.5rem] relative">
                <Image
                  src={default_userImg}
                  alt="User Image"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              </div>
              <div
                contentEditable
                id="content"
                placeholder="What's on your mind?"
                className="px-3 w-full text-white rounded-md resize-none focus:outline-none overflow-y-auto"
                value={content}
                // onChange={(e) => {
                //   const textarea = e.target;
                //   textarea.style.height = "auto"; // reset first
                //   textarea.style.height =
                //     Math.min(textarea.scrollHeight, 400) + "px"; // max height = 300px
                //   setContent(e.target.value);
                // }}
                onInput={(e) => {
                  const div = e.target as HTMLDivElement;
                  setContent(div.innerText);
                }}
                style={{
                  lineHeight: "1.5",
                  minHeight: "150px",
                  color: "white",
                }}
              ></div>
            </div>
              <div className="px-3">
                {/* Testing */}
                {/* image preview will come here for creating the post and we need to send it to the carouesl as a prop*/}
                {preview !== null && (
                  <div className="mt-4 w-full h-[400px] overflow-hidden border border-gray-600 rounded-md">
                    <Carousel images={preview} pageNos={true} />
                  </div>
                )}
              </div>
          </div>
          {/* fixed section */}
          <div className="flex justify-between items-center bg-black mt-2">
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
                accept="image/*,video/*"
                multiple
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
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: black; /* Changed background to black */
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
          oveflow-y: auto;
          transform: translateY(100%);
          animation: slide-up 0.3s ease-out forwards;
          color: white;
          z-index: 1100;
        }

        .overflow-hidden {
          overflow: hidden;
        }

        /* Scrollbar Customization */
        .modal-content::-webkit-scrollbar,
        .flex-grow::-webkit-scrollbar {
          width: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb,
        .flex-grow::-webkit-scrollbar-thumb {
          background-color: black !important; /* Scrollbar thumb color */
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-track,
        .flex-grow::-webkit-scrollbar-track {
          background-color: gray !important; /* Scrollbar track color */
        }

        /* Firefox Scrollbar */
        .modal-content,
        .flex-grow {
          scrollbar-color: black #f0f0f0; /* Thumb color and track color */
          scrollbar-width: thin; /* Make the scrollbar thinner */
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

        #content:empty::before {
          content: attr(placeholder);
          color: gray;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
