import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Info, Loader2, Brain } from "lucide-react";

function CustomViewpointModalComponent({
  showModal,
  customViewpoint,
  onViewpointChange,
  onClose,
  onGenerate,
  isGenerating,
  generatedCount,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (showModal && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] transition-all duration-300">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 w-full max-w-lg mx-auto shadow-2xl transform transition-all duration-300 border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Generate Demo Perspective
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Create a unique AI-generated viewpoint on the climate summit story.
              Our advanced AI will analyze the topic from your specified perspective.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your viewpoint:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={customViewpoint}
                onChange={onViewpointChange}
                placeholder="e.g., Small Business Owner, Student Leader, Tech Entrepreneur..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                maxLength={50}
                disabled={isGenerating}
                autoComplete="off"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {customViewpoint.length}/50 characters
                </p>
                {customViewpoint.trim() && (
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    Ready to generate
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-1">
                    Demo Limitation
                  </p>
                  <p className="text-xs text-red-700">
                    You can generate {2 - generatedCount} more perspective
                    {2 - generatedCount !== 1 ? "s" : ""}
                    {generatedCount > 0 && ` (${generatedCount}/2 used)`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <motion.button
              onClick={onGenerate}
              disabled={isGenerating || !customViewpoint.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Perspective
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const CustomViewpointModal = React.memo(CustomViewpointModalComponent);
CustomViewpointModal.displayName = "CustomViewpointModal";

export default CustomViewpointModal;
