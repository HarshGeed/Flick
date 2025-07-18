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

export default function CreatePostModal() {
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    setModalIsOpen(false); // Close the modal
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
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: session?.user?.name,
          content: content.trim() || null,
          image: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("response not ok");
        return;
      }

      //emit the post to data server
      socket.emit("new_post", {
        username: session?.user?.name,
        content,
        image: imageUrls,
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
        onRequestClose={handleCloseModal}
        className="modal-content" // Apply animation class
        overlayClassName="modal-overlay" // Custom overlay styling
        bodyOpenClassName="overflow-hidden"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full min-h-[300px] max-h-[80vh] overflow-hidden"
        >
          <div className="flex-grow overflow-y-auto">
            <div
              contentEditable
              id="content"
              placeholder="What's on your mind?"
              className="pl-[3rem] pr-2 w-full text-white rounded-md resize-none focus:outline-none overflow-y-auto"
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
              style={{ lineHeight: "1.5", minHeight: "100px", color: "white" }}
            ></div>
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
          <div className="w-[2.5rem] h-[2.5rem] absolute">
            <Image
              src={default_userImg}
              alt="User Image"
              className="rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </form>
      </Modal>
      
    </div>
  );
}
