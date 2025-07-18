import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaSearch, FaFolder, FaExternalLinkAlt, FaCrown, FaStar, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
const SaveNewsModal = ({ isOpen, onClose, newsId, newsTitle }) => {
const [folders, setFolders] = useState([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [showCreateFolder, setShowCreateFolder] = useState(false);
const [newFolderName, setNewFolderName] = useState('');
const [selectedFolder, setSelectedFolder] = useState(null);
const [confirmSave, setConfirmSave] = useState(false);
const [notes, setNotes] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');
// Plan-related state
const [userPlan, setUserPlan] = useState(null);
const [currentSavedCount, setCurrentSavedCount] = useState(0);
const [planLoading, setPlanLoading] = useState(true);
const router = useRouter();
// Plan limits configuration
const PLAN_LIMITS = {
starter: { max: 25, canAddNotes: false, displayName: 'Standard' },
pro: { max: 75, canAddNotes: true, displayName: 'Pro' },
elite: { max: 'unlimited', canAddNotes: true, displayName: 'Elite' }
};
// Fetch user plan and current saved articles count
useEffect(() => {
if (isOpen) {
fetchUserPlanAndStats();
}
}, [isOpen]);
const fetchUserPlanAndStats = async () => {
setPlanLoading(true);
try {
const token = localStorage.getItem('user_token');
if (!token) {
setErrorMessage('Please login to save articles');
setPlanLoading(false);
return;
}
  // Fetch user plan
  const planResponse = await fetch('/api/user/plan', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (planResponse.ok) {
    const planData = await planResponse.json();
    setUserPlan(planData);
  }

  // Fetch folders and count saved articles
  await fetchFoldersAndCount();
  
} catch (error) {
  console.error('Error fetching user data:', error);
  setErrorMessage('Error loading user data');
} finally {
  setPlanLoading(false);
}
};
const fetchFoldersAndCount = async () => {
setLoading(true);
try {
const token = localStorage.getItem('user_token');
  // Fetch folders
  const foldersResponse = await fetch('/api/user/folders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (foldersResponse.ok) {
    const foldersData = await foldersResponse.json();
    setFolders(foldersData.folders || []);
  }

  // Fetch saved articles count
  const countResponse = await fetch('/api/user/saved-news/count', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (countResponse.ok) {
    const countData = await countResponse.json();
    setCurrentSavedCount(countData.count || 0);
  }

} catch (error) {
  console.error('Error fetching data:', error);
} finally {
  setLoading(false);
}
};
const createFolder = async () => {
if (!newFolderName.trim()) return;
setLoading(true);
setErrorMessage('');
try {
  const response = await fetch('/api/user/folders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newFolderName.trim() }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    setFolders([...folders, data.folder]);
    setNewFolderName('');
    setShowCreateFolder(false);
    setSuccessMessage(data.message);
  } else {
    setErrorMessage(data.message || 'Error creating folder');
  }
} catch (error) {
  console.error('Error creating folder:', error);
  setErrorMessage('Error creating folder');
} finally {
  setLoading(false);
}
};
const saveNewsToFolder = async () => {
if (!selectedFolder) return;
// Check if user has reached their plan limit
if (userPlan && !canSaveMoreArticles()) {
  const planLimit = PLAN_LIMITS[userPlan.current_plan];
  setErrorMessage(`You've reached your ${planLimit.displayName} plan limit of ${planLimit.max} saved articles. Upgrade for more storage!`);
  return;
}

setLoading(true);
setErrorMessage('');
try {
  const response = await fetch('/api/user/save-news', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      folderId: selectedFolder.id, 
      newsId: newsId,
      note: canAddNotes() ? (notes.trim() || null) : null
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    toast.success('Article saved successfully!');
    onClose();
  } else {
    setErrorMessage(data.message || 'Error saving news');
  }
} catch (error) {
  console.error('Error saving news:', error);
  setErrorMessage('Error saving news');
} finally {
  setLoading(false);
}
};
// Helper functions for plan checks
const canAddNotes = () => {
if (!userPlan) return false;
return PLAN_LIMITS[userPlan.current_plan]?.canAddNotes || false;
};
const canSaveMoreArticles = () => {
if (!userPlan) return false;
const limit = PLAN_LIMITS[userPlan.current_plan]?.max;
return limit === 'unlimited' || currentSavedCount < limit;
};
const getRemainingArticles = () => {
if (!userPlan) return 0;
const limit = PLAN_LIMITS[userPlan.current_plan]?.max;
if (limit === 'unlimited') return 'unlimited';
return Math.max(0, limit - currentSavedCount);
};
const filteredFolders = folders.filter(folder =>
folder.name.toLowerCase().includes(searchTerm.toLowerCase())
);
const handleFolderSelect = (folder) => {
if (!canSaveMoreArticles()) {
const planLimit = PLAN_LIMITS[userPlan.current_plan];
setErrorMessage(`You've reached your ${planLimit.displayName} plan limit of ${planLimit.max} saved articles. Upgrade for more storage!`);
return;
}
setSelectedFolder(folder);
setConfirmSave(true);
};
const resetModal = () => {
setSearchTerm('');
setShowCreateFolder(false);
setNewFolderName('');
setSelectedFolder(null);
setConfirmSave(false);
setNotes('');
setErrorMessage('');
setSuccessMessage('');
};
const handleClose = () => {
resetModal();
onClose();
};
const PlanUpgradePrompt = () => {
if (!userPlan || canSaveMoreArticles()) return null;
return (
  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
    <div className="flex items-center space-x-3">
      <div className="bg-purple-100 p-2 rounded-full">
        <FaCrown className="text-purple-600" size={20} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-purple-900">Upgrade Your Plan</h4>
        <p className="text-sm text-purple-700">
          You've reached your limit. Upgrade to save more articles and unlock premium features!
        </p>
      </div>
    </div>
    <div className="mt-3 flex space-x-2">
      <button 
        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
        onClick={() => router.push('/upgrade')}
      >
        Upgrade Now
      </button>
    </div>
  </div>
);
};
const PlanStatus = () => {
if (!userPlan) return null;
const remaining = getRemainingArticles();
const planConfig = PLAN_LIMITS[userPlan.current_plan];

return (
  <div className="bg-gray-50 rounded-lg p-3 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {userPlan.current_plan === 'starter' && <FaFolder className="text-blue-600" size={14} />}
          {userPlan.current_plan === 'pro' && <FaStar className="text-purple-600" size={14} />}
          {userPlan.current_plan === 'elite' && <FaCrown className="text-yellow-600" size={14} />}
          <span className="text-sm font-medium text-gray-900">
            {planConfig.displayName} Plan
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {remaining === 'unlimited' ? 
          'Unlimited saves' : 
          `${remaining} saves left`
        }
      </div>
    </div>
    {planConfig.max !== 'unlimited' && (
      <div className="mt-2">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentSavedCount / planConfig.max) * 100}%` }}
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
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden my-auto">
{/* Header */}
<div className="flex items-center justify-between p-4 border-b">
<h3 className="text-lg font-semibold text-gray-900">Save News</h3>
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
            {/* News Title */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Saving:</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {newsTitle}
              </p>
            </div>

            {/* Create New Folder Section */}
            <div className="mb-4">
              {!showCreateFolder ? (
                <button
                  onClick={() => setShowCreateFolder(true)}
                  disabled={!canSaveMoreArticles()}
                  className={`flex items-center space-x-2 w-full p-3 border-2 border-dashed rounded-lg transition-colors ${
                    canSaveMoreArticles() 
                      ? 'border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50' 
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaPlus size={14} />
                  <span className="text-sm font-medium">Create New Folder</span>
                </button>
              ) : (
                <div className="border-2 border-red-300 rounded-lg p-3">
                  <input
                    type="text"
                    placeholder="Enter folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={createFolder}
                      disabled={!newFolderName.trim() || loading}
                      className="flex-1 bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateFolder(false);
                        setNewFolderName('');
                        setErrorMessage('');
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
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Folders List */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-2"></div>
                  Loading folders...
                </div>
              ) : filteredFolders.length > 0 ? (
                <div className="space-y-2">
                  {filteredFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleFolderSelect(folder)}
                      disabled={!canSaveMoreArticles()}
                      className={`flex items-center space-x-3 w-full p-3 text-left border rounded-lg transition-colors group ${
                        canSaveMoreArticles()
                          ? 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <FaFolder className="text-red-600 group-hover:text-red-700" size={16} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(folder.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!canSaveMoreArticles() && (
                        <FaLock className="text-gray-400" size={12} />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaFolder size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">
                    {searchTerm ? 'No folders found' : 'No folders yet. Create your first folder!'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="text-center">
            <div className="mb-4">
              <FaFolder size={48} className="mx-auto text-red-600 mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Save
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Save this news to:
              </p>
              <p className="text-base font-semibold text-red-700 mb-4">
                {selectedFolder?.name}
              </p>
              
              {/* Notes Section - Only for Pro and Elite */}
              {canAddNotes() ? (
                <div className="text-left mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    placeholder="Write your thoughts about this news..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
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
                    <span className="text-sm">Notes are available in Pro and Elite plans</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setConfirmSave(false);
                  setErrorMessage('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={saveNewsToFolder}
                disabled={loading || !canSaveMoreArticles()}
                className="flex-1 bg-red-700 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Save'}
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
          onClick={() => {router.push("/saved-folders")}}
          className="flex items-center space-x-2 text-red-700 hover:text-red-800 transition-colors text-sm font-medium"
        >
          <FaExternalLinkAlt size={12} />
          <span>View My Saved News</span>
        </button>
      </div>
    )}
  </div>
</div>
);
};
export default SaveNewsModal