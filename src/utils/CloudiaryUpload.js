/**
 * Cloudinary Upload Utility
 *
 * Handles image uploads to Cloudinary for user profile pictures.
 * Uses unsigned upload preset for client-side uploads.
 */

/**
 * Upload file to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 * @throws {Error} - If upload fails
 */
export async function uploadToCloudinary(file) {
  // Validate file input
  if (!file) {
    throw new Error("No file provided for upload");
  }

  // Validate file type (images only)
  if (!file.type.startsWith('image/')) {
    throw new Error("Only image files are allowed");
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "profile_upload"); // unsigned preset
  data.append("cloud_name", "dixytbrk5"); // cloud name from dashboard

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dixytbrk5/image/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status: ${res.status}`);
    }

    const json = await res.json();

    if (!json.secure_url) {
      throw new Error("Upload succeeded but no URL returned");
    }

    return json.secure_url; // final image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}


