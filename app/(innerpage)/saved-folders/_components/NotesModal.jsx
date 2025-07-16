import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

const NotesModal = ({ isOpen, onClose, savedItem, onUpdateNote }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && savedItem) {
      setNote(savedItem.note || '');
      setError('');
    }
  }, [isOpen, savedItem]);

  const handleSaveNote = async () => {
    if (!savedItem) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/user/save-news/${savedItem.id}/note`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: note.trim() || null }),
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateNote(savedItem.id, note.trim());
        onClose();
      } else {
        setError(data.message || 'Failed to update note');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNote(savedItem?.note || '');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">My Notes</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* News Title */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Notes for:</p>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {savedItem?.news?.title}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Notes Textarea */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Notes
            </label>
            <textarea
              placeholder={note ? "Edit your notes..." : "Add your thoughts about this news..."}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {note.length}/1000 characters
            </p>
          </div>

          {!note && (
            <div className="text-center py-4 text-gray-500">
              <FileText size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notes added for this article yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNote}
            disabled={loading}
            className="flex-1 bg-red-700 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;