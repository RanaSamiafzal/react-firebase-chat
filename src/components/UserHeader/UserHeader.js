/**
 * UserHeader Component - User profile header with photo upload functionality
 *
 * This component displays the current user's profile information and allows
 * profile picture uploads to Cloudinary with Firebase integration.
 */

import React from "react";
import { uploadToCloudinary } from "../../utils/CloudiaryUpload";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { updateProfile } from "firebase/auth";

function UserHeader({ currentUser, setCurrentUser }) {
  // Get display name, fallback to email if not available
  const displayName = currentUser?.displayName || currentUser?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  /**
   * Handle profile picture file upload
   * Uploads to Cloudinary, updates Firestore and Firebase Auth profile
   * @param {Event} e - File input change event
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log("Uploading file to Cloudinary");
      const imageUrl = await uploadToCloudinary(file); // Upload profile pic to Cloudinary
      console.log(`File uploaded: ${imageUrl}`);

      // Update Firestore with new photo URL
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { photoURL: imageUrl });
      console.log("Firestore updated with new photo URL");

      // Update Firebase Auth profile to persist across sessions
      await updateProfile(currentUser, { photoURL: imageUrl });

      // Update UI with new picture
      setCurrentUser({ ...currentUser, photoURL: imageUrl });
      alert("Photo Updated Successfully");
    } catch (error) {
      console.log("Uploading Failed! Try again", error);
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
      {/* Profile picture upload trigger */}
      <label htmlFor="profileUpload" className="cursor-pointer relative">
        {currentUser?.photoURL ? (
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={currentUser.photoURL}
              alt={`${displayName}'s profile`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {initial}
          </div>
        )}
      </label>

      {/* Hidden file input for profile picture upload */}
      <input
        id="profileUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* User information display */}
      <div>
        <p className="font-semibold text-lg">{displayName}</p>
        <p className="text-green-400 text-sm">Active</p>
      </div>
    </div>
  );
}

export default UserHeader;
