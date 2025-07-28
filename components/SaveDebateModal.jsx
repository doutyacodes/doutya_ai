// components/SaveDebateModal.jsx
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCrown,
  FaExternalLinkAlt,
  FaFolder,
  FaLock,
  FaPlus,
  FaSearch,
  FaStar,
  FaTimes,
  FaComments,
} from "react-icons/fa";

const SaveDebateModal = ({ isOpen, onClose, debateId, debateTitle }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [confirmSave, setConfirmSave] = useState(false);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Plan-related state
  const [userPlan, setUserPlan] = useState(null);
  const [currentSavedCount, setCurrentSavedCount] = useState(0);
  const [planLoading, setPlanLoading] = useState(true);
  const router = useRouter();
  
  // Plan limits configuration (including debates in the count)
  const PLAN_LIMITS = {
    starter: { max: 25, canAddNotes: false, displayName: "Standard" },
    pro: { max: 75, canAddNotes: true, displayName: "Pro" },
    elite: { max: "unlimited", canAddNotes: true, displayName: "Elite" },
  };

  // Fetch user plan and current saved items count
  useEffect(() => {
    if (isOpen) {
      fetchUserPlanAndStats();
    }
  }, [isOpen]);

  const fetchUserPlanAndStats = async () => {
    setPlanLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        setErrorMessage("Please login to save debates");
        setPlanLoading(false);
        return;
      }

      // Fetch user plan
      const planResponse = await fetch("/api/user/plan2", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (planResponse.ok) {
        const planData = await planResponse.json();
        setUserPlan(planData);
      }

      // Fetch folders and count saved items (both news and debates)
      await fetchFoldersAndCount();
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Error loading user data");
    } finally {
      setPlanLoading(false);
    }
  };

  const fetchFoldersAndCount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      
      // Fetch folders
      const foldersResponse = await fetch("/api/user/folders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json();
        setFolders(foldersData.folders || []);
      }

      // Fetch saved news count
      const newsCountResponse = await fetch("/api/user/saved-news/count", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Fetch saved debates count
      const debatesCountResponse = await fetch("/api/user/saved-debates/count", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let totalCount = 0;
      if (newsCountResponse.ok) {
        const newsData = await newsCountResponse.json();
        totalCount += newsData.count || 0;
      }
      if (debatesCountResponse.ok) {
        const debatesData = await debatesCountResponse.json();
        totalCount += debatesData.count || 0;
      }

      setCurrentSavedCount(totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/user/folders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setFolders([...folders, data.folder]);
        setNewFolderName("");
        setShowCreateFolder(false);
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message || "Error creating folder");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      setErrorMessage("Error creating folder");
    } finally {
      setLoading(false);
    }
  };

  const saveDebateToFolder = async () => {
    if (!selectedFolder) return;
    
    // Check if user has reached their plan limit
    if (userPlan && !canSaveMoreItems()) {
      const planLimit = PLAN_LIMITS[userPlan.current_plan];
      setErrorMessage(
        `You've reached your ${planLimit.displayName} plan limit of ${planLimit.max} saved items. Upgrade for more storage!`
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/user/save-debate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId: selectedFolder.id,
          debateId: debateId,
          note: canAddNotes() ? notes.trim() || null : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Debate saved successfully!");
        onClose();
      } else {
        setErrorMessage(data.message || "Error saving debate");
      }
    } catch (error) {
      console.error("Error saving debate:", error);
      setErrorMessage("Error saving debate");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for plan checks
  const canAddNotes = () => {
    if (!userPlan) return false;
    return PLAN_LIMITS[userPlan.current_plan]?.canAddNotes || false;
  };

  const canSaveMoreItems = () => {
    if (!userPlan) return false;
    const limit = PLAN_LIMITS[userPlan.current_plan]?.max;
    return limit === "unlimited" || currentSavedCount < limit;
  };

  const getRemainingItems = () => {
    if (!userPlan) return 0;
    const limit = PLAN_LIMITS[userPlan.current_plan]?.max;
    if (limit === "unlimited") return "unlimited";
    return Math.max(0, limit - currentSavedCount);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderSelect = (folder) => {
    if (!canSaveMoreItems()) {
      const planLimit = PLAN_LIMITS[userPlan.current_plan];
      setErrorMessage(
        `You've reached your ${planLimit.displayName} plan limit of ${planLimit.max} saved items. Upgrade for more storage!`
      );
      return;
    }
    setSelectedFolder(folder);
    setConfirmSave(true);
  };

  const resetModal = () => {
    setSearchTerm("");
    setShowCreateFolder(false);
    setNewFolderName("");
    setSelectedFolder(null);
    setConfirmSave(false);
    setNotes("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const PlanUpgradePrompt = () => {
    if (!userPlan || canSaveMoreItems()) return null;
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <FaCrown className="text-purple-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900">Upgrade Your Plan</h4>
            <p className="text-sm text-purple-700">
              You&apos;ve reached your limit. Upgrade to save more content and unlock premium features!
            </p>
          </div>
        </div>
        <div className="mt-3 flex space-x-2">
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
            onClick={() => router.push("/upgrade")}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  };

  const PlanStatus = () => {
    if (!userPlan) return null;
    const remaining = getRemainingItems();
    const planConfig = PLAN_LIMITS[userPlan.current_plan];

    return (
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {userPlan.current_plan === "starter" && (
                <FaFolder className="text-blue-600" size={14} />
              )}
              {userPlan.current_plan === "pro" && (
                <FaStar className="text-purple-600" size={14} />
              )}
              {userPlan.current_plan === "elite" && (
                <FaCrown className="text-yellow-600" size={14} />
              )}
              <span className="text-sm font-medium text-gray-900">
                {planConfig.displayName} Plan
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {remaining === "unlimited"
              ? "Unlimited saves"
              : `${remaining} saves left`}
          </div>
        </div>
        {planConfig.max !== "unlimited" && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentSavedCount / planConfig.max) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{currentSavedCount} saved</span>
              <span>{planConfig.max} max</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-scroll pb-10">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaComments className="text-blue-600" size={18} />
            Save Debate
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Loading State */}
        {planLoading && (
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {(errorMessage || successMessage) && (
          <div className="px-4 pt-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {!planLoading && (
          <div className="p-4">
            {/* Plan Status */}
            <PlanStatus />

            {/* Upgrade Prompt */}
            <PlanUpgradePrompt />

            {!confirmSave ? (
              <>
                {/* Debate Title */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1 flex items-center gap-2">
                    <FaComments size={14} />
                    Saving Debate:
                  </p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {debateTitle}
                  </p>
                </div>

                {/* Create New Folder Section */}
                <div className="mb-4">
                  {!showCreateFolder ? (
                    <button
                      onClick={() => setShowCreateFolder(true)}
                      disabled={!canSaveMoreItems()}
                      className={`flex items-center space-x-2 w-full p-3 border-2 border-dashed rounded-lg transition-colors ${
                        canSaveMoreItems()
                          ? "border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                          : "border-gray-300 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FaPlus size={14} />
                      <span className="text-sm font-medium">
                        Create New Folder
                      </span>
                    </button>
                  ) : (
                    <div className="border-2 border-blue-300 rounded-lg p-3">
                      <input
                        type="text"
                        placeholder="Enter folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={createFolder}
                          disabled={!newFolderName.trim() || loading}
                          className="flex-1 bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateFolder(false);
                            setNewFolderName("");
                            setErrorMessage("");
                          }}
                          className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Folders */}
                {folders.length > 0 && (
                  <div className="mb-3">
                    <div className="relative">
                      <FaSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search folders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Folders List */}
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-2"></div>
                      Loading folders...
                    </div>
                  ) : filteredFolders.length > 0 ? (
                    <div className="space-y-2">
                      {filteredFolders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => handleFolderSelect(folder)}
                          disabled={!canSaveMoreItems()}
                          className={`flex items-center space-x-3 w-full p-3 text-left border rounded-lg transition-colors group ${
                            canSaveMoreItems()
                              ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              : "border-gray-200 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <FaFolder
                            className="text-blue-600 group-hover:text-blue-700"
                            size={16}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {folder.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created{" "}
                              {new Date(folder.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!canSaveMoreItems() && (
                            <FaLock className="text-gray-400" size={12} />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaFolder
                        size={32}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className="text-sm">
                        {searchTerm
                          ? "No folders found"
                          : "No folders yet. Create your first folder!"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Confirmation Screen */
              <div className="text-center">
                <div className="mb-4">
                  <FaComments size={48} className="mx-auto text-blue-600 mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirm Save
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Save this debate to:
                  </p>
                  <p className="text-base font-semibold text-blue-700 mb-4">
                    {selectedFolder?.name}
                  </p>

                  {/* Notes Section - Only for Pro and Elite */}
                  {canAddNotes() ? (
                    <div className="text-left mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add a note (optional)
                      </label>
                      <textarea
                        placeholder="Write your thoughts about this debate..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {notes.length}/500 characters
                      </p>
                    </div>
                  ) : (
                    <div className="text-left mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaLock size={12} />
                        <span className="text-sm">
                          Notes are available in Pro and Elite plans
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setConfirmSave(false);
                      setErrorMessage("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={saveDebateToFolder}
                    disabled={loading || !canSaveMoreItems()}
                    className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!confirmSave && !planLoading && (
          <div className="border-t p-4">
            <button
              onClick={() => {
                router.push("/saved-folders");
              }}
              className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              <FaExternalLinkAlt size={12} />
              <span>View My Saved Content</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveDebateModal;