import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaSearch, FaFolder, FaExternalLinkAlt } from 'react-icons/fa';

const SaveNewsModal = ({ isOpen, onClose, newsId, newsTitle }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [confirmSave, setConfirmSave] = useState(false);
  const [notes, setNotes] = useState(''); // NEW: Add notes state
  const [errorMessage, setErrorMessage] = useState(''); // NEW: Add error message state
  const [successMessage, setSuccessMessage] = useState(''); // NEW: Add success message state
  const router = useRouter()

  // Fetch user folders when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/folders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    setLoading(true);
    setErrorMessage(''); // NEW: Clear previous error
    try {
      const response = await fetch('/api/user/folders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      
      const data = await response.json(); // NEW: Get response data
      
      if (response.ok) {
        setFolders([...folders, data.folder]);
        setNewFolderName('');
        setShowCreateFolder(false);
        setSuccessMessage(data.message); // NEW: Show success message
      } else {
        // NEW: Handle error response
        setErrorMessage(data.message || 'Error creating folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setErrorMessage('Error creating folder'); // NEW: Show error message
    } finally {
      setLoading(false);
    }
  };

  const saveNewsToFolder = async () => {
    if (!selectedFolder) return;
    
    setLoading(true);
    setErrorMessage(''); // NEW: Clear previous error
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
          note: notes.trim() || null // NEW: Include notes in request
        }),
      });
      
      const data = await response.json(); // NEW: Get response data
      
      if (response.ok) {
        // Success - close modal and show success message
        onClose();
        console.log(data.message); // NEW: Log success message
        // You can add a toast notification here
      } else {
        // NEW: Handle error response
        setErrorMessage(data.message || 'Error saving news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      setErrorMessage('Error saving news'); // NEW: Show error message
    } finally {
      setLoading(false);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    setConfirmSave(true);
  };

  const resetModal = () => {
    setSearchTerm('');
    setShowCreateFolder(false);
    setNewFolderName('');
    setSelectedFolder(null);
    setConfirmSave(false);
    setNotes(''); // NEW: Reset notes
    setErrorMessage(''); // NEW: Reset error message
    setSuccessMessage(''); // NEW: Reset success message
  };

  const handleClose = () => {
    resetModal();
    onClose();
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

        {/* NEW: Error/Success Messages */}
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
        <div className="p-4">
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
                    className="flex items-center space-x-2 w-full p-3 border-2 border-dashed border-red-300 rounded-lg text-red-700 hover:border-red-400 hover:bg-red-50 transition-colors"
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
                          setErrorMessage(''); // NEW: Clear error when canceling
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
                        className="flex items-center space-x-3 w-full p-3 text-left border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
                      >
                        <FaFolder className="text-red-600 group-hover:text-red-700" size={16} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(folder.created_at).toLocaleDateString()}
                          </p>
                        </div>
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
                
                {/* NEW: Notes Section */}
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
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setConfirmSave(false);
                    setErrorMessage(''); // NEW: Clear error when going back
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={saveNewsToFolder}
                  disabled={loading}
                  className="flex-1 bg-red-700 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!confirmSave && (
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

export default SaveNewsModal;