// // // import React, { useEffect, useRef, useState } from "react";
// // // import { uploadFile } from "../../../../superBase";
// // // import { useGetDesignerProfileQuery, useUpdateDesignerProfileMutation } from "./dashboard/DesignerDashboardApiSlice";
// // // import "../../../theme.css";

// // // const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
// // // const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
// // // const STYLE_OPTIONS = ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"];
// // // const SPECIALIZATION_OPTIONS = ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"];

// // // const AVAILABILITY_META = {
// // //     AVAILABLE: { dot: "bg-emerald-500", text: "text-emerald-700", label: "Available" },
// // //     BUSY: { dot: "bg-amber-500", text: "text-amber-700", label: "Busy" },
// // //     UNAVAILABLE: { dot: "bg-rose-500", text: "text-rose-700", label: "Unavailable" },
// // // };

// // // const inputClass = "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-70";
// // // const areaClass = "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none";
// // // const labelClass = "text-xs font-semibold text-[var(--text)]";

// // // const emptyForm = {
// // //     name: "", phone: "", countryCode: "+91", country: "", state: "", city: "", address: "", bio: "",
// // //     yearsOfExperience: "", experienceLevel: "", availability: "", designStyles: [], specializations: [],
// // //     certifications: [], serviceCities: [], portfolioLinks: [], photos: [], minBudgetHandled: "", maxBudgetHandled: "",
// // // };

// // // function initialsFromName(name) {
// // //     return !name ? "?" : name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
// // // }

// // // function formatCurrency(n) {
// // //     const num = Number(n);
// // //     if (!num || Number.isNaN(num)) return "—";
// // //     return num >= 100000 ? `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L` : `₹${num.toLocaleString("en-IN")}`;
// // // }

// // // export default function ProfilePage() {
// // //     const fileInputRef = useRef(null);
// // //     const { data: profileRes, isLoading, isFetching, isError, error: fetchError, refetch } = useGetDesignerProfileQuery();
// // //     const [updateProfile, { isLoading: saving }] = useUpdateDesignerProfileMutation();

// // //     const [status, setStatus] = useState({ type: "muted", message: "" });
// // //     const [uploadingCount, setUploadingCount] = useState(0);
// // //     const [account, setAccount] = useState(null);
// // //     const [form, setForm] = useState(emptyForm);
// // //     const [savedForm, setSavedForm] = useState(emptyForm);
// // //     const [hydrated, setHydrated] = useState(false);
// // //     const [dirty, setDirty] = useState(false);
// // //     const [isEditing, setIsEditing] = useState(false);
// // //     const [showSuccessModal, setShowSuccessModal] = useState(false);
// // //     const [chipDrafts, setChipDrafts] = useState({ certifications: "", serviceCities: "", portfolioLinks: "" });

// // //     useEffect(() => {
// // //         if (!profileRes || hydrated) return;
// // //         const data = profileRes.data || profileRes.result || profileRes;
// // //         setAccount({ name: data.name, email: data.email, city: data.city, state: data.state, verificationStatus: data.verificationStatus, rating: data.rating, totalReviews: data.totalReviews });
// // //         const hydratedForm = {
// // //             name: data.name || "", phone: data.phone || "", countryCode: data.countryCode || "+91", country: data.country || "",
// // //             state: data.state || "", city: data.city || "", address: data.address || "", bio: data.bio || "",
// // //             yearsOfExperience: data.yearsOfExperience ?? "", experienceLevel: data.experienceLevel || "", availability: data.availability || "",
// // //             designStyles: data.designStyles || [], specializations: data.specializations || [], certifications: data.certifications || [],
// // //             serviceCities: data.serviceCities || [], portfolioLinks: data.portfolioLinks || [], photos: data.photos || [],
// // //             minBudgetHandled: data.minBudgetHandled ?? "", maxBudgetHandled: data.maxBudgetHandled ?? "",
// // //         };
// // //         setForm(hydratedForm);
// // //         setSavedForm(hydratedForm);
// // //         setHydrated(true);
// // //     }, [profileRes, hydrated]);

// // //     const updateField = (key, value) => {
// // //         setForm((prev) => ({ ...prev, [key]: value }));
// // //         setDirty(true);
// // //     };

// // //     const toggleMultiSelect = (key, option) => {
// // //         setForm((prev) => {
// // //             const next = prev[key].includes(option) ? prev[key].filter((v) => v !== option) : [...prev[key], option];
// // //             return { ...prev, [key]: next };
// // //         });
// // //         setDirty(true);
// // //     };

// // //     const addChip = (key) => {
// // //         const v = (chipDrafts[key] || "").trim();
// // //         if (!v || form[key].includes(v)) return;
// // //         setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
// // //         setChipDrafts((prev) => ({ ...prev, [key]: "" }));
// // //         setDirty(true);
// // //     };

// // //     const removeChip = (key, chip) => {
// // //         setForm((prev) => ({ ...prev, [key]: prev[key].filter((c) => c !== chip) }));
// // //         setDirty(true);
// // //     };

// // //     const handleChipKeyDown = (key, e) => {
// // //         if (e.key === "Enter" || e.key === ",") {
// // //             e.preventDefault();
// // //             addChip(key);
// // //         } else if (e.key === "Backspace" && !chipDrafts[key] && form[key].length) {
// // //             setForm((prev) => ({ ...prev, [key]: prev[key].slice(0, -1) }));
// // //             setDirty(true);
// // //         }
// // //     };

// // //     const handlePhotoSelect = async (e) => {
// // //         const files = Array.from(e.target.files || []);
// // //         e.target.value = "";
// // //         if (!files.length) return;

// // //         setUploadingCount((c) => c + files.length);
// // //         for (const file of files) {
// // //             try {
// // //                 const response = await uploadFile(file, "designers", "profile-photos");
// // //                 if (response.publicUrl) {
// // //                     setForm((prev) => ({ ...prev, photos: [...prev.photos, response.publicUrl] }));
// // //                     setDirty(true);
// // //                 }
// // //             } catch (err) {
// // //                 setStatus({ type: "error", message: `Photo upload failed: ${err.message}` });
// // //             } finally {
// // //                 setUploadingCount((c) => c - 1);
// // //             }
// // //         }
// // //     };

// // //     const removePhoto = (url) => {
// // //         setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
// // //         setDirty(true);
// // //     };

// // //     const reorderPhotoToFront = (url) => {
// // //         setForm((prev) => ({ ...prev, photos: [url, ...prev.photos.filter((p) => p !== url)] }));
// // //         setDirty(true);
// // //     };

// // //     const validate = () => {
// // //         if (!form.yearsOfExperience && form.yearsOfExperience !== 0) return "Years of experience is required.";
// // //         if (!form.experienceLevel) return "Select an experience level.";
// // //         if (!form.availability) return "Select your availability status.";
// // //         if (!form.designStyles.length) return "Add at least one design style.";
// // //         if (!form.specializations.length) return "Add at least one specialization.";
// // //         if (!form.serviceCities.length) return "Add at least one service city.";
// // //         if (form.minBudgetHandled === "" || form.maxBudgetHandled === "") return "Set your budget range.";
// // //         if (Number(form.minBudgetHandled) > Number(form.maxBudgetHandled)) return "Minimum budget cannot exceed maximum budget.";
// // //         return null;
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         setStatus({ type: "muted", message: "" });

// // //         const validationError = validate();
// // //         if (validationError) {
// // //             setStatus({ type: "error", message: validationError });
// // //             return;
// // //         }

// // //         try {
// // //             const payload = {
// // //                 name: form.name, phone: form.phone, countryCode: form.countryCode, country: form.country,
// // //                 state: form.state, city: form.city, address: form.address, bio: form.bio,
// // //                 yearsOfExperience: Number(form.yearsOfExperience), experienceLevel: form.experienceLevel,
// // //                 availability: form.availability, designStyles: form.designStyles, specializations: form.specializations,
// // //                 certifications: form.certifications, serviceCities: form.serviceCities, portfolioLinks: form.portfolioLinks,
// // //                 photos: form.photos, minBudgetHandled: Number(form.minBudgetHandled), maxBudgetHandled: Number(form.maxBudgetHandled),
// // //             };

// // //             await updateProfile(payload).unwrap();
// // //             setShowSuccessModal(true);
// // //             setTimeout(() => setShowSuccessModal(false), 2000);
// // //             setDirty(false);
// // //             setSavedForm(form);
// // //             setIsEditing(false);
// // //         } catch (err) {
// // //             setStatus({ type: "error", message: err?.data?.message || err?.message || "Something went wrong." });
// // //         }
// // //     };

// // //     const renderChipField = (key, label, placeholder, required, hint) => (
// // //         <div className="flex flex-col gap-1">
// // //             <div className="flex items-baseline justify-between">
// // //                 <label className={labelClass}>
// // //                     {label}
// // //                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
// // //                 </label>
// // //                 {form[key].length > 0 && <span className="text-[10px] text-[var(--muted)]">{form[key].length} added</span>}
// // //             </div>
// // //             <div className={`flex flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 transition ${!isEditing ? "opacity-70" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}>
// // //                 {form[key].length === 0 && isEditing === false && <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not added</span>}
// // //                 {form[key].map((v) => (
// // //                     <span key={v} className="inline-flex items-center gap-1 rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]">
// // //                         {v}
// // //                         {isEditing && <button type="button" onClick={() => removeChip(key, v)} className="rounded-md p-0.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">×</button>}
// // //                     </span>
// // //                 ))}
// // //                 {isEditing && (
// // //                     <input
// // //                         type="text"
// // //                         value={chipDrafts[key]}
// // //                         onChange={(e) => setChipDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
// // //                         onKeyDown={(e) => handleChipKeyDown(key, e)}
// // //                         onBlur={() => addChip(key)}
// // //                         placeholder={form[key].length ? "Add another…" : placeholder}
// // //                         className="min-w-[120px] flex-1 border-none bg-transparent px-1.5 py-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
// // //                     />
// // //                 )}
// // //             </div>
// // //             {hint && isEditing && <p className="text-[11px] text-[var(--muted)]">{hint}</p>}
// // //         </div>
// // //     );

// // //     const renderMultiSelectField = (key, label, options, required) => (
// // //         <div className="flex flex-col gap-1">
// // //             <div className="flex items-baseline justify-between">
// // //                 <label className={labelClass}>
// // //                     {label}
// // //                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
// // //                 </label>
// // //                 {form[key].length > 0 && <span className="text-[10px] text-[var(--muted)]">{form[key].length} selected</span>}
// // //             </div>
// // //             {isEditing ? (
// // //                 <div className="flex flex-wrap gap-1.5">
// // //                     {options.map((opt) => {
// // //                         const active = form[key].includes(opt);
// // //                         return (
// // //                             <button
// // //                                 key={opt}
// // //                                 type="button"
// // //                                 onClick={() => toggleMultiSelect(key, opt)}
// // //                                 className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/12 text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
// // //                             >
// // //                                 {opt}
// // //                             </button>
// // //                         );
// // //                     })}
// // //                 </div>
// // //             ) : (
// // //                 <div className="flex flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-2">
// // //                     {form[key].length === 0 ? (
// // //                         <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not selected</span>
// // //                     ) : (
// // //                         form[key].map((v) => (
// // //                             <span key={v} className="inline-flex items-center rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-2.5 py-1 text-xs font-medium text-[var(--text)]">
// // //                                 {v}
// // //                             </span>
// // //                         ))
// // //                     )}
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );

// // //     if (isLoading) return (
// // //         <div className="flex h-screen w-screen items-center justify-center bg-[var(--background-secondary)]">
// // //             <div className="w-full max-w-6xl animate-pulse space-y-4 p-4">
// // //                 <div className="h-32 rounded-2xl bg-[var(--surface)]" />
// // //                 <div className="h-96 rounded-2xl bg-[var(--surface)]" />
// // //             </div>
// // //         </div>
// // //     );

// // //     if (isError) return (
// // //         <div className="flex h-screen w-screen items-center justify-center bg-[var(--background-secondary)] p-4">
// // //             <div className="w-full max-w-md rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
// // //                 <p className="text-sm text-[var(--danger)]">{fetchError?.data?.message || "Couldn't load your profile."}</p>
// // //                 <button type="button" onClick={refetch} className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--gold)]">
// // //                     Retry
// // //                 </button>
// // //             </div>
// // //         </div>
// // //     );

// // //     const statusColor = status.type === "error" ? "text-[var(--danger)]" : status.type === "success" ? "text-[var(--success)]" : "text-[var(--muted)]";
// // //     const availMeta = AVAILABILITY_META[form.availability];
// // //     const completenessChecks = [
// // //         Boolean(savedForm.bio && savedForm.bio.length > 20),
// // //         Boolean(savedForm.yearsOfExperience !== "" && savedForm.yearsOfExperience !== null),
// // //         Boolean(savedForm.experienceLevel),
// // //         Boolean(savedForm.availability),
// // //         savedForm.designStyles.length > 0,
// // //         savedForm.specializations.length > 0,
// // //         savedForm.serviceCities.length > 0,
// // //         savedForm.photos.length >= 3,
// // //         Boolean(savedForm.minBudgetHandled && savedForm.maxBudgetHandled),
// // //     ];
// // //     const completenessPct = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);
// // //     const missingCount = completenessChecks.filter((c) => !c).length;

// // //     return (
// // //         <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--background-secondary)]">
// // //             <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 overflow-hidden lg:flex-row">
// // //                 {/* LEFT COLUMN */}
// // //                 <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--background)] p-5 sm:p-7">
// // //                     <div className="mb-6 flex items-start justify-between gap-4">
// // //                         <div className="flex items-center gap-4">
// // //                             <div className="relative shrink-0">
// // //                                 {form.photos[0] ? (
// // //                                     <img src={form.photos[0]} alt={account?.name} className="h-16 w-16 rounded-md border-2 border-[var(--gold)]/30 object-cover" />
// // //                                 ) : (
// // //                                     <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-[var(--gold)]/30 bg-[var(--gold)]/10 font-[var(--font-heading)] text-lg font-semibold text-[var(--gold)]">
// // //                                         {initialsFromName(account?.name)}
// // //                                     </div>
// // //                                 )}
// // //                                 {availMeta && <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-md border-2 border-[var(--background)] ${availMeta.dot}`} />}
// // //                             </div>
// // //                             <div>
// // //                                 <h1 className="m-0 font-[var(--font-heading)] text-xl font-bold text-[var(--heading)] sm:text-2xl">Profile Information</h1>
// // //                                 <p className="mt-0.5 text-sm text-[var(--muted)]">Complete your profile details</p>
// // //                                 {missingCount > 0 ? (
// // //                                     <p className="mt-1 text-xs font-semibold text-[var(--gold)]">Pro Tip: Add all required information to complete your profile.</p>
// // //                                 ) : (
// // //                                     <p className="mt-1 text-xs font-semibold text-[var(--success)]">Your profile is fully complete.</p>
// // //                                 )}
// // //                             </div>
// // //                         </div>
// // //                         {!isEditing && (
// // //                             <button type="button" onClick={() => setIsEditing(true)} className="shrink-0 rounded-md border border-[var(--gold)] bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--gold)] hover:bg-[var(--gold)]/10">
// // //                                 Edit profile
// // //                             </button>
// // //                         )}
// // //                     </div>

// // //                     {/* BASIC FIELDS */}
// // //                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Full Name<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <input type="text" value={form.name} disabled={!isEditing} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Phone<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <div className="flex gap-2">
// // //                                 <input type="text" value={form.countryCode} disabled={!isEditing} onChange={(e) => updateField("countryCode", e.target.value)} className={`${inputClass} w-16 text-center`} />
// // //                                 <input type="tel" value={form.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
// // //                             </div>
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Address</label>
// // //                             <input type="text" value={form.address} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>City</label>
// // //                             <input type="text" value={form.city} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>State</label>
// // //                             <input type="text" value={form.state} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Country</label>
// // //                             <input type="text" value={form.country} disabled={!isEditing} placeholder="India" onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                     </div>

// // //                     {/* BIO */}
// // //                     <div className="mt-4 flex flex-col gap-1">
// // //                         <div className="flex items-baseline justify-between">
// // //                             <label className={labelClass}>Bio</label>
// // //                             <span className="text-[10px] text-[var(--muted)]">{form.bio.length}/1000</span>
// // //                         </div>
// // //                         <textarea value={form.bio} maxLength={1000} disabled={!isEditing} placeholder="Tell clients about your style…" onChange={(e) => updateField("bio", e.target.value)} className={`${areaClass} min-h-20`} />
// // //                     </div>

// // //                     {/* PROFESSIONAL */}
// // //                     <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Years<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <input type="number" min="0" max="80" value={form.yearsOfExperience} disabled={!isEditing} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Level<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <select value={form.experienceLevel} disabled={!isEditing} onChange={(e) => updateField("experienceLevel", e.target.value)} className={inputClass}>
// // //                                 <option value="">Select</option>
// // //                                 {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</option>)}
// // //                             </select>
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Availability<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <select value={form.availability} disabled={!isEditing} onChange={(e) => updateField("availability", e.target.value)} className={inputClass}>
// // //                                 <option value="">Select</option>
// // //                                 {AVAILABILITY_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
// // //                             </select>
// // //                         </div>
// // //                     </div>

// // //                     {/* SPECIALTIES */}
// // //                     <div className="mt-4 space-y-3">
// // //                         {renderMultiSelectField("designStyles", "Design styles", STYLE_OPTIONS, true)}
// // //                         {renderMultiSelectField("specializations", "Specializations", SPECIALIZATION_OPTIONS, true)}
// // //                         {renderChipField("certifications", "Certifications", "e.g. NCIDQ", false)}
// // //                         {renderChipField("serviceCities", "Service cities", "e.g. Hyderabad", true)}
// // //                         {renderChipField("portfolioLinks", "Portfolio links", "https://example.com", false, "Must start with http:// or https://")}
// // //                     </div>

// // //                     {/* BUDGET */}
// // //                     <div className="mt-4 grid grid-cols-2 gap-3">
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Min budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <input type="number" min="0" value={form.minBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("minBudgetHandled", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                         <div className="flex flex-col gap-1">
// // //                             <label className={labelClass}>Max budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// // //                             <input type="number" min="0" value={form.maxBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("maxBudgetHandled", e.target.value)} className={inputClass} />
// // //                         </div>
// // //                     </div>

// // //                     {/* PHOTOS */}
// // //                     <div className="mt-4 flex flex-col gap-1">
// // //                         <div className="flex items-baseline justify-between">
// // //                             <label className={labelClass}>Portfolio photos</label>
// // //                             <span className="text-[10px] text-[var(--muted)]">{form.photos.length} photo{form.photos.length === 1 ? "" : "s"}</span>
// // //                         </div>
// // //                         <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2">
// // //                             {form.photos.map((url, idx) => (
// // //                                 <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
// // //                                     <img src={url} alt="Portfolio" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
// // //                                     {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-[var(--gold)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--background)]">Cover</span>}
// // //                                     {isEditing && (
// // //                                         <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1 opacity-0 group-hover:bg-black/10 group-hover:opacity-100">
// // //                                             {idx !== 0 && <button type="button" onClick={() => reorderPhotoToFront(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-[10px] text-white">★</button>}
// // //                                             <button type="button" onClick={() => removePhoto(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-xs text-white">×</button>
// // //                                         </div>
// // //                                     )}
// // //                                 </div>
// // //                             ))}
// // //                             {Array.from({ length: uploadingCount }).map((_, i) => (
// // //                                 <div key={`uploading-${i}`} className="flex aspect-square animate-pulse items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
// // //                                     <span className="text-[10px] text-[var(--muted)]">↑</span>
// // //                                 </div>
// // //                             ))}
// // //                             {isEditing && (
// // //                                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--border)] text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
// // //                                     <span className="text-lg leading-none">+</span>
// // //                                 </button>
// // //                             )}
// // //                             {form.photos.length === 0 && uploadingCount === 0 && !isEditing && (
// // //                                 <div className="col-span-full flex aspect-[4/1] items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
// // //                                     No photos added
// // //                                 </div>
// // //                             )}
// // //                             <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handlePhotoSelect} disabled={!isEditing} />
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 {/* RIGHT COLUMN */}
// // //                 <div className="flex w-full shrink-0 flex-col gap-4 border-t border-[var(--border)] bg-[var(--background-secondary)] p-5 sm:p-7 lg:w-80 lg:border-l lg:border-t-0 lg:overflow-y-auto">
// // //                     <div className="rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/6 p-4">
// // //                         <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--heading)]">Reminder</p>
// // //                         <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">Keep your bio, styles, and budget accurate — clients see this first.</p>
// // //                     </div>

// // //                     <div>
// // //                         <h2 className="m-0 text-sm font-bold text-[var(--heading)]">🔒 Account</h2>
// // //                         <div className="mt-2 space-y-1.5 text-xs">
// // //                             <div className="flex justify-between gap-2">
// // //                                 <span className="text-[var(--muted)]">Email</span>
// // //                                 <span className="truncate text-right font-medium text-[var(--text)]">{account?.email || "—"}</span>
// // //                             </div>
// // //                             <div className="flex justify-between gap-2">
// // //                                 <span className="text-[var(--muted)]">Verification</span>
// // //                                 <span className="font-medium text-[var(--text)]">{account?.verificationStatus === "VERIFIED" ? "✓" : "Pending"}</span>
// // //                             </div>
// // //                             {typeof account?.rating === "number" && account.totalReviews > 0 && (
// // //                                 <div className="flex justify-between gap-2">
// // //                                     <span className="text-[var(--muted)]">Rating</span>
// // //                                     <span className="font-medium text-[var(--text)]">★ {account.rating.toFixed(1)}</span>
// // //                                 </div>
// // //                             )}
// // //                             {availMeta && (
// // //                                 <div className="flex items-center justify-between gap-2">
// // //                                     <span className="text-[var(--muted)]">Status</span>
// // //                                     <span className="inline-flex items-center gap-1 font-medium text-[var(--text)]">
// // //                                         <span className={`h-2 w-2 rounded-sm ${availMeta.dot}`} />
// // //                                         {availMeta.label}
// // //                                     </span>
// // //                                 </div>
// // //                             )}
// // //                             {form.minBudgetHandled && form.maxBudgetHandled && (
// // //                                 <div className="flex justify-between gap-2">
// // //                                     <span className="text-[var(--muted)]">Budget</span>
// // //                                     <span className="font-medium text-[var(--text)]">{formatCurrency(form.minBudgetHandled)} – {formatCurrency(form.maxBudgetHandled)}</span>
// // //                                 </div>
// // //                             )}
// // //                         </div>
// // //                     </div>

// // //                     <div>
// // //                         <div className="flex items-center justify-between">
// // //                             <h2 className="m-0 text-sm font-bold text-[var(--heading)]">Completeness</h2>
// // //                             <span className="text-xs font-semibold text-[var(--gold)]">{completenessPct}%</span>
// // //                         </div>
// // //                         <div className="mt-2 h-1.5 w-full overflow-hidden rounded-md bg-[var(--border)]">
// // //                             <div className="h-full rounded-md bg-[var(--gold)] transition-all duration-500" style={{ width: `${completenessPct}%` }} />
// // //                         </div>
// // //                         <p className="mt-2 text-[11px] text-[var(--muted)]">
// // //                             {missingCount === 0 ? "✓ All complete" : `${missingCount} section${missingCount === 1 ? "" : "s"} left`}
// // //                         </p>
// // //                     </div>

// // //                     <div className="flex-1" />

// // //                     {isEditing ? (
// // //                         <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
// // //                             <p className={`text-xs font-medium ${statusColor}`}>
// // //                                 {status.message || (dirty ? "Unsaved changes" : "No changes")}
// // //                             </p>
// // //                             <div className="flex items-center gap-2">
// // //                                 <button type="button" onClick={() => { setForm(savedForm); setChipDrafts({ certifications: "", serviceCities: "", portfolioLinks: "" }); setDirty(false); setIsEditing(false); }} disabled={saving || uploadingCount > 0} className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:opacity-50">
// // //                                     Cancel
// // //                                 </button>
// // //                                 <button type="submit" disabled={saving || uploadingCount > 0} className="flex-1 rounded-md bg-[var(--gold)] px-4 py-2 text-xs font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:opacity-50">
// // //                                     {saving ? "Saving…" : "Save"}
// // //                                 </button>
// // //                             </div>
// // //                         </div>
// // //                     ) : status.message && (
// // //                         <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
// // //                             <p className={`text-xs font-medium ${statusColor}`}>{status.message}</p>
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //             </form>

// // //             {/* SUCCESS MODAL */}
// // //             {showSuccessModal && (
// // //                 <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
// // //                     <div className="animate-in fade-in zoom-in-95 duration-300 rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-8 shadow-2xl text-center">
// // //                         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gold)]/10">
// // //                             <span className="text-3xl">✓</span>
// // //                         </div>
// // //                         <h2 className="m-0 text-2xl font-bold text-[var(--heading)]">Profile Updated!</h2>
// // //                         <p className="mt-2 text-sm text-[var(--muted)]">Your changes have been saved successfully.</p>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // }

// // import React, { useEffect, useRef, useState } from "react";
// // import { uploadFile } from "../../../../superBase";
// // import { useGetDesignerProfileQuery, useUpdateDesignerProfileMutation } from "./dashboard/DesignerDashboardApiSlice";
// // import "../../../theme.css";

// // const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
// // const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
// // const STYLE_OPTIONS = ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"];
// // const SPECIALIZATION_OPTIONS = ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"];

// // const AVAILABILITY_META = {
// //     AVAILABLE: { dot: "bg-emerald-500", text: "text-emerald-700", label: "Available" },
// //     BUSY: { dot: "bg-amber-500", text: "text-amber-700", label: "Busy" },
// //     UNAVAILABLE: { dot: "bg-rose-500", text: "text-rose-700", label: "Unavailable" },
// // };

// // const inputClass = "w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-70";
// // const areaClass = "w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none";
// // const labelClass = "text-xs font-semibold text-[var(--text)]";

// // const emptyForm = {
// //     name: "", phone: "", countryCode: "+91", country: "", state: "", city: "", address: "", bio: "",
// //     yearsOfExperience: "", experienceLevel: "", availability: "", designStyles: [], specializations: [],
// //     certifications: [], serviceCities: [], portfolioLinks: [], photos: [], minBudgetHandled: "", maxBudgetHandled: "",
// // };

// // function initialsFromName(name) {
// //     return !name ? "?" : name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
// // }

// // function formatCurrency(n) {
// //     const num = Number(n);
// //     if (!num || Number.isNaN(num)) return "—";
// //     return num >= 100000 ? `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L` : `₹${num.toLocaleString("en-IN")}`;
// // }

// // export default function ProfilePage() {
// //     const fileInputRef = useRef(null);
// //     const { data: profileRes, isLoading, isFetching, isError, error: fetchError, refetch } = useGetDesignerProfileQuery();
// //     const [updateProfile, { isLoading: saving }] = useUpdateDesignerProfileMutation();

// //     const [status, setStatus] = useState({ type: "muted", message: "" });
// //     const [uploadingCount, setUploadingCount] = useState(0);
// //     const [account, setAccount] = useState(null);
// //     const [form, setForm] = useState(emptyForm);
// //     const [savedForm, setSavedForm] = useState(emptyForm);
// //     const [hydrated, setHydrated] = useState(false);
// //     const [dirty, setDirty] = useState(false);
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [showSuccessModal, setShowSuccessModal] = useState(false);
// //     const [chipDrafts, setChipDrafts] = useState({ certifications: "", serviceCities: "", portfolioLinks: "" });

// //     useEffect(() => {
// //         if (!profileRes || hydrated) return;
// //         const data = profileRes.data || profileRes.result || profileRes;
// //         setAccount({ name: data.name, email: data.email, city: data.city, state: data.state, verificationStatus: data.verificationStatus, rating: data.rating, totalReviews: data.totalReviews });
// //         const hydratedForm = {
// //             name: data.name || "", phone: data.phone || "", countryCode: data.countryCode || "+91", country: data.country || "",
// //             state: data.state || "", city: data.city || "", address: data.address || "", bio: data.bio || "",
// //             yearsOfExperience: data.yearsOfExperience ?? "", experienceLevel: data.experienceLevel || "", availability: data.availability || "",
// //             designStyles: data.designStyles || [], specializations: data.specializations || [], certifications: data.certifications || [],
// //             serviceCities: data.serviceCities || [], portfolioLinks: data.portfolioLinks || [], photos: data.photos || [],
// //             minBudgetHandled: data.minBudgetHandled ?? "", maxBudgetHandled: data.maxBudgetHandled ?? "",
// //         };
// //         setForm(hydratedForm);
// //         setSavedForm(hydratedForm);
// //         setHydrated(true);
// //     }, [profileRes, hydrated]);

// //     const updateField = (key, value) => {
// //         setForm((prev) => ({ ...prev, [key]: value }));
// //         setDirty(true);
// //     };

// //     const toggleMultiSelect = (key, option) => {
// //         setForm((prev) => {
// //             const next = prev[key].includes(option) ? prev[key].filter((v) => v !== option) : [...prev[key], option];
// //             return { ...prev, [key]: next };
// //         });
// //         setDirty(true);
// //     };

// //     const addChip = (key) => {
// //         const v = (chipDrafts[key] || "").trim();
// //         if (!v || form[key].includes(v)) return;
// //         setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
// //         setChipDrafts((prev) => ({ ...prev, [key]: "" }));
// //         setDirty(true);
// //     };

// //     const removeChip = (key, chip) => {
// //         setForm((prev) => ({ ...prev, [key]: prev[key].filter((c) => c !== chip) }));
// //         setDirty(true);
// //     };

// //     const handleChipKeyDown = (key, e) => {
// //         if (e.key === "Enter" || e.key === ",") {
// //             e.preventDefault();
// //             addChip(key);
// //         } else if (e.key === "Backspace" && !chipDrafts[key] && form[key].length) {
// //             setForm((prev) => ({ ...prev, [key]: prev[key].slice(0, -1) }));
// //             setDirty(true);
// //         }
// //     };

// //     const handlePhotoSelect = async (e) => {
// //         const files = Array.from(e.target.files || []);
// //         e.target.value = "";
// //         if (!files.length) return;

// //         setUploadingCount((c) => c + files.length);
// //         for (const file of files) {
// //             try {
// //                 const response = await uploadFile(file, "designers", "profile-photos");
// //                 if (response.publicUrl) {
// //                     setForm((prev) => ({ ...prev, photos: [...prev.photos, response.publicUrl] }));
// //                     setDirty(true);
// //                 }
// //             } catch (err) {
// //                 setStatus({ type: "error", message: `Photo upload failed: ${err.message}` });
// //             } finally {
// //                 setUploadingCount((c) => c - 1);
// //             }
// //         }
// //     };

// //     const removePhoto = (url) => {
// //         setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
// //         setDirty(true);
// //     };

// //     const reorderPhotoToFront = (url) => {
// //         setForm((prev) => ({ ...prev, photos: [url, ...prev.photos.filter((p) => p !== url)] }));
// //         setDirty(true);
// //     };

// //     const validate = () => {
// //         if (!form.yearsOfExperience && form.yearsOfExperience !== 0) return "Years of experience is required.";
// //         if (!form.experienceLevel) return "Select an experience level.";
// //         if (!form.availability) return "Select your availability status.";
// //         if (!form.designStyles.length) return "Add at least one design style.";
// //         if (!form.specializations.length) return "Add at least one specialization.";
// //         if (!form.serviceCities.length) return "Add at least one service city.";
// //         if (form.minBudgetHandled === "" || form.maxBudgetHandled === "") return "Set your budget range.";
// //         if (Number(form.minBudgetHandled) > Number(form.maxBudgetHandled)) return "Minimum budget cannot exceed maximum budget.";
// //         return null;
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setStatus({ type: "muted", message: "" });

// //         const validationError = validate();
// //         if (validationError) {
// //             setStatus({ type: "error", message: validationError });
// //             return;
// //         }

// //         try {
// //             const payload = {
// //                 name: form.name, phone: form.phone, countryCode: form.countryCode, country: form.country,
// //                 state: form.state, city: form.city, address: form.address, bio: form.bio,
// //                 yearsOfExperience: Number(form.yearsOfExperience), experienceLevel: form.experienceLevel,
// //                 availability: form.availability, designStyles: form.designStyles, specializations: form.specializations,
// //                 certifications: form.certifications, serviceCities: form.serviceCities, portfolioLinks: form.portfolioLinks,
// //                 photos: form.photos, minBudgetHandled: Number(form.minBudgetHandled), maxBudgetHandled: Number(form.maxBudgetHandled),
// //             };

// //             await updateProfile(payload).unwrap();
// //             setShowSuccessModal(true);
// //             setTimeout(() => setShowSuccessModal(false), 2000);
// //             setDirty(false);
// //             setSavedForm(form);
// //             setIsEditing(false);
// //         } catch (err) {
// //             setStatus({ type: "error", message: err?.data?.message || err?.message || "Something went wrong." });
// //         }
// //     };

// //     const renderChipField = (key, label, placeholder, required, hint) => (
// //         <div className="flex min-w-0 flex-col gap-1">
// //             <div className="flex items-baseline justify-between gap-2">
// //                 <label className={labelClass}>
// //                     {label}
// //                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
// //                 </label>
// //                 {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} added</span>}
// //             </div>
// //             <div className={`flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 transition ${!isEditing ? "opacity-70" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}>
// //                 {form[key].length === 0 && isEditing === false && <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not added</span>}
// //                 {form[key].map((v) => (
// //                     <span key={v} className="inline-flex max-w-full items-center gap-1 rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]">
// //                         <span className="truncate">{v}</span>
// //                         {isEditing && <button type="button" onClick={() => removeChip(key, v)} className="shrink-0 rounded-md p-0.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">×</button>}
// //                     </span>
// //                 ))}
// //                 {isEditing && (
// //                     <input
// //                         type="text"
// //                         value={chipDrafts[key]}
// //                         onChange={(e) => setChipDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
// //                         onKeyDown={(e) => handleChipKeyDown(key, e)}
// //                         onBlur={() => addChip(key)}
// //                         placeholder={form[key].length ? "Add another…" : placeholder}
// //                         className="min-w-[80px] flex-1 border-none bg-transparent px-1.5 py-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
// //                     />
// //                 )}
// //             </div>
// //             {hint && isEditing && <p className="text-[11px] text-[var(--muted)]">{hint}</p>}
// //         </div>
// //     );

// //     const renderMultiSelectField = (key, label, options, required) => (
// //         <div className="flex min-w-0 flex-col gap-1">
// //             <div className="flex items-baseline justify-between gap-2">
// //                 <label className={labelClass}>
// //                     {label}
// //                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
// //                 </label>
// //                 {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} selected</span>}
// //             </div>
// //             {isEditing ? (
// //                 <div className="flex min-w-0 flex-wrap gap-1.5">
// //                     {options.map((opt) => {
// //                         const active = form[key].includes(opt);
// //                         return (
// //                             <button
// //                                 key={opt}
// //                                 type="button"
// //                                 onClick={() => toggleMultiSelect(key, opt)}
// //                                 className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/12 text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
// //                             >
// //                                 {opt}
// //                             </button>
// //                         );
// //                     })}
// //                 </div>
// //             ) : (
// //                 <div className="flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-2">
// //                     {form[key].length === 0 ? (
// //                         <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not selected</span>
// //                     ) : (
// //                         form[key].map((v) => (
// //                             <span key={v} className="inline-flex max-w-full items-center truncate rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-2.5 py-1 text-xs font-medium text-[var(--text)]">
// //                                 {v}
// //                             </span>
// //                         ))
// //                     )}
// //                 </div>
// //             )}
// //         </div>
// //     );

// //     if (isLoading) return (
// //         <div className="flex h-screen w-screen items-center justify-center bg-[var(--background-secondary)]">
// //             <div className="w-full max-w-6xl animate-pulse space-y-4 p-4">
// //                 <div className="h-32 rounded-2xl bg-[var(--surface)]" />
// //                 <div className="h-96 rounded-2xl bg-[var(--surface)]" />
// //             </div>
// //         </div>
// //     );

// //     if (isError) return (
// //         <div className="flex h-screen w-screen items-center justify-center bg-[var(--background-secondary)] p-4">
// //             <div className="w-full max-w-md rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
// //                 <p className="text-sm text-[var(--danger)]">{fetchError?.data?.message || "Couldn't load your profile."}</p>
// //                 <button type="button" onClick={refetch} className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--gold)]">
// //                     Retry
// //                 </button>
// //             </div>
// //         </div>
// //     );

// //     const statusColor = status.type === "error" ? "text-[var(--danger)]" : status.type === "success" ? "text-[var(--success)]" : "text-[var(--muted)]";
// //     const availMeta = AVAILABILITY_META[form.availability];
// //     const completenessChecks = [
// //         Boolean(savedForm.bio && savedForm.bio.length > 20),
// //         Boolean(savedForm.yearsOfExperience !== "" && savedForm.yearsOfExperience !== null),
// //         Boolean(savedForm.experienceLevel),
// //         Boolean(savedForm.availability),
// //         savedForm.designStyles.length > 0,
// //         savedForm.specializations.length > 0,
// //         savedForm.serviceCities.length > 0,
// //         savedForm.photos.length >= 3,
// //         Boolean(savedForm.minBudgetHandled && savedForm.maxBudgetHandled),
// //     ];
// //     const completenessPct = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);
// //     const missingCount = completenessChecks.filter((c) => !c).length;

// //     return (
// //         <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--background-secondary)]">
// //             <form onSubmit={handleSubmit} className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden lg:flex-row">
// //                 {/* LEFT COLUMN */}
// //                 <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-7">
// //                     <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
// //                         <div className="flex min-w-0 items-center gap-3 sm:gap-4">
// //                             <div className="relative shrink-0">
// //                                 {form.photos[0] ? (
// //                                     <img src={form.photos[0]} alt={account?.name} className="h-14 w-14 rounded-md border-2 border-[var(--gold)]/30 object-cover sm:h-16 sm:w-16" />
// //                                 ) : (
// //                                     <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-[var(--gold)]/30 bg-[var(--gold)]/10 font-[var(--font-heading)] text-base font-semibold text-[var(--gold)] sm:h-16 sm:w-16 sm:text-lg">
// //                                         {initialsFromName(account?.name)}
// //                                     </div>
// //                                 )}
// //                                 {availMeta && <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-md border-2 border-[var(--background)] ${availMeta.dot}`} />}
// //                             </div>
// //                             <div className="min-w-0">
// //                                 <h1 className="m-0 truncate font-[var(--font-heading)] text-lg font-bold text-[var(--heading)] sm:text-xl lg:text-2xl">Profile Information</h1>
// //                                 <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:text-sm">Complete your profile details</p>
// //                                 {missingCount > 0 ? (
// //                                     <p className="mt-1 text-[11px] font-semibold text-[var(--gold)] sm:text-xs">Pro Tip: Add all required information to complete your profile.</p>
// //                                 ) : (
// //                                     <p className="mt-1 text-[11px] font-semibold text-[var(--success)] sm:text-xs">Your profile is fully complete.</p>
// //                                 )}
// //                             </div>
// //                         </div>
// //                         {!isEditing && (
// //                             <button type="button" onClick={() => setIsEditing(true)} className="shrink-0 rounded-md border border-[var(--gold)] bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)] hover:bg-[var(--gold)]/10 sm:px-4 sm:text-xs">
// //                                 Edit profile
// //                             </button>
// //                         )}
// //                     </div>

// //                     {/* BASIC FIELDS */}
// //                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Full Name<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <input type="text" value={form.name} disabled={!isEditing} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Phone<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <div className="flex min-w-0 gap-2">
// //                                 <input type="text" value={form.countryCode} disabled={!isEditing} onChange={(e) => updateField("countryCode", e.target.value)} className={`${inputClass} w-16 shrink-0 text-center`} />
// //                                 <input type="tel" value={form.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} className={`${inputClass} min-w-0 flex-1`} />
// //                             </div>
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Address</label>
// //                             <input type="text" value={form.address} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>City</label>
// //                             <input type="text" value={form.city} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>State</label>
// //                             <input type="text" value={form.state} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Country</label>
// //                             <input type="text" value={form.country} disabled={!isEditing} placeholder="India" onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
// //                         </div>
// //                     </div>

// //                     {/* BIO */}
// //                     <div className="mt-4 flex min-w-0 flex-col gap-1">
// //                         <div className="flex items-baseline justify-between">
// //                             <label className={labelClass}>Bio</label>
// //                             <span className="text-[10px] text-[var(--muted)]">{form.bio.length}/1000</span>
// //                         </div>
// //                         <textarea value={form.bio} maxLength={1000} disabled={!isEditing} placeholder="Tell clients about your style…" onChange={(e) => updateField("bio", e.target.value)} className={`${areaClass} min-h-20`} />
// //                     </div>

// //                     {/* PROFESSIONAL */}
// //                     <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Years<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <input type="number" min="0" max="80" value={form.yearsOfExperience} disabled={!isEditing} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Level<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <select value={form.experienceLevel} disabled={!isEditing} onChange={(e) => updateField("experienceLevel", e.target.value)} className={inputClass}>
// //                                 <option value="">Select</option>
// //                                 {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</option>)}
// //                             </select>
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Availability<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <select value={form.availability} disabled={!isEditing} onChange={(e) => updateField("availability", e.target.value)} className={inputClass}>
// //                                 <option value="">Select</option>
// //                                 {AVAILABILITY_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
// //                             </select>
// //                         </div>
// //                     </div>

// //                     {/* SPECIALTIES */}
// //                     <div className="mt-4 space-y-3">
// //                         {renderMultiSelectField("designStyles", "Design styles", STYLE_OPTIONS, true)}
// //                         {renderMultiSelectField("specializations", "Specializations", SPECIALIZATION_OPTIONS, true)}
// //                         {renderChipField("certifications", "Certifications", "e.g. NCIDQ", false)}
// //                         {renderChipField("serviceCities", "Service cities", "e.g. Hyderabad", true)}
// //                         {renderChipField("portfolioLinks", "Portfolio links", "https://example.com", false, "Must start with http:// or https://")}
// //                     </div>

// //                     {/* BUDGET */}
// //                     <div className="mt-4 grid grid-cols-2 gap-3">
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Min budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <input type="number" min="0" value={form.minBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("minBudgetHandled", e.target.value)} className={inputClass} />
// //                         </div>
// //                         <div className="flex min-w-0 flex-col gap-1">
// //                             <label className={labelClass}>Max budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
// //                             <input type="number" min="0" value={form.maxBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("maxBudgetHandled", e.target.value)} className={inputClass} />
// //                         </div>
// //                     </div>

// //                     {/* PHOTOS */}
// //                     <div className="mt-4 flex min-w-0 flex-col gap-1">
// //                         <div className="flex items-baseline justify-between">
// //                             <label className={labelClass}>Portfolio photos</label>
// //                             <span className="text-[10px] text-[var(--muted)]">{form.photos.length} photo{form.photos.length === 1 ? "" : "s"}</span>
// //                         </div>
// //                         <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(76px,1fr))]">
// //                             {form.photos.map((url, idx) => (
// //                                 <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
// //                                     <img src={url} alt="Portfolio" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
// //                                     {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-[var(--gold)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--background)]">Cover</span>}
// //                                     {isEditing && (
// //                                         <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1 opacity-0 group-hover:bg-black/10 group-hover:opacity-100">
// //                                             {idx !== 0 && <button type="button" onClick={() => reorderPhotoToFront(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-[10px] text-white">★</button>}
// //                                             <button type="button" onClick={() => removePhoto(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-xs text-white">×</button>
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                             {Array.from({ length: uploadingCount }).map((_, i) => (
// //                                 <div key={`uploading-${i}`} className="flex aspect-square animate-pulse items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
// //                                     <span className="text-[10px] text-[var(--muted)]">↑</span>
// //                                 </div>
// //                             ))}
// //                             {isEditing && (
// //                                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--border)] text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
// //                                     <span className="text-lg leading-none">+</span>
// //                                 </button>
// //                             )}
// //                             {form.photos.length === 0 && uploadingCount === 0 && !isEditing && (
// //                                 <div className="col-span-full flex aspect-[4/1] items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
// //                                     No photos added
// //                                 </div>
// //                             )}
// //                             <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handlePhotoSelect} disabled={!isEditing} />
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* RIGHT COLUMN */}
// //                 <div className="flex w-full min-w-0 shrink-0 flex-col gap-4 overflow-y-auto border-t border-[var(--border)] bg-[var(--background-secondary)] p-4 sm:p-6 lg:h-full lg:w-[300px] lg:border-l lg:border-t-0 lg:p-6 xl:w-[320px] xl:p-7">
// //                     <div className="rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/6 p-3 sm:p-4">
// //                         <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--heading)]">Reminder</p>
// //                         <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">Keep your bio, styles, and budget accurate — clients see this first.</p>
// //                     </div>

// //                     <div>
// //                         <h2 className="m-0 text-sm font-bold text-[var(--heading)]">🔒 Account</h2>
// //                         <div className="mt-2 space-y-1.5 text-xs">
// //                             <div className="flex justify-between gap-2">
// //                                 <span className="shrink-0 text-[var(--muted)]">Email</span>
// //                                 <span className="min-w-0 max-w-[65%] truncate text-right font-medium text-[var(--text)]">{account?.email || "—"}</span>
// //                             </div>
// //                             <div className="flex justify-between gap-2">
// //                                 <span className="text-[var(--muted)]">Verification</span>
// //                                 <span className="font-medium text-[var(--text)]">{account?.verificationStatus === "VERIFIED" ? "✓" : "Pending"}</span>
// //                             </div>
// //                             {typeof account?.rating === "number" && account.totalReviews > 0 && (
// //                                 <div className="flex justify-between gap-2">
// //                                     <span className="text-[var(--muted)]">Rating</span>
// //                                     <span className="font-medium text-[var(--text)]">★ {account.rating.toFixed(1)}</span>
// //                                 </div>
// //                             )}
// //                             {availMeta && (
// //                                 <div className="flex items-center justify-between gap-2">
// //                                     <span className="text-[var(--muted)]">Status</span>
// //                                     <span className="inline-flex items-center gap-1 font-medium text-[var(--text)]">
// //                                         <span className={`h-2 w-2 rounded-sm ${availMeta.dot}`} />
// //                                         {availMeta.label}
// //                                     </span>
// //                                 </div>
// //                             )}
// //                             {form.minBudgetHandled && form.maxBudgetHandled && (
// //                                 <div className="flex justify-between gap-2">
// //                                     <span className="shrink-0 text-[var(--muted)]">Budget</span>
// //                                     <span className="min-w-0 max-w-[65%] truncate text-right font-medium text-[var(--text)]">{formatCurrency(form.minBudgetHandled)} – {formatCurrency(form.maxBudgetHandled)}</span>
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>

// //                     <div>
// //                         <div className="flex items-center justify-between">
// //                             <h2 className="m-0 text-sm font-bold text-[var(--heading)]">Completeness</h2>
// //                             <span className="text-xs font-semibold text-[var(--gold)]">{completenessPct}%</span>
// //                         </div>
// //                         <div className="mt-2 h-1.5 w-full overflow-hidden rounded-md bg-[var(--border)]">
// //                             <div className="h-full rounded-md bg-[var(--gold)] transition-all duration-500" style={{ width: `${completenessPct}%` }} />
// //                         </div>
// //                         <p className="mt-2 text-[11px] text-[var(--muted)]">
// //                             {missingCount === 0 ? "✓ All complete" : `${missingCount} section${missingCount === 1 ? "" : "s"} left`}
// //                         </p>
// //                     </div>

// //                     <div className="flex-1" />

// //                     {isEditing ? (
// //                         <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
// //                             <p className={`text-xs font-medium ${statusColor}`}>
// //                                 {status.message || (dirty ? "Unsaved changes" : "No changes")}
// //                             </p>
// //                             <div className="flex items-center gap-2">
// //                                 <button type="button" onClick={() => { setForm(savedForm); setChipDrafts({ certifications: "", serviceCities: "", portfolioLinks: "" }); setDirty(false); setIsEditing(false); }} disabled={saving || uploadingCount > 0} className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[11px] font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:opacity-50 sm:px-4 sm:text-xs">
// //                                     Cancel
// //                                 </button>
// //                                 <button type="submit" disabled={saving || uploadingCount > 0} className="flex-1 rounded-md bg-[var(--gold)] px-3 py-2 text-[11px] font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:opacity-50 sm:px-4 sm:text-xs">
// //                                     {saving ? "Saving…" : "Save"}
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ) : status.message && (
// //                         <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
// //                             <p className={`text-xs font-medium ${statusColor}`}>{status.message}</p>
// //                         </div>
// //                     )}
// //                 </div>
// //             </form>

// //             {/* SUCCESS MODAL */}
// //             {showSuccessModal && (
// //                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
// //                     <div className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-6 text-center shadow-2xl sm:p-8">
// //                         <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 sm:h-16 sm:w-16">
// //                             <span className="text-2xl sm:text-3xl">✓</span>
// //                         </div>
// //                         <h2 className="m-0 text-xl font-bold text-[var(--heading)] sm:text-2xl">Profile Updated!</h2>
// //                         <p className="mt-2 text-sm text-[var(--muted)]">Your changes have been saved successfully.</p>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// import React, { useEffect, useRef, useState } from "react";
// import { uploadFile } from "../../../../superBase";
// import { useGetDesignerProfileQuery, useUpdateDesignerProfileMutation } from "./dashboard/DesignerDashboardApiSlice";
// import "../../../theme.css";

// const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
// const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
// const STYLE_OPTIONS = ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"];
// const SPECIALIZATION_OPTIONS = ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"];

// const AVAILABILITY_META = {
//     AVAILABLE: { dot: "bg-emerald-500", label: "Available" },
//     BUSY: { dot: "bg-amber-500", label: "Busy" },
//     UNAVAILABLE: { dot: "bg-rose-500", label: "Unavailable" },
// };

// const inputClass = "w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-70";
// const areaClass = "w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none";
// const labelClass = "text-xs font-semibold text-[var(--text)]";

// const emptyForm = {
//     name: "", phone: "", countryCode: "+91", country: "", state: "", city: "", address: "", bio: "",
//     yearsOfExperience: "", experienceLevel: "", availability: "", designStyles: [], specializations: [],
//     certifications: [], serviceCities: [], portfolioLinks: [], photos: [], minBudgetHandled: "", maxBudgetHandled: "",
// };

// function initialsFromName(name) {
//     return !name ? "?" : name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
// }

// export default function ProfilePage() {
//     const fileInputRef = useRef(null);
//     const { data: profileRes, isLoading, isError, error: fetchError, refetch } = useGetDesignerProfileQuery();
//     const [updateProfile, { isLoading: saving }] = useUpdateDesignerProfileMutation();

//     const [status, setStatus] = useState({ type: "muted", message: "" });
//     const [uploadingCount, setUploadingCount] = useState(0);
//     const [account, setAccount] = useState(null);
//     const [form, setForm] = useState(emptyForm);
//     const [savedForm, setSavedForm] = useState(emptyForm);
//     const [hydrated, setHydrated] = useState(false);
//     const [dirty, setDirty] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [chipDrafts, setChipDrafts] = useState({ certifications: "", serviceCities: "", portfolioLinks: "" });

//     useEffect(() => {
//         if (!profileRes || hydrated) return;
//         const data = profileRes.data || profileRes.result || profileRes;
//         setAccount({ name: data.name, email: data.email, verificationStatus: data.verificationStatus, rating: data.rating, totalReviews: data.totalReviews });
//         const hydratedForm = {
//             name: data.name || "", phone: data.phone || "", countryCode: data.countryCode || "+91", country: data.country || "",
//             state: data.state || "", city: data.city || "", address: data.address || "", bio: data.bio || "",
//             yearsOfExperience: data.yearsOfExperience ?? "", experienceLevel: data.experienceLevel || "", availability: data.availability || "",
//             designStyles: data.designStyles || [], specializations: data.specializations || [], certifications: data.certifications || [],
//             serviceCities: data.serviceCities || [], portfolioLinks: data.portfolioLinks || [], photos: data.photos || [],
//             minBudgetHandled: data.minBudgetHandled ?? "", maxBudgetHandled: data.maxBudgetHandled ?? "",
//         };
//         setForm(hydratedForm);
//         setSavedForm(hydratedForm);
//         setHydrated(true);
//     }, [profileRes, hydrated]);

//     const updateField = (key, value) => {
//         setForm((prev) => ({ ...prev, [key]: value }));
//         setDirty(true);
//     };

//     const toggleMultiSelect = (key, option) => {
//         setForm((prev) => {
//             const next = prev[key].includes(option) ? prev[key].filter((v) => v !== option) : [...prev[key], option];
//             return { ...prev, [key]: next };
//         });
//         setDirty(true);
//     };

//     const addChip = (key) => {
//         const v = (chipDrafts[key] || "").trim();
//         if (!v || form[key].includes(v)) return;
//         setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
//         setChipDrafts((prev) => ({ ...prev, [key]: "" }));
//         setDirty(true);
//     };

//     const removeChip = (key, chip) => {
//         setForm((prev) => ({ ...prev, [key]: prev[key].filter((c) => c !== chip) }));
//         setDirty(true);
//     };

//     const handleChipKeyDown = (key, e) => {
//         if (e.key === "Enter" || e.key === ",") {
//             e.preventDefault();
//             addChip(key);
//         } else if (e.key === "Backspace" && !chipDrafts[key] && form[key].length) {
//             setForm((prev) => ({ ...prev, [key]: prev[key].slice(0, -1) }));
//             setDirty(true);
//         }
//     };

//     const handlePhotoSelect = async (e) => {
//         const files = Array.from(e.target.files || []);
//         e.target.value = "";
//         if (!files.length) return;

//         setUploadingCount((c) => c + files.length);
//         for (const file of files) {
//             try {
//                 const response = await uploadFile(file, "designers", "profile-photos");
//                 if (response.publicUrl) {
//                     setForm((prev) => ({ ...prev, photos: [...prev.photos, response.publicUrl] }));
//                     setDirty(true);
//                 }
//             } catch (err) {
//                 setStatus({ type: "error", message: `Photo upload failed: ${err.message}` });
//             } finally {
//                 setUploadingCount((c) => c - 1);
//             }
//         }
//     };

//     const removePhoto = (url) => {
//         setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
//         setDirty(true);
//     };

//     const reorderPhotoToFront = (url) => {
//         setForm((prev) => ({ ...prev, photos: [url, ...prev.photos.filter((p) => p !== url)] }));
//         setDirty(true);
//     };

//     const validate = () => {
//         if (!form.yearsOfExperience && form.yearsOfExperience !== 0) return "Years of experience is required.";
//         if (!form.experienceLevel) return "Select an experience level.";
//         if (!form.availability) return "Select your availability status.";
//         if (!form.designStyles.length) return "Add at least one design style.";
//         if (!form.specializations.length) return "Add at least one specialization.";
//         if (!form.serviceCities.length) return "Add at least one service city.";
//         if (form.minBudgetHandled === "" || form.maxBudgetHandled === "") return "Set your budget range.";
//         if (Number(form.minBudgetHandled) > Number(form.maxBudgetHandled)) return "Minimum budget cannot exceed maximum budget.";
//         return null;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setStatus({ type: "muted", message: "" });

//         const validationError = validate();
//         if (validationError) {
//             setStatus({ type: "error", message: validationError });
//             return;
//         }

//         try {
//             const payload = {
//                 name: form.name, phone: form.phone, countryCode: form.countryCode, country: form.country,
//                 state: form.state, city: form.city, address: form.address, bio: form.bio,
//                 yearsOfExperience: Number(form.yearsOfExperience), experienceLevel: form.experienceLevel,
//                 availability: form.availability, designStyles: form.designStyles, specializations: form.specializations,
//                 certifications: form.certifications, serviceCities: form.serviceCities, portfolioLinks: form.portfolioLinks,
//                 photos: form.photos, minBudgetHandled: Number(form.minBudgetHandled), maxBudgetHandled: Number(form.maxBudgetHandled),
//             };

//             await updateProfile(payload).unwrap();
//             setShowSuccessModal(true);
//             setTimeout(() => setShowSuccessModal(false), 2000);
//             setDirty(false);
//             setSavedForm(form);
//             setIsEditing(false);
//         } catch (err) {
//             setStatus({ type: "error", message: err?.data?.message || err?.message || "Something went wrong." });
//         }
//     };

//     const cancelEdit = () => {
//         setForm(savedForm);
//         setChipDrafts({ certifications: "", serviceCities: "", portfolioLinks: "" });
//         setDirty(false);
//         setIsEditing(false);
//         setStatus({ type: "muted", message: "" });
//     };

//     const renderChipField = (key, label, placeholder, required, hint) => (
//         <div className="flex min-w-0 flex-col gap-1">
//             <div className="flex items-baseline justify-between gap-2">
//                 <label className={labelClass}>
//                     {label}
//                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
//                 </label>
//                 {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} added</span>}
//             </div>
//             <div className={`flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 transition ${!isEditing ? "opacity-70" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}>
//                 {form[key].length === 0 && !isEditing && <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not added</span>}
//                 {form[key].map((v) => (
//                     <span key={v} className="inline-flex max-w-full items-center gap-1 rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]">
//                         <span className="truncate">{v}</span>
//                         {isEditing && <button type="button" onClick={() => removeChip(key, v)} className="shrink-0 rounded-md p-0.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">×</button>}
//                     </span>
//                 ))}
//                 {isEditing && (
//                     <input
//                         type="text"
//                         value={chipDrafts[key]}
//                         onChange={(e) => setChipDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
//                         onKeyDown={(e) => handleChipKeyDown(key, e)}
//                         onBlur={() => addChip(key)}
//                         placeholder={form[key].length ? "Add another…" : placeholder}
//                         className="min-w-[80px] flex-1 border-none bg-transparent px-1.5 py-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
//                     />
//                 )}
//             </div>
//             {hint && isEditing && <p className="text-[11px] text-[var(--muted)]">{hint}</p>}
//         </div>
//     );

//     const renderMultiSelectField = (key, label, options, required) => (
//         <div className="flex min-w-0 flex-col gap-1">
//             <div className="flex items-baseline justify-between gap-2">
//                 <label className={labelClass}>
//                     {label}
//                     {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
//                 </label>
//                 {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} selected</span>}
//             </div>
//             {isEditing ? (
//                 <div className="flex min-w-0 flex-wrap gap-1.5">
//                     {options.map((opt) => {
//                         const active = form[key].includes(opt);
//                         return (
//                             <button
//                                 key={opt}
//                                 type="button"
//                                 onClick={() => toggleMultiSelect(key, opt)}
//                                 className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/12 text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
//                             >
//                                 {opt}
//                             </button>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <div className="flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-2">
//                     {form[key].length === 0 ? (
//                         <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not selected</span>
//                     ) : (
//                         form[key].map((v) => (
//                             <span key={v} className="inline-flex max-w-full items-center truncate rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-2.5 py-1 text-xs font-medium text-[var(--text)]">
//                                 {v}
//                             </span>
//                         ))
//                     )}
//                 </div>
//             )}
//         </div>
//     );

//     if (isLoading) return (
//         <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)]">
//             <div className="w-full max-w-3xl animate-pulse space-y-4 p-4">
//                 <div className="h-32 rounded-2xl bg-[var(--surface)]" />
//                 <div className="h-96 rounded-2xl bg-[var(--surface)]" />
//             </div>
//         </div>
//     );

//     if (isError) return (
//         <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)] p-4">
//             <div className="w-full max-w-md rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
//                 <p className="text-sm text-[var(--danger)]">{fetchError?.data?.message || "Couldn't load your profile."}</p>
//                 <button type="button" onClick={refetch} className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--gold)]">
//                     Retry
//                 </button>
//             </div>
//         </div>
//     );

//     const statusColor = status.type === "error" ? "text-[var(--danger)]" : status.type === "success" ? "text-[var(--success)]" : "text-[var(--muted)]";
//     const availMeta = AVAILABILITY_META[form.availability];

//     return (
//         <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--background-secondary)]">
//             <form onSubmit={handleSubmit} className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto">
//                 <div className="w-full max-w-3xl min-w-0 flex-col bg-[var(--background)] p-4 sm:p-6 lg:p-8">
//                     {/* HEADER */}
//                     <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
//                         <div className="flex min-w-0 items-center gap-3 sm:gap-4">
//                             <div className="relative shrink-0">
//                                 {form.photos[0] ? (
//                                     <img src={form.photos[0]} alt={account?.name} className="h-14 w-14 rounded-md border-2 border-[var(--gold)]/30 object-cover sm:h-16 sm:w-16" />
//                                 ) : (
//                                     <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-[var(--gold)]/30 bg-[var(--gold)]/10 font-[var(--font-heading)] text-base font-semibold text-[var(--gold)] sm:h-16 sm:w-16 sm:text-lg">
//                                         {initialsFromName(account?.name)}
//                                     </div>
//                                 )}
//                                 {availMeta && <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-md border-2 border-[var(--background)] ${availMeta.dot}`} />}
//                             </div>
//                             <div className="min-w-0">
//                                 <h1 className="m-0 truncate font-[var(--font-heading)] text-lg font-bold text-[var(--heading)] sm:text-xl lg:text-2xl">Profile Information</h1>
//                                 <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:text-sm">Complete your profile details</p>
//                             </div>
//                         </div>
//                         {!isEditing && (
//                             <button type="button" onClick={() => setIsEditing(true)} className="shrink-0 rounded-md border border-[var(--gold)] bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)] hover:bg-[var(--gold)]/10 sm:px-4 sm:text-xs">
//                                 Edit profile
//                             </button>
//                         )}
//                     </div>

//                     {/* ACCOUNT SUMMARY STRIP */}
//                     <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs">
//                         <div className="flex items-center gap-1.5">
//                             <span className="text-[var(--muted)]">Email</span>
//                             <span className="font-medium text-[var(--text)]">{account?.email || "—"}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                             <span className="text-[var(--muted)]">Verification</span>
//                             <span className="font-medium text-[var(--text)]">{account?.verificationStatus === "VERIFIED" ? "✓ Verified" : "Pending"}</span>
//                         </div>
//                         {typeof account?.rating === "number" && account.totalReviews > 0 && (
//                             <div className="flex items-center gap-1.5">
//                                 <span className="text-[var(--muted)]">Rating</span>
//                                 <span className="font-medium text-[var(--text)]">★ {account.rating.toFixed(1)}</span>
//                             </div>
//                         )}
//                     </div>

//                     {/* BASIC FIELDS */}
//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Full Name<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <input type="text" value={form.name} disabled={!isEditing} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Phone<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <div className="flex min-w-0 gap-2">
//                                 <input type="text" value={form.countryCode} disabled={!isEditing} onChange={(e) => updateField("countryCode", e.target.value)} className={`${inputClass} w-16 shrink-0 text-center`} />
//                                 <input type="tel" value={form.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} className={`${inputClass} min-w-0 flex-1`} />
//                             </div>
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Address</label>
//                             <input type="text" value={form.address} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>City</label>
//                             <input type="text" value={form.city} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>State</label>
//                             <input type="text" value={form.state} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Country</label>
//                             <input type="text" value={form.country} disabled={!isEditing} placeholder="India" onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
//                         </div>
//                     </div>

//                     {/* BIO */}
//                     <div className="mt-4 flex min-w-0 flex-col gap-1">
//                         <div className="flex items-baseline justify-between">
//                             <label className={labelClass}>Bio</label>
//                             <span className="text-[10px] text-[var(--muted)]">{form.bio.length}/1000</span>
//                         </div>
//                         <textarea value={form.bio} maxLength={1000} disabled={!isEditing} placeholder="Tell clients about your style…" onChange={(e) => updateField("bio", e.target.value)} className={`${areaClass} min-h-20`} />
//                     </div>

//                     {/* PROFESSIONAL */}
//                     <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Years<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <input type="number" min="0" max="80" value={form.yearsOfExperience} disabled={!isEditing} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Level<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <select value={form.experienceLevel} disabled={!isEditing} onChange={(e) => updateField("experienceLevel", e.target.value)} className={inputClass}>
//                                 <option value="">Select</option>
//                                 {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</option>)}
//                             </select>
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Availability<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <select value={form.availability} disabled={!isEditing} onChange={(e) => updateField("availability", e.target.value)} className={inputClass}>
//                                 <option value="">Select</option>
//                                 {AVAILABILITY_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     {/* SPECIALTIES */}
//                     <div className="mt-4 space-y-3">
//                         {renderMultiSelectField("designStyles", "Design styles", STYLE_OPTIONS, true)}
//                         {renderMultiSelectField("specializations", "Specializations", SPECIALIZATION_OPTIONS, true)}
//                         {renderChipField("certifications", "Certifications", "e.g. NCIDQ", false)}
//                         {renderChipField("serviceCities", "Service cities", "e.g. Hyderabad", true)}
//                         {renderChipField("portfolioLinks", "Portfolio links", "https://example.com", false, "Must start with http:// or https://")}
//                     </div>

//                     {/* BUDGET */}
//                     <div className="mt-4 grid grid-cols-2 gap-3">
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Min budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <input type="number" min="0" value={form.minBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("minBudgetHandled", e.target.value)} className={inputClass} />
//                         </div>
//                         <div className="flex min-w-0 flex-col gap-1">
//                             <label className={labelClass}>Max budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
//                             <input type="number" min="0" value={form.maxBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("maxBudgetHandled", e.target.value)} className={inputClass} />
//                         </div>
//                     </div>

//                     {/* PHOTOS */}
//                     <div className="mt-4 flex min-w-0 flex-col gap-1">
//                         <div className="flex items-baseline justify-between">
//                             <label className={labelClass}>Portfolio photos</label>
//                             <span className="text-[10px] text-[var(--muted)]">{form.photos.length} photo{form.photos.length === 1 ? "" : "s"}</span>
//                         </div>
//                         <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(76px,1fr))]">
//                             {form.photos.map((url, idx) => (
//                                 <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
//                                     <img src={url} alt="Portfolio" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
//                                     {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-[var(--gold)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--background)]">Cover</span>}
//                                     {isEditing && (
//                                         <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1 opacity-0 group-hover:bg-black/10 group-hover:opacity-100">
//                                             {idx !== 0 && <button type="button" onClick={() => reorderPhotoToFront(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-[10px] text-white">★</button>}
//                                             <button type="button" onClick={() => removePhoto(url)} className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-xs text-white">×</button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                             {Array.from({ length: uploadingCount }).map((_, i) => (
//                                 <div key={`uploading-${i}`} className="flex aspect-square animate-pulse items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
//                                     <span className="text-[10px] text-[var(--muted)]">↑</span>
//                                 </div>
//                             ))}
//                             {isEditing && (
//                                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--border)] text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
//                                     <span className="text-lg leading-none">+</span>
//                                 </button>
//                             )}
//                             {form.photos.length === 0 && uploadingCount === 0 && !isEditing && (
//                                 <div className="col-span-full flex aspect-[4/1] items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
//                                     No photos added
//                                 </div>
//                             )}
//                             <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handlePhotoSelect} disabled={!isEditing} />
//                         </div>
//                     </div>

//                     {/* STATUS MESSAGE (view mode) */}
//                     {!isEditing && status.message && (
//                         <p className={`mt-4 text-xs font-medium ${statusColor}`}>{status.message}</p>
//                     )}

//                     {/* SPACER so sticky bar doesn't cover last field */}
//                     {isEditing && <div className="h-4" />}
//                 </div>
//             </form>

//             {/* STICKY SAVE BAR — only visible in edit mode */}
//             {isEditing && (
//                 <div className="flex w-full shrink-0 justify-center border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 sm:px-6">
//                     <div className="flex w-full max-w-3xl min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                         <p className={`text-xs font-medium ${statusColor}`}>
//                             {status.message || (dirty ? "Unsaved changes" : "No changes")}
//                         </p>
//                         <div className="flex items-center gap-2">
//                             <button type="button" onClick={cancelEdit} disabled={saving || uploadingCount > 0} className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[11px] font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:opacity-50 sm:text-xs">
//                                 Cancel
//                             </button>
//                             <button type="submit" form={undefined} onClick={handleSubmit} disabled={saving || uploadingCount > 0} className="rounded-md bg-[var(--gold)] px-5 py-2 text-[11px] font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:opacity-50 sm:text-xs">
//                                 {saving ? "Saving…" : "Save changes"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* SUCCESS MODAL */}
//             {showSuccessModal && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//                     <div className="w-full max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-6 text-center shadow-2xl sm:p-8">
//                         <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 sm:h-16 sm:w-16">
//                             <span className="text-2xl sm:text-3xl">✓</span>
//                         </div>
//                         <h2 className="m-0 text-xl font-bold text-[var(--heading)] sm:text-2xl">Profile Updated!</h2>
//                         <p className="mt-2 text-sm text-[var(--muted)]">Your changes have been saved successfully.</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../../../superBase";
import { useGetDesignerProfileQuery, useUpdateDesignerProfileMutation } from "./dashboard/DesignerDashboardApiSlice";
import "../../../theme.css";

const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
const STYLE_OPTIONS = ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"];
const SPECIALIZATION_OPTIONS = ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"];

const AVAILABILITY_META = {
    AVAILABLE: { dot: "bg-emerald-500", label: "Available" },
    BUSY: { dot: "bg-amber-500", label: "Busy" },
    UNAVAILABLE: { dot: "bg-rose-500", label: "Unavailable" },
};

const inputClass = "w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-70";
const areaClass = "w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none";
const labelClass = "text-xs font-semibold text-[var(--text)]";
const sectionCardClass = "rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5";
const sectionTitleClass = "mb-3 font-[var(--font-heading)] text-sm font-bold text-[var(--heading)] sm:text-base";

const emptyForm = {
    name: "", phone: "", countryCode: "+91", country: "", state: "", city: "", address: "", bio: "",
    yearsOfExperience: "", experienceLevel: "", availability: "", designStyles: [], specializations: [],
    certifications: [], serviceCities: [], portfolioLinks: [], photos: [], minBudgetHandled: "", maxBudgetHandled: "",
};

function initialsFromName(name) {
    return !name ? "?" : name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default function ProfilePage() {
    const fileInputRef = useRef(null);
    const { data: profileRes, isLoading, isError, error: fetchError, refetch } = useGetDesignerProfileQuery();
    const [updateProfile, { isLoading: saving }] = useUpdateDesignerProfileMutation();

    const [status, setStatus] = useState({ type: "muted", message: "" });
    const [uploadingCount, setUploadingCount] = useState(0);
    const [account, setAccount] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [savedForm, setSavedForm] = useState(emptyForm);
    const [hydrated, setHydrated] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [chipDrafts, setChipDrafts] = useState({ certifications: "", serviceCities: "", portfolioLinks: "" });

    useEffect(() => {
        if (!profileRes || hydrated) return;
        const data = profileRes.data || profileRes.result || profileRes;
        setAccount({ name: data.name, email: data.email, verificationStatus: data.verificationStatus, rating: data.rating, totalReviews: data.totalReviews });
        const hydratedForm = {
            name: data.name || "", phone: data.phone || "", countryCode: data.countryCode || "+91", country: data.country || "",
            state: data.state || "", city: data.city || "", address: data.address || "", bio: data.bio || "",
            yearsOfExperience: data.yearsOfExperience ?? "", experienceLevel: data.experienceLevel || "", availability: data.availability || "",
            designStyles: data.designStyles || [], specializations: data.specializations || [], certifications: data.certifications || [],
            serviceCities: data.serviceCities || [], portfolioLinks: data.portfolioLinks || [], photos: data.photos || [],
            minBudgetHandled: data.minBudgetHandled ?? "", maxBudgetHandled: data.maxBudgetHandled ?? "",
        };
        setForm(hydratedForm);
        setSavedForm(hydratedForm);
        setHydrated(true);
    }, [profileRes, hydrated]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setDirty(true);
    };

    const toggleMultiSelect = (key, option) => {
        setForm((prev) => {
            const next = prev[key].includes(option) ? prev[key].filter((v) => v !== option) : [...prev[key], option];
            return { ...prev, [key]: next };
        });
        setDirty(true);
    };

    const addChip = (key) => {
        const v = (chipDrafts[key] || "").trim();
        if (!v || form[key].includes(v)) return;
        setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
        setChipDrafts((prev) => ({ ...prev, [key]: "" }));
        setDirty(true);
    };

    const removeChip = (key, chip) => {
        setForm((prev) => ({ ...prev, [key]: prev[key].filter((c) => c !== chip) }));
        setDirty(true);
    };

    const handleChipKeyDown = (key, e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addChip(key);
        } else if (e.key === "Backspace" && !chipDrafts[key] && form[key].length) {
            setForm((prev) => ({ ...prev, [key]: prev[key].slice(0, -1) }));
            setDirty(true);
        }
    };

    const handlePhotoSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        if (!files.length) return;

        setUploadingCount((c) => c + files.length);
        for (const file of files) {
            try {
                const response = await uploadFile(file, "designers", "profile-photos");
                if (response.publicUrl) {
                    setForm((prev) => ({ ...prev, photos: [...prev.photos, response.publicUrl] }));
                    setDirty(true);
                }
            } catch (err) {
                setStatus({ type: "error", message: `Photo upload failed: ${err.message}` });
            } finally {
                setUploadingCount((c) => c - 1);
            }
        }
    };

    const removePhoto = (url) => {
        setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
        setDirty(true);
    };

    const reorderPhotoToFront = (url) => {
        setForm((prev) => ({ ...prev, photos: [url, ...prev.photos.filter((p) => p !== url)] }));
        setDirty(true);
    };

    const validate = () => {
        if (!form.yearsOfExperience && form.yearsOfExperience !== 0) return "Years of experience is required.";
        if (!form.experienceLevel) return "Select an experience level.";
        if (!form.availability) return "Select your availability status.";
        if (!form.designStyles.length) return "Add at least one design style.";
        if (!form.specializations.length) return "Add at least one specialization.";
        if (!form.serviceCities.length) return "Add at least one service city.";
        if (form.minBudgetHandled === "" || form.maxBudgetHandled === "") return "Set your budget range.";
        if (Number(form.minBudgetHandled) > Number(form.maxBudgetHandled)) return "Minimum budget cannot exceed maximum budget.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "muted", message: "" });

        const validationError = validate();
        if (validationError) {
            setStatus({ type: "error", message: validationError });
            return;
        }

        try {
            const payload = {
                name: form.name, phone: form.phone, countryCode: form.countryCode, country: form.country,
                state: form.state, city: form.city, address: form.address, bio: form.bio,
                yearsOfExperience: Number(form.yearsOfExperience), experienceLevel: form.experienceLevel,
                availability: form.availability, designStyles: form.designStyles, specializations: form.specializations,
                certifications: form.certifications, serviceCities: form.serviceCities, portfolioLinks: form.portfolioLinks,
                photos: form.photos, minBudgetHandled: Number(form.minBudgetHandled), maxBudgetHandled: Number(form.maxBudgetHandled),
            };

            await updateProfile(payload).unwrap();
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);
            setDirty(false);
            setSavedForm(form);
            setIsEditing(false);
        } catch (err) {
            setStatus({ type: "error", message: err?.data?.message || err?.message || "Something went wrong." });
        }
    };

    const cancelEdit = () => {
        setForm(savedForm);
        setChipDrafts({ certifications: "", serviceCities: "", portfolioLinks: "" });
        setDirty(false);
        setIsEditing(false);
        setStatus({ type: "muted", message: "" });
    };

    const renderChipField = (key, label, placeholder, required, hint) => (
        <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={`chip-${key}`} className={labelClass}>
                    {label}
                    {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
                </label>
                {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} added</span>}
            </div>
            <div className={`flex min-w-0 flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 transition ${!isEditing ? "opacity-70" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}>
                {form[key].length === 0 && !isEditing && <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not added</span>}
                {form[key].map((v) => (
                    <span key={v} className="inline-flex max-w-full items-center gap-1 rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]">
                        <span className="truncate">{v}</span>
                        {isEditing && (
                            <button type="button" onClick={() => removeChip(key, v)} aria-label={`Remove ${v}`} className="shrink-0 rounded-md p-0.5 leading-none text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">
                                ×
                            </button>
                        )}
                    </span>
                ))}
                {isEditing && (
                    <input
                        id={`chip-${key}`}
                        type="text"
                        value={chipDrafts[key]}
                        onChange={(e) => setChipDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                        onKeyDown={(e) => handleChipKeyDown(key, e)}
                        onBlur={() => addChip(key)}
                        placeholder={form[key].length ? "Add another…" : placeholder}
                        className="min-w-[120px] flex-1 border-none bg-transparent px-1.5 py-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                    />
                )}
            </div>
            {hint && isEditing && <p className="text-[11px] text-[var(--muted)]">{hint}</p>}
        </div>
    );

    const renderMultiSelectField = (key, label, options, required) => (
        <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
                <span className={labelClass}>
                    {label}
                    {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
                </span>
                {form[key].length > 0 && <span className="shrink-0 text-[10px] text-[var(--muted)]">{form[key].length} selected</span>}
            </div>
            {isEditing ? (
                <div className="flex min-w-0 flex-wrap gap-1.5" role="group" aria-label={label}>
                    {options.map((opt) => {
                        const active = form[key].includes(opt);
                        return (
                            <button
                                key={opt}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleMultiSelect(key, opt)}
                                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/12 text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-2">
                    {form[key].length === 0 ? (
                        <span className="px-1.5 py-1 text-xs text-[var(--muted)]">Not selected</span>
                    ) : (
                        form[key].map((v) => (
                            <span key={v} className="inline-flex max-w-full items-center truncate rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-2.5 py-1 text-xs font-medium text-[var(--text)]">
                                {v}
                            </span>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    if (isLoading) return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)]">
            <div className="w-full max-w-4xl animate-pulse space-y-4 p-4 sm:p-6">
                <div className="h-32 rounded-2xl bg-[var(--surface)]" />
                <div className="h-96 rounded-2xl bg-[var(--surface)]" />
            </div>
        </div>
    );

    if (isError) return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)] p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
                <p className="text-sm text-[var(--danger)]">{fetchError?.data?.message || "Couldn't load your profile."}</p>
                <button type="button" onClick={refetch} className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--gold)]">
                    Retry
                </button>
            </div>
        </div>
    );

    const statusColor = status.type === "error" ? "text-[var(--danger)]" : status.type === "success" ? "text-[var(--success)]" : "text-[var(--muted)]";
    const availMeta = AVAILABILITY_META[form.availability];

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--background-secondary)]">
            <form onSubmit={handleSubmit} className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 xl:p-10">
                        {/* HEADER */}
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <div className="relative shrink-0">
                                    {form.photos[0] ? (
                                        <img src={form.photos[0]} alt={account?.name || "Profile"} className="h-14 w-14 rounded-md border-2 border-[var(--gold)]/30 object-cover sm:h-16 sm:w-16" />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-[var(--gold)]/30 bg-[var(--gold)]/10 font-[var(--font-heading)] text-base font-semibold text-[var(--gold)] sm:h-16 sm:w-16 sm:text-lg">
                                            {initialsFromName(account?.name)}
                                        </div>
                                    )}
                                    {availMeta && <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-md border-2 border-[var(--background)] ${availMeta.dot}`} title={availMeta.label} />}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="m-0 truncate font-[var(--font-heading)] text-lg font-bold text-[var(--heading)] sm:text-xl lg:text-2xl">Profile Information</h1>
                                    <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:text-sm">Complete your profile details</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)} className="shrink-0 rounded-md border border-[var(--gold)] bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)] hover:bg-[var(--gold)]/10 sm:px-4 sm:text-xs">
                                    Edit profile
                                </button>
                            )}
                        </div>

                        {/* ACCOUNT SUMMARY STRIP */}
                        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[var(--muted)]">Email</span>
                                <span className="font-medium text-[var(--text)]">{account?.email || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[var(--muted)]">Verification</span>
                                <span className="font-medium text-[var(--text)]">{account?.verificationStatus === "VERIFIED" ? "✓ Verified" : "Pending"}</span>
                            </div>
                            {typeof account?.rating === "number" && account.totalReviews > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[var(--muted)]">Rating</span>
                                    <span className="font-medium text-[var(--text)]">★ {account.rating.toFixed(1)} <span className="text-[var(--muted)]">({account.totalReviews})</span></span>
                                </div>
                            )}
                        </div>

                        {/* MAIN LAYOUT: fields first on mobile, photo sidebar sits left on large screens */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
                            {/* SIDEBAR — PORTFOLIO PHOTOS */}
                            <div className="order-2 min-w-0 lg:order-1">
                                <div className={`${sectionCardClass} lg:sticky lg:top-0`}>
                                    <div className="mb-3 flex items-baseline justify-between">
                                        <h2 className={sectionTitleClass}>Portfolio photos</h2>
                                        <span className="text-[10px] text-[var(--muted)]">{form.photos.length} photo{form.photos.length === 1 ? "" : "s"}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                                        {form.photos.map((url, idx) => (
                                            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
                                                <img src={url} alt="Portfolio" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                                                {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-[var(--gold)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--background)]">Cover</span>}
                                                {isEditing && (
                                                    <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100">
                                                        {idx !== 0 && (
                                                            <button type="button" onClick={() => reorderPhotoToFront(url)} aria-label="Set as cover photo" className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-[10px] text-white">
                                                                ★
                                                            </button>
                                                        )}
                                                        <button type="button" onClick={() => removePhoto(url)} aria-label="Remove photo" className="flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-xs text-white">
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {Array.from({ length: uploadingCount }).map((_, i) => (
                                            <div key={`uploading-${i}`} className="flex aspect-square animate-pulse items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
                                                <span className="text-[10px] text-[var(--muted)]">↑</span>
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--border)] text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
                                                <span className="text-lg leading-none">+</span>
                                            </button>
                                        )}
                                        {form.photos.length === 0 && uploadingCount === 0 && !isEditing && (
                                            <div className="col-span-full flex aspect-[3/1] items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
                                                No photos added
                                            </div>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handlePhotoSelect} disabled={!isEditing} />
                                </div>
                            </div>

                            {/* MAIN COLUMN — FORM FIELDS */}
                            <div className="order-1 flex min-w-0 flex-col gap-5 lg:order-2">
                                {/* BASIC INFO */}
                                <div className={sectionCardClass}>
                                    <h2 className={sectionTitleClass}>Basic information</h2>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="name" className={labelClass}>Full name<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <input id="name" type="text" value={form.name} disabled={!isEditing} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="phone" className={labelClass}>Phone<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <div className="flex min-w-0 gap-2">
                                                <input type="text" aria-label="Country code" value={form.countryCode} disabled={!isEditing} onChange={(e) => updateField("countryCode", e.target.value)} className={`${inputClass} w-16 shrink-0 text-center`} />
                                                <input id="phone" type="tel" value={form.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} className={`${inputClass} min-w-0 flex-1`} />
                                            </div>
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="address" className={labelClass}>Address</label>
                                            <input id="address" type="text" value={form.address} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="city" className={labelClass}>City</label>
                                            <input id="city" type="text" value={form.city} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="state" className={labelClass}>State</label>
                                            <input id="state" type="text" value={form.state} disabled={!isEditing} placeholder="N/A" onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="country" className={labelClass}>Country</label>
                                            <input id="country" type="text" value={form.country} disabled={!isEditing} placeholder="India" onChange={(e) => updateField("country", e.target.value)} className={inputClass} />
                                        </div>
                                    </div>

                                    {/* BIO */}
                                    <div className="mt-4 flex min-w-0 flex-col gap-1">
                                        <div className="flex items-baseline justify-between">
                                            <label htmlFor="bio" className={labelClass}>Bio</label>
                                            <span className="text-[10px] text-[var(--muted)]">{form.bio.length}/1000</span>
                                        </div>
                                        <textarea id="bio" value={form.bio} maxLength={1000} disabled={!isEditing} placeholder="Tell clients about your style…" onChange={(e) => updateField("bio", e.target.value)} className={`${areaClass} min-h-24`} />
                                    </div>
                                </div>

                                {/* PROFESSIONAL */}
                                <div className={sectionCardClass}>
                                    <h2 className={sectionTitleClass}>Professional details</h2>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="years" className={labelClass}>Years of experience<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <input id="years" type="number" min="0" max="80" value={form.yearsOfExperience} disabled={!isEditing} onChange={(e) => updateField("yearsOfExperience", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="level" className={labelClass}>Experience level<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <select id="level" value={form.experienceLevel} disabled={!isEditing} onChange={(e) => updateField("experienceLevel", e.target.value)} className={inputClass}>
                                                <option value="">Select</option>
                                                {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="availability" className={labelClass}>Availability<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <select id="availability" value={form.availability} disabled={!isEditing} onChange={(e) => updateField("availability", e.target.value)} className={inputClass}>
                                                <option value="">Select</option>
                                                {AVAILABILITY_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="minBudget" className={labelClass}>Min budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <input id="minBudget" type="number" min="0" value={form.minBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("minBudgetHandled", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <label htmlFor="maxBudget" className={labelClass}>Max budget (₹)<span className="ml-0.5 text-[var(--danger)]">*</span></label>
                                            <input id="maxBudget" type="number" min="0" value={form.maxBudgetHandled} disabled={!isEditing} placeholder="0" onChange={(e) => updateField("maxBudgetHandled", e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>

                                {/* SPECIALTIES */}
                                <div className={sectionCardClass}>
                                    <h2 className={sectionTitleClass}>Specialties</h2>
                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                        {renderMultiSelectField("designStyles", "Design styles", STYLE_OPTIONS, true)}
                                        {renderMultiSelectField("specializations", "Specializations", SPECIALIZATION_OPTIONS, true)}
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                                        {renderChipField("certifications", "Certifications", "e.g. NCIDQ", false)}
                                        {renderChipField("serviceCities", "Service cities", "e.g. Hyderabad", true)}
                                        {renderChipField("portfolioLinks", "Portfolio links", "https://example.com", false, "Must start with http:// or https://")}
                                    </div>
                                </div>

                                {/* STATUS MESSAGE (view mode) */}
                                {!isEditing && status.message && (
                                    <p className={`text-xs font-medium ${statusColor}`}>{status.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STICKY SAVE BAR — only visible in edit mode, inside the form for a valid native submit */}
                {isEditing && (
                    <div className="flex w-full shrink-0 justify-center border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 sm:px-6">
                        <div className="flex w-full max-w-[1400px] min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className={`text-xs font-medium ${statusColor}`}>
                                {status.message || (dirty ? "Unsaved changes" : "No changes")}
                            </p>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={cancelEdit} disabled={saving || uploadingCount > 0} className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[11px] font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving || uploadingCount > 0} className="rounded-md bg-[var(--gold)] px-5 py-2 text-[11px] font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs">
                                    {saving ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-6 text-center shadow-2xl sm:p-8">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 sm:h-16 sm:w-16">
                            <span className="text-2xl sm:text-3xl">✓</span>
                        </div>
                        <h2 className="m-0 text-xl font-bold text-[var(--heading)] sm:text-2xl">Profile Updated!</h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">Your changes have been saved successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
}