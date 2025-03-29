"use client";
import Modal from "react-modal";
import { useState } from "react";
import Image from "next/image";
import avatar from "@/public/avatar.jpg";
import { ArrowUpFromLine } from "lucide-react";
import { ImagePlay } from "lucide-react";
import { MapPinPlus } from "lucide-react";

// Set the app element for accessibility
Modal.setAppElement("body");

export default function CreatePostModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
        <div className="flex flex-col h-full">
          <textarea
            placeholder="What's on your mind?"
            className="flex-grow ml-[3rem] text-white rounded-md p-2 resize-none focus:outline-none"
          ></textarea>
          <div className="flex justify-between mt-4 items-center">
            <div className="flex space-x-2">
              <ArrowUpFromLine/>
              <ImagePlay/>
              <MapPinPlus/>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
              Post
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
        </div>
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
          align-items: center;
        }

        .modal-content {
          width: 800px;
          height: 300px;
          padding: 20px;
          background: black; /* Changed background to black */
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
          transform: translateY(100%);
          animation: slide-up 0.3s ease-out forwards;
          color: white;
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
