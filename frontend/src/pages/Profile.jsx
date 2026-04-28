import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  }

  // 🖼️ Handle image preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleUpdate() {
    const formData = new FormData();

    formData.append("username", user.username);
    formData.append("email", user.email);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateProfile(formData);
      toast.success("Profile updated ✅");
      setShowModal(false);
      setPreview(null);
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto">

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          My Profile
        </h2>

        <img
          src={
            preview
              ? preview
              : user.image
              ? `${BASE_URL}${user.image}`
              : "https://via.placeholder.com/100"
          }
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />

        <p className="font-semibold dark:text-white">
          {user.username}
        </p>
        <p className="text-gray-500 dark:text-gray-300">
          {user.email}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      </div>

      {/* 🪟 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96">

            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Edit Profile
            </h2>

            {/* Image Preview */}
            <img
              src={
                preview
                  ? preview
                  : user.image
                  ? `${BASE_URL}${user.image}`
                  : "https://via.placeholder.com/100"
              }
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />

            <input
              type="file"
              onChange={handleImageChange}
              className="mb-3"
            />

            <input
              value={user.username}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
              className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
            />

            <input
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreview(null);
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;