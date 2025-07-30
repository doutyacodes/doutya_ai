import { AlertCircle, Info } from "lucide-react";
import React from "react";

const ToastComponent = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`fixed top-4 right-4 z-[10000] px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 min-w-[300px] ${
      type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
      type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
      'bg-blue-50 border-blue-200 text-blue-800'
    }`}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> :
     type === 'error' ? <AlertCircle className="w-5 h-5" /> :
     <Info className="w-5 h-5" />}
    <span className="font-medium">{message}</span>
    <button
      onClick={onClose}
      className="ml-auto p-1 hover:bg-black/10 rounded"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// ✅ Now memoize the named function
const Toast = React.memo(ToastComponent);

// ✅ Optionally assign displayName (especially helpful for DevTools)
Toast.displayName = 'Toast';

export default Toast;
