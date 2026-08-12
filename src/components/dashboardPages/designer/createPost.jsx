


import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, ImagePlus, Loader2, X } from "lucide-react";
import {
    useGetUserPortfolioWithPaginationQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} from "./dashboard/DesignerDashboardApiSlice";
import { uploadFiles } from "../../../../superBase";
import Table from "../../../global/Table";

export default function PostManager() {
    const [userId, setUserId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        setUserId(stored?.id || stored?._id || null);
    }, []);


    const {
        data: portfolioData,
        isLoading,
        isError,
        error,
    } = useGetUserPortfolioWithPaginationQuery(
        { userId, page, limit },
        { skip: !userId }
    );
    const posts = portfolioData?.posts || [];
    const pagination = portfolioData?.pagination || {};

    const [deletePost] = useDeletePostMutation();

    const [formOpen, setFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const openCreate = () => {
        setEditingPost(null);
        setFormOpen(true);
    };

    const openEdit = (post) => {
        setEditingPost(post);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingPost(null);
    };

    const handleDelete = async (postId) => {
        setDeletingId(postId);
        try {
            await deletePost(postId).unwrap();
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
        setDeletingId(null);
        setConfirmId(null);
    };

    const tableColumns = [
        {
            key: "title",
            label: "Title",
            width: "25%",
            truncate: true,
            maxLines: 1,
        },
        {
            key: "description",
            label: "Description",
            width: "35%",
            truncate: true,
            maxLines: 2,
        },
        {
            key: "images",
            label: "Images",
            width: "12%",
            render: (row) => (
                <span className="text-sm">{row.images?.length || 0}</span>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            width: "15%",
            render: (row) => {
                const date = new Date(row.createdAt).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                );
                return <span className="text-sm">{date}</span>;
            },
        },
        {
            key: "actions",
            label: "Actions",
            width: "13%",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="pm-action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(row);
                        }}
                        title="Edit post"
                    >
                        <Pencil size={14} />
                        Edit
                    </button>

                    {confirmId === (row.id || row._id) ? (
                        <div className="pm-confirm">
                            <button
                                type="button"
                                className="pm-action-btn pm-action-danger text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(row.id || row._id);
                                }}
                                disabled={deletingId === (row.id || row._id)}
                            >
                                {deletingId === (row.id || row._id) ? (
                                    <Loader2 size={12} className="pm-spin" />
                                ) : (
                                    "Yes"
                                )}
                            </button>
                            <button
                                type="button"
                                className="pm-action-btn text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmId(null);
                                }}
                            >
                                No
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="pm-action-btn pm-action-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmId(row.id || row._id);
                            }}
                            title="Delete post"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="pm-wrap">
            <div className="pm-toolbar">
                <div>
                    <h2 className="pm-title">Your posts</h2>
                    <p className="pm-subtitle">
                        Manage the work shown on your portfolio
                    </p>
                </div>
                <button
                    type="button"
                    className="pm-new-btn"
                    onClick={openCreate}
                >
                    <Plus size={16} />
                    New post
                </button>
            </div>

            {isLoading ? (
                <div className="pm-state">
                    <Loader2 size={20} className="pm-spin" />
                    <span>Loading your posts…</span>
                </div>
            ) : isError ? (
                <div className="pm-state pm-state-error">
                    {error?.data?.message || "Failed to load posts."}
                </div>
            ) : (
                <>
                    <Table
                        columns={tableColumns}
                        data={posts}
                        rowKey="id"
                        emptyMessage="You haven't created any posts yet."
                        minWidth="100%"
                    />

                    {posts.length > 0 && (
                        <div className="pm-pagination">
                            <button
                                type="button"
                                className="pm-page-btn"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <span className="pm-page-info">
                                Page {pagination.currentPage} of{" "}
                                {pagination.totalPages}
                            </span>
                            <button
                                type="button"
                                className="pm-page-btn"
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(
                                            pagination.totalPages,
                                            p + 1
                                        )
                                    )
                                }
                                disabled={
                                    page === pagination.totalPages
                                }
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {formOpen && <PostFormModal post={editingPost} onClose={closeForm} />}

            <style>{`
                .pm-wrap { font-family: var(--font-body); max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
                .pm-toolbar { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
                .pm-title { font-family: var(--font-heading); font-size: 26px; color: var(--heading); margin: 0 0 4px; }
                .pm-subtitle { font-size: 14px; color: var(--muted); margin: 0; }
                .pm-new-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: var(--radius-sm); border: none; background: var(--primary); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: var(--transition); white-space: nowrap; }
                .pm-new-btn:hover { background: var(--primary-hover); }
                .pm-state { display: flex; align-items: center; gap: 10px; padding: 24px; border-radius: var(--radius-sm); border: 1px solid var(--border); color: var(--muted); font-size: 14px; }
                .pm-state-error { border-color: var(--danger); color: var(--danger); background: rgba(178,58,72,.06); }
                .pm-action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 12px; font-weight: 600; cursor: pointer; transition: var(--transition); }
                .pm-action-btn:hover { background: var(--background-secondary); color: var(--heading); }
                .pm-action-danger { color: var(--danger); border-color: var(--danger); }
                .pm-action-danger:hover { background: rgba(178,58,72,.08); color: var(--danger); }
                .pm-confirm { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
                .pm-spin { animation: pm-spin 0.8s linear infinite; }
                .pm-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 24px; }
                .pm-page-btn { padding: 8px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 13px; font-weight: 600; cursor: pointer; transition: var(--transition); }
                .pm-page-btn:hover:not(:disabled) { background: var(--background-secondary); }
                .pm-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .pm-page-info { font-size: 13px; color: var(--muted); white-space: nowrap; }
                @keyframes pm-spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

function PostFormModal({ post, onClose }) {
    const fileInputRef = useRef(null);
    const isEdit = Boolean(post);

    const [createPost, { isLoading: creating }] = useCreatePostMutation();
    const [updatePost, { isLoading: updating }] = useUpdatePostMutation();

    const [title, setTitle] = useState(post?.title || "");
    const [description, setDescription] = useState(post?.description || "");
    const [existingImages, setExistingImages] = useState(post?.images || []);
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setNewFiles((prev) => [...prev, ...files]);
        setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        e.target.value = "";
    };

    const removeExistingImage = (url) => setExistingImages((prev) => prev.filter((img) => img !== url));

    const removeNewFile = (index) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
        setNewPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (!title.trim() || !description.trim()) {
            setLocalError("Title and description are required.");
            return;
        }
        if (!existingImages.length && !newFiles.length) {
            setLocalError("At least one image is required.");
            return;
        }

        try {
            let uploadedUrls = [];
            if (newFiles.length) {
                setUploading(true);
                const filesMap = Object.fromEntries(newFiles.map((file, i) => [`image_${i}`, file]));
                const uploaded = await uploadFiles(filesMap, "posts", "portfolio");
                uploadedUrls = Object.values(uploaded);
                setUploading(false);
            }

            const images = [...existingImages, ...uploadedUrls];
            const payload = { title: title.trim(), description: description.trim(), images };

            if (isEdit) {
                await updatePost({ postId: post.id || post._id, ...payload }).unwrap();
            } else {
                await createPost(payload).unwrap();
            }

            onClose?.();
        } catch (err) {
            setUploading(false);
            setLocalError(err?.data?.message || err?.message || "Something went wrong. Please try again.");
        }
    };

    const busy = creating || updating || uploading;
    const allPreviewImages = [
        ...existingImages.map((url) => ({ url, isNew: false })),
        ...newPreviews.map((url, i) => ({ url, isNew: true, index: i })),
    ];

    return (
        <div className="pf-overlay" role="dialog" aria-modal="true">
            <div className="pf-modal">
                <div className="pf-header">
                    <h2 className="pf-title">{isEdit ? "Edit post" : "New post"}</h2>
                    <button type="button" className="pf-icon-btn" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pf-form">
                    <div className="pf-field">
                        <label className="pf-label" htmlFor="pf-title">Title</label>
                        <input
                            id="pf-title"
                            className="pf-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Modern Kitchen Remodel"
                            disabled={busy}
                        />
                    </div>

                    <div className="pf-field">
                        <label className="pf-label" htmlFor="pf-description">Description</label>
                        <textarea
                            id="pf-description"
                            className="pf-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the work, materials, and finish"
                            rows={4}
                            disabled={busy}
                        />
                    </div>

                    <div className="pf-field">
                        <label className="pf-label">Images</label>
                        <div className="pf-image-grid">
                            {allPreviewImages.map((img, i) => (
                                <div className="pf-image-thumb" key={img.url + i}>
                                    <img src={img.url} alt="" />
                                    <button
                                        type="button"
                                        className="pf-thumb-remove"
                                        onClick={() =>
                                            img.isNew ? removeNewFile(img.index) : removeExistingImage(img.url)
                                        }
                                        disabled={busy}
                                        aria-label="Remove image"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="pf-add-image"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={busy}
                            >
                                <ImagePlus size={20} />
                                <span>Add</span>
                            </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFilesSelected} />
                    </div>

                    {localError && <p className="pf-error">{localError}</p>}

                    <div className="pf-actions">
                        <button type="button" className="pf-btn pf-btn-secondary" onClick={onClose} disabled={busy}>
                            Cancel
                        </button>
                        <button type="submit" className="pf-btn pf-btn-primary" disabled={busy}>
                            {busy ? (
                                <>
                                    <Loader2 size={16} className="pf-spin" />
                                    {uploading ? "Uploading" : "Saving"}
                                </>
                            ) : isEdit ? (
                                "Save changes"
                            ) : (
                                "Publish post"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .pf-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
                .pf-modal { width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); font-family: var(--font-body); }
                .pf-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
                .pf-title { font-family: var(--font-heading); font-size: 20px; color: var(--heading); margin: 0; }
                .pf-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; transition: var(--transition); }
                .pf-icon-btn:hover { background: var(--background-secondary); color: var(--heading); }
                .pf-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
                .pf-field { display: flex; flex-direction: column; gap: 8px; }
                .pf-label { font-size: 13px; font-weight: 600; color: var(--heading); }
                .pf-input, .pf-textarea { font-family: var(--font-body); font-size: 14px; padding: 11px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--background); color: var(--text); transition: var(--transition); outline: none; }
                .pf-input:focus, .pf-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(74,52,40,.08); }
                .pf-textarea { resize: vertical; min-height: 90px; }
                .pf-image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 10px; }
                .pf-image-thumb { position: relative; aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); }
                .pf-image-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .pf-thumb-remove { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: var(--radius-sm); background: rgba(0,0,0,.55); color: #fff; cursor: pointer; }
                .pf-add-image { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px dashed var(--border); border-radius: var(--radius-sm); background: var(--background-secondary); color: var(--muted); font-size: 11px; cursor: pointer; transition: var(--transition); }
                .pf-add-image:hover { border-color: var(--primary); color: var(--primary); }
                .pf-error { margin: 0; padding: 10px 14px; border-radius: var(--radius-sm); background: rgba(178,58,72,.08); border: 1px solid var(--danger); color: var(--danger); font-size: 13px; }
                .pf-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
                .pf-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: var(--transition); }
                .pf-btn:disabled { opacity: .6; cursor: not-allowed; }
                .pf-btn-primary { background: var(--primary); color: #fff; }
                .pf-btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
                .pf-btn-secondary { background: var(--surface); border-color: var(--border); color: var(--text); }
                .pf-btn-secondary:hover:not(:disabled) { background: var(--background-secondary); }
                .pf-spin { animation: pf-spin 0.8s linear infinite; }
                @keyframes pf-spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}


