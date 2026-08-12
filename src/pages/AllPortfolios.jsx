// // // // // import React from "react";
// // // // // import { useNavigate } from "react-router-dom";
// // // // // import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

// // // // // const AllPortfolios = () => {
// // // // //   const navigate = useNavigate();
// // // // //   const { data, isLoading, isError } = useGetAllPortfoliosQuery({ page: 1, limit: 20 });

// // // // //   const portfolios = data?.data || [];

// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // // // //         <p className="text-[#1a1a2e]/50">Loading portfolios...</p>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (isError) {
// // // // //     return (
// // // // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // // // //         <p className="text-red-500">Failed to load portfolios</p>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="w-full min-h-screen bg-[#faf8f4]">
// // // // //       <div className="w-full border-b border-[#1a1a2e]/10 px-6 sm:px-10 lg:px-16 py-10">
// // // // //         <p className="text-xs tracking-[0.25em] uppercase text-[#0098cc] font-semibold mb-2">
// // // // //           Showcase
// // // // //         </p>
// // // // //         <h1
// // // // //           className="text-4xl sm:text-5xl text-[#1a1a2e]"
// // // // //           style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // // // //         >
// // // // //           Explore Portfolios
// // // // //         </h1>
// // // // //         <p className="text-[#1a1a2e]/60 mt-2 max-w-xl">
// // // // //           Work from designers, architects, and contractors building spaces worth following.
// // // // //         </p>
// // // // //       </div>

// // // // //       <div className="w-full px-6 sm:px-10 lg:px-16 py-10">
// // // // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1a1a2e]/10">
// // // // //           {portfolios.map((user) => {
// // // // //             const coverImage = user.posts?.[0]?.images?.[0];
// // // // //             const roleLabel =
// // // // //               { 1: "Client", 2: "Designer", 3: "Architect", 4: "Contractor", 5: "Material Supplier" }[
// // // // //                 user.role
// // // // //               ] || "Professional";

// // // // //             return (
// // // // //               <div
// // // // //                 key={user.id}
// // // // //                 onClick={() => navigate(`/portfolio/${user.id}`)}
// // // // //                 className="group cursor-pointer bg-[#faf8f4] hover:bg-white transition-colors"
// // // // //               >
// // // // //                 <div className="relative h-72 overflow-hidden bg-[#1a1a2e]/5">
// // // // //                   {coverImage ? (
// // // // //                     <img
// // // // //                       src={coverImage}
// // // // //                       alt={user.name}
// // // // //                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
// // // // //                     />
// // // // //                   ) : (
// // // // //                     <div className="w-full h-full flex items-center justify-center text-[#1a1a2e]/30 text-sm">
// // // // //                       No posts yet
// // // // //                     </div>
// // // // //                   )}
// // // // //                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
// // // // //                 </div>

// // // // //                 <div className="p-5 flex items-center gap-3">
// // // // //                   <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0098cc]/10 flex-shrink-0 flex items-center justify-center">
// // // // //                     {user.profile ? (
// // // // //                       <img src={user.profile} alt={user.name} className="w-full h-full object-cover" />
// // // // //                     ) : (
// // // // //                       <span className="text-[#0098cc] text-sm font-semibold">
// // // // //                         {user.name?.[0]?.toUpperCase()}
// // // // //                       </span>
// // // // //                     )}
// // // // //                   </div>
// // // // //                   <div className="min-w-0">
// // // // //                     <p
// // // // //                       className="text-[#1a1a2e] truncate leading-tight"
// // // // //                       style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // // // //                     >
// // // // //                       {user.name}
// // // // //                     </p>
// // // // //                     <p className="text-[11px] uppercase tracking-wide text-[#1a1a2e]/40">
// // // // //                       {roleLabel} · {user.posts?.length ?? user._count?.posts ?? 0} posts
// // // // //                     </p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             );
// // // // //           })}
// // // // //         </div>

// // // // //         {portfolios.length === 0 && (
// // // // //           <div className="text-center text-[#1a1a2e]/40 py-24">No portfolios published yet.</div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AllPortfolios;


// // // // import React, { useState } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

// // // // const ROLE_LABELS = {
// // // //   1: "Client",
// // // //   2: "Designer",
// // // //   3: "Architect",
// // // //   4: "Contractor",
// // // //   5: "Material Supplier",
// // // // };

// // // // const PAGE_LIMIT = 20;

// // // // // user.profile comes back as a JSON string (bio/specialization/etc.), not an image URL.
// // // // // This safely parses it and pulls out an avatar url if one ever exists (e.g. profile.avatar),
// // // // // otherwise falls back to initials.
// // // // const parseProfile = (profile) => {
// // // //   if (!profile) return null;
// // // //   if (typeof profile === "object") return profile;
// // // //   try {
// // // //     return JSON.parse(profile);
// // // //   } catch {
// // // //     return null;
// // // //   }
// // // // };

// // // // const Pagination = ({ currentPage, totalPages, onPageChange }) => {
// // // //   if (totalPages <= 1) return null;

// // // //   const pages = [];
// // // //   const windowSize = 1;
// // // //   const start = Math.max(1, currentPage - windowSize);
// // // //   const end = Math.min(totalPages, currentPage + windowSize);

// // // //   if (start > 1) {
// // // //     pages.push(1);
// // // //     if (start > 2) pages.push("ellipsis-start");
// // // //   }
// // // //   for (let p = start; p <= end; p++) pages.push(p);
// // // //   if (end < totalPages) {
// // // //     if (end < totalPages - 1) pages.push("ellipsis-end");
// // // //     pages.push(totalPages);
// // // //   }

// // // //   return (
// // // //     <div className="flex items-center justify-center gap-2 py-14">
// // // //       <button
// // // //         onClick={() => onPageChange(currentPage - 1)}
// // // //         disabled={currentPage === 1}
// // // //         className="px-4 py-2 text-sm rounded-full border border-[#1a1a2e]/15 text-[#1a1a2e]/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0098cc] hover:text-[#0098cc] transition-colors"
// // // //       >
// // // //         Prev
// // // //       </button>

// // // //       {pages.map((p, i) =>
// // // //         typeof p === "number" ? (
// // // //           <button
// // // //             key={p}
// // // //             onClick={() => onPageChange(p)}
// // // //             className={`w-9 h-9 text-sm rounded-full transition-colors ${p === currentPage
// // // //                 ? "bg-[#1a1a2e] text-white"
// // // //                 : "text-[#1a1a2e]/70 hover:bg-[#1a1a2e]/5"
// // // //               }`}
// // // //           >
// // // //             {p}
// // // //           </button>
// // // //         ) : (
// // // //           <span key={p + i} className="px-1 text-[#1a1a2e]/30 select-none">
// // // //             &hellip;
// // // //           </span>
// // // //         )
// // // //       )}

// // // //       <button
// // // //         onClick={() => onPageChange(currentPage + 1)}
// // // //         disabled={currentPage === totalPages}
// // // //         className="px-4 py-2 text-sm rounded-full border border-[#1a1a2e]/15 text-[#1a1a2e]/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0098cc] hover:text-[#0098cc] transition-colors"
// // // //       >
// // // //         Next
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // };

// // // // const PortfolioCard = ({ user, onClick }) => {
// // // //   const coverImage = user.posts?.[0]?.images?.[0];
// // // //   const roleLabel = ROLE_LABELS[user.role] || "Professional";
// // // //   const profileData = parseProfile(user.profile);
// // // //   const avatarUrl = profileData?.avatar || profileData?.image || null;
// // // //   const postCount = user._count?.posts ?? user.posts?.length ?? 0;

// // // //   return (
// // // //     <div
// // // //       onClick={onClick}
// // // //       className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#1a1a2e]/8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
// // // //     >
// // // //       <div className="relative h-64 overflow-hidden bg-[#1a1a2e]/5">
// // // //         {coverImage ? (
// // // //           <img
// // // //             src={coverImage}
// // // //             alt={user.name}
// // // //             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
// // // //           />
// // // //         ) : (
// // // //           <div className="w-full h-full flex items-center justify-center text-[#1a1a2e]/30 text-sm">
// // // //             No posts yet
// // // //           </div>
// // // //         )}
// // // //         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

// // // //         <span className="absolute top-3 left-3 text-[10px] tracking-wide uppercase bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[#1a1a2e]/70 font-medium">
// // // //           {roleLabel}
// // // //         </span>
// // // //       </div>

// // // //       <div className="p-5 flex items-center gap-3">
// // // //         <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0098cc]/10 flex-shrink-0 flex items-center justify-center">
// // // //           {avatarUrl ? (
// // // //             <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
// // // //           ) : (
// // // //             <span className="text-[#0098cc] text-sm font-semibold">
// // // //               {user.name?.[0]?.toUpperCase()}
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //         <div className="min-w-0">
// // // //           <p
// // // //             className="text-[#1a1a2e] truncate leading-tight"
// // // //             style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // // //           >
// // // //             {user.name}
// // // //           </p>
// // // //           <p className="text-[11px] uppercase tracking-wide text-[#1a1a2e]/40 mt-0.5">
// // // //             {postCount} {postCount === 1 ? "post" : "posts"}
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // const AllPortfolios = () => {
// // // //   const navigate = useNavigate();
// // // //   const [page, setPage] = useState(1);

// // // //   const { data, isLoading, isError, isFetching } = useGetAllPortfoliosQuery({
// // // //     page,
// // // //     limit: PAGE_LIMIT,
// // // //   });

// // // //   const portfolios = data?.data?.data || [];
// // // //   const pagination = data?.data?.pagination;
// // // //   const totalPages = pagination?.totalPages ?? 1;

// // // //   const handlePageChange = (newPage) => {
// // // //     if (newPage < 1 || newPage > totalPages) return;
// // // //     setPage(newPage);
// // // //     window.scrollTo({ top: 0, behavior: "smooth" });
// // // //   };

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // // //         <p className="text-[#1a1a2e]/50">Loading portfolios...</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (isError) {
// // // //     return (
// // // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // // //         <p className="text-red-500">Failed to load portfolios</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="w-full min-h-screen bg-[#faf8f4]">
// // // //       <div className="w-full border-b border-[#1a1a2e]/10 px-6 sm:px-10 lg:px-16 py-10">
// // // //         <p className="text-xs tracking-[0.25em] uppercase text-[#0098cc] font-semibold mb-2">
// // // //           Showcase
// // // //         </p>
// // // //         <h1
// // // //           className="text-4xl sm:text-5xl text-[#1a1a2e]"
// // // //           style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // // //         >
// // // //           Explore Portfolios
// // // //         </h1>
// // // //         <p className="text-[#1a1a2e]/60 mt-2 max-w-xl">
// // // //           Work from designers, architects, and contractors building spaces worth following.
// // // //         </p>
// // // //       </div>

// // // //       <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
// // // //         {portfolios.length === 0 ? (
// // // //           <div className="text-center text-[#1a1a2e]/40 py-24">
// // // //             No portfolios published yet.
// // // //           </div>
// // // //         ) : (
// // // //           <>
// // // //             <div
// // // //               className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"
// // // //                 }`}
// // // //             >
// // // //               {portfolios.map((user) => (
// // // //                 <PortfolioCard
// // // //                   key={user.id}
// // // //                   user={user}
// // // //                   onClick={() => navigate(`/portfolio/${user.id}`)}
// // // //                 />
// // // //               ))}
// // // //             </div>

// // // //             <Pagination
// // // //               currentPage={pagination?.currentPage ?? page}
// // // //               totalPages={totalPages}
// // // //               onPageChange={handlePageChange}
// // // //             />

// // // //             {pagination && (
// // // //               <p className="text-center text-xs text-[#1a1a2e]/35 -mt-8">
// // // //                 Showing page {pagination.currentPage} of {pagination.totalPages} ·{" "}
// // // //                 {pagination.totalRecords} total
// // // //               </p>
// // // //             )}
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AllPortfolios;



// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

// // // const ROLE_LABELS = {
// // //   1: "Client",
// // //   2: "Designer",
// // //   3: "Architect",
// // //   4: "Contractor",
// // //   5: "Material Supplier",
// // // };

// // // const PAGE_LIMIT = 20;

// // // // user.profile comes back as a JSON string (bio/specialization/etc.), not an image URL.
// // // // This safely parses it and pulls out an avatar url if one ever exists (e.g. profile.avatar),
// // // // otherwise falls back to initials.
// // // const parseProfile = (profile) => {
// // //   if (!profile) return null;
// // //   if (typeof profile === "object") return profile;
// // //   try {
// // //     return JSON.parse(profile);
// // //   } catch {
// // //     return null;
// // //   }
// // // };

// // // const Pagination = ({ currentPage, totalPages, onPageChange }) => {
// // //   if (totalPages <= 1) return null;

// // //   const pages = [];
// // //   const windowSize = 1;
// // //   const start = Math.max(1, currentPage - windowSize);
// // //   const end = Math.min(totalPages, currentPage + windowSize);

// // //   if (start > 1) {
// // //     pages.push(1);
// // //     if (start > 2) pages.push("ellipsis-start");
// // //   }
// // //   for (let p = start; p <= end; p++) pages.push(p);
// // //   if (end < totalPages) {
// // //     if (end < totalPages - 1) pages.push("ellipsis-end");
// // //     pages.push(totalPages);
// // //   }

// // //   return (
// // //     <div className="flex items-center justify-center gap-2 py-14">
// // //       <button
// // //         onClick={() => onPageChange(currentPage - 1)}
// // //         disabled={currentPage === 1}
// // //         className="px-4 py-2 text-sm rounded-full border border-[#1a1a2e]/15 text-[#1a1a2e]/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0098cc] hover:text-[#0098cc] transition-colors"
// // //       >
// // //         Prev
// // //       </button>

// // //       {pages.map((p, i) =>
// // //         typeof p === "number" ? (
// // //           <button
// // //             key={p}
// // //             onClick={() => onPageChange(p)}
// // //             className={`w-9 h-9 text-sm rounded-full transition-colors ${p === currentPage
// // //                 ? "bg-[#1a1a2e] text-white"
// // //                 : "text-[#1a1a2e]/70 hover:bg-[#1a1a2e]/5"
// // //               }`}
// // //           >
// // //             {p}
// // //           </button>
// // //         ) : (
// // //           <span key={p + i} className="px-1 text-[#1a1a2e]/30 select-none">
// // //             &hellip;
// // //           </span>
// // //         )
// // //       )}

// // //       <button
// // //         onClick={() => onPageChange(currentPage + 1)}
// // //         disabled={currentPage === totalPages}
// // //         className="px-4 py-2 text-sm rounded-full border border-[#1a1a2e]/15 text-[#1a1a2e]/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0098cc] hover:text-[#0098cc] transition-colors"
// // //       >
// // //         Next
// // //       </button>
// // //     </div>
// // //   );
// // // };

// // // const PortfolioCard = ({ user, onClick }) => {
// // //   const coverImage = user.posts?.[0]?.images?.[0];
// // //   const roleLabel = ROLE_LABELS[user.role] || "Professional";
// // //   const profileData = parseProfile(user.profile);
// // //   const avatarUrl = profileData?.avatar || profileData?.image || null;
// // //   const postCount = user._count?.posts ?? user.posts?.length ?? 0;

// // //   return (
// // //     <div
// // //       onClick={onClick}
// // //       className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#1a1a2e]/8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
// // //     >
// // //       <div className="relative h-64 overflow-hidden bg-[#1a1a2e]/5">
// // //         {coverImage ? (
// // //           <img
// // //             src={coverImage}
// // //             alt={user.name}
// // //             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
// // //           />
// // //         ) : (
// // //           <div className="w-full h-full flex items-center justify-center text-[#1a1a2e]/30 text-sm">
// // //             No posts yet
// // //           </div>
// // //         )}
// // //         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

// // //         <span className="absolute top-3 left-3 text-[10px] tracking-wide uppercase bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[#1a1a2e]/70 font-medium">
// // //           {roleLabel}
// // //         </span>
// // //       </div>

// // //       <div className="p-5 flex items-center gap-3">
// // //         <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0098cc]/10 flex-shrink-0 flex items-center justify-center">
// // //           {avatarUrl ? (
// // //             <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
// // //           ) : (
// // //             <span className="text-[#0098cc] text-sm font-semibold">
// // //               {user.name?.[0]?.toUpperCase()}
// // //             </span>
// // //           )}
// // //         </div>
// // //         <div className="min-w-0">
// // //           <p
// // //             className="text-[#1a1a2e] truncate leading-tight"
// // //             style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // //           >
// // //             {user.name}
// // //           </p>
// // //           <p className="text-[11px] uppercase tracking-wide text-[#1a1a2e]/40 mt-0.5">
// // //             {postCount} {postCount === 1 ? "post" : "posts"}
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const AllPortfolios = () => {
// // //   const navigate = useNavigate();
// // //   const [page, setPage] = useState(1);

// // //   const { data, isLoading, isError, isFetching } = useGetAllPortfoliosQuery({
// // //     page,
// // //     limit: PAGE_LIMIT,
// // //   });

// // //   const portfolios = data?.data?.data || [];
// // //   const pagination = data?.data?.pagination;
// // //   const totalPages = pagination?.totalPages ?? 1;

// // //   const handlePageChange = (newPage) => {
// // //     if (newPage < 1 || newPage > totalPages) return;
// // //     setPage(newPage);
// // //     window.scrollTo({ top: 0, behavior: "smooth" });
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // //         <p className="text-[#1a1a2e]/50">Loading portfolios...</p>
// // //       </div>
// // //     );
// // //   }

// // //   if (isError) {
// // //     return (
// // //       <div className="w-full min-h-screen bg-[#faf8f4] flex items-center justify-center">
// // //         <p className="text-red-500">Failed to load portfolios</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="w-full min-h-screen bg-[#faf8f4]">
// // //       <div className="w-full border-b border-[#1a1a2e]/10 px-6 sm:px-10 lg:px-16 py-10">
// // //         <p className="text-xs tracking-[0.25em] uppercase text-[#0098cc] font-semibold mb-2">
// // //           Showcase
// // //         </p>
// // //         <h1
// // //           className="text-4xl sm:text-5xl text-[#1a1a2e]"
// // //           style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
// // //         >
// // //           Explore Portfolios
// // //         </h1>
// // //         <p className="text-[#1a1a2e]/60 mt-2 max-w-xl">
// // //           Work from designers, architects, and contractors building spaces worth following.
// // //         </p>
// // //       </div>

// // //       <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
// // //         {portfolios.length === 0 ? (
// // //           <div className="text-center text-[#1a1a2e]/40 py-24">
// // //             No portfolios published yet.
// // //           </div>
// // //         ) : (
// // //           <>
// // //             <div
// // //               className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"
// // //                 }`}
// // //             >
// // //               {portfolios.map((user) => (
// // //                 <PortfolioCard
// // //                   key={user.id}
// // //                   user={user}
// // //                   onClick={() => navigate(`/portfolio/${user.id}`)}
// // //                 />
// // //               ))}
// // //             </div>

// // //             <Pagination
// // //               currentPage={pagination?.currentPage ?? page}
// // //               totalPages={totalPages}
// // //               onPageChange={handlePageChange}
// // //             />

// // //             {pagination && (
// // //               <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm">
// // //                 <div className="px-4 py-2 rounded-full bg-white border border-[#1a1a2e]/10 shadow-sm">
// // //                   <span className="text-[#1a1a2e]/50">Page</span>{" "}
// // //                   <span className="font-semibold text-[#1a1a2e]">
// // //                     {pagination.currentPage}
// // //                   </span>
// // //                   <span className="text-[#1a1a2e]/50"> / {pagination.totalPages}</span>
// // //                 </div>


// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AllPortfolios;


// // import React, { useState } from "react";

// // // ---- mock of the hook so this file is self-contained / previewable ----
// // // In your app, delete this block and use your real import:
// // // import { useNavigate } from "react-router-dom";
// // // import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";

// // const MOCK_RESPONSE = {
// //   success: 1,
// //   status_code: 200,
// //   message: "Portfolios fetched successfully",
// //   data: {
// //     data: [
// //       {
// //         id: "c731e7a4-202c-4b99-b7db-64c917363b5e",
// //         name: "eccomerce",
// //         username: "eccomerce123",
// //         profile:
// //           '{"bio":"ecommerce.1vedanshi@gmail.com","specialization":"Exterior Designer","style":"Minimalist","experience":2}',
// //         role: 2,
// //         country: "India",
// //         state: "Telangana",
// //         city: "Hyderabad",
// //         createdAt: "2026-08-02T11:50:44.985Z",
// //         posts: [
// //           {
// //             id: "5fd21d51-f4a3-4689-b752-ccda923d3de6",
// //             title: "ecommerce.1vedanshi@gmail.com",
// //             description: "ecommerce.1vedanshi@gmail.com",
// //             images: [
// //               "https://gcjbrbcaqpmyquxhnlxw.supabase.co/storage/v1/object/public/posts/portfolio/dab67bb0-8ec8-43a6-ae05-0d1b8cfa6128.HEIC",
// //             ],
// //             createdAt: "2026-08-02T11:52:06.083Z",
// //           },
// //         ],
// //         followers: [],
// //         _count: { posts: 1, followers: 0, following: 0 },
// //       },
// //       {
// //         id: "6cc1b582-9df3-43a0-a978-46430993ba64",
// //         name: "Mani Reddy",
// //         username: "manireddy99516",
// //         profile: '{"bio":"Reliable plumbing, done right.","trade":"Plumbing","experience":3}',
// //         role: 4,
// //         country: "India",
// //         state: "Telangana",
// //         city: "Hyderabad",
// //         createdAt: "2026-08-02T17:08:43.964Z",
// //         posts: [],
// //         followers: [],
// //         _count: { posts: 0, followers: 0, following: 0 },
// //       },
// //       {
// //         id: "f11eb00f-6a91-4dbe-83f8-029faa9e0cfa",
// //         name: "Naveen Mech",
// //         username: "21d45ao305123",
// //         profile:
// //           '{"bio":"Commercial architecture that lasts.","specialization":"Commercial","software":"Revit","experience":3}',
// //         role: 3,
// //         country: "India",
// //         state: "Telangana",
// //         city: "Hyderabad",
// //         createdAt: "2026-08-02T16:41:35.661Z",
// //         posts: [],
// //         followers: [],
// //         _count: { posts: 0, followers: 0, following: 0 },
// //       },
// //     ],
// //     pagination: {
// //       currentPage: 1,
// //       perPage: 20,
// //       totalRecords: 3,
// //       totalPages: 1,
// //       hasNextPage: false,
// //       hasPreviousPage: false,
// //     },
// //   },
// // };

// // const useGetAllPortfoliosQuery = () => ({
// //   data: MOCK_RESPONSE,
// //   isLoading: false,
// //   isError: false,
// //   isFetching: false,
// // });

// // const useNavigate = () => (path) => console.log("navigate to", path);
// // // ---- end mock block ----

// // const ROLE_META = {
// //   1: { label: "client", tag: "c-blue" },
// //   2: { label: "designer", tag: "c-pink" },
// //   3: { label: "architect", tag: "c-purple" },
// //   4: { label: "contractor", tag: "c-amber" },
// //   5: { label: "material supplier", tag: "c-teal" },
// // };

// // const ROLE_STYLES = {
// //   1: { bg: "#E6F1FB", text: "#042C53", chip: "#B5D4F4" },
// //   2: { bg: "#FBEAF0", text: "#4B1528", chip: "#F4C0D1" },
// //   3: { bg: "#EEEDFE", text: "#26215C", chip: "#CECBF6" },
// //   4: { bg: "#FAEEDA", text: "#412402", chip: "#FAC775" },
// //   5: { bg: "#E1F5EE", text: "#04342C", chip: "#9FE1CB" },
// // };

// // const PAGE_LIMIT = 20;

// // const parseProfile = (profile) => {
// //   if (!profile) return null;
// //   if (typeof profile === "object") return profile;
// //   try {
// //     return JSON.parse(profile);
// //   } catch {
// //     return null;
// //   }
// // };

// // const timeAgo = (dateStr) => {
// //   if (!dateStr) return "";
// //   const diff = Date.now() - new Date(dateStr).getTime();
// //   const mins = Math.floor(diff / 60000);
// //   if (mins < 60) return `${mins}m ago`;
// //   const hrs = Math.floor(mins / 60);
// //   if (hrs < 24) return `${hrs}h ago`;
// //   const days = Math.floor(hrs / 24);
// //   if (days < 30) return `${days}d ago`;
// //   return new Date(dateStr).toLocaleDateString();
// // };

// // const Pagination = ({ currentPage, totalPages, onPageChange }) => {
// //   if (totalPages <= 1) return null;
// //   const pages = [];
// //   const start = Math.max(1, currentPage - 1);
// //   const end = Math.min(totalPages, currentPage + 1);
// //   if (start > 1) {
// //     pages.push(1);
// //     if (start > 2) pages.push("e1");
// //   }
// //   for (let p = start; p <= end; p++) pages.push(p);
// //   if (end < totalPages) {
// //     if (end < totalPages - 1) pages.push("e2");
// //     pages.push(totalPages);
// //   }

// //   return (
// //     <div className="flex items-center justify-center gap-2 py-12">
// //       <button
// //         onClick={() => onPageChange(currentPage - 1)}
// //         disabled={currentPage === 1}
// //         className="px-4 py-2.5 text-sm font-bold rounded-full border-[3px] border-[#14142B] bg-white text-[#14142B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C4F135] active:translate-y-0.5 transition-all"
// //       >
// //         ← back
// //       </button>
// //       {pages.map((p, i) =>
// //         typeof p === "number" ? (
// //           <button
// //             key={p}
// //             onClick={() => onPageChange(p)}
// //             className={`w-10 h-10 text-sm font-extrabold rounded-full border-[3px] border-[#14142B] transition-all ${
// //               p === currentPage
// //                 ? "bg-[#7C3AED] text-white -rotate-3 scale-110"
// //                 : "bg-white text-[#14142B] hover:bg-[#FFF9F0] hover:-translate-y-0.5"
// //             }`}
// //           >
// //             {p}
// //           </button>
// //         ) : (
// //           <span key={p + i} className="px-1 text-[#14142B]/30 font-black select-none">
// //             ⋯
// //           </span>
// //         )
// //       )}
// //       <button
// //         onClick={() => onPageChange(currentPage + 1)}
// //         disabled={currentPage === totalPages}
// //         className="px-4 py-2.5 text-sm font-bold rounded-full border-[3px] border-[#14142B] bg-white text-[#14142B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C4F135] active:translate-y-0.5 transition-all"
// //       >
// //         next →
// //       </button>
// //     </div>
// //   );
// // };

// // const PortfolioCard = ({ user, index, onClick }) => {
// //   const coverImage = user.posts?.[0]?.images?.[0];
// //   const roleMeta = ROLE_META[user.role] || { label: "creator" };
// //   const roleStyle = ROLE_STYLES[user.role] || { bg: "#F1EFE8", text: "#2C2C2A", chip: "#D3D1C7" };
// //   const profileData = parseProfile(user.profile);
// //   const bio = profileData?.bio && !profileData.bio.includes("@") ? profileData.bio : null;
// //   const specTag =
// //     profileData?.specialization || profileData?.trade || profileData?.software || null;
// //   const postCount = user._count?.posts ?? user.posts?.length ?? 0;
// //   const followerCount = user._count?.followers ?? 0;
// //   const tilt = index % 2 === 0 ? "-rotate-1" : "rotate-1";
// //   const hoverTilt = index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1";

// //   return (
// //     <div
// //       onClick={onClick}
// //       className={`group relative cursor-pointer bg-white rounded-[28px] border-[3px] border-[#14142B] p-3 pb-4 ${tilt} ${hoverTilt} hover:-translate-y-2 transition-all duration-300`}
// //       style={{ boxShadow: "6px 6px 0 #14142B" }}
// //     >
// //       <span
// //         className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-14 h-14 rounded-full border-[3px] border-[#14142B] bg-[#FF5470] text-white text-[10px] font-extrabold uppercase tracking-tight rotate-12 group-hover:rotate-[25deg] group-hover:scale-110 transition-all duration-300 leading-tight text-center px-1"
// //       >
// //         {postCount > 0 ? "peep\nthis" : "say\nhi"}
// //       </span>

// //       <div className="relative h-56 overflow-hidden rounded-[20px] border-[2px] border-[#14142B]/10 bg-[#F1EFE8]">
// //         {coverImage ? (
// //           <img
// //             src={coverImage}
// //             alt={user.name}
// //             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
// //             onError={(e) => {
// //               e.currentTarget.style.display = "none";
// //             }}
// //           />
// //         ) : (
// //           <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#14142B]/30">
// //             <i className="ti ti-photo-off" style={{ fontSize: 32 }} aria-hidden="true"></i>
// //             <span className="text-xs font-bold uppercase tracking-wide">no posts yet</span>
// //           </div>
// //         )}

// //         <span
// //           className="absolute bottom-2 left-2 text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full border-2 border-[#14142B]"
// //           style={{ background: roleStyle.chip, color: roleStyle.text }}
// //         >
// //           {roleMeta.label}
// //         </span>
// //       </div>

// //       <div className="pt-3 px-1">
// //         <div className="flex items-start justify-between gap-2">
// //           <div className="min-w-0">
// //             <p className="text-lg font-black text-[#14142B] truncate leading-tight">
// //               {user.name}
// //             </p>
// //             <p className="text-xs text-[#14142B]/50 font-semibold truncate">@{user.username}</p>
// //           </div>
// //           <div
// //             className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#14142B] flex-shrink-0 flex items-center justify-center font-black text-sm"
// //             style={{ background: roleStyle.bg, color: roleStyle.text }}
// //           >
// //             {user.name?.[0]?.toUpperCase()}
// //           </div>
// //         </div>

// //         {bio && (
// //           <p className="text-[13px] text-[#14142B]/70 font-medium mt-2 line-clamp-2 leading-snug">
// //             {bio}
// //           </p>
// //         )}

// //         <div className="flex items-center flex-wrap gap-1.5 mt-3">
// //           {specTag && (
// //             <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-[#FFF9F0] border border-[#14142B]/15 text-[#14142B]/60">
// //               #{specTag.replace(/\s+/g, "").toLowerCase()}
// //             </span>
// //           )}
// //           {user.city && (
// //             <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-[#FFF9F0] border border-[#14142B]/15 text-[#14142B]/60">
// //               <i className="ti ti-map-pin" style={{ fontSize: 11, verticalAlign: -1 }} aria-hidden="true"></i>{" "}
// //               {user.city}
// //             </span>
// //           )}
// //         </div>

// //         <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-dashed border-[#14142B]/15">
// //           <div className="flex items-center gap-3 text-[11px] font-bold text-[#14142B]/60">
// //             <span>
// //               <span className="text-[#14142B] font-black">{postCount}</span> posts
// //             </span>
// //             <span>
// //               <span className="text-[#14142B] font-black">{followerCount}</span> followers
// //             </span>
// //           </div>
// //           <span className="text-[10px] font-bold text-[#14142B]/40">
// //             {timeAgo(user.createdAt)}
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Confetti = () => (
// //   <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
// //     <span className="absolute top-6 left-[8%] w-4 h-4 rounded-full bg-[#C4F135] border-2 border-[#14142B] rotate-12" />
// //     <span className="absolute top-20 right-[12%] w-3 h-8 bg-[#FF5470] border-2 border-[#14142B] rotate-45 rounded-sm" />
// //     <span className="absolute bottom-10 left-[20%] w-5 h-5 bg-[#7C3AED] border-2 border-[#14142B] -rotate-12 rounded-sm" />
// //     <span className="absolute top-1/3 right-[6%] w-6 h-6 rounded-full bg-[#FFD23F] border-2 border-[#14142B]" />
// //   </div>
// // );

// // const AllPortfolios = () => {
// //   const navigate = useNavigate();
// //   const [page, setPage] = useState(1);

// //   const { data, isLoading, isError, isFetching } = useGetAllPortfoliosQuery({
// //     page,
// //     limit: PAGE_LIMIT,
// //   });

// //   const portfolios = data?.data?.data || [];
// //   const pagination = data?.data?.pagination;
// //   const totalPages = pagination?.totalPages ?? 1;

// //   const handlePageChange = (newPage) => {
// //     if (newPage < 1 || newPage > totalPages) return;
// //     setPage(newPage);
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="w-full min-h-screen bg-[#FFF9F0] flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-3">
// //           <div className="w-14 h-14 rounded-full border-[6px] border-[#14142B] border-t-[#7C3AED] animate-spin" />
// //           <p className="text-[#14142B] font-bold">loading the good stuff...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="w-full min-h-screen bg-[#FFF9F0] flex items-center justify-center">
// //         <div className="bg-white border-[3px] border-[#14142B] rounded-3xl px-8 py-6 rotate-1" style={{ boxShadow: "6px 6px 0 #14142B" }}>
// //           <p className="text-[#FF5470] font-black text-lg">welp, that broke 💥</p>
// //           <p className="text-[#14142B]/60 text-sm mt-1 font-medium">couldn't load portfolios, try again in a sec.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full min-h-screen bg-[#FFF9F0]" style={{ fontFamily: "'Space Grotesk', 'Arial Black', sans-serif" }}>
// //       <link
// //         rel="stylesheet"
// //         href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@500;700;800&display=swap"
// //       />

// //       <div className="relative w-full border-b-[3px] border-[#14142B] px-6 sm:px-10 lg:px-16 pt-12 pb-10 overflow-hidden">
// //         <Confetti />
// //         <div className="relative z-10">
// //           <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#14142B] text-[#C4F135] mb-4 -rotate-2">
// //             ✦ live showcase ✦
// //           </span>
// //           <h1
// //             className="text-5xl sm:text-6xl font-black text-[#14142B] leading-[0.95] tracking-tight"
// //             style={{ fontFamily: "'Space Grotesk', sans-serif" }}
// //           >
// //             explore the
// //             <br />
// //             <span className="text-[#7C3AED]">portfolios</span>
// //             <span className="text-[#FF5470]">.</span>
// //           </h1>
// //           <p className="text-[#14142B]/60 mt-3 max-w-md font-semibold">
// //             designers, architects, and contractors out here building spaces that actually go hard.
// //           </p>

// //           {pagination && (
// //             <div className="flex flex-wrap gap-3 mt-6">
// //               <div className="bg-white border-[3px] border-[#14142B] rounded-2xl px-4 py-2 -rotate-1" style={{ boxShadow: "3px 3px 0 #14142B" }}>
// //                 <span className="text-2xl font-black text-[#14142B]">{pagination.totalRecords}</span>
// //                 <span className="text-xs font-bold text-[#14142B]/50 uppercase ml-1.5">creators</span>
// //               </div>
// //               <div className="bg-white border-[3px] border-[#14142B] rounded-2xl px-4 py-2 rotate-1" style={{ boxShadow: "3px 3px 0 #14142B" }}>
// //                 <span className="text-2xl font-black text-[#14142B]">
// //                   {portfolios.reduce((sum, u) => sum + (u._count?.posts ?? u.posts?.length ?? 0), 0)}
// //                 </span>
// //                 <span className="text-xs font-bold text-[#14142B]/50 uppercase ml-1.5">posts</span>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
// //         {portfolios.length === 0 ? (
// //           <div className="text-center py-24">
// //             <p className="text-3xl font-black text-[#14142B]">nothing here yet 👀</p>
// //             <p className="text-[#14142B]/50 font-semibold mt-2">check back soon, creators are cooking.</p>
// //           </div>
// //         ) : (
// //           <>
// //             <div
// //               className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-3 transition-opacity ${
// //                 isFetching ? "opacity-50" : "opacity-100"
// //               }`}
// //             >
// //               {portfolios.map((user, i) => (
// //                 <PortfolioCard
// //                   key={user.id}
// //                   user={user}
// //                   index={i}
// //                   onClick={() => navigate(`/portfolio/${user.id}`)}
// //                 />
// //               ))}
// //             </div>

// //             <Pagination
// //               currentPage={pagination?.currentPage ?? page}
// //               totalPages={totalPages}
// //               onPageChange={handlePageChange}
// //             />

// //             {pagination && (
// //               <p className="text-center text-xs text-[#14142B]/35 font-bold -mt-6">
// //                 page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalRecords} total
// //               </p>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllPortfolios;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";
// import "../theme.css";

// const ROLE_LABELS = {
//   1: "client",
//   2: "designer",
//   3: "architect",
//   4: "contractor",
//   5: "material supplier",
// };

// const PAGE_LIMIT = 20;

// const parseProfile = (profile) => {
//   if (!profile) return null;
//   if (typeof profile === "object") return profile;
//   try {
//     return JSON.parse(profile);
//   } catch {
//     return null;
//   }
// };

// const timeAgo = (dateStr) => {
//   if (!dateStr) return "";
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   const days = Math.floor(hrs / 24);
//   if (days < 30) return `${days}d ago`;
//   return new Date(dateStr).toLocaleDateString();
// };

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   if (totalPages <= 1) return null;
//   const pages = [];
//   const start = Math.max(1, currentPage - 1);
//   const end = Math.min(totalPages, currentPage + 1);
//   if (start > 1) {
//     pages.push(1);
//     if (start > 2) pages.push("e1");
//   }
//   for (let p = start; p <= end; p++) pages.push(p);
//   if (end < totalPages) {
//     if (end < totalPages - 1) pages.push("e2");
//     pages.push(totalPages);
//   }

//   return (
//     <div className="flex items-center justify-center gap-2 py-14">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         style={{
//           border: "1px solid var(--border)",
//           color: "var(--text)",
//           background: "var(--surface)",
//           fontFamily: "var(--font-body)",
//         }}
//         className="px-4 py-2 text-sm rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-hover)]"
//       >
//         Prev
//       </button>

//       {pages.map((p, i) =>
//         typeof p === "number" ? (
//           <button
//             key={p}
//             onClick={() => onPageChange(p)}
//             style={
//               p === currentPage
//                 ? { background: "var(--primary)", color: "#fff", fontFamily: "var(--font-body)" }
//                 : { color: "var(--text)", fontFamily: "var(--font-body)" }
//             }
//             className="w-9 h-9 text-sm rounded-full transition-colors hover:bg-[var(--background-secondary)]"
//           >
//             {p}
//           </button>
//         ) : (
//           <span key={p + i} style={{ color: "var(--muted)" }} className="px-1 select-none">
//             &hellip;
//           </span>
//         )
//       )}

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         style={{
//           border: "1px solid var(--border)",
//           color: "var(--text)",
//           background: "var(--surface)",
//           fontFamily: "var(--font-body)",
//         }}
//         className="px-4 py-2 text-sm rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-hover)]"
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// const PortfolioCard = ({ user, onClick }) => {
//   const coverImage = user.posts?.[0]?.images?.[0];
//   const roleLabel = ROLE_LABELS[user.role] || "professional";
//   const profileData = parseProfile(user.profile);
//   const bio = profileData?.bio && !profileData.bio.includes("@") ? profileData.bio : null;
//   const specTag = profileData?.specialization || profileData?.trade || profileData?.software || null;
//   const postCount = user._count?.posts ?? user.posts?.length ?? 0;
//   const followerCount = user._count?.followers ?? 0;

//   return (
//     <div
//       onClick={onClick}
//       style={{
//         background: "var(--surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius-lg)",
//         boxShadow: "var(--shadow-sm)",
//         transition: "var(--transition)",
//       }}
//       className="group cursor-pointer overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
//     >
//       <div className="relative h-64 overflow-hidden" style={{ background: "var(--background-secondary)" }}>
//         {coverImage ? (
//           <img
//             src={coverImage}
//             alt={user.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         ) : (
//           <div
//             className="w-full h-full flex items-center justify-center text-sm"
//             style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
//           >
//             No posts yet
//           </div>
//         )}
//         <span
//           className="absolute top-3 left-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full font-medium"
//           style={{
//             background: "var(--surface)",
//             color: "var(--primary)",
//             border: "1px solid var(--border)",
//             fontFamily: "var(--font-body)",
//           }}
//         >
//           {roleLabel}
//         </span>
//       </div>

//       <div className="p-5">
//         <div className="flex items-center gap-3">
//           <div
//             className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm"
//             style={{ background: "var(--background-secondary)", color: "var(--gold-hover)" }}
//           >
//             {user.name?.[0]?.toUpperCase()}
//           </div>
//           <div className="min-w-0">
//             <p
//               className="truncate leading-tight"
//               style={{ fontFamily: "var(--font-heading)", color: "var(--heading)", fontSize: 17 }}
//             >
//               {user.name}
//             </p>
//             <p className="text-[11px] truncate" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
//               @{user.username}
//             </p>
//           </div>
//         </div>

//         {bio && (
//           <p
//             className="text-[13px] mt-3 line-clamp-2 leading-snug"
//             style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
//           >
//             {bio}
//           </p>
//         )}

//         <div className="flex items-center flex-wrap gap-1.5 mt-3">
//           {specTag && (
//             <span
//               className="text-[10px] px-2 py-1 rounded-full"
//               style={{
//                 background: "var(--background-secondary)",
//                 color: "var(--text)",
//                 fontFamily: "var(--font-body)",
//               }}
//             >
//               {specTag}
//             </span>
//           )}
//           {user.city && (
//             <span
//               className="text-[10px] px-2 py-1 rounded-full"
//               style={{
//                 background: "var(--background-secondary)",
//                 color: "var(--text)",
//                 fontFamily: "var(--font-body)",
//               }}
//             >
//               {user.city}
//             </span>
//           )}
//         </div>

//         <div
//           className="flex items-center justify-between mt-4 pt-3"
//           style={{ borderTop: "1px solid var(--border)" }}
//         >
//           <div
//             className="flex items-center gap-3 text-[11px]"
//             style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
//           >
//             <span>
//               <span style={{ color: "var(--heading)", fontWeight: 600 }}>{postCount}</span> posts
//             </span>
//             <span>
//               <span style={{ color: "var(--heading)", fontWeight: 600 }}>{followerCount}</span> followers
//             </span>
//           </div>
//           <span className="text-[10px]" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
//             {timeAgo(user.createdAt)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AllPortfolios = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError, isFetching } = useGetAllPortfoliosQuery({
//     page,
//     limit: PAGE_LIMIT,
//   });

//   const portfolios = data?.data?.data || [];
//   const pagination = data?.data?.pagination;
//   const totalPages = pagination?.totalPages ?? 1;

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (isLoading) {
//     return (
//       <div
//         className="w-full min-h-screen flex items-center justify-center"
//         style={{ background: "var(--background)" }}
//       >
//         <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>Loading portfolios...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div
//         className="w-full min-h-screen flex items-center justify-center"
//         style={{ background: "var(--background)" }}
//       >
//         <p style={{ color: "var(--danger)", fontFamily: "var(--font-body)" }}>Failed to load portfolios</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen" style={{ background: "var(--background)" }}>
//       <div
//         className="w-full px-6 sm:px-10 lg:px-16 py-10"
//         style={{ borderBottom: "1px solid var(--border)" }}
//       >
//         <p
//           className="text-xs tracking-[0.25em] uppercase font-semibold mb-2"
//           style={{ color: "var(--gold-hover)", fontFamily: "var(--font-body)" }}
//         >
//           Showcase
//         </p>
//         <h1
//           className="text-4xl sm:text-5xl"
//           style={{ fontFamily: "var(--font-heading)", color: "var(--heading)" }}
//         >
//           Explore Portfolios
//         </h1>
//         <p className="mt-2 max-w-xl" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
//           Work from designers, architects, and contractors building spaces worth following.
//         </p>
//       </div>

//       <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
//         {portfolios.length === 0 ? (
//           <div className="text-center py-24" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
//             No portfolios published yet.
//           </div>
//         ) : (
//           <>
//             <div
//               className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${
//                 isFetching ? "opacity-50" : "opacity-100"
//               }`}
//             >
//               {portfolios.map((user) => (
//                 <PortfolioCard
//                   key={user.id}
//                   user={user}
//                   onClick={() => navigate(`/portfolio/${user.id}`, { state: { user } })}
//                 />
//               ))}
//             </div>

//             <Pagination
//               currentPage={pagination?.currentPage ?? page}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />

//             {pagination && (
//               <p
//                 className="text-center text-xs -mt-8"
//                 style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
//               >
//                 Showing page {pagination.currentPage} of {pagination.totalPages} ·{" "}
//                 {pagination.totalRecords} total
//               </p>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllPortfolios;



// AllPortfolios.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllPortfoliosQuery } from "./supplyproductsapislice";
import Pagination from "../global/pagination";
import "../theme.css";

const ROLE_LABELS = {
  1: "client",
  2: "designer",
  3: "architect",
  4: "contractor",
  5: "material supplier",
};

const PAGE_LIMIT = 20;

const UNSUPPORTED_IMAGE_EXTENSIONS = [".heic", ".heif", ".tiff", ".tif", ".bmp", ".avif"];

const isUnsupportedImage = (url) => {
  if (!url) return true;
  const clean = url.split("?")[0].toLowerCase();
  return UNSUPPORTED_IMAGE_EXTENSIONS.some((ext) => clean.endsWith(ext));
};

const parseProfile = (profile) => {
  if (!profile) return null;
  if (typeof profile === "object") return profile;
  try {
    return JSON.parse(profile);
  } catch {
    return null;
  }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const PortfolioCard = ({ user, onClick }) => {
  const rawCoverImage = user.posts?.[0]?.images?.[0];
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = rawCoverImage && !isUnsupportedImage(rawCoverImage) && !imgFailed;
  console.log({ rawCoverImage, isUnsupported: isUnsupportedImage(rawCoverImage), showImage });
  const roleLabel = ROLE_LABELS[user.role] || "professional";
  const profileData = parseProfile(user.profile);
  const bio = profileData?.bio && !profileData.bio.includes("@") ? profileData.bio : null;
  const specTag = profileData?.specialization || profileData?.trade || profileData?.software || null;
  const postCount = user._count?.posts ?? user.posts?.length ?? 0;
  const followerCount = user._count?.followers ?? 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        transition: "var(--transition)",
      }}
      className="group cursor-pointer overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
    >
      <div className="relative h-64 overflow-hidden" style={{ background: "var(--background-secondary)" }}>
        {showImage ? (
          <img
            src={rawCoverImage}
            alt={user.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm text-center px-4"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            {rawCoverImage ? "Preview unavailable" : "No posts yet"}
          </div>
        )}
        <span
          className="absolute top-3 left-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full font-medium"
          style={{
            background: "var(--surface)",
            color: "var(--primary)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
          }}
        >
          {roleLabel}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-sm"
            style={{ background: "var(--background-secondary)", color: "var(--gold-hover)" }}
          >
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p
              className="truncate leading-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--heading)", fontSize: 17 }}
            >
              {user.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              @{user.username}
            </p>
          </div>
        </div>

        {bio && (
          <p
            className="text-[13px] mt-3 line-clamp-2 leading-snug"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            {bio}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-1.5 mt-3">
          {specTag && (
            <span
              className="text-[10px] px-2 py-1 rounded-full"
              style={{
                background: "var(--background-secondary)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {specTag}
            </span>
          )}
          {user.city && (
            <span
              className="text-[10px] px-2 py-1 rounded-full"
              style={{
                background: "var(--background-secondary)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {user.city}
            </span>
          )}
        </div>

        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center gap-3 text-[11px]"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            <span>
              <span style={{ color: "var(--heading)", fontWeight: 600 }}>{postCount}</span> posts
            </span>
            <span>
              <span style={{ color: "var(--heading)", fontWeight: 600 }}>{followerCount}</span> followers
            </span>
          </div>
          <span className="text-[10px]" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {timeAgo(user.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

const AllPortfolios = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetAllPortfoliosQuery({
    page,
    limit: PAGE_LIMIT,
  });

  const portfolios = data?.data?.data || [];
  const apiPagination = data?.data?.pagination;

  // Map API's pagination shape to what the Pagination component expects
  const pagination = apiPagination
    ? {
      total: apiPagination.totalRecords,
      page: apiPagination.currentPage,
      limit: apiPagination.perPage,
      totalPages: apiPagination.totalPages,
    }
    : { total: 0, page, limit: PAGE_LIMIT, totalPages: 1 };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>Loading portfolios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <p style={{ color: "var(--danger)", fontFamily: "var(--font-body)" }}>Failed to load portfolios</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{ background: "var(--background)" }}>
      <div
        className="w-full px-6 sm:px-10 lg:px-16 py-10"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="text-xs tracking-[0.25em] uppercase font-semibold mb-2"
          style={{ color: "var(--gold-hover)", fontFamily: "var(--font-body)" }}
        >
          Showcase
        </p>
        <h1
          className="text-4xl sm:text-5xl"
          style={{ fontFamily: "var(--font-heading)", color: "var(--heading)" }}
        >
          Explore Portfolios
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
          Work from designers, architects, and contractors building spaces worth following.
        </p>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
        {portfolios.length === 0 ? (
          <div className="text-center py-24" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            No portfolios published yet.
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"
                }`}
            >
              {portfolios.map((user) => (
                <PortfolioCard
                  key={user.id}
                  user={user}
                  onClick={() => navigate(`/portfolio/${user.id}`, { state: { user } })}
                />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                isFetching={isFetching}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllPortfolios;

