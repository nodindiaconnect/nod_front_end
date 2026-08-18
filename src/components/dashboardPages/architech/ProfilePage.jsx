import React, { useRef, useEffect, useState } from "react";
import { uploadFile } from "../../../../superBase";
import {
  useGetDesignerProfileQuery,
  useUpdateDesignerProfileMutation,
} from "./dashboard/ArchitechDashboardApiSlice";
import "../../../theme.css";

const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
const STYLE_OPTIONS = [
  "Modern",
  "Minimalist",
  "Luxury",
  "Scandinavian",
  "Industrial",
  "Eclectic",
];
const SPECIALIZATION_OPTIONS = [
  "Interior Designer",
  "Exterior Designer",
  "AutoCAD Designer",
  "BIM designer",
  "vastu consultant",
  "product designer",
  "Structural Designer",
  "Landscape Designer",
  "3D Visualizer",
];

const AVAILABILITY_META = {
  AVAILABLE: { dot: "bg-emerald-500", label: "Available" },
  BUSY: { dot: "bg-amber-500", label: "Busy" },
  UNAVAILABLE: { dot: "bg-rose-500", label: "Unavailable" },
};

const inputClass =
  "w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-70";
const areaClass =
  "w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none";
const labelClass = "text-xs font-semibold text-[var(--text)]";
const groupTitleClass =
  "font-[var(--font-heading)] text-sm font-bold text-[var(--heading)] sm:text-base";

const emptyForm = {
  name: "",
  phone: "",
  countryCode: "+91",
  country: "",
  state: "",
  city: "",
  address: "",
  bio: "",
  yearsOfExperience: "",
  experienceLevel: "",
  availability: "",
  designStyles: [],
  specializations: [],
  certifications: [],
  serviceCities: [],
  portfolioLinks: [],
  photos: [],
  minBudgetHandled: "",
  maxBudgetHandled: "",
};

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const {
    data: profileRes,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetDesignerProfileQuery();
  const [updateProfile, { isLoading: saving }] =
    useUpdateDesignerProfileMutation();

  const [status, setStatus] = useState({ type: "muted", message: "" });
  const [uploadingCount, setUploadingCount] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [savedForm, setSavedForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chipDrafts, setChipDrafts] = useState({
    certifications: "",
    serviceCities: "",
    portfolioLinks: "",
  });

  useEffect(() => {
    if (!profileRes || hydrated) return;
    const data = profileRes.data || profileRes.result || profileRes;
    setAccount({
      name: data.name,
      email: data.email,
      verificationStatus: data.verificationStatus,
      rating: data.rating,
      totalReviews: data.totalReviews,
    });
    const hydratedForm = {
      name: data.name || "",
      phone: data.phone || "",
      countryCode: data.countryCode || "+91",
      country: data.country || "",
      state: data.state || "",
      city: data.city || "",
      address: data.address || "",
      bio: data.bio || "",
      yearsOfExperience: data.yearsOfExperience ?? "",
      experienceLevel: data.experienceLevel || "",
      availability: data.availability || "",
      designStyles: data.designStyles || [],
      specializations: data.specializations || [],
      certifications: data.certifications || [],
      serviceCities: data.serviceCities || [],
      portfolioLinks: data.portfolioLinks || [],
      photos: data.photos || [],
      minBudgetHandled: data.minBudgetHandled ?? "",
      maxBudgetHandled: data.maxBudgetHandled ?? "",
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
      const next = prev[key].includes(option)
        ? prev[key].filter((v) => v !== option)
        : [...prev[key], option];
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
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((c) => c !== chip),
    }));
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

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarUploading(true);
    try {
      const response = await uploadFile(file, "designers", "profile-photos");
      if (response.publicUrl) {
        setForm((prev) => ({ ...prev, photos: [response.publicUrl] }));
        setDirty(true);
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: `Photo upload failed: ${err.message}`,
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  const removeAvatar = () => {
    setForm((prev) => ({ ...prev, photos: [] }));
    setDirty(true);
  };

  const validate = () => {
    if (!form.yearsOfExperience && form.yearsOfExperience !== 0)
      return "Years of experience is required.";
    if (!form.experienceLevel) return "Select an experience level.";
    if (!form.availability) return "Select your availability status.";
    if (!form.designStyles.length) return "Add at least one design style.";
    if (!form.specializations.length) return "Add at least one specialization.";
    if (!form.serviceCities.length) return "Add at least one service city.";
    if (form.minBudgetHandled === "" || form.maxBudgetHandled === "")
      return "Set your budget range.";
    if (Number(form.minBudgetHandled) > Number(form.maxBudgetHandled))
      return "Minimum budget cannot exceed maximum budget.";
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
        name: form.name,
        phone: form.phone,
        countryCode: form.countryCode,
        country: form.country,
        state: form.state,
        city: form.city,
        address: form.address,
        bio: form.bio,
        yearsOfExperience: Number(form.yearsOfExperience),
        experienceLevel: form.experienceLevel,
        availability: form.availability,
        designStyles: form.designStyles,
        specializations: form.specializations,
        certifications: form.certifications,
        serviceCities: form.serviceCities,
        portfolioLinks: form.portfolioLinks,
        photos: form.photos,
        minBudgetHandled: Number(form.minBudgetHandled),
        maxBudgetHandled: Number(form.maxBudgetHandled),
      };
      await updateProfile(payload).unwrap();
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      setDirty(false);
      setSavedForm(form);
      setIsEditing(false);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.data?.message || err?.message || "Something went wrong.",
      });
    }
  };

  const cancelEdit = () => {
    setForm(savedForm);
    setChipDrafts({
      certifications: "",
      serviceCities: "",
      portfolioLinks: "",
    });
    setDirty(false);
    setIsEditing(false);
    setStatus({ type: "muted", message: "" });
  };

  const renderChipField = (key, label, placeholder, required, hint) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={`chip-${key}`} className={labelClass}>
          {label}
          {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
        </label>
        {form[key].length > 0 && (
          <span className="shrink-0 text-[10px] text-[var(--muted)]">
            {form[key].length} added
          </span>
        )}
      </div>
      <div
        className={`flex min-w-0 flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 transition ${!isEditing ? "opacity-70" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}
      >
        {form[key].length === 0 && !isEditing && (
          <span className="px-1.5 py-1 text-xs text-[var(--muted)]">
            Not added
          </span>
        )}
        {form[key].map((v) => (
          <span
            key={v}
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]"
          >
            <span className="truncate">{v}</span>
            {isEditing && (
              <button
                type="button"
                onClick={() => removeChip(key, v)}
                aria-label={`Remove ${v}`}
                className="shrink-0 rounded-md p-0.5 leading-none text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
              >
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
            onChange={(e) =>
              setChipDrafts((prev) => ({ ...prev, [key]: e.target.value }))
            }
            onKeyDown={(e) => handleChipKeyDown(key, e)}
            onBlur={() => addChip(key)}
            placeholder={form[key].length ? "Add another…" : placeholder}
            className="min-w-[120px] flex-1 border-none bg-transparent px-1.5 py-1 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
          />
        )}
      </div>
      {hint && isEditing && (
        <p className="text-[11px] text-[var(--muted)]">{hint}</p>
      )}
    </div>
  );

  const renderMultiSelectField = (key, label, options, required) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className={labelClass}>
          {label}
          {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
        </span>
        {form[key].length > 0 && (
          <span className="shrink-0 text-[10px] text-[var(--muted)]">
            {form[key].length} selected
          </span>
        )}
      </div>
      {isEditing ? (
        <div
          className="flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5"
          role="group"
          aria-label={label}
        >
          {options.map((opt) => {
            const active = form[key].includes(opt);
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={active}
                onClick={() => toggleMultiSelect(key, opt)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/12 text-[var(--text)]" : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex min-w-0 flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-2.5">
          {form[key].length === 0 ? (
            <span className="px-1.5 py-1 text-xs text-[var(--muted)]">
              Not selected
            </span>
          ) : (
            form[key].map((v) => (
              <span
                key={v}
                className="inline-flex max-w-full items-center truncate rounded-md border border-[var(--gold)]/25 bg-[var(--gold)]/8 px-2.5 py-1 text-xs font-medium text-[var(--text)]"
              >
                {v}
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)]">
        <div className="w-full animate-pulse space-y-0">
          <div className="h-32 bg-[var(--surface)]" />
          <div className="h-96 bg-[var(--surface)]" />
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--background-secondary)] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6 text-center">
          <p className="text-sm text-[var(--danger)]">
            {fetchError?.data?.message || "Couldn't load your profile."}
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--gold)]"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const statusColor =
    status.type === "error"
      ? "text-[var(--danger)]"
      : status.type === "success"
        ? "text-[var(--success)]"
        : "text-[var(--muted)]";
  const availMeta = AVAILABILITY_META[form.availability];
  const avatarUrl = form.photos[0];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--background)]">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 w-full flex-1 overflow-y-auto">
          {/* HEADER STRIP — no outer margin/padding, edge to edge */}
          <div className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <div className="group relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={account?.name || "Profile"}
                    className="h-20 w-20 rounded-full border-2 border-[var(--gold)]/30 object-cover sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--background-secondary)] sm:h-24 sm:w-24">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-8 w-8 text-[var(--muted)]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75a3 3 0 013-3h1.372c.516 0 1.014-.184 1.406-.518l.928-.796c.392-.334.89-.518 1.406-.518h2.276c.516 0 1.014.184 1.406.518l.928.796c.392.334.89.518 1.406.518H19.5a3 3 0 013 3v2.25a3 3 0 01-3 3h-15a3 3 0 01-3-3v-2.25z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12V9.75A2.25 2.25 0 019 7.5h1.5m3 0H15a2.25 2.25 0 012.25 2.25V12"
                      />
                      <circle cx="12" cy="16.5" r="2.25" />
                    </svg>
                  </div>
                )}
                {availMeta && (
                  <span
                    className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-[var(--background)] ${availMeta.dot}`}
                    title={availMeta.label}
                  />
                )}
                {isEditing && (
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/0 text-white opacity-0 transition group-hover:bg-black/45 group-hover:opacity-100">
                    {avatarUploading ? (
                      <span className="text-[10px] font-semibold">
                        Uploading…
                      </span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.174C3.05 7.514 2.25 8.454 2.25 9.549v8.201c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875V9.549c0-1.095-.8-2.035-1.802-2.145a48.11 48.11 0 00-1.134-.174 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-4.132 0 2.192 2.192 0 00-1.736 1.039l-.822 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                        />
                      </svg>
                    )}
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarSelect}
                      disabled={avatarUploading}
                    />
                  </label>
                )}
                {isEditing && avatarUrl && !avatarUploading && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    aria-label="Remove photo"
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--danger)] shadow-sm hover:bg-[var(--danger)]/10"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="m-0 truncate font-[var(--font-heading)] text-xl font-bold text-[var(--heading)] sm:text-2xl">
                  Profile Information
                </h1>
                <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:text-sm">
                  Complete your profile details
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="shrink-0 rounded-md border border-[var(--gold)] bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)] hover:bg-[var(--gold)]/10 sm:text-xs"
              >
                Edit profile
              </button>
            )}
          </div>

          {/* ACCOUNT SUMMARY STRIP */}
          <div className="flex w-full flex-wrap gap-x-6 gap-y-2 border-b border-[var(--border)] bg-[var(--background-secondary)] px-5 py-3 text-xs sm:px-8">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--muted)]">Email</span>
              <span className="font-medium text-[var(--text)]">
                {account?.email || "—"}
              </span>
            </div>
           
            {typeof account?.rating === "number" &&
              account.totalReviews > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--muted)]">Rating</span>
                  <span className="font-medium text-[var(--text)]">
                    ★ {account.rating.toFixed(1)}{" "}
                    <span className="text-[var(--muted)]">
                      ({account.totalReviews})
                    </span>
                  </span>
                </div>
              )}
          </div>

          {/* BODY */}
          <div className="w-full px-5 py-6 sm:px-8">
            <div className="flex w-full flex-col divide-y divide-[var(--border)]">
              {/* BASIC INFORMATION */}
              <div className="w-full pb-6">
                <h2 className={`${groupTitleClass} mb-4`}>Basic information</h2>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="name" className={labelClass}>
                      Full name
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      disabled={!isEditing}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="phone" className={labelClass}>
                      Phone
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    {/* <div className="flex min-w-0 gap-2">
                                            <input type="text" aria-label="Country code" value={form.countryCode} disabled={!isEditing} onChange={(e) => updateField("countryCode", e.target.value)} className={`${inputClass} w-16 shrink-0 text-center`} />
                                            <input id="phone" type="tel" value={form.phone} disabled={!isEditing} onChange={(e) => updateField("phone", e.target.value)} className={`${inputClass} min-w-0 flex-1`} />
                                        </div> */}

                    <div className="flex min-w-0 gap-2">
                      <input
                        type="text"
                        aria-label="Country code"
                        value={form.countryCode}
                        disabled={!isEditing}
                        onChange={(e) =>
                          updateField("countryCode", e.target.value)
                        }
                        className={`${inputClass} w-0 flex-[3] text-center`}
                      />

                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        disabled={!isEditing}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={`${inputClass} w-0 min-w-0 flex-[7]`}
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="address" className={labelClass}>
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={form.address}
                      disabled={!isEditing}
                      placeholder="N/A"
                      onChange={(e) => updateField("address", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="city" className={labelClass}>
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      disabled={!isEditing}
                      placeholder="N/A"
                      onChange={(e) => updateField("city", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="state" className={labelClass}>
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={form.state}
                      disabled={!isEditing}
                      placeholder="N/A"
                      onChange={(e) => updateField("state", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="country" className={labelClass}>
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={form.country}
                      disabled={!isEditing}
                      placeholder="India"
                      onChange={(e) => updateField("country", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-4 flex w-full min-w-0 flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="bio" className={labelClass}>
                      Bio
                    </label>
                    <span className="text-[10px] text-[var(--muted)]">
                      {form.bio.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    value={form.bio}
                    maxLength={1000}
                    disabled={!isEditing}
                    placeholder="Tell clients about your style…"
                    onChange={(e) => updateField("bio", e.target.value)}
                    className={`${areaClass} min-h-24 w-full`}
                  />
                </div>
              </div>

              {/* PROFESSIONAL DETAILS */}
              <div className="w-full py-6">
                <h2 className={`${groupTitleClass} mb-4`}>
                  Professional details
                </h2>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="years" className={labelClass}>
                      Years of experience
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <input
                      id="years"
                      type="number"
                      min="0"
                      max="80"
                      value={form.yearsOfExperience}
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateField("yearsOfExperience", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="level" className={labelClass}>
                      Experience level
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <select
                      id="level"
                      value={form.experienceLevel}
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateField("experienceLevel", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="availability" className={labelClass}>
                      Availability
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <select
                      id="availability"
                      value={form.availability}
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateField("availability", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {AVAILABILITY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="minBudget" className={labelClass}>
                      Min budget (₹)
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <input
                      id="minBudget"
                      type="number"
                      min="0"
                      value={form.minBudgetHandled}
                      disabled={!isEditing}
                      placeholder="0"
                      onChange={(e) =>
                        updateField("minBudgetHandled", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <label htmlFor="maxBudget" className={labelClass}>
                      Max budget (₹)
                      <span className="ml-0.5 text-[var(--danger)]">*</span>
                    </label>
                    <input
                      id="maxBudget"
                      type="number"
                      min="0"
                      value={form.maxBudgetHandled}
                      disabled={!isEditing}
                      placeholder="0"
                      onChange={(e) =>
                        updateField("maxBudgetHandled", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* SPECIALTIES */}
              <div className="w-full pt-6">
                <h2 className={`${groupTitleClass} mb-4`}>Specialties</h2>
                <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
                  {renderMultiSelectField(
                    "designStyles",
                    "Design styles",
                    STYLE_OPTIONS,
                    true,
                  )}
                  {renderMultiSelectField(
                    "specializations",
                    "Specializations",
                    SPECIALIZATION_OPTIONS,
                    true,
                  )}
                </div>
                <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                  {renderChipField(
                    "certifications",
                    "Certifications",
                    "e.g. NCIDQ",
                    false,
                  )}
                  {renderChipField(
                    "serviceCities",
                    "Service cities",
                    "e.g. Hyderabad",
                    true,
                  )}
                  {renderChipField(
                    "portfolioLinks",
                    "Portfolio links",
                    "https://example.com",
                    false,
                    "Must start with http:// or https://",
                  )}
                </div>
              </div>
            </div>

            {!isEditing && status.message && (
              <p className={`mt-6 text-xs font-medium ${statusColor}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex w-full shrink-0 justify-center border-t border-[var(--border)] bg-[var(--background)] px-5 py-3 sm:px-8">
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-xs font-medium ${statusColor}`}>
                {status.message || (dirty ? "Unsaved changes" : "No changes")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving || avatarUploading}
                  className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[11px] font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || avatarUploading}
                  className="rounded-md bg-[var(--gold)] px-5 py-2 text-[11px] font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 sm:h-16 sm:w-16">
              <span className="text-2xl sm:text-3xl">✓</span>
            </div>
            <h2 className="m-0 text-xl font-bold text-[var(--heading)] sm:text-2xl">
              Profile Updated!
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your changes have been saved successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
