import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    useGetUserPortfolioQuery,
    useFollowUserMutation,
    useUnfollowUserMutation,
} from "./supplyproductsapislice";

const UserPortfolioProfile = () => {
    const { userId } = useParams();
    const { data, isLoading, isError, refetch } = useGetUserPortfolioQuery(userId);
    const [followUser, { isLoading: following }] = useFollowUserMutation();
    const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activePost, setActivePost] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardIndex, setCardIndex] = useState({});

    const posts = data?.data || [];
    const profileUser = posts[0]?.user || data?.user;

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(userId).unwrap();
                setIsFollowing(false);
            } else {
                await followUser(userId).unwrap();
                setIsFollowing(true);
            }
            refetch();
        } catch (err) {
            console.error("Follow toggle failed:", err);
        }
    };

    const openPost = (post) => {
        setActivePost(post);
        setActiveIndex(0);
    };

    const nextModalImage = (e) => {
        e.stopPropagation();
        setActiveIndex((i) => (i + 1) % activePost.images.length);
    };

    const prevModalImage = (e) => {
        e.stopPropagation();
        setActiveIndex((i) => (i - 1 + activePost.images.length) % activePost.images.length);
    };

    const nextCardImage = (e, postId, len) => {
        e.stopPropagation();
        setCardIndex((prev) => ({ ...prev, [postId]: ((prev[postId] || 0) + 1) % len }));
    };

    const prevCardImage = (e, postId, len) => {
        e.stopPropagation();
        setCardIndex((prev) => ({ ...prev, [postId]: ((prev[postId] || 0) - 1 + len) % len }));
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
                <p className="text-[#1a1a2e]/50">Loading profile...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
                <p className="text-red-500">Failed to load profile</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#faf8f4]">
            <div className="w-full border-b border-[#1a1a2e]/10 px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-[#0098cc]/10 flex items-center justify-center text-[#0098cc] text-2xl font-semibold overflow-hidden flex-shrink-0">
                        {profileUser?.profile ? (
                            <img src={profileUser.profile} alt={profileUser.name} className="w-full h-full object-cover" />
                        ) : (
                            profileUser?.name?.[0]?.toUpperCase() || "U"
                        )}
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.25em] uppercase text-[#0098cc] font-semibold mb-1">
                            {profileUser?.role
                                ? { 1: "Client", 2: "Designer", 3: "Architect", 4: "Contractor", 5: "Material Supplier" }[
                                profileUser.role
                                ] || "Professional"
                                : "Professional"}
                        </p>
                        <h1
                            className="text-3xl sm:text-4xl text-[#1a1a2e] leading-tight"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {profileUser?.name || "Portfolio"}
                        </h1>
                        <p className="text-sm text-[#1a1a2e]/50 mt-1">{posts.length} posts</p>
                    </div>
                </div>

                <button
                    onClick={handleFollowToggle}
                    disabled={following || unfollowing}
                    className={
                        isFollowing
                            ? "px-6 py-2.5 rounded-sm border border-[#1a1a2e]/20 text-[#1a1a2e] font-medium hover:bg-[#1a1a2e]/5 transition self-start sm:self-auto disabled:opacity-50"
                            : "px-6 py-2.5 rounded-sm bg-[#1a1a2e] text-white font-medium hover:bg-[#0098cc] transition self-start sm:self-auto disabled:opacity-50"
                    }
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>

            <div className="w-full px-6 sm:px-10 lg:px-16 py-10">
                {posts.length === 0 ? (
                    <div className="text-center text-[#1a1a2e]/40 py-24">No posts published yet.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1a1a2e]/10">
                        {posts.map((post) => {
                            const idx = cardIndex[post.id] || 0;
                            return (
                                <div
                                    key={post.id}
                                    className="group bg-[#faf8f4] hover:bg-white transition-colors cursor-pointer"
                                    onClick={() => openPost(post)}
                                >
                                    <div className="relative h-80 overflow-hidden bg-[#1a1a2e]/5">
                                        <img
                                            src={post.images[idx]}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {post.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => prevCardImage(e, post.id, post.images.length)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <ChevronLeft size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => nextCardImage(e, post.id, post.images.length)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <ChevronRight size={18} />
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {post.images.map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`w-1.5 h-1.5 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-sm tracking-wide">
                                                    {idx + 1}/{post.images.length}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3
                                            className="text-[#1a1a2e] text-lg mb-1.5"
                                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                        >
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-[#1a1a2e]/60 line-clamp-2 leading-relaxed">
                                            {post.description}
                                        </p>
                                        <p className="text-[11px] uppercase tracking-wide text-[#1a1a2e]/35 mt-3">
                                            {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {activePost && (
                <div
                    className="fixed inset-0 bg-[#1a1a2e]/80 flex items-center justify-center z-50 p-4 sm:p-8"
                    onClick={() => setActivePost(null)}
                >
                    <div
                        className="bg-[#faf8f4] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-[420px] bg-[#1a1a2e]/5 overflow-hidden">
                            <img
                                src={activePost.images[activeIndex]}
                                alt={`${activePost.title}-${activeIndex}`}
                                className="w-full h-full object-cover"
                            />

                            <button
                                onClick={() => setActivePost(null)}
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>

                            {activePost.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevModalImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextModalImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {activePost.images.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveIndex(i);
                                                }}
                                                className={`w-2 h-2 rounded-full transition ${i === activeIndex ? "bg-white" : "bg-white/40"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-sm tracking-wide">
                                        {activeIndex + 1} / {activePost.images.length}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="p-8">
                            <h3
                                className="text-2xl text-[#1a1a2e] mb-3"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {activePost.title}
                            </h3>
                            <p className="text-[#1a1a2e]/70 leading-relaxed">{activePost.description}</p>
                            <button
                                onClick={() => setActivePost(null)}
                                className="mt-6 px-5 py-2.5 rounded-sm border border-[#1a1a2e]/20 text-[#1a1a2e] font-medium hover:bg-[#1a1a2e]/5 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPortfolioProfile;