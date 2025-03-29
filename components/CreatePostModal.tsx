"use client";
import Modal from "react-modal";
import { useState } from "react";
import Image from "next/image";
import avatar from "@/public/avatar.jpg"

// Set the app element for accessibility
Modal.setAppElement("body");

export default function CreatePostModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="flex justify-center items-center">
      {/* Button to open the modal */}
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Create Post
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
            className="flex-grow border border-gray-500 bg-gray-800 text-white rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex justify-end mt-4 space-x-2">
            {/* <button
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button> */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Post
            </button>
          </div>
          <div className="w-[2.5rem] h-[2.5rem] relative">
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
            transform: translateY(-30%);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
