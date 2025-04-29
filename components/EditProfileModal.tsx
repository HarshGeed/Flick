"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import Modal from "react-modal";
export default function EditProfileModal({ openState, onClose }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/profilePageData/profileData");
        if (!res.ok) throw new Error("Failed to fetch the user data");
        const userData = await res.json();
        setUser(userData);
        setUsername(userData.username || "");
        setBio(userData.bio || "");
        setLocation(userData.location || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);
  return (
    <>
      <Modal
        isOpen={openState}
        onRequestClose={onClose}
        className="modal-content" // Apply animation class
        overlayClassName="modal-overlay" // Custom overlay styling
        bodyOpenClassName="overflow-hidden"
      >
        <div className="flex-col">
          <div className="flex justify-between items-center w-full">
            <h3>Edit Profile</h3>
            <button
              className="bg-gray-900 px-4 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition ease-in-out duration-300"
              type="submit"
            >
              Save
            </button>
          </div>
          <div className="w-full h-[10rem] bg-gray-800 rounded-t-xl opacity-70 relative mt-4">
            <button className="w-full h-full flex items-center justify-center cursor-pointer z-10">
              <Pencil />
            </button>
            <div className="bg-gray-700 w-[7rem] h-[7rem] left-8 absolute top-[7rem] rounded-full">
              <button className="w-full h-full flex items-center justify-center cursor-pointer z-10">
                <Pencil />
              </button>
            </div>
          </div>
          {/* form data */}
          <form action="" className="mt-[5rem]">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block px-3 pt-9 pb-2 w-full text-base text-white bg-transparent border border-gray-500 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-gray-800 peer"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute text-sm text-gray-400 top-3 left-3 z-10 peer-focus:text-gray-700 transition-colors"
              >
                Username
              </label>
            </div>

            {/* Bio */}
            <div className="relative z-0 w-full mb-6 group">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="block px-3 pt-9 pb-2 w-full text-base text-white bg-transparent border border-gray-500 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-gray-800 peer"
                rows={3}
              ></textarea>
              <label className="absolute text-sm text-gray-400 top-3 left-3 z-10 peer-focus:text-gray-700 transition-colors">
                Bio
              </label>
            </div>
            {/* Location */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block px-3 pt-9 pb-2 w-full text-base text-white bg-transparent border border-gray-500 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-gray-800 peer"
              />
              <label className="absolute text-sm text-gray-400 top-3 left-3 z-10 peer-focus:text-gray-700 transition-colors">
                Location
              </label>
            </div>
          </form>
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
          align-items: flex-start; /* Align modal to the top */
          padding-top: 20px; /* Add some space from the top */
          margin-top: 9rem;
          z-index: 1050;
        }

        .modal-content {
          width: 650px;
          min-height: 85vh;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: black; /* Changed background to black */
          border-radius: 10px;
          box-shadow: 0 1px 10px rgba(255, 255, 255, 0.2);
          overflow-y: auto;
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
    </>
  );
}
