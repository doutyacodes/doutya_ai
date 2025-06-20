"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Edit2, Trash2, Plus, Folder, X, Check } from 'lucide-react';

const SavedFoldersPage = () => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createError, setCreateError] = useState('');

  const dropdownRef = useRef(null);
  const editInputRef = useRef(null);

  // Fetch folders from API
  const fetchFolders = async (search = '') => {
    try {
      setLoading(true);

      const token = localStorage.getItem('user_token');
      const url = search ? `/api/user/folders?search=${encodeURIComponent(search)}` : '/api/user/folders';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

      
      if (response.ok) {
        setFolders(data.folders);
        setFilteredFolders(data.folders);
      } else {
        setError(data.message || 'Failed to fetch folders');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFolders();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchFolders(searchQuery);
    } else {
      setFilteredFolders(folders);
    }
  }, [searchQuery, folders]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingFolder && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingFolder]);

  // Handle edit folder
  const handleEditFolder = async (folderId) => {
    if (!editName.trim()) {
      setEditError('Folder name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/user/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setFolders(prev => prev.map(folder => 
          folder.id === folderId ? { ...folder, name: editName.trim() } : folder
        ));
        setEditingFolder(null);
        setEditName('');
        setEditError('');
      } else {
        setEditError(data.message || 'Failed to update folder');
      }
    } catch (err) {
      setEditError('Network error occurred');
    }
  };

  // Handle delete folder
  const handleDeleteFolder = async (folderId) => {
    try {
      const response = await fetch(`/api/user/folders/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (response.ok) {
        setFolders(prev => prev.filter(folder => folder.id !== folderId));
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete folder');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setCreateError('Folder name cannot be empty');
      return;
    }

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
        setFolders(prev => [data.folder, ...prev]);
        setNewFolderName('');
        setShowCreateFolder(false);
        setCreateError('');
      } else {
        setCreateError(data.message || 'Failed to create folder');
      }
    } catch (err) {
      setCreateError('Network error occurred');
    }
  };

  // Handle folder click
  const handleFolderClick = (folderId) => {
    window.location.href = `/saved-folders/${folderId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Folders</h1>
          <p className="text-gray-600">Organize your saved news articles into folders</p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none"
            />
          </div>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Folder
          </button>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              {createError && (
                <p className="text-red-600 text-sm mb-4">{createError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                    setCreateError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Delete Folder</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete &ldquo;{deleteConfirm.name}&ldquo;? This will permanently delete the folder and all saved news articles within it. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteFolder(deleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
          </div>
        )}

        {/* Folders Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFolders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No folders found' : 'No folders yet'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first folder to get started'}
                </p>
              </div>
            ) : (
              filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
                >
                  {/* Folder Content */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Folder className="w-8 h-8 text-red-800" />
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                        ref={activeDropdown === folder.id ? dropdownRef : null}
                      >
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === folder.id ? null : folder.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === folder.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                            <button
                              onClick={() => {
                                setEditingFolder(folder.id);
                                setEditName(folder.name);
                                setActiveDropdown(null);
                                setEditError('');
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirm(folder);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Folder Name */}
                    {editingFolder === folder.id ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditFolder(folder.id);
                            } else if (e.key === 'Escape') {
                              setEditingFolder(null);
                              setEditName('');
                              setEditError('');
                            }
                          }}
                        />
                        {editError && (
                          <p className="text-red-600 text-xs mt-1">{editError}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditFolder(folder.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingFolder(null);
                              setEditName('');
                              setEditError('');
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-medium text-gray-900 mb-2 truncate">
                        {folder.name}
                      </h3>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Created {new Date(folder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFoldersPage;