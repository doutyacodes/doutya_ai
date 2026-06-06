// app/saved-folders/[...params]/page.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Eye,
  FileText,
  Search,
  Trash2,
  X,
  MessageCircle,
  User,
  Brain,
  CheckCircle,
  Clock,
  PlayCircle,
  Award,
  Target,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GrFormView } from "react-icons/gr";
import toast from "react-hot-toast";

const SavedFolderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();

  const routeParams = params.params || [];
  let contentType = "all";
  let folderId;

  if (routeParams.length === 1) {
    folderId = routeParams[0];
    contentType = "all";
  } else if (routeParams.length === 2) {
    contentType = routeParams[0];
    folderId = routeParams[1];
  }

  const [folder, setFolder] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [notesModal, setNotesModal] = useState({ isOpen: false, savedItem: null });
  const [stats, setStats] = useState({ total: 0, news: 0, debates: 0 });
  const [currentPerspectives, setCurrentPerspectives] = useState({});
  const [isPaused, setIsPaused] = useState({});

  const viewpointColors = {
    0: { bg: "bg-[#1E90FF]", text: "text-[#1E90FF]" },
    1: { bg: "bg-[#00bf62]", text: "text-[#00bf62]" },
    2: { bg: "bg-[#6A5ACD]", text: "text-[#6A5ACD]" },
    3: { bg: "bg-[#20B2AA]", text: "text-[#20B2AA]" },
    4: { bg: "bg-[#DAA520]", text: "text-[#DAA520]" },
    5: { bg: "bg-[#00CED1]", text: "text-[#00CED1]" },
  };

  const getViewpointColor = (index, type = "bg") => {
    const colorSet = viewpointColors[index % Object.keys(viewpointColors).length];
    return type === "bg" ? colorSet.bg : colorSet.text;
  };

  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const fetchFolderData = async () => {
    if (!folderId) { setError("Invalid folder ID"); setLoading(false); return; }
    try {
      setLoading(true);
      setError("");
      const apiUrl = routeParams.length === 1
        ? `/api/user/folders2/${folderId}`
        : `/api/user/folders2/${contentType}/${folderId}`;
      const token = localStorage.getItem("user_token");
      if (!token) { router.push("/auth/login"); return; }
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setFolder(data.folder);
        setAllContent(data.content || []);
        setFilteredContent(data.content || []);
        setStats(data.stats || { total: 0, news: 0, debates: 0 });
      } else if (response.status === 404) {
        setError("Folder not found");
      } else if (response.status === 401) {
        router.push("/auth/login");
      } else {
        setError(data.message || "Failed to fetch folder data");
      }
    } catch (err) {
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFolderData(); }, [folderId, contentType]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allContent.filter((item) => {
        const query = searchQuery.toLowerCase();
        if (item.type === "news") {
          return item.news?.title?.toLowerCase().includes(query) ||
            item.news?.summary?.toLowerCase().includes(query);
        } else if (item.type === "debate") {
          return item.debate?.title?.toLowerCase().includes(query) ||
            item.debate?.user_position_title?.toLowerCase().includes(query) ||
            item.debate?.ai_position_title?.toLowerCase().includes(query);
        }
        return false;
      });
      setFilteredContent(filtered);
    } else {
      setFilteredContent(allContent);
    }
  }, [searchQuery, allContent]);

  useEffect(() => {
    const initialPerspectives = {};
    const initialPaused = {};
    allContent.forEach((savedItem) => {
      if (savedItem.type === "news" && savedItem.allPerspectives?.length > 0) {
        const currentIndex = savedItem.allPerspectives.findIndex((p) => p.id === savedItem.news.id);
        initialPerspectives[savedItem.id] = currentIndex >= 0 ? currentIndex : 0;
        initialPaused[savedItem.id] = false;
      }
    });
    setCurrentPerspectives(initialPerspectives);
    setIsPaused(initialPaused);
  }, [allContent]);

  useEffect(() => {
    const intervals = {};
    allContent.forEach((savedItem) => {
      if (savedItem.type === "news" && savedItem.allPerspectives?.length > 1 && !isPaused[savedItem.id]) {
        intervals[savedItem.id] = setInterval(() => {
          setCurrentPerspectives((prev) => ({
            ...prev,
            [savedItem.id]: (prev[savedItem.id] + 1) % savedItem.allPerspectives.length,
          }));
        }, 3000);
      }
    });
    return () => Object.values(intervals).forEach(clearInterval);
  }, [allContent, isPaused]);

  const handleRemoveContent = async (savedItemId, itemType) => {
    try {
      setRemovingId(savedItemId);
      const endpoint = itemType === "news"
        ? `/api/user/folders2/${folderId}/news/${savedItemId}`
        : `/api/user/saved-debates/${savedItemId}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setAllContent((prev) => prev.filter((item) => item.id !== savedItemId));
        setFilteredContent((prev) => prev.filter((item) => item.id !== savedItemId));
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          [itemType === "news" ? "news" : "debates"]: prev[itemType === "news" ? "news" : "debates"] - 1,
        }));
        setRemoveConfirm(null);
        toast.success(`${itemType === "news" ? "Article" : "Debate"} removed from folder`);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove item");
      }
    } catch (err) {
      toast.error(err.message || "Network error occurred");
    } finally {
      setRemovingId(null);
    }
  };

  const handleContentClick = (item) => {
    if (item.type === "news") {
      const p = getCurrentPerspective(item);
      router.push(`/news/${p?.id || item.news?.id}`);
    } else if (item.type === "debate") {
      router.push(`/user-debates/${item.debate?.id}`);
    }
  };

  const handleUpdateNote = async (savedItemId, newNote, itemType) => {
    const endpoint = itemType === "news"
      ? `/api/user/save-news/${savedItemId}/note`
      : `/api/user/saved-debates/${savedItemId}`;
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note: newNote }),
    });
    if (response.ok) {
      const updater = (prev) => prev.map((item) => item.id === savedItemId ? { ...item, note: newNote } : item);
      setAllContent(updater);
      setFilteredContent(updater);
      toast.success("Note updated successfully");
    } else {
      const data = await response.json();
      throw new Error(data.message || "Failed to update note");
    }
  };

  const handleDotClick = (savedItemId, perspectiveIndex) => {
    setCurrentPerspectives((prev) => ({ ...prev, [savedItemId]: perspectiveIndex }));
  };
  const handleMouseEnter = (id) => setIsPaused((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id) => setIsPaused((prev) => ({ ...prev, [id]: false }));

  const getCurrentPerspective = (savedItem) => {
    if (savedItem.type !== "news") return null;
    return savedItem.allPerspectives?.[currentPerspectives[savedItem.id] || 0] || savedItem.news;
  };
  const getCurrentPerspectiveIndex = (savedItem) => currentPerspectives[savedItem.id] || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-blue-600 bg-blue-100";
      case "completed": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDebateActionButton = (debate) => {
    if (debate.status === "completed") return (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-lg text-sm">
        <Award className="w-4 h-4" /><span className="font-medium">View Report</span>
      </div>
    );
    if (debate.can_continue) return (
      <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm">
        <PlayCircle className="w-4 h-4" /><span className="font-medium">Continue</span>
      </div>
    );
    return (
      <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1 rounded-lg text-sm">
        <Clock className="w-4 h-4" /><span className="font-medium">In Progress</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch { return "Invalid date"; }
  };

  const getNavLinks = () => {
    const baseUrl = `/saved-folders`;
    return [
      { label: "All Content", url: `${baseUrl}/${folderId}`, count: stats.total, active: contentType === "all", icon: Target },
      { label: "Articles", url: `${baseUrl}/news/${folderId}`, count: stats.news, active: contentType === "news", icon: FileText },
      { label: "Debates", url: `${baseUrl}/debates/${folderId}`, count: stats.debates, active: contentType === "debates", icon: MessageCircle },
    ];
  };

  const getPageTitle = () => {
    switch (contentType) {
      case "news": return `${folder?.name || "Folder"} - Articles`;
      case "debates": return `${folder?.name || "Folder"} - Debates`;
      default: return folder?.name || "Folder";
    }
  };

  const getPageDescription = () => {
    switch (contentType) {
      case "news": return `${stats.news} saved article${stats.news !== 1 ? "s" : ""}`;
      case "debates": return `${stats.debates} saved debate${stats.debates !== 1 ? "s" : ""}`;
      default: return `${stats.total} saved item${stats.total !== 1 ? "s" : ""} (${stats.news} articles, ${stats.debates} debates)`;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Folder</h3>
        <p className="text-gray-600 text-lg">Fetching your saved content...</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-red-800 text-xl font-semibold mb-4">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => router.push("/saved-folders")} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium">Back to Folders</button>
          <button onClick={fetchFolderData} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium">Try Again</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* ── Header ── z-30 so navbar dropdowns (z-41/42) render above it */}
      <div className="bg-white/95 shadow-sm border-b sticky top-0 z-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.push("/saved-folders")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Folders</span>
            </button>
            <div className="text-gray-400">/</div>
            <span className="text-gray-600 font-medium">{folder?.name || "Loading..."}</span>
            {contentType !== "all" && (
              <><div className="text-gray-400">/</div><span className="text-blue-600 font-medium capitalize">{contentType}</span></>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
              <p className="text-gray-600 text-lg">{getPageDescription()}</p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => router.push(link.url)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    link.active ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${link.active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {link.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Remove Confirm Modal ── */}
      <AnimatePresence>
        {removeConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-center">Remove {removeConfirm.type === "news" ? "Article" : "Debate"}</h3>
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to remove &ldquo;{removeConfirm.type === "news" ? removeConfirm.news?.title : removeConfirm.debate?.title}&rdquo; from this folder?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setRemoveConfirm(null)} disabled={removingId === removeConfirm.id} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                <button
                  onClick={() => handleRemoveContent(removeConfirm.id, removeConfirm.type)}
                  disabled={removingId === removeConfirm.id}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {removingId === removeConfirm.id ? <><Loader2 className="w-4 h-4 animate-spin" />Removing...</> : "Remove"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={() => setNotesModal({ isOpen: false, savedItem: null })}
        savedItem={notesModal.savedItem}
        onUpdateNote={handleUpdateNote}
      />

      {/* ── Content Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto">
              <Eye className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {searchQuery ? "No content found" : `No saved ${contentType === "all" ? "content" : contentType}`}
              </h3>
              <p className="text-gray-600 text-lg">
                {searchQuery ? "Try adjusting your search terms" : `Start saving ${contentType === "all" ? "content" : contentType} to this folder`}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">Clear Search</button>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((savedItem, index) => (
              <motion.div
                key={`${savedItem.type}-${savedItem.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white shadow-lg cursor-pointer overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-500 flex flex-col group"
                onMouseEnter={() => savedItem.type === "news" && handleMouseEnter(savedItem.id)}
                onMouseLeave={() => savedItem.type === "news" && handleMouseLeave(savedItem.id)}
              >
                {savedItem.type === "news" ? (
                  <NewsCard
                    savedItem={savedItem}
                    getCurrentPerspective={getCurrentPerspective}
                    getCurrentPerspectiveIndex={getCurrentPerspectiveIndex}
                    getViewpointColor={getViewpointColor}
                    handleContentClick={handleContentClick}
                    handleDotClick={handleDotClick}
                    setRemoveConfirm={setRemoveConfirm}
                    setNotesModal={setNotesModal}
                    formatDate={formatDate}
                    cn={cn}
                  />
                ) : (
                  <DebateCard
                    savedItem={savedItem}
                    getStatusColor={getStatusColor}
                    getDebateActionButton={getDebateActionButton}
                    handleContentClick={handleContentClick}
                    setRemoveConfirm={setRemoveConfirm}
                    setNotesModal={setNotesModal}
                    formatDate={formatDate}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── NewsCard ──────────────────────────────────────────────────────────────────
const NewsCard = ({
  savedItem, getCurrentPerspective, getCurrentPerspectiveIndex,
  getViewpointColor, handleContentClick, handleDotClick,
  setRemoveConfirm, setNotesModal, formatDate, cn,
}) => {
  const currentPerspective = getCurrentPerspective(savedItem);
  const currentIndex = getCurrentPerspectiveIndex(savedItem);

  return (
    <>
      {/* ── Top bar: badge + delete only ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
          <FileText className="w-3 h-3" />
          Article
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setRemoveConfirm(savedItem); }}
          className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Remove from folder"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── Perspectives names header (original) ── */}
      {savedItem.allPerspectives?.length > 1 && (
        <div className="px-4 pb-2 bg-gray-50 border-b border-gray-100 py-2">
          <p className="text-[10px] md:text-xs text-black font-medium">
            <span className="flex gap-1 items-center flex-wrap">
              <span className="font-bold">Perspectives:</span>
              {savedItem.allPerspectives.map((p, i) => (
                <span key={i} className="text-gray-600">
                  {p.viewpoint}{i < savedItem.allPerspectives.length - 1 ? "," : ""}
                </span>
              ))}
            </span>
          </p>
        </div>
      )}

      {/* ── Image ── */}
      <div className="relative w-full h-48 bg-gray-100">
        {currentPerspective?.media_type === "video" ? (
          <video
            src={`https://wowfy.in/testusr/images/${currentPerspective.image_url}`}
            className="w-full h-full object-cover"
            controls controlsList="nodownload noplaybackrate nofullscreen"
            disablePictureInPicture autoPlay muted loop
            onClick={() => handleContentClick(savedItem)}
          />
        ) : (
          <Image
            src={`https://wowfy.in/testusr/images/${currentPerspective?.image_url || savedItem.news?.image_url || ""}`}
            alt={currentPerspective?.title || savedItem.news?.title || "News image"}
            width={400} height={300}
            className="w-full h-full object-cover"
            onClick={() => handleContentClick(savedItem)}
            onError={(e) => { e.target.src = "/api/placeholder/400/300"; }}
          />
        )}
        {/* Viewpoint pill over image bottom-left */}
        <span className={cn(
          "absolute bottom-2 left-2 text-white text-xs flex items-center font-medium px-2 py-1 rounded-md bg-opacity-90",
          getViewpointColor(currentIndex, "bg")
        )}>
          <GrFormView size={18} />
          {currentPerspective?.viewpoint || savedItem.news?.viewpoint || "Unknown"}
        </span>
      </div>

      {/* ── Dots below image, centered (original position) ── */}
      {savedItem.allPerspectives?.length > 1 && (
        <div className="flex justify-center my-3 space-x-2">
          {savedItem.allPerspectives.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); handleDotClick(savedItem.id, i); }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === i ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-600"
              )}
            />
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-col flex-grow p-6">
        <motion.div
          key={`${savedItem.id}-${currentIndex}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
        >
          <span className={cn("text-xs flex items-center font-semibold mb-2", getViewpointColor(currentIndex, "text"))}>
            <GrFormView size={18} className={getViewpointColor(currentIndex, "text")} />
            {currentPerspective?.viewpoint || savedItem.news?.viewpoint || "Unknown"} Perspective
          </span>
          <h3
            onClick={() => handleContentClick(savedItem)}
            className="text-lg font-semibold text-gray-800 mb-3 cursor-pointer line-clamp-3 hover:text-blue-600 transition-colors"
          >
            {currentPerspective?.title || savedItem.news?.title || "Untitled"}
          </h3>
        </motion.div>

        {(currentPerspective?.summary || savedItem.news?.summary) && (
          <p onClick={() => handleContentClick(savedItem)} className="text-gray-600 text-sm mb-4 line-clamp-3 cursor-pointer">
            {currentPerspective?.summary || savedItem.news?.summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto mb-4">
          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>Saved {formatDate(savedItem.saved_at)}</span></div>
          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{formatDate(currentPerspective?.show_date || savedItem.news?.show_date)}</span></div>
        </div>
      </div>

      {/* ── Notes footer ── */}
      <div className="px-6 pb-6 border-t border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); setNotesModal({ isOpen: true, savedItem }); }}
          className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors font-medium w-full justify-center py-3"
        >
          <FileText className="w-4 h-4" />
          <span>{savedItem.note ? "View/Edit Notes" : "Add Notes"}</span>
          {savedItem.note && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
        </button>
      </div>
    </>
  );
};

// ── DebateCard ────────────────────────────────────────────────────────────────
const DebateCard = ({
  savedItem, getStatusColor, getDebateActionButton,
  handleContentClick, setRemoveConfirm, setNotesModal, formatDate,
}) => (
  <>
    {/* ── Top bar: badge + remove ── */}
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
        <MessageCircle className="w-3 h-3" />
        Debate
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setRemoveConfirm(savedItem); }}
        className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Remove from folder"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    {/* ── Body ── */}
    <div className="p-4 pt-2 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(savedItem.debate?.status)}`}>
          {savedItem.debate?.status ? savedItem.debate.status.charAt(0).toUpperCase() + savedItem.debate.status.slice(1) : "Unknown"}
        </span>
        <span className="text-xs text-gray-500">{formatDate(savedItem.saved_at)}</span>
      </div>

      <h3
        onClick={() => handleContentClick(savedItem)}
        className="text-base font-semibold text-gray-800 mb-4 cursor-pointer line-clamp-2 hover:text-blue-600 transition-colors leading-snug"
      >
        {savedItem.debate?.title || "Untitled Debate"}
      </h3>

      {savedItem.debate && (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{savedItem.debate.conversation_count || 0}/{savedItem.debate.max_conversations || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${savedItem.debate.progress_percentage || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-800">Your Position</span>
              </div>
              <p className="text-green-700 text-sm font-medium">{savedItem.debate.user_position_title || "No position set"}</p>
            </div>
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-red-800">AI Position</span>
              </div>
              <p className="text-red-700 text-sm font-medium">{savedItem.debate.ai_position_title || "No position set"}</p>
            </div>
          </div>

          <div className="mb-2">{getDebateActionButton(savedItem.debate)}</div>
        </>
      )}
    </div>

    {/* ── Notes footer ── */}
    <div className="px-4 pb-4 border-t border-gray-100 mt-auto">
      <button
        onClick={(e) => { e.stopPropagation(); setNotesModal({ isOpen: true, savedItem }); }}
        className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors font-medium w-full justify-center py-3"
      >
        <FileText className="w-4 h-4" />
        <span>{savedItem.note ? "View/Edit Notes" : "Add Notes"}</span>
        {savedItem.note && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
      </button>
    </div>
  </>
);

// ── NotesModal ────────────────────────────────────────────────────────────────
const NotesModal = ({ isOpen, onClose, savedItem, onUpdateNote }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && savedItem) { setNote(savedItem.note || ""); setError(""); }
  }, [isOpen, savedItem]);

  const handleSaveNote = async () => {
    if (!savedItem) return;
    setLoading(true); setError("");
    try {
      await onUpdateNote(savedItem.id, note.trim() || null, savedItem.type);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setNote(savedItem?.note || ""); setError(""); onClose(); };

  if (!isOpen) return null;

  const getTitle = () => {
    if (savedItem?.type === "news") return savedItem.news?.title || "Untitled Article";
    if (savedItem?.type === "debate") return savedItem.debate?.title || "Untitled Debate";
    return "Unknown Content";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold text-gray-900">My Notes</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X size={20} /></button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              {savedItem?.type === "news" ? <><FileText className="w-4 h-4 text-green-600" />Notes for article:</> : <><MessageCircle className="w-4 h-4 text-purple-600" />Notes for debate:</>}
            </p>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{getTitle()}</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4"><p className="text-sm">{error}</p></div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Your Notes</label>
            <textarea
              placeholder={note ? "Edit your notes..." : `Add your thoughts about this ${savedItem?.type}...`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{note.length}/1000 characters</p>
          </div>

          {!note && (
            <div className="text-center py-4 text-gray-500">
              <FileText size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notes added yet.</p>
            </div>
          )}
        </div>

        <div className="border-t p-6 flex space-x-3">
          <button onClick={handleClose} disabled={loading} className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors">Cancel</button>
          <button
            onClick={handleSaveNote}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save Note"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SavedFolderDetailsPage;