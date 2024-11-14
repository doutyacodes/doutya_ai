"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PencilIcon } from "lucide-react";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import GlobalApi from "@/app/api/_services/GlobalApi";
import toast from "react-hot-toast";



const Profile = () => {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To toggle editing mode for user info
  const [loading, setLoading] = useState(true); // To toggle editing mode for user info

  const handleEditUser = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEditChild = (childId, e) => {
    const { name, value } = e.target;
    setChildren((prevChildren) =>
      prevChildren.map((child) =>
        child.id === childId ? { ...child, [name]: value } : child
      )
    );
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const response = await GlobalApi.GetUserChildren(token);
        const children = response.data.data;
        const users = response.data.user;
        console.log("children", children);
        setChildren(children);
        setUser(users);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChildren();
  }, []);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (e.g., update data in your backend or state)
    console.log("User details updated:", user);
    console.log("Children details updated:", children);
  };

  const updateUserData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        await GlobalApi.UpdateUserData(token, user); // Send updated user data to the API
        toast.success("User updated successfully!");
      }
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
              "Failed to update user data. Please try again."
          );
    }
  };
  

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-3xl font-semibold text-center mb-4">
            User Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium min-w-28">Name:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleEditUser}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <div className="text-lg">{user.name}</div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="font-medium min-w-28">Username:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleEditUser}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <div className="text-lg">{user.username}</div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="font-medium min-w-28">Mobile:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleEditUser}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <div className="text-lg">{user.mobile}</div>
              )}
            </div>

            {/* Edit Pencil Icon */}
            {!isEditing && (
              <button
                onClick={toggleEditMode}
                className="absolute top-4 right-4 text-blue-500"
              >
                <PencilIcon className="w-6 h-6" />
              </button>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-center mt-6">
                <button
                 onClick={updateUserData}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </motion.div>

        {/* Children Info Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-semibold text-center mb-4">
            Children Information
          </h2>
          <div className="space-y-4">
            {children.map((child) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center bg-orange-50 p-4 rounded-md shadow-sm"
              >
                <img
                  src={`/images/${
                    child.gender === "male" ? "boy.png" : "girl.png"
                  }`}
                  alt={child.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 pl-4">
                  <div className="text-lg font-medium">{child.name}</div>
                  <div className="text-sm text-gray-500">
                    Age:{" "}
                    {child.age}{" "}
                    years
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const newName = prompt("Edit Name:", child.name);
                      if (newName) {
                        handleEditChild(child.id, {
                          target: { name: "name", value: newName },
                        });
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
