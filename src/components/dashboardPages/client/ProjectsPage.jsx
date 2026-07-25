
import React, { useState, useRef } from "react";
import {
    useCreateProjectMutation,
    useListProjectsQuery,
} from "./Dashboard/overpageApiSlice";
import Table, { ExpandableCell } from "../../../global/Table";
import supabase, { uploadFile } from "../../../../superBase"; // adjust path to wherever supabaseClient.js lives
import {
    Plus,
    Upload,
    AlertCircle,
    CheckCircle,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    FileText,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
    RotateCcw,
    Image as ImageIcon,
    Video as VideoIcon,
    Users,
    MessageCircle,
    Tag,
    Home,
    Ruler,
    Layers,
    BedDouble,
    Bath,
    Palette,
    Sofa,
    Heart,
    AlertTriangle,
    UserCheck,
    Clock,
    Wallet,
    Flag,
    StickyNote,
    FolderKanban
} from "lucide-react";
import Loader from "../../../global/Loader";



// Brand color used for primary buttons / accents
const BRAND = "#3a2418";
const BRAND_HOVER = "#2c1a11";

// Enum values matching backend (used only for rendering options — backend validates them)
const ENUMS = {
    category: ["RESIDENTIAL", "COMMERCIAL", "OFFICE", "VILLA", "APARTMENT"],
    servicesRequired: ["ARCHITECT", "INTERIOR_DESIGNER", "CONTRACTOR"],
    propertyStatus: ["NEW_CONSTRUCTION", "RENOVATION", "REMODELING"],
    designStyle: [
        "MODERN",
        "MINIMALIST",
        "LUXURY",
        "CONTEMPORARY",
        "TRADITIONAL",
        "SCANDINAVIAN",
    ],
    spaceRequirements: [
        "MODULAR_KITCHEN",
        "WARDROBES",
        "FALSE_CEILING",
        "TV_UNIT",
        "LIGHTING",
        "FURNITURE",
    ],
    clientInvolvement: [
        "HANDS_OFF",
        "OCCASIONAL_CHECK_INS",
        "ACTIVELY_INVOLVED",
    ],
    priority: ["URGENT", "NORMAL", "FLEXIBLE"],
    preferredCommunication: ["CHAT", "PHONE", "VIDEO_CALL"],
};

const FILE_FIELDS = [
    { key: "floorPlan", label: "Floor Plan", accept: "image/*,.pdf", attachmentType: "FLOOR_PLAN" },
    { key: "propertyPhoto", label: "Property Photos", accept: "image/*", attachmentType: "PROPERTY_PHOTO" },
    { key: "referenceImage", label: "Reference Images", accept: "image/*", attachmentType: "REFERENCE_IMAGE" },
    { key: "video", label: "Video Tour", accept: "video/*", attachmentType: "VIDEO" },
];

const formatEnumLabel = (enumValue) => {
    if (!enumValue) return "";
    return enumValue
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const isVideoUrl = (url = "") => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);

// Every step, in order. "space" is skipped entirely for NEW_CONSTRUCTION.
const STEP_META = {
    basic: { label: "Basics" },
    location: { label: "Location" },
    property: { label: "Property" },
    design: { label: "Design" },
    space: { label: "Current Space" },
    budget: { label: "Budget" },
    involvement: { label: "Communication" },
    files: { label: "Files & Notes" },
    review: { label: "Review" },
};

function getStepsForStatus(propertyStatus) {
    const base = ["basic", "location", "property", "design"];
    if (propertyStatus !== "NEW_CONSTRUCTION") base.push("space");
    base.push("budget", "involvement", "files", "review");
    return base;
}

/* ────────────────────────────────────────────────────────────────
   Injected once — the moving-stripes "in progress" animation, the
   fade/pop-in used for success & error states, and global
   scrollbar-hiding utilities used across the page.
──────────────────────────────────────────────────────────────── */
function UploadAnimationStyles() {
    return (
        <style>{`
            @keyframes upload-stripes {
                0% { background-position: 0 0; }
                100% { background-position: 40px 0; }
            }
            @keyframes upload-pop {
                0% { transform: scale(0.85); opacity: 0; }
                60% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes upload-shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-4px); }
                40% { transform: translateX(4px); }
                60% { transform: translateX(-3px); }
                80% { transform: translateX(3px); }
            }
            @keyframes modal-pop {
                0% { transform: scale(0.96) translateY(8px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes modal-fade {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .upload-progress-track {
                position: relative;
                overflow: hidden;
                background-color: rgba(58, 36, 24, 0.08);
            }
            .upload-progress-fill {
                position: absolute;
                inset: 0;
                background-image: repeating-linear-gradient(
                    45deg,
                    ${BRAND} 0,
                    ${BRAND} 10px,
                    rgba(58, 36, 24, 0.55) 10px,
                    rgba(58, 36, 24, 0.55) 20px
                );
                background-size: 40px 40px;
                animation: upload-stripes 0.9s linear infinite;
            }
            .upload-pop-in {
                animation: upload-pop 0.35s ease-out;
            }
            .upload-shake {
                animation: upload-shake 0.4s ease-in-out;
            }
            .modal-pop-in {
                animation: modal-pop 0.25s ease-out;
            }
            .modal-fade-in {
                animation: modal-fade 0.2s ease-out;
            }
            /* Hide scrollbars everywhere we mark .no-scrollbar, while
               keeping the element scrollable via mouse/touch/keys. */
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
            }
        `}</style>
    );
}

/* ────────────────────────────────────────────────────────────────
   STEP PROGRESS
──────────────────────────────────────────────────────────────── */
function StepProgress({ stepKeys, currentKey }) {
    const currentIndex = stepKeys.indexOf(currentKey);
    const totalSteps = stepKeys.length;
    const percent = ((currentIndex + 1) / totalSteps) * 100;

    return (
        <div className="mb-6">
            {/* Mobile: compact bar + current step label */}
            <div className="sm:hidden mb-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: BRAND }}>
                        Step {currentIndex + 1} of {totalSteps}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                        {STEP_META[currentKey]?.label}
                    </span>
                </div>
                <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--border)" }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: BRAND }}
                    />
                </div>
            </div>

            {/* sm and up: full step-by-step indicator */}
            <div className="hidden sm:flex items-center overflow-x-auto no-scrollbar pb-1">
                {stepKeys.map((key, i) => {
                    const done = i < currentIndex;
                    const active = i === currentIndex;
                    return (
                        <div
                            key={key}
                            className="flex items-center"
                            style={{ flex: i === stepKeys.length - 1 ? "0 0 auto" : 1, minWidth: 64 }}
                        >
                            <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0"
                                    style={{
                                        border: `1px solid ${done || active ? BRAND : "var(--border)"}`,
                                        backgroundColor: done ? BRAND : "transparent",
                                        color: done ? "#fff" : active ? BRAND : "var(--muted)",
                                        fontWeight: 600,
                                    }}
                                >
                                    {done ? "✓" : i + 1}
                                </div>
                                <div
                                    className="mt-1.5 text-[10px] text-center whitespace-nowrap"
                                    style={{ color: active ? BRAND : "var(--muted)", fontWeight: active ? 600 : 400 }}
                                >
                                    {STEP_META[key].label}
                                </div>
                            </div>
                            {i !== stepKeys.length - 1 && (
                                <div
                                    className="h-px flex-1 mx-1"
                                    style={{ backgroundColor: done ? BRAND : "var(--border)", marginBottom: 18, minWidth: 24 }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   FILE UPLOAD CARD
   Renders one of four states: empty / uploading / success / error.
──────────────────────────────────────────────────────────────── */
function FileUploadCard({ fieldKey, label, accept, file, status, error, onPick, onRemove, onRetry, inputRef }) {
    // ── SUCCESS ──
    if (status === "success" && file) {
        return (
            <div>
                <label className="block text-sm font-medium text-heading mb-3">{label}</label>
                <div className="upload-pop-in flex items-center justify-between p-4 bg-success bg-opacity-10 border border-success border-opacity-40 rounded-sm">
                    <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle size={20} className="text-success flex-shrink-0" />
                        <div className="min-w-0">
                            <span className="text-sm text-success font-semibold truncate block">
                                {file.name}
                            </span>
                            <span className="text-xs text-success text-opacity-80">Uploaded successfully</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(fieldKey)}
                        className="text-muted hover:text-danger transition-colors flex-shrink-0"
                        aria-label={`Remove ${label}`}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // ── UPLOADING ──
    if (status === "uploading") {
        return (
            <div>
                <label className="block text-sm font-medium text-heading mb-3">{label}</label>
                <div className="p-4 bg-background border border-border rounded-sm">
                    <div className="flex items-center gap-2 mb-3 min-w-0">
                        <Loader2 size={18} className="animate-spin flex-shrink-0" style={{ color: BRAND }} />
                        <span className="text-sm font-medium truncate" style={{ color: BRAND }}>
                            Uploading {file?.name}...
                        </span>
                    </div>
                    <div className="upload-progress-track h-2 w-full rounded-full">
                        <div className="upload-progress-fill h-full w-full rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    // ── ERROR ──
    if (status === "error") {
        return (
            <div>
                <label className="block text-sm font-medium text-heading mb-3">{label}</label>
                <div className="upload-shake flex items-center justify-between gap-2 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-40 rounded-sm">
                    <div className="flex items-center gap-2 min-w-0">
                        <AlertCircle size={20} className="text-danger flex-shrink-0" />
                        <div className="min-w-0">
                            <span className="text-sm text-danger font-semibold block">Upload failed</span>
                            <span className="text-xs text-danger text-opacity-80 truncate block">
                                {error || "Please try again"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => onRetry(fieldKey)}
                            className="text-danger hover:opacity-70 transition-opacity"
                            aria-label={`Retry ${label}`}
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemove(fieldKey)}
                            className="text-muted hover:text-danger transition-colors"
                            aria-label={`Remove ${label}`}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── EMPTY / IDLE ──
    return (
        <div>
            <label className="block text-sm font-medium text-heading mb-3">{label}</label>
            <input
                type="file"
                ref={(el) => (inputRef.current[fieldKey] = el)}
                onChange={(e) => onPick(e, fieldKey)}
                accept={accept}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => inputRef.current[fieldKey]?.click()}
                className="w-full p-4 border-2 border-dashed border-border rounded-sm hover:border-primary transition-colors cursor-pointer"
            >
                <div className="text-center">
                    <Upload size={24} className="mx-auto mb-2 text-muted" />
                    <p className="text-sm text-muted">Click to upload</p>
                </div>
            </button>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   ROW — a labeled fact with an icon, used inside the two-column
   detail grids in the modal.
──────────────────────────────────────────────────────────────── */
function DetailRow({ label, value, Icon }) {
    return (
        <div className="flex items-start gap-3 py-3 px-1">
            <div
                className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(58, 36, 24, 0.08)" }}
            >
                {Icon && <Icon size={15} style={{ color: BRAND }} />}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wide text-muted mb-0.5">{label}</div>
                <div className="text-sm text-heading font-semibold break-words">
                    {value === "" || value === null || value === undefined ? "—" : value}
                </div>
            </div>
        </div>
    );
}

/* Two-column responsive wrapper for a list of DetailRow definitions */
function DetailGrid({ items }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 rounded-sm border border-border p-2 sm:p-3 bg-background">
            {items.map((item, idx) => (
                <DetailRow key={idx} label={item.label} value={item.value} Icon={item.Icon} />
            ))}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   PROJECT DETAILS MODAL
   One self-contained component: owns its own "which section am I on"
   state and renders every section inline (no sub-components) so the
   whole read-only view lives in a single function, mirroring the
   step-by-step feel of the creation wizard with Back / Next controls.
──────────────────────────────────────────────────────────────── */
function ProjectDetailsModal({ project, onClose }) {
    const [sectionIndex, setSectionIndex] = useState(0);

    if (!project) return null;

    // Same step list as the wizard, minus "review" (this whole modal IS the review).
    const sectionKeys = getStepsForStatus(project.propertyStatus).filter((k) => k !== "review");
    const currentKey = sectionKeys[sectionIndex] || sectionKeys[0];
    const isFirst = sectionIndex === 0;
    const isLast = sectionIndex === sectionKeys.length - 1;

    // Group attachments (from the API) by type so each file field can show
    // its matching uploads, whether there's one or several of a kind.
    const attachmentsByType = (project.attachments || []).reduce((acc, att) => {
        acc[att.type] = acc[att.type] || [];
        acc[att.type].push(att);
        return acc;
    }, {});

    return (
        <div
            className="modal-fade-in fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="modal-pop-in w-full sm:max-w-3xl bg-white sm:rounded-sm flex flex-col"
                style={{ maxHeight: "92vh", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-start gap-3 p-4 sm:p-5"
                    style={{ borderBottom: "1px solid var(--border)" }}
                >
                    <div className="min-w-0 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: BRAND }}
                        >
                            <Briefcase size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2
                                className="text-lg sm:text-xl font-bold text-heading truncate"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                {project.title || "Project Details"}
                            </h2>
                            <p className="text-xs sm:text-sm text-muted mt-0.5">
                                Section {sectionIndex + 1} of {sectionKeys.length} · {STEP_META[currentKey]?.label}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text transition-colors p-1 -mr-1 shrink-0"
                        aria-label="Close details"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Step dots */}
                <div className="px-4 sm:px-5 pt-3">
                    <StepProgress stepKeys={sectionKeys} currentKey={currentKey} />
                </div>

                {/* Body — scrollable (no visible scrollbar), section-wise */}
                <div className="px-4 sm:px-5 pb-2 overflow-y-auto no-scrollbar flex-1">
                    {currentKey === "basic" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    { label: "Project Title", value: project.title, Icon: FileText },
                                    { label: "Current Stage", value: formatEnumLabel(project.status), Icon: CheckCircle },
                                    { label: "Category", value: formatEnumLabel(project.category), Icon: Tag },
                                    { label: "Property Status", value: formatEnumLabel(project.propertyStatus), Icon: Home },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    {
                                        label: "Services Required",
                                        value: (project.servicesRequired || []).map(formatEnumLabel).join(", "),
                                        Icon: Briefcase,
                                    },
                                    { label: "Description", value: project.description, Icon: FileText },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "location" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    { label: "Address", value: project.address, Icon: MapPin },
                                    { label: "City", value: project.city, Icon: MapPin },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "State", value: project.state, Icon: MapPin },
                                    { label: "Pincode", value: project.pincode, Icon: MapPin },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "property" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    { label: "Property Size (sq ft)", value: project.propertySize, Icon: Ruler },
                                    { label: "Number of Floors", value: project.numberOfFloors, Icon: Layers },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "Number of Bedrooms", value: project.numberOfBedrooms, Icon: BedDouble },
                                    { label: "Number of Bathrooms", value: project.numberOfBathrooms, Icon: Bath },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "design" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    {
                                        label: "Design Style",
                                        value: (project.designStyle || []).map(formatEnumLabel).join(", "),
                                        Icon: Palette,
                                    },
                                    {
                                        label: "Space Requirements",
                                        value: (project.spaceRequirements || []).map(formatEnumLabel).join(", "),
                                        Icon: Sofa,
                                    },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "Color Preferences", value: project.colorPreferences, Icon: Palette },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "space" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    { label: "What they like", value: project.currentSpaceLikes, Icon: Heart },
                                    { label: "Problems to solve", value: project.currentSpaceProblems, Icon: AlertTriangle },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "Accessibility Needs", value: project.accessibilityNeeds, Icon: UserCheck },
                                    { label: "Who uses the space", value: project.spaceUsers, Icon: Users },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "budget" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    {
                                        label: "Minimum Budget",
                                        value: project.budgetMin ? `₹${project.budgetMin}` : "",
                                        Icon: DollarSign,
                                    },
                                    {
                                        label: "Maximum Budget",
                                        value: project.budgetMax ? `₹${project.budgetMax}` : "",
                                        Icon: Wallet,
                                    },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    {
                                        label: "Start Date",
                                        value: project.startDate ? new Date(project.startDate).toLocaleDateString() : "",
                                        Icon: Calendar,
                                    },
                                    {
                                        label: "Completion Date",
                                        value: project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "",
                                        Icon: Calendar,
                                    },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "Priority", value: formatEnumLabel(project.priority), Icon: Flag },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "involvement" && (
                        <div className="space-y-4">
                            <DetailGrid
                                items={[
                                    { label: "Client Involvement", value: formatEnumLabel(project.clientInvolvement), Icon: Users },
                                    {
                                        label: "Preferred Communication",
                                        value: formatEnumLabel(project.preferredCommunication),
                                        Icon: MessageCircle,
                                    },
                                ]}
                            />
                            <DetailGrid
                                items={[
                                    { label: "Preferred Working Hours", value: project.preferredWorkingHours, Icon: Clock },
                                    { label: "Site Visit Required", value: project.siteVisitRequired ? "Yes" : "No", Icon: MapPin },
                                ]}
                            />
                        </div>
                    )}

                    {currentKey === "files" && (
                        <div className="pb-2">
                            <h3
                                className="text-sm font-semibold text-heading mb-3 flex items-center gap-2"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                <Upload size={16} />
                                Attachments
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {FILE_FIELDS.map(({ key, label, attachmentType }) => {
                                    const items = attachmentsByType[attachmentType] || [];
                                    return (
                                        <div key={key} className="rounded-sm border border-border p-3 bg-background">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: "rgba(58, 36, 24, 0.08)" }}
                                                >
                                                    <ImageIcon size={14} style={{ color: BRAND }} />
                                                </div>
                                                <span className="text-xs font-semibold text-heading uppercase tracking-wide">
                                                    {label}
                                                </span>
                                            </div>
                                            {items.length === 0 ? (
                                                <div className="text-sm text-muted italic pl-1">No {label.toLowerCase()} uploaded</div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {items.map((att) => (

                                                        <a key={att.id}
                                                            href={att.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block rounded-sm overflow-hidden border border-border hover:border-primary transition-colors bg-white aspect-square relative group"
                                                        >
                                                            {isVideoUrl(att.url) ? (
                                                                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                    <VideoIcon size={20} className="text-muted" />
                                                                    <span className="text-[9px] text-muted px-1 text-center">
                                                                        View video
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={att.url}
                                                                    alt={label}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = "none";
                                                                        e.currentTarget.nextSibling.style.display = "flex";
                                                                    }}
                                                                />
                                                            )}
                                                            <div
                                                                className="w-full h-full items-center justify-center hidden flex-col gap-1"
                                                                style={{ position: "absolute", inset: 0, backgroundColor: "var(--background)" }}
                                                            >
                                                                <ImageIcon size={18} className="text-muted" />
                                                                <span className="text-[9px] text-muted">N/A</span>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 rounded-sm border border-border p-3 bg-background">
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: "rgba(58, 36, 24, 0.08)" }}
                                    >
                                        <StickyNote size={14} style={{ color: BRAND }} />
                                    </div>
                                    <span className="text-xs font-semibold text-heading uppercase tracking-wide">
                                        Additional Notes
                                    </span>
                                </div>
                                <div className="text-sm text-heading font-medium whitespace-pre-wrap break-words pl-1">
                                    {project.additionalNotes || "—"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer nav */}
                <div
                    className="flex items-center gap-3 p-4 sm:p-5"
                    style={{ borderTop: "1px solid var(--border)" }}
                >
                    {!isFirst ? (
                        <button
                            type="button"
                            onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
                            className="flex items-center gap-1 px-5 py-2.5 border rounded-sm font-semibold transition-colors"
                            style={{ borderColor: BRAND, color: BRAND }}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </button>
                    ) : (
                        <span />
                    )}

                    <div className="ml-auto flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border rounded-sm font-semibold transition-colors"
                            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                        >
                            Close
                        </button>
                        {!isLast && (
                            <button
                                type="button"
                                onClick={() => setSectionIndex((i) => Math.min(sectionKeys.length - 1, i + 1))}
                                className="flex items-center gap-1 px-5 py-2.5 text-white rounded-sm font-semibold transition-colors"
                                style={{ backgroundColor: BRAND }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_HOVER)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState(1); // 1-indexed position within the wizard
    const [selectedProject, setSelectedProject] = useState(null); // drives the details modal
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const { data: projectsData, isLoading: isLoadingProjects } =
        useListProjectsQuery();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        servicesRequired: [],
        description: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        propertySize: "",
        numberOfFloors: "",
        numberOfBedrooms: "",
        numberOfBathrooms: "",
        propertyStatus: "",
        designStyle: [],
        colorPreferences: "",
        spaceRequirements: [],
        accessibilityNeeds: "",
        spaceUsers: "",
        currentSpaceLikes: "",
        currentSpaceProblems: "",
        clientInvolvement: "",
        budgetMin: "",
        budgetMax: "",
        startDate: "",
        completionDate: "",
        priority: "NORMAL",
        siteVisitRequired: false,
        preferredCommunication: "",
        preferredWorkingHours: "",
        additionalNotes: "",
    });

    // Local File objects (kept so the UI can show the filename while uploading)
    const [files, setFiles] = useState({
        floorPlan: null,
        propertyPhoto: null,
        referenceImage: null,
        video: null,
    });

    // Per-file upload state machine: "idle" | "uploading" | "success" | "error"
    const [uploadStatus, setUploadStatus] = useState({
        floorPlan: "idle",
        propertyPhoto: "idle",
        referenceImage: "idle",
        video: "idle",
    });

    // Per-file error message, for display in the failed card
    const [uploadErrors, setUploadErrors] = useState({
        floorPlan: "",
        propertyPhoto: "",
        referenceImage: "",
        video: "",
    });

    // Public URLs returned by Supabase Storage once a file finishes uploading.
    // These — not the raw File objects — are what get sent to the backend.
    const [uploadedUrls, setUploadedUrls] = useState({
        floorPlan: "",
        propertyPhoto: "",
        referenceImage: "",
        video: "",
    });

    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRefs = useRef({});

    // ── Wizard bookkeeping ──
    const stepKeys = getStepsForStatus(formData.propertyStatus);
    const currentIndex = Math.min(step, stepKeys.length) - 1;
    const currentStepKey = stepKeys[currentIndex] || "basic";
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === stepKeys.length - 1;

    // Are any files still mid-upload? Used to block final submission so we
    // never send a project without its files finishing.
    const isAnyFileUploading = Object.values(uploadStatus).some((s) => s === "uploading");

    // Handle text/number inputs
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors([]);
    };

    // Handle multi-select arrays
    const handleMultiSelect = (fieldName, value) => {
        setFormData((prev) => {
            const current = prev[fieldName] || [];
            const isSelected = current.includes(value);
            return {
                ...prev,
                [fieldName]: isSelected
                    ? current.filter((item) => item !== value)
                    : [...current, value],
            };
        });
        setErrors([]);
    };

    // ── Core upload routine — shared by initial pick and retry ──
    const runUpload = async (fileType, file) => {
        setUploadStatus((prev) => ({ ...prev, [fileType]: "uploading" }));
        setUploadErrors((prev) => ({ ...prev, [fileType]: "" }));

        try {
            // NOTE: bucket name must match an EXISTING Supabase Storage bucket.
            // Your project's Storage currently has a bucket named "products",
            // not "project-files" — using the wrong name causes a
            // "Bucket not found" (404) error on every upload.
            const { publicUrl } = await uploadFile(file, "products", fileType);
            setUploadedUrls((prev) => ({ ...prev, [fileType]: publicUrl }));
            setUploadStatus((prev) => ({ ...prev, [fileType]: "success" }));
        } catch (err) {
            setUploadStatus((prev) => ({ ...prev, [fileType]: "error" }));
            setUploadErrors((prev) => ({
                ...prev,
                [fileType]: err?.message || "Something went wrong",
            }));
        }
    };

    // Handle file selection — immediately kicks off the Supabase upload
    const handleFileChange = (e, fileType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFiles((prev) => ({ ...prev, [fileType]: file }));
        runUpload(fileType, file);
    };

    // Retry an upload that previously failed, using the same File object
    const handleRetry = (fileType) => {
        const file = files[fileType];
        if (file) runUpload(fileType, file);
    };

    // Remove a file entirely and reset its status/URL
    const removeFile = (fileType) => {
        setFiles((prev) => ({ ...prev, [fileType]: null }));
        setUploadStatus((prev) => ({ ...prev, [fileType]: "idle" }));
        setUploadErrors((prev) => ({ ...prev, [fileType]: "" }));
        setUploadedUrls((prev) => ({ ...prev, [fileType]: "" }));
        if (fileInputRefs.current[fileType]) {
            fileInputRefs.current[fileType].value = "";
        }
    };

    // ── Per-step validation ──
    // Backend owns enum validation — the frontend only checks required
    // fields are filled in, nothing more.
    const validateStep = (stepKey) => {
        const stepErrors = [];

        if (stepKey === "basic") {
            if (!formData.title) stepErrors.push("Project Title is required");
            if (!formData.category) stepErrors.push("Category is required");
            if (!formData.propertyStatus) stepErrors.push("Property Status is required");
            if (!formData.description) stepErrors.push("Project Description is required");
            if (formData.servicesRequired.length === 0)
                stepErrors.push("Select at least one required service");
        }

        if (stepKey === "location") {
            if (!formData.address) stepErrors.push("Address is required");
            if (!formData.city) stepErrors.push("City is required");
            if (!formData.state) stepErrors.push("State is required");
            if (!formData.pincode) stepErrors.push("Pincode is required");
        }

        if (stepKey === "property") {
            if (!formData.propertySize) stepErrors.push("Property size is required");
        }

        if (stepKey === "budget") {
            if (!formData.budgetMin) stepErrors.push("Minimum budget is required");
            if (!formData.budgetMax) stepErrors.push("Maximum budget is required");
            if (Number(formData.budgetMin) > Number(formData.budgetMax))
                stepErrors.push("Minimum budget cannot exceed maximum budget");
            if (!formData.startDate) stepErrors.push("Start date is required");
            if (!formData.completionDate) stepErrors.push("Completion date is required");
            if (
                formData.startDate &&
                formData.completionDate &&
                new Date(formData.startDate) > new Date(formData.completionDate)
            )
                stepErrors.push("Start date cannot be after completion date");
        }

        if (stepKey === "files") {
            if (isAnyFileUploading)
                stepErrors.push("Please wait for file uploads to finish");
            if (Object.values(uploadStatus).some((s) => s === "error"))
                stepErrors.push("Fix or remove failed uploads before continuing");
        }

        return stepErrors;
    };

    // Full validation, run once more right before submit as a safety net
    const validateForm = () => {
        const newErrors = stepKeys
            .filter((k) => k !== "review")
            .flatMap((k) => validateStep(k));

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleWizardNext = () => {
        const stepErrors = validateStep(currentStepKey);
        if (stepErrors.length > 0) {
            setErrors(stepErrors);
            return;
        }
        setErrors([]);
        if (currentStepKey === "review") {
            handleSubmit();
            return;
        }
        setStep((s) => s + 1);
    };

    const handleWizardBack = () => {
        setErrors([]);
        setStep((s) => Math.max(1, s - 1));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                ...formData,
                floorPlanUrl: uploadedUrls.floorPlan || undefined,
                propertyPhotoUrl: uploadedUrls.propertyPhoto || undefined,
                referenceImageUrl: uploadedUrls.referenceImage || undefined,
                videoUrl: uploadedUrls.video || undefined,
            };

            await createProject(payload).unwrap();

            setSuccessMessage("Project created successfully!");
            setTimeout(() => {
                setShowForm(false);
                setSuccessMessage("");
                resetForm();
            }, 2000);
        } catch (err) {
            setErrors([
                "Failed to create project. Please try again.",
                ...(err.data?.errors || []),
            ]);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            title: "",
            category: "",
            servicesRequired: [],
            description: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            propertySize: "",
            numberOfFloors: "",
            numberOfBedrooms: "",
            numberOfBathrooms: "",
            propertyStatus: "",
            designStyle: [],
            colorPreferences: "",
            spaceRequirements: [],
            accessibilityNeeds: "",
            spaceUsers: "",
            currentSpaceLikes: "",
            currentSpaceProblems: "",
            clientInvolvement: "",
            budgetMin: "",
            budgetMax: "",
            startDate: "",
            completionDate: "",
            priority: "NORMAL",
            siteVisitRequired: false,
            preferredCommunication: "",
            preferredWorkingHours: "",
            additionalNotes: "",
        });
        setFiles({
            floorPlan: null,
            propertyPhoto: null,
            referenceImage: null,
            video: null,
        });
        setUploadStatus({
            floorPlan: "idle",
            propertyPhoto: "idle",
            referenceImage: "idle",
            video: "idle",
        });
        setUploadErrors({
            floorPlan: "",
            propertyPhoto: "",
            referenceImage: "",
            video: "",
        });
        setUploadedUrls({
            floorPlan: "",
            propertyPhoto: "",
            referenceImage: "",
            video: "",
        });
        setErrors([]);
    };

    const closeForm = () => {
        setShowForm(false);
        resetForm();
    };

    const primaryBtnStyle = {
        fontFamily: "var(--font-body)",
        backgroundColor: BRAND,
        boxShadow: "none",
    };

    const inputClass =
        "w-full px-4 py-3 bg-background border border-border rounded-sm text-text focus:outline-none focus:border-primary transition-colors text-base";

    // ── Columns for the projects list table ──




    const projectColumns = [
        {
            key: "title",
            label: "Project",
            icon: FolderKanban,
            width: "24%",
            render: (project) => (
                <div className="min-w-0">
                    <div
                        className="font-semibold text-heading truncate"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {project.title}
                    </div>

                    <div className="text-xs text-muted mt-0.5">
                        <ExpandableCell
                            text={project.description}
                            maxLines={2}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category / Priority",
            icon: Tag,
            width: "18%",
            render: (project) => (
                <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs px-2.5 py-1 bg-primary bg-opacity-10 text-primary rounded-full font-medium">
                        <ExpandableCell
                            text={formatEnumLabel(project.category)}
                            maxLines={1}
                        />
                    </span>

                    <span className="text-xs px-2.5 py-1 bg-gold bg-opacity-10 text-gold rounded-full font-medium">
                        <ExpandableCell
                            text={formatEnumLabel(project.priority)}
                            maxLines={1}
                        />
                    </span>
                </div>
            ),
        },
        {
            key: "location",
            label: "Location",
            icon: MapPin,
            width: "20%",
            render: (project) => (
                <ExpandableCell
                    text={`${project.city}, ${project.state}`}
                    maxLines={2}
                />
            ),
        },
        {
            key: "budget",
            label: "Budget",
            icon: DollarSign,
            width: "18%",
            render: (project) => (
                <ExpandableCell
                    text={`₹${project.budgetMin} - ₹${project.budgetMax}`}
                    maxLines={1}
                />
            ),
        },
        {
            key: "timeline",
            label: "Timeline",
            icon: Calendar,
            width: "20%",
            render: (project) => (
                <span className="text-xs">
                    {new Date(project.startDate).toLocaleDateString()} –{" "}
                    {new Date(project.completionDate).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            width: "12%",
            render: (project) => (
                <button
                    className="px-3 py-1.5 text-white rounded-sm font-medium text-xs transition-colors whitespace-nowrap"
                    style={{
                        fontFamily: "var(--font-body)",
                        backgroundColor: BRAND,
                        boxShadow: "none",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = BRAND_HOVER)
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = BRAND)
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                    }}
                >
                    View Details
                </button>
            ),
        },
    ];


    return (
        <div className="min-h-screen bg-background text-text">
            <UploadAnimationStyles />
            <div className="w-full max-w-6xl py-2 px-2 sm:py-8">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h1
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Projects
                    </h1>
                    <p className="text-sm sm:text-base text-muted" style={{ fontFamily: "var(--font-body)" }}>
                        Create and manage your design projects
                    </p>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mb-6 flex items-center gap-2 px-6 py-3 text-white rounded-sm font-medium transition-colors w-full sm:w-auto justify-center"
                        style={{ fontFamily: "var(--font-body)", backgroundColor: BRAND, boxShadow: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_HOVER)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
                    >
                        <Plus size={20} />
                        Create New Project
                    </button>
                )}

                {/* ── PROJECT WIZARD (inline, not a modal) ── */}
                {showForm && (
                    <div
                        className="mb-8 flex flex-col"
                        style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid var(--border)",
                            boxShadow: "none",
                            borderRadius: 0,
                        }}
                    >
                        {/* Header */}
                        <div
                            className="sticky top-0 z-10 flex justify-between items-start gap-3 p-4 sm:p-5 pb-3 sm:pb-0"
                            style={{ backgroundColor: "#ffffff", borderBottom: "1px solid var(--border)" }}
                        >
                            <div className="min-w-0">
                                <h2
                                    className="text-lg sm:text-2xl font-bold text-heading truncate"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Create New Project
                                </h2>
                                <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1">
                                    Step {currentIndex + 1} of {stepKeys.length}
                                </p>
                            </div>
                            <button
                                onClick={closeForm}
                                className="text-muted hover:text-text transition-colors p-1 -mr-1 shrink-0"
                                aria-label="Cancel and close"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-4 sm:px-5 pt-4 sm:pt-4 sm:border-t-0" style={{ borderTop: "1px solid transparent" }}>
                            <StepProgress stepKeys={stepKeys} currentKey={currentStepKey} />

                            {errors.length > 0 && (
                                <div className="mb-4 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-sm">
                                    <div className="flex gap-3">
                                        <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-medium text-danger mb-2">
                                                Please fix the following before continuing
                                            </h3>
                                            <ul className="space-y-1 text-sm text-danger text-opacity-90">
                                                {errors.map((error, idx) => (
                                                    <li key={idx}>• {error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-4 p-4 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-sm flex gap-3">
                                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                                    <p className="text-success font-medium">{successMessage}</p>
                                </div>
                            )}

                            {/* ── STEP: BASICS ── */}
                            {currentStepKey === "basic" && (
                                <div className="space-y-5 sm:space-y-6 pb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">
                                            Project Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Modern Living Room Renovation"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Category
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    <option value="">Select category</option>
                                                    {ENUMS.category.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {formatEnumLabel(cat)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Property Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="propertyStatus"
                                                    value={formData.propertyStatus}
                                                    onChange={handleInputChange}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    <option value="">Select status</option>
                                                    {ENUMS.propertyStatus.map((status) => (
                                                        <option key={status} value={status}>
                                                            {formatEnumLabel(status)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">
                                            Project Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Describe your project vision and requirements..."
                                            rows="4"
                                            className={`${inputClass} resize-none`}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-3 sm:mb-4">
                                            Services Required
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                            {ENUMS.servicesRequired.map((service) => (
                                                <label
                                                    key={service}
                                                    className="flex items-center gap-3 p-4 bg-background border border-border rounded-sm cursor-pointer hover:border-primary transition-colors active:border-primary"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.servicesRequired.includes(service)}
                                                        onChange={() => handleMultiSelect("servicesRequired", service)}
                                                        className="w-5 h-5 rounded shrink-0"
                                                        style={{ accentColor: BRAND }}
                                                    />
                                                    <span className="text-text font-medium">
                                                        {formatEnumLabel(service)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: LOCATION ── */}
                            {currentStepKey === "location" && (
                                <div className="pb-6">
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6 flex items-center gap-2"
                                        style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                        <MapPin size={20} />
                                        Location Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Street address"
                                            className={`md:col-span-2 ${inputClass}`}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Pincode"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: PROPERTY ── */}
                            {currentStepKey === "property" && (
                                <div className="pb-6">
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6 flex items-center gap-2"
                                        style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                        <Briefcase size={20} />
                                        Property Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <input
                                            type="number"
                                            name="propertySize"
                                            value={formData.propertySize}
                                            onChange={handleInputChange}
                                            placeholder="Property size (sq ft)"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="number"
                                            name="numberOfFloors"
                                            value={formData.numberOfFloors}
                                            onChange={handleInputChange}
                                            placeholder="Number of floors"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="number"
                                            name="numberOfBedrooms"
                                            value={formData.numberOfBedrooms}
                                            onChange={handleInputChange}
                                            placeholder="Number of bedrooms"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                        <input
                                            type="number"
                                            name="numberOfBathrooms"
                                            value={formData.numberOfBathrooms}
                                            onChange={handleInputChange}
                                            placeholder="Number of bathrooms"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: DESIGN ── */}
                            {currentStepKey === "design" && (
                                <div className="space-y-5 sm:space-y-6 pb-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
                                        Design Preferences
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-3 sm:mb-4">
                                            Design Style
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {ENUMS.designStyle.map((style) => (
                                                <label
                                                    key={style}
                                                    className="flex items-center gap-3 p-3 bg-background border border-border rounded-sm cursor-pointer hover:border-primary transition-colors active:border-primary"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.designStyle.includes(style)}
                                                        onChange={() => handleMultiSelect("designStyle", style)}
                                                        className="w-5 h-5 rounded shrink-0"
                                                        style={{ accentColor: BRAND }}
                                                    />
                                                    <span className="text-sm text-text">{formatEnumLabel(style)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-3 sm:mb-4">
                                            Space Requirements
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {ENUMS.spaceRequirements.map((space) => (
                                                <label
                                                    key={space}
                                                    className="flex items-center gap-3 p-3 bg-background border border-border rounded-sm cursor-pointer hover:border-primary transition-colors active:border-primary"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.spaceRequirements.includes(space)}
                                                        onChange={() => handleMultiSelect("spaceRequirements", space)}
                                                        className="w-5 h-5 rounded shrink-0"
                                                        style={{ accentColor: BRAND }}
                                                    />
                                                    <span className="text-sm text-text">{formatEnumLabel(space)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">
                                            Color Preferences
                                        </label>
                                        <input
                                            type="text"
                                            name="colorPreferences"
                                            value={formData.colorPreferences}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Warm neutrals, Bold accents"
                                            className={inputClass}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: CURRENT SPACE (skipped for NEW_CONSTRUCTION) ── */}
                            {currentStepKey === "space" && (
                                <div className="pb-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                        Current Space Context
                                    </h3>
                                    <div className="grid grid-cols-1 gap-5 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                What do you like about your current space?
                                            </label>
                                            <textarea
                                                name="currentSpaceLikes"
                                                value={formData.currentSpaceLikes}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Natural light, Layout..."
                                                rows="3"
                                                className={`${inputClass} resize-none`}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                What problems need solving?
                                            </label>
                                            <textarea
                                                name="currentSpaceProblems"
                                                value={formData.currentSpaceProblems}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Limited storage, Dark corners..."
                                                rows="3"
                                                className={`${inputClass} resize-none`}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: BUDGET ── */}
                            {currentStepKey === "budget" && (
                                <div className="pb-6">
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6 flex items-center gap-2"
                                        style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                        <DollarSign size={20} />
                                        Budget & Timeline
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Minimum Budget (₹)
                                            </label>
                                            <input
                                                type="number"
                                                name="budgetMin"
                                                value={formData.budgetMin}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className={inputClass}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Maximum Budget (₹)
                                            </label>
                                            <input
                                                type="number"
                                                name="budgetMax"
                                                value={formData.budgetMax}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className={inputClass}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2">
                                                <Calendar size={16} />
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2">
                                                <Calendar size={16} />
                                                Completion Date
                                            </label>
                                            <input
                                                type="date"
                                                name="completionDate"
                                                value={formData.completionDate}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Priority
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleInputChange}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    {ENUMS.priority.map((p) => (
                                                        <option key={p} value={p}>
                                                            {formatEnumLabel(p)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: INVOLVEMENT & COMMUNICATION ── */}
                            {currentStepKey === "involvement" && (
                                <div className="pb-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                        Involvement & Communication
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Your Involvement Level
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="clientInvolvement"
                                                    value={formData.clientInvolvement}
                                                    onChange={handleInputChange}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    <option value="">Select involvement level</option>
                                                    {ENUMS.clientInvolvement.map((level) => (
                                                        <option key={level} value={level}>
                                                            {formatEnumLabel(level)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Preferred Communication
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="preferredCommunication"
                                                    value={formData.preferredCommunication}
                                                    onChange={handleInputChange}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    <option value="">Select communication method</option>
                                                    {ENUMS.preferredCommunication.map((comm) => (
                                                        <option key={comm} value={comm}>
                                                            {formatEnumLabel(comm)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-heading mb-2">
                                                Preferred Working Hours
                                            </label>
                                            <input
                                                type="text"
                                                name="preferredWorkingHours"
                                                value={formData.preferredWorkingHours}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 9 AM - 5 PM"
                                                className={inputClass}
                                                style={{ fontFamily: "var(--font-body)" }}
                                            />
                                        </div>

                                        <div className="flex items-end pb-0">
                                            <label className="flex items-center gap-3 p-4 bg-background border border-border rounded-sm cursor-pointer hover:border-primary transition-colors w-full">
                                                <input
                                                    type="checkbox"
                                                    name="siteVisitRequired"
                                                    checked={formData.siteVisitRequired}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 rounded shrink-0"
                                                    style={{ accentColor: BRAND }}
                                                />
                                                <span className="text-text font-medium">Site visit required</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: FILES & NOTES ── */}
                            {currentStepKey === "files" && (
                                <div className="space-y-6 sm:space-y-8 pb-6">
                                    <div>
                                        <h3
                                            className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6 flex items-center gap-2"
                                            style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                            <Upload size={20} />
                                            Project Files
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                            {FILE_FIELDS.map(({ key, label, accept }) => (
                                                <FileUploadCard
                                                    key={key}
                                                    fieldKey={key}
                                                    label={label}
                                                    accept={accept}
                                                    file={files[key]}
                                                    status={uploadStatus[key]}
                                                    error={uploadErrors[key]}
                                                    onPick={handleFileChange}
                                                    onRemove={removeFile}
                                                    onRetry={handleRetry}
                                                    inputRef={fileInputRefs}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3
                                            className="text-base sm:text-lg font-semibold text-heading mb-4 sm:mb-6 flex items-center gap-2"
                                            style={{ fontFamily: "var(--font-heading)" }}
                                        >
                                            <FileText size={20} />
                                            Additional Information
                                        </h3>
                                        <textarea
                                            name="additionalNotes"
                                            value={formData.additionalNotes}
                                            onChange={handleInputChange}
                                            placeholder="Any additional notes, constraints, or special requests..."
                                            rows="4"
                                            className={`${inputClass} resize-none`}
                                            style={{ fontFamily: "var(--font-body)" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP: REVIEW ── */}
                            {currentStepKey === "review" && (
                                <div className="pb-6 space-y-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-heading mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                        Review Your Project
                                    </h3>

                                    <DetailGrid
                                        items={[
                                            { label: "Project Title", value: formData.title, Icon: FileText },
                                            { label: "Category", value: formatEnumLabel(formData.category), Icon: Tag },
                                            { label: "Property Status", value: formatEnumLabel(formData.propertyStatus), Icon: Home },
                                            {
                                                label: "Services Required",
                                                value: formData.servicesRequired.map(formatEnumLabel).join(", "),
                                                Icon: Briefcase,
                                            },
                                        ]}
                                    />

                                    <DetailGrid
                                        items={[
                                            {
                                                label: "Address",
                                                value: [formData.address, formData.city, formData.state, formData.pincode]
                                                    .filter(Boolean)
                                                    .join(", "),
                                                Icon: MapPin,
                                            },
                                            {
                                                label: "Property Size",
                                                value: formData.propertySize
                                                    ? `${formData.propertySize} sq ft${formData.numberOfFloors ? ` · ${formData.numberOfFloors} floors` : ""}`
                                                    : "",
                                                Icon: Ruler,
                                            },
                                        ]}
                                    />

                                    <DetailGrid
                                        items={[
                                            {
                                                label: "Budget Range",
                                                value: `₹${formData.budgetMin || "—"} - ₹${formData.budgetMax || "—"}`,
                                                Icon: DollarSign,
                                            },
                                            {
                                                label: "Timeline",
                                                value: `${formData.startDate || "—"} to ${formData.completionDate || "—"}`,
                                                Icon: Calendar,
                                            },
                                        ]}
                                    />

                                    <div className="rounded-sm border border-border p-2 sm:p-3 bg-background">
                                        <div className="flex items-center gap-2 px-1 py-2">
                                            <div
                                                className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "rgba(58, 36, 24, 0.08)" }}
                                            >
                                                <Upload size={15} style={{ color: BRAND }} />
                                            </div>
                                            <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">
                                                Files
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1 pb-2">
                                            {Object.entries(files).filter(([, v]) => v).length > 0 ? (
                                                Object.entries(files)
                                                    .filter(([, v]) => v)
                                                    .map(([k]) => {
                                                        const s = uploadStatus[k];
                                                        return (
                                                            <div key={k} className="flex items-center gap-2 text-sm">
                                                                {s === "success" && (
                                                                    <CheckCircle size={14} className="text-success flex-shrink-0" />
                                                                )}
                                                                {s === "error" && (
                                                                    <AlertCircle size={14} className="text-danger flex-shrink-0" />
                                                                )}
                                                                {s === "uploading" && (
                                                                    <Loader2 size={14} className="animate-spin flex-shrink-0" style={{ color: BRAND }} />
                                                                )}
                                                                <span
                                                                    className={
                                                                        s === "success"
                                                                            ? "text-success"
                                                                            : s === "error"
                                                                                ? "text-danger"
                                                                                : "text-muted"
                                                                    }
                                                                >
                                                                    {formatEnumLabel(k)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })
                                            ) : (
                                                <span className="text-muted text-sm">No files attached</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── WIZARD NAV ── */}
                        <div
                            className="sticky bottom-0 z-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-5"
                            style={{ borderTop: "1px solid var(--border)", backgroundColor: "#ffffff" }}
                        >
                            {/* Left Side */}
                            {!isFirstStep && (
                                <button
                                    type="button"
                                    onClick={handleWizardBack}
                                    className="flex items-center justify-center gap-1 px-6 py-3 border rounded-sm font-semibold transition-colors w-full sm:w-auto"
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        borderColor: BRAND,
                                        color: BRAND,
                                        boxShadow: "none",
                                    }}
                                >
                                    <ChevronLeft size={18} />
                                    Back
                                </button>
                            )}

                            {/* Right Side */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-6 py-3 border rounded-sm font-semibold transition-colors w-full sm:w-auto"
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        borderColor: "var(--border)",
                                        color: "var(--muted)",
                                        boxShadow: "none",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleWizardNext}
                                    disabled={isCreating || isAnyFileUploading}
                                    className="px-6 py-3 text-white rounded-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
                                    style={primaryBtnStyle}
                                    onMouseEnter={(e) => {
                                        if (!isCreating && !isAnyFileUploading)
                                            e.currentTarget.style.backgroundColor = BRAND_HOVER;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = BRAND;
                                    }}
                                >
                                    {isCreating && <Loader2 size={16} className="animate-spin" />}
                                    {isLastStep
                                        ? isCreating
                                            ? "Creating..."
                                            : "Create Project"
                                        : isAnyFileUploading
                                            ? "Uploading..."
                                            : "Next"}
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* Projects List */}
                <div>
                    <h2
                        className="text-lg sm:text-xl lg:text-2xl font-bold text-heading mb-4"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Your Projects
                    </h2>

                    {isLoadingProjects ? (
                        <Loader />
                    ) : projectsData?.data && projectsData.data.length > 0 ? (
                        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 w-full">
                            <Table
                                columns={projectColumns}
                                data={projectsData.data}
                                rowKey="id"
                                emptyMessage="No projects yet."
                            />
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase size={48} className="mx-auto text-muted opacity-50 mb-4" />
                            <p className="text-muted mb-4">No projects yet. Create one to get started.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2 text-white rounded-sm font-medium transition-colors"
                                style={{ fontFamily: "var(--font-body)", backgroundColor: BRAND, boxShadow: "none" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_HOVER)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
                            >
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── VIEW DETAILS MODAL ── */}
            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}