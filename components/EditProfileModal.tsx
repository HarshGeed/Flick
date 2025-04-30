"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import defaultProfileImg from "@/public/default-userImg.png";
import { Pencil } from "lucide-react";
import Modal from "react-modal";

Modal.setAppElement("body");

export default function EditProfileModal({
  openState,
  onClose,
  initialCoverImage,
  initialProfileImage,
}) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [previousCoverImage, setPreviousCoverImage] = useState(initialCoverImage); // Track previous cover image
  const [previousProfileImage, setPreviousProfileImage] = useState(initialProfileImage); // Track previous profile image
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

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
        setCoverImage(userData.coverImage || "");
        setProfileImage(userData.profileImage || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/imageUpload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.urls[0];
  };

  const handleImageSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "cover") {
      setLoadingCover(true);
      const url = await uploadImage(file);
      setPreviousCoverImage(coverImage); // Store the current cover image as the previous one
      setCoverImage(url);
      setLoadingCover(false);
    } else if (type === "profile") {
      setLoadingProfile(true);
      const url = await uploadImage(file);
      setPreviousProfileImage(profileImage); // Store the current profile image as the previous one
      setProfileImage(url);
      setLoadingProfile(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profilePageData/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          location,
          coverImage,
          profileImage,
          previousCoverImage, // Send the previous cover image URL
          previousProfileImage, // Send the previous profile image URL
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUser(updatedUser);
      onClose();

      window.location.reload();
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  if (!user) return <p>Loading...</p>;

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
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <div className="w-full h-[10rem] bg-gray-800 rounded-t-xl opacity-70 relative mt-4 z-10">
            {loadingCover && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="loader"></div> {/* Spinner */}
              </div>
            )}
            {coverImage && (
              <Image
                src={coverImage}
                alt="cover image"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full z-0"
              />
            )}
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={(e) => handleImageSelect(e, "cover")}
              className="hidden"
            />
            <button
              className="absolute top-2 right-2 flex items-center justify-center cursor-pointer z-20 bg-gray-900 p-2 rounded-full hover:bg-gray-700 transition ease-in-out duration-300"
              onClick={() => coverInputRef.current?.click()}
            >
              <Pencil />
            </button>
          </div>
          <div className="bg-gray-700 w-[7rem] h-[7rem] left-10 absolute top-[11rem] rounded-full overflow-hidden z-10">
            {loadingProfile && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="loader"></div> {/* Spinner */}
              </div>
            )}
            <Image
              src={profileImage || defaultProfileImg}
              alt="profile image"
              layout="fill"
              objectFit="cover"
              className="absolute top-0 left-0 w-full h-full z-0"
            />
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e, "profile")}
              className="hidden"
            />
            <button
              className="absolute bottom-2 right-2 flex items-center justify-center cursor-pointer z-20 bg-gray-900 p-2 rounded-full hover:bg-gray-700 transition ease-in-out duration-300"
              onClick={() => profileInputRef.current?.click()}
            >
              <Pencil />
            </button>
          </div>
          {/* form data */}
          <form className="mt-[5rem]">
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
        
         .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
