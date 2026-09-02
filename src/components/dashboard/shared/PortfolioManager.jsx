import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Loader2,
  X,
  FolderKanban,
  Eye,
  ExternalLink,
  Layers,
  Sparkles,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Hammer,
  Palette,
} from "lucide-react";
import { uploadFiles } from "../../../../superBase";
import {
  useGetUserPortfolioWithPaginationQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../../dashboardPages/designer/dashboard/DesignerDashboardApiSlice";
import { toast } from "react-toastify";


const CATEGORIES = [
  "Residential Architecture",
  "Commercial & Office",
  "Interior Design & Styling",
  "Modular Kitchen & Joinery",
  "Turnkey Construction & Civil",
  "Renovation & Remodeling",
  "Landscape & Outdoor",
  "Structural Blueprints",
  "3D Visualization & Renders",
];

export default function PortfolioManager({ roleTitle = "Professional", roleKey = "DESIGNER" }) {
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      setUserId(stored?.id || stored?._id || null);
    } catch {
      setUserId(null);
    }
  }, []);

  const {
    data: portfolioData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserPortfolioWithPaginationQuery(
    { userId, page, limit },
    { skip: !userId }
  );

  const rawPosts = portfolioData?.posts || [];
  const pagination = portfolioData?.pagination || {};

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [images, setImages] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setImages([]);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setTitle(post.title || "");
    setDescription(post.description || "");
    setCategory(post.category || CATEGORIES[0]);
    setImages(Array.isArray(post.images) ? [...post.images] : []);
    setFormError("");
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingFiles(true);
    setFormError("");

    try {
      const uploadResults = await uploadFiles(files, "portfolio", "showcase-images");
      const urls = uploadResults.map((r) => r.publicUrl).filter(Boolean);
      if (urls.length) {
        setImages((prev) => [...prev, ...urls]);
      } else {
        setFormError("Failed to upload images. Please check file format.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setFormError("Error uploading images to storage.");
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Please enter a project title.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please enter a project description.");
      return;
    }
    if (images.length === 0) {
      setFormError("Please upload at least one project photo.");
      return;
    }

    try {
      if (editingPost) {
        await updatePost({
          postId: editingPost.id || editingPost._id,
          title: title.trim(),
          description: description.trim(),
          images,
          category,
        }).unwrap();
        toast.success("Showcase post updated successfully!");
      } else {
        await createPost({
          title: title.trim(),
          description: description.trim(),
          images,
          category,
        }).unwrap();
        toast.success("Showcase post created and added to your portfolio!");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(err?.data?.message || "Failed to save post. Please try again.");
    }
  };

  const handleDelete = async (postId) => {
    setDeletingId(postId);
    try {
      await deletePost(postId).unwrap();
      toast.success("Post deleted successfully.");
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete post.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Filter posts
  const filteredPosts = rawPosts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalImagesCount = rawPosts.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
              {roleTitle} Portfolio & Posts
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
              Live Showcase
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Publish, manage, and curate high-resolution blueprints, 3D renders, and site execution projects displayed on your public profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userId && (
            <a
              href={`/portfolio/${userId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg border border-[var(--border)] bg-white text-xs font-semibold text-[var(--heading)] hover:bg-[var(--background-secondary)] transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink size={14} /> Public View
            </a>
          )}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={16} /> New Project Post
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[var(--border)] rounded-xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
            <FolderKanban size={20} />
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] font-medium block">Total Showcase Posts</span>
            <span className="text-xl font-extrabold text-[var(--heading)]">{pagination.totalPosts || rawPosts.length}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[var(--border)] rounded-xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/15 text-[var(--heading)] flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] font-medium block">Published Media Items</span>
            <span className="text-xl font-extrabold text-[var(--heading)]">{totalImagesCount} Photos</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[var(--border)] rounded-xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] font-medium block">Public Status</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={15} /> Verified & Visible
            </span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-white border border-[var(--border)] rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={15} />
          <input
            type="text"
            placeholder="Search projects by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 text-[var(--heading)]"
          />
        </div>

        <span className="text-xs text-[var(--muted)] font-medium">
          Showing {filteredPosts.length} of {rawPosts.length} posts
        </span>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-[var(--primary)]" size={24} />
            <span>Loading showcase posts...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-3">
            <FolderKanban className="text-[var(--muted)] opacity-40" size={36} />
            <h4 className="text-sm font-bold text-[var(--heading)]">No project posts found</h4>
            <p className="text-[var(--muted)] max-w-sm">
              You haven't uploaded any showcase projects yet. Click the button below to add your first work.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-1 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition cursor-pointer"
            >
              + Create First Project Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text)]">
              <thead className="bg-[var(--background-secondary)] text-[var(--heading)] uppercase font-bold text-[11px] tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th className="px-5 py-3.5 w-16">Preview</th>
                  <th className="px-5 py-3.5">Title & Description</th>
                  <th className="px-5 py-3.5 w-28">Media</th>
                  <th className="px-5 py-3.5 w-32">Published</th>
                  <th className="px-5 py-3.5 w-36 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-medium">
                {filteredPosts.map((post) => {
                  const imagesList = Array.isArray(post.images) ? post.images : [];
                  const coverImg = imagesList[0] || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&q=80";

                  return (
                    <tr key={post.id || post._id} className="hover:bg-[var(--background-secondary)]/50 transition">
                      <td className="px-5 py-3.5">
                        <div
                          onClick={() => setPreviewPost(post)}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)] shrink-0 cursor-pointer group relative"
                        >
                          <img src={coverImg} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                            <Eye size={14} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <h4
                            onClick={() => setPreviewPost(post)}
                            className="font-bold text-[var(--heading)] hover:text-[var(--primary)] transition cursor-pointer text-sm line-clamp-1"
                          >
                            {post.title}
                          </h4>
                          <p className="text-[var(--muted)] line-clamp-1 text-[11px] mt-0.5 leading-relaxed">
                            {post.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--background-secondary)] text-[var(--heading)] text-[11px] font-bold border border-[var(--border)] inline-flex items-center gap-1">
                          <Layers size={12} /> {imagesList.length} Photos
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[var(--muted)] text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewPost(post)}
                            className="p-1.5 rounded-md border border-[var(--border)] bg-white text-[var(--text)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition cursor-pointer"
                            title="Preview post"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(post)}
                            className="p-1.5 rounded-md border border-[var(--border)] bg-white text-[var(--text)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition cursor-pointer"
                            title="Edit post"
                          >
                            <Pencil size={14} />
                          </button>

                          {confirmDeleteId === (post.id || post._id) ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(post.id || post._id)}
                                disabled={deletingId === (post.id || post._id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                {deletingId === (post.id || post._id) ? "..." : "Confirm"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-[var(--background-secondary)] text-[var(--heading)] rounded text-[10px] font-semibold hover:bg-[var(--border)] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(post.id || post._id)}
                              className="p-1.5 rounded-md border border-[var(--border)] bg-white text-[var(--text)] hover:text-red-600 hover:border-red-300 transition cursor-pointer"
                              title="Delete post"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[var(--border)] shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
                {editingPost ? "Edit Showcase Project" : "Add New Showcase Project"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--background-secondary)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text)] mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Minimalist Villa Living Room & Terrace"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] bg-white text-[var(--heading)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">
                  Description & Specifications <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the architectural concept, materials used, client requirements, space dimensions, and execution milestones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] resize-none leading-relaxed text-[var(--heading)]"
                  required
                />
              </div>

              {/* Photo Upload & Gallery */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[var(--text)]">
                    Project Photos & Drawings ({images.length}) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[var(--muted)]">High-res PNG, JPG, or WebP</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)] group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-lg aspect-square flex flex-col items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] cursor-pointer transition p-2 text-center bg-[var(--background-secondary)]/50 hover:bg-[var(--primary)]/5">
                    <ImagePlus size={24} className="mb-1 text-[var(--muted)]" />
                    <span className="text-[10px] font-bold">
                      {uploadingFiles ? "Uploading..." : "+ Add Images"}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingFiles}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--heading)] font-semibold hover:bg-[var(--background-secondary)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating || uploadingFiles}
                  className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {(isCreating || isUpdating) && <Loader2 size={14} className="animate-spin" />}
                  {editingPost ? "Save Changes" : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setPreviewPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[var(--border)] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>{previewPost.title}</h3>
                <span className="text-xs text-[var(--primary)] font-semibold">{previewPost.category || "Showcase Project"}</span>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="w-8 h-8 rounded-full bg-[var(--background-secondary)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text)] leading-relaxed whitespace-pre-line">
              {previewPost.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(previewPost.images || []).map((img, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)]">
                  <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  setPreviewPost(null);
                  openEditModal(previewPost);
                }}
                className="px-4 py-2 border border-[var(--border)] text-[var(--heading)] rounded-lg text-xs font-bold hover:bg-[var(--background-secondary)] cursor-pointer"
              >
                Edit Post
              </button>
              <button
                onClick={() => setPreviewPost(null)}
                className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
