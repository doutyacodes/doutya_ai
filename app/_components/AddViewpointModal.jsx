import React, { useState } from "react";
import { X, Sparkles, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AddViewpointModal = ({
  isOpen,
  onClose,
  newsId, // Changed from newsGroupId to newsId
  currentCount,
  onSuccess,
}) => {
  const [viewpoint, setViewpoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const maxViewpoints = 3;
  const remainingViewpoints = maxViewpoints - currentCount;

  const handleSubmit = async () => {
    if (!viewpoint.trim()) {
      setError("Please enter a viewpoint");
      return;
    }

    if (viewpoint.trim().length < 3) {
      setError("Viewpoint must be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/user/generate-viewpoint", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsId: newsId, // Changed from newsGroupId to newsId
          viewpoint: viewpoint.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Custom viewpoint created successfully!");
        setViewpoint("");
        onSuccess(data.relevance); // Pass relevance data to parent
        onClose();
      } else {
        throw new Error(data.error || "Failed to create viewpoint");
      }
    } catch (err) {
      console.error("Error creating viewpoint:", err);
      setError(err.message || "Failed to create viewpoint. Please try again.");
      toast.error("Failed to create viewpoint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setViewpoint("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Custom Viewpoint
                </h3>
                <p className="text-sm text-gray-500">
                  Elite Feature • {remainingViewpoints} remaining
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">
                    Create Your Perspective
                  </h4>
                  <p className="text-sm text-purple-700">
                   {` AI will generate a unique viewpoint of this news tailored to
                    your specified perspective. Be specific for better results
                    (e.g., "Environmental activist", "Small business owner",
                    "Student").`}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <label
                htmlFor="viewpoint"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Viewpoint Perspective
              </label>
              <div className="relative">
                <input
                  id="viewpoint"
                  type="text"
                  value={viewpoint}
                  onChange={(e) => setViewpoint(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isLoading && viewpoint.trim()) {
                      handleSubmit();
                    }
                  }}
                  placeholder="e.g., Climate scientist, Tech entrepreneur, Student..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  disabled={isLoading}
                  maxLength={50}
                />
                <div className="absolute right-3 top-3">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {viewpoint.length}/50 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !viewpoint.trim()}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Viewpoint
                  </>
                )}
              </button>
            </div>

            {/* Usage Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                ✨ Elite members can create up to {maxViewpoints} custom
                viewpoints per article
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddViewpointModal;
