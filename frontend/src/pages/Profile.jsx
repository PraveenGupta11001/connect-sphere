import React, { useState, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import userIconImg from "../assets/user-286.png";
import Compressor from "compressorjs";
import { setUser } from "../features/auth/authSlice";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoURL: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data from Firestore on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        console.error("User UID is undefined");
        setError("User not authenticated.");
        return;
      }
      console.log("Fetching user data for UID:", user.uid);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("User data:", data);
          setProfileData({
            displayName: data.displayName || "",
            email: data.email || user.email,
            phone: data.phone || "",
            address: data.address || "",
            photoURL: data.photoURL || userIconImg,
          });
        } else {
          console.log("User document does not exist");
          setError("User profile not found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data: " + err.message);
      }
    };
    fetchUserData();
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and compression
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 500 * 1024) {
      setError("Image size must be less than 500KB.");
      return;
    }

    new Compressor(file, {
      quality: 0.6,
      maxWidth: 200,
      maxHeight: 200,
      success(compressedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImage(reader.result);
          setProfileData((prev) => ({ ...prev, photoURL: reader.result }));
        };
        reader.onerror = () => setError("Failed to process image.");
        reader.readAsDataURL(compressedFile);
      },
      error(err) {
        console.error("Image compression error:", err);
        setError("Failed to compress image.");
      },
    });
  };

  // Handle form submission to save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: profileData.displayName,
        phone: profileData.phone,
        address: profileData.address,
        photoURL: profileData.photoURL,
      });

      // Update Redux state with the new user data
      dispatch(setUser({
        ...user,
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      }));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setNewImage(null);

      // Fetch updated data to verify
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        setProfileData({
          displayName: updatedData.displayName || "",
          email: updatedData.email || user.email,
          phone: updatedData.phone || "",
          address: updatedData.address || "",
          photoURL: updatedData.photoURL || userIconImg,
        });
        console.log("Updated user data:", updatedData);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile changes: " + err.message);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    setNewImage(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header background section */}
        <div className="h-[30vh] bg-gradient-to-b from-indigo-500 to-sky-500 flex justify-center items-center relative">
          <div className="w-[120px] h-[120px] rounded-full bg-white ring-2 ring-white shadow-lg relative">
            <img
              src={profileData.photoURL || userIconImg}
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
            {isEditing && (
              <label
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white shadow-md z-10 border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                aria-label="Edit Profile Picture"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Edit size={18} className="text-black" />
              </label>
            )}
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">
            {profileData.displayName || "User"}
          </h1>

          {/* Edit/Save Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              {isEditing ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit size={18} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium w-24 text-left">
                Name
              </label>
              <input
                type="text"
                name="displayName"
                value={profileData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your name..."
                disabled={!isEditing}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium w-24 text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="flex-1 px-4 py-2.5 bg-gray-200 border border-gray-200 rounded-lg text-sm cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium w-24 text-left">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number..."
                disabled={!isEditing}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium w-24 text-left">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                placeholder="Enter your address..."
                disabled={!isEditing}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            {isEditing && (
              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Save size={18} />
                Save Changes
              </button>
            )}
          </form>

          {error && (
            <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-green-500 text-sm text-center">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
}