"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Plus, 
  Folder, 
  X, 
  Check, 
  FileText, 
  MessageCircle,
  ArrowRight,
  Calendar,
  Target,
  Eye,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [expandedFolder, setExpandedFolder] = useState(null);

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
      const response = await fetch(`/api/user/folders2/${folderId}`, {
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
      const response = await fetch(`/api/user/folders2/${folderId}`, {
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

  // Handle folder navigation
  const handleFolderNavigation = (folderId, contentType = 'all') => {
    let url;
    if (contentType === 'all') {
      url = `/saved-folders/${folderId}`;
    } else {
      url = `/saved-folders/${contentType}/${folderId}`;
    }
    window.location.href = url;
  };

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId, event) => {
    event.stopPropagation();
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };

  // Calculate total items across all folders
  const totalItems = folders.reduce((sum, folder) => sum + folder.counts?.total || 0, 0);
  const totalNews = folders.reduce((sum, folder) => sum + folder.counts?.news || 0, 0);
  const totalDebates = folders.reduce((sum, folder) => sum + folder.counts?.debates || 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                My Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Folders</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Organize your saved news articles and debates into folders
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{folders.length}</div>
                  <div className="text-sm text-gray-600">Total Folders</div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalNews}</div>
                  <div className="text-sm text-gray-600">Saved Articles</div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalDebates}</div>
                  <div className="text-sm text-gray-600">Saved Debates</div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3">
                    <ArrowRight className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm text-lg"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
          >
            <Plus className="w-5 h-5" />
            Create Folder
          </motion.button>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
              {createError && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{createError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                    setCreateError('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">Delete Folder</h3>
              <p className="text-gray-600 mb-2 text-center">
                Are you sure you want to delete <strong>&ldquo;{deleteConfirm.name}&rdquo;</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  This will permanently delete the folder and all saved content within it:
                </p>
                <ul className="mt-2 text-red-700 text-sm space-y-1">
                  <li>• {deleteConfirm.counts?.news || 0} saved articles</li>
                  <li>• {deleteConfirm.counts?.debates || 0} saved debates</li>
                </ul>
                <p className="mt-2 text-red-800 text-sm font-medium">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteFolder(deleteConfirm.id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Folder
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
          >
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Folders Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6"
          >
            {filteredFolders.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto"
                >
                  <Folder className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {searchQuery ? 'No folders found' : 'No folders yet'}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first folder to organize your saved content'}
                  </p>
                </motion.div>
              </div>
            ) : (
              filteredFolders.map((folder, index) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  {/* Folder Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <Folder className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {editingFolder === folder.id ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-lg"
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
                                <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">{editError}</p>
                              )}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleEditFolder(folder.id)}
                                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingFolder(null);
                                    setEditName('');
                                    setEditError('');
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold text-xl text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                {folder.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Created {new Date(folder.created_at).toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* More Options */}
                      {editingFolder !== folder.id && (
                        <div 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={(e) => e.stopPropagation()}
                          ref={activeDropdown === folder.id ? dropdownRef : null}
                        >
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === folder.id ? null : folder.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdown === folder.id && (
                            <div className="absolute right-6 top-20 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[140px]">
                              <button
                                onClick={() => {
                                  setEditingFolder(folder.id);
                                  setEditName(folder.name);
                                  setActiveDropdown(null);
                                  setEditError('');
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirm(folder);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content Counts Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {folder.counts?.total || 0}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {folder.counts?.news || 0}
                          </div>
                          <div className="text-xs text-gray-500">Articles</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {folder.counts?.debates || 0}
                          </div>
                          <div className="text-xs text-gray-500">Debates</div>
                        </div>
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={(e) => toggleFolderExpansion(folder.id, e)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <ChevronRight 
                          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                            expandedFolder === folder.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Navigation Options - Collapsible */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: expandedFolder === folder.id ? 'auto' : 0,
                      opacity: expandedFolder === folder.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-3">
                      {/* View All Content */}
                      <button
                        onClick={() => handleFolderNavigation(folder.id, 'all')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group/nav"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg group-hover/nav:bg-blue-200 transition-colors">
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">View All Content</div>
                            <div className="text-sm text-gray-600">
                              {folder.counts?.total || 0} items
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover/nav:text-gray-600 transition-colors" />
                      </button>

                      {/* View Articles Only */}
                      {(folder.counts?.news || 0) > 0 && (
                        <button
                          onClick={() => handleFolderNavigation(folder.id, 'news')}
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group/nav"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg group-hover/nav:bg-green-200 transition-colors">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">Articles Only</div>
                              <div className="text-sm text-gray-600">
                                {folder.counts?.news || 0} articles
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover/nav:text-gray-600 transition-colors" />
                        </button>
                      )}

                      {/* View Debates Only */}
                      {(folder.counts?.debates || 0) > 0 && (
                        <button
                          onClick={() => handleFolderNavigation(folder.id, 'debates')}
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 group/nav"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg group-hover/nav:bg-purple-200 transition-colors">
                              <MessageCircle className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">Debates Only</div>
                              <div className="text-sm text-gray-600">
                                {folder.counts?.debates || 0} debates
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover/nav:text-gray-600 transition-colors" />
                        </button>
                      )}

                      {/* Empty State */}
                      {(folder.counts?.total || 0) === 0 && (
                        <div className="text-center py-6">
                          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            No saved content yet
                          </p>
                          <p className="text-gray-400 text-xs">
                            Start saving articles and debates to this folder
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedFoldersPage;