import { useRef, useEffect, useState } from "react";
import { uploadFile } from "../../../../superBase";
import {
  useGetArchitectProfileQuery,
  useUpdateArchitectProfileMutation,
} from "./dashboard/ArchitechDashboardApiSlice";
import "../../../theme.css";

const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];
const SPECIALIZATION_LEVELS = ["Beginner", "Intermediate", "Professional"];
const AVAILABILITY_STATUSES = ["AVAILABLE", "BUSY", "UNAVAILABLE"];
const SPECIALIZATION_OPTIONS = [
  "Residential Architecture",
  "Commercial Architecture",
  "Landscape Architecture",
  "Sustainable Architecture",
  "Urban Planning",
  "Heritage Restoration",
  "Interior Architecture",
  "3D BIM Modeling",
  "Industrial Architecture",
  "Structural Planning",
];

const AVAILABILITY_META = {
  AVAILABLE: { dot: "bg-[var(--success)]", label: "Available" },
  BUSY: { dot: "bg-[var(--warning)]", label: "Busy" },
  UNAVAILABLE: { dot: "bg-[var(--danger)]", label: "Unavailable" },
};

/* ---------------------------------------------------------------------- */
/* Shared style tokens                                                     */
/* ---------------------------------------------------------------------- */

const inputClass =
  "w-full min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-80 disabled:text-[var(--text)]";
const selectClass = `${inputClass} appearance-none pr-9 disabled:appearance-none`;
const areaClass =
  "w-full min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] resize-none disabled:opacity-80";
const labelClass = "text-xs font-medium text-[var(--muted)]";

const cardClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 sm:p-6";

const sectionHeaderClass = "mb-5 flex items-center gap-3";
const sectionIconWrapClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/12 text-[var(--gold)]";
const sectionTitleClass =
  "font-[var(--font-heading)] text-[15px] font-bold text-[var(--heading)] sm:text-base";
const sectionAccentClass = "h-4 w-[3px] rounded-full bg-[var(--gold)]";

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
  specializationLevel: "",
  availability: "",
  specializations: [],
  licenseNumber: "",
  licenseIssuingBody: "",
  certifications: [],
  serviceCities: [],
  portfolioLinks: [],
  photos: [],
  minBudgetHandled: "",
  maxBudgetHandled: "",
};

/* ---------------------------------------------------------------------- */
/* Small inline icons (no new icon library — plain outline SVGs)           */
/* ---------------------------------------------------------------------- */

const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.1a2 2 0 01-2 2H5.75a2 2 0 01-2-2v-4.1M20.25 14.15a2 2 0 00-.998-1.73L18 11.5m2.25 2.65L14.4 10.5m-9.65 3.65a2 2 0 00.998-1.73L7 11.5m-2.25 2.65L9.6 10.5M9 8V6.75A1.75 1.75 0 0110.75 5h2.5A1.75 1.75 0 0115 6.75V8m-6 0h6m-6 0H3.75v3.5L12 15.5l8.25-4V8H15" />
  </svg>
);

const StarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.98 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M22.5 7.5l-9.816 6.545a1.5 1.5 0 01-1.664 0L1.5 7.5" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const SectionHeader = ({ icon, title }) => (
  <div className={sectionHeaderClass}>
    <div className={sectionIconWrapClass}>{icon}</div>
    <div className="flex items-center gap-2">
      <div className={sectionAccentClass} />
      <h2 className={sectionTitleClass}>{title}</h2>
    </div>
  </div>
);

export default function ProfilePage() {
  const avatarInputRef = useRef(null);
  const {
    data: profileRes,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetArchitectProfileQuery();
  const [updateProfile, { isLoading: saving }] =
    useUpdateArchitectProfileMutation();

  const [status, setStatus] = useState({ type: "muted", message: "" });
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
      specializationLevel: data.specializationLevel || data.level || "",
      availability: data.availability || "",
      specializations: data.specializations || [],
      licenseNumber: data.licenseNumber || "",
      licenseIssuingBody: data.licenseIssuingBody || "",
      certifications: data.certifications || [],
      serviceCities: data.serviceCities || [],
      portfolioLinks: data.portfolioLinks || [],
      photos:
        Array.isArray(data.photos) && data.photos.length > 0
          ? data.photos
          : data.profileImageUrl
          ? [data.profileImageUrl]
          : data.profile
          ? [data.profile]
          : [],
      minBudgetHandled: data.minBudgetHandled ?? "",
      maxBudgetHandled: data.maxBudgetHandled ?? "",
    };
    setForm(hydratedForm);
    setSavedForm(hydratedForm);
    setHydrated(true);
  }, [profileRes, hydrated]);

  const updateField = (key, value) => {
    if (key === "bio" && /\d/.test(value)) {
      setStatus({ type: "error", message: "Bio cannot contain numbers." });
      return;
    }
    if (key === "bio" && status.message === "Bio cannot contain numbers.") {
      setStatus({ type: "muted", message: "" });
    }
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
    if (!form.specializations.length) return "Add at least one architectural specialization.";
    if (!form.serviceCities.length) return "Add at least one service city.";
    if (form.minBudgetHandled === "" || form.maxBudgetHandled === "")
      return "Set your budget range.";
    if (form.bio && /\d/.test(form.bio))
      return "Bio cannot contain numbers.";
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
        specializationLevel: form.specializationLevel,
        availability: form.availability,
        specializations: form.specializations,
        licenseNumber: form.licenseNumber,
        licenseIssuingBody: form.licenseIssuingBody,
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
        className={`flex min-w-0 flex-wrap items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5 transition ${!isEditing ? "opacity-90" : "focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--gold)]/20"}`}
      >
        {form[key].length === 0 && !isEditing && (
          <span className="px-1.5 py-1 text-xs text-[var(--muted)]">
            Not added
          </span>
        )}
        {form[key].map((v) => (
          <span
            key={v}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/12 py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--text)]"
          >
            <span className="truncate">{v}</span>
            {isEditing && (
              <button
                type="button"
                onClick={() => removeChip(key, v)}
                aria-label={`Remove ${v}`}
                className="shrink-0 rounded-full p-0.5 leading-none text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
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
          className="flex min-w-0 flex-wrap gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5"
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
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--gold)]/50"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex min-w-0 flex-wrap gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5">
          {form[key].length === 0 ? (
            <span className="px-1.5 py-1 text-xs text-[var(--muted)]">
              Not selected
            </span>
          ) : (
            form[key].map((v) => (
              <span
                key={v}
                className="inline-flex max-w-full items-center truncate rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/12 px-2.5 py-1 text-xs font-medium text-[var(--text)]"
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
        <div className="w-full animate-pulse space-y-4 p-6">
          <div className="h-28 rounded-2xl bg-[var(--surface)]" />
          <div className="h-64 rounded-2xl bg-[var(--surface)]" />
          <div className="h-40 rounded-2xl bg-[var(--surface)]" />
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
    <div className="profile-page flex h-full w-full flex-col overflow-hidden bg-[var(--background-secondary)]">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 w-full flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            {/* ---------------------------------------------------------- */}
            {/* PROFILE HEADER CARD                                        */}
            {/* ---------------------------------------------------------- */}
            <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div className="flex w-full flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="group relative shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={account?.name || "Profile"}
                        className="h-[76px] w-[76px] rounded-full border-2 border-[var(--gold)]/30 object-cover"
                      />
                    ) : (
                      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-dashed border-[var(--border)] bg-[var(--background-secondary)]">
                        <UserIcon className="h-7 w-7 text-[var(--muted)]" />
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-[var(--surface)] ${availMeta ? availMeta.dot : "bg-[var(--success)]"}`}
                      title={availMeta ? availMeta.label : "Active"}
                    />
                    {isEditing && (
                      <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full text-[var(--background)] opacity-0 transition group-hover:bg-[var(--heading)]/70 group-hover:opacity-100">
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
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--danger)] shadow-sm hover:bg-[var(--danger)]/10"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="m-0 truncate font-[var(--font-heading)] text-lg font-bold text-[var(--heading)] sm:text-xl">
                      Profile Information
                    </h1>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:text-sm">
                      Complete your profile details to get discovered by more clients.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
                  disabled={isEditing && (saving || avatarUploading)}
                  className="shrink-0 rounded-lg border border-[var(--gold)] bg-[var(--surface)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)] transition hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs"
                >
                  {isEditing ? "Cancel" : "Edit profile"}
                </button>
              </div>

              {/* EMAIL ROW */}
              <div className="flex w-full items-center gap-2 border-t border-[var(--border)] bg-[var(--background-secondary)] px-5 py-3 sm:px-6">
                <MailIcon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                <span className="truncate text-xs text-[var(--text)] sm:text-sm">
                  {account?.email || "—"}
                </span>
                {typeof account?.rating === "number" && account.totalReviews > 0 && (
                  <span className="ml-auto shrink-0 text-xs text-[var(--muted)]">
                    ★ {account.rating.toFixed(1)} ({account.totalReviews})
                  </span>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* BASIC INFORMATION CARD                                     */}
            {/* ---------------------------------------------------------- */}
            <div className={cardClass}>
              <SectionHeader icon={<UserIcon className="h-4.5 w-4.5" />} title="Basic information" />

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div className="flex min-w-0 gap-2">
                    <input
                      type="text"
                      aria-label="Country code"
                      value={form.countryCode}
                      disabled={!isEditing}
                      onChange={(e) => updateField("countryCode", e.target.value)}
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

            {/* ---------------------------------------------------------- */}
            {/* PROFESSIONAL DETAILS CARD                                  */}
            {/* ---------------------------------------------------------- */}
            <div className={cardClass}>
              <SectionHeader icon={<BriefcaseIcon className="h-4.5 w-4.5" />} title="Professional details" />

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
                    onChange={(e) => updateField("yearsOfExperience", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="level" className={labelClass}>
                    Experience level
                    <span className="ml-0.5 text-[var(--danger)]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="level"
                      value={form.experienceLevel}
                      disabled={!isEditing}
                      onChange={(e) => updateField("experienceLevel", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select</option>
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="availability" className={labelClass}>
                    Availability
                    <span className="ml-0.5 text-[var(--danger)]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="availability"
                      value={form.availability}
                      disabled={!isEditing}
                      onChange={(e) => updateField("availability", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select</option>
                      {AVAILABILITY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
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
                    onChange={(e) => updateField("minBudgetHandled", e.target.value)}
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
                    onChange={(e) => updateField("maxBudgetHandled", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* SPECIALTIES CARD                                           */}
            {/* ---------------------------------------------------------- */}
            <div className={cardClass}>
              <SectionHeader icon={<StarIcon className="h-4.5 w-4.5" />} title="Specialties & Licensing" />

              <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
                {renderMultiSelectField("specializations", "Architectural Specializations", SPECIALIZATION_OPTIONS, true)}

                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="specializationLevel" className={labelClass}>
                    Specialization Level
                  </label>
                  <div className="relative">
                    <select
                      id="specializationLevel"
                      value={form.specializationLevel || ""}
                      disabled={!isEditing}
                      onChange={(e) => updateField("specializationLevel", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select Specialization Level</option>
                      {SPECIALIZATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1">
                    Available levels: Beginner, Intermediate, Professional. Used for client discovery and project matching.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="licenseNumber" className={labelClass}>
                    License / CoA registration number
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    value={form.licenseNumber}
                    disabled={!isEditing}
                    placeholder="e.g. CA/2022/12345"
                    onChange={(e) => updateField("licenseNumber", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="licenseIssuingBody" className={labelClass}>
                    Issuing authority / council
                  </label>
                  <input
                    id="licenseIssuingBody"
                    type="text"
                    value={form.licenseIssuingBody}
                    disabled={!isEditing}
                    placeholder="e.g. Council of Architecture, India"
                    onChange={(e) => updateField("licenseIssuingBody", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
                {renderChipField("certifications", "Certifications", "e.g. LEED AP, GRIHA", false)}
                {renderChipField("serviceCities", "Service cities", "e.g. Hyderabad", true)}
                {renderChipField(
                  "portfolioLinks",
                  "Portfolio links",
                  "https://example.com",
                  false,
                  "Must start with http:// or https://",
                )}
              </div>
            </div>

            {!isEditing && status.message && (
              <p className={`text-xs font-medium ${statusColor}`}>{status.message}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex w-full shrink-0 justify-center border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 sm:px-8">
            <div className="flex w-full max-w-6xl min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-xs font-medium ${statusColor}`}>
                {status.message || (dirty ? "Unsaved changes" : "No changes")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving || avatarUploading}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] font-semibold uppercase text-[var(--text)] hover:border-[var(--danger)]/50 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || avatarUploading}
                  className="rounded-lg bg-[var(--gold)] px-5 py-2 text-[11px] font-semibold uppercase text-[var(--background)] hover:bg-[var(--gold)]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--heading)]/70 p-4 backdrop-blur-sm">
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

