import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "../../../theme.css";
import {
    useCreateProjectMutation,
    useGetProjectEnumsQuery,
} from "./Dashboard/overpageApiSlice";
import { uploadFile } from "../../../../superBase";
import {
    Upload, AlertCircle, CheckCircle, MapPin, Briefcase, Calendar,
    IndianRupee, FileText, ChevronDown, ChevronLeft, ChevronRight, X,
    Loader2, RotateCcw, Image as ImageIcon, Video as VideoIcon, Users,
    MessageCircle, Tag, Home, Ruler, Layers, BedDouble, Bath, Palette,
    Sofa, Heart, AlertTriangle, UserCheck, Clock, Wallet, Flag, StickyNote,
    Plus, Check, FileIcon,
} from "lucide-react";


const MAX_FILES_PER_TYPE = 4;

const FILE_FIELDS = [
    { key: "floorPlan", label: "Floor Plan", accept: "image/*,.pdf" },
    { key: "propertyPhoto", label: "Property Photos", accept: "image/*" },
    { key: "referenceImage", label: "Reference Images", accept: "image/*" },
    { key: "video", label: "Video Tour", accept: "video/*" },
];

// A curated interior-design color library. Grouped so the picker reads like
// a real swatch book rather than a flat grid of random colors.
const COLOR_LIBRARY = [
    {
        group: "Neutrals",
        swatches: [
            { name: "Warm White", hex: "#F5F1EA" },
            { name: "Soft Beige", hex: "#E8DCC8" },
            { name: "Ivory", hex: "#FFFDF6" },
            { name: "Greige", hex: "#CBC3B8" },
            { name: "Slate Gray", hex: "#8A8F98" },
            { name: "Charcoal", hex: "#36454F" },
            { name: "Espresso Brown", hex: "#3C2A21" },
        ],
    },
    {
        group: "Earth & Warm",
        swatches: [
            { name: "Terracotta", hex: "#C1663A" },
            { name: "Rust", hex: "#B7472A" },
            { name: "Mustard Yellow", hex: "#D4A32C" },
            { name: "Gold", hex: "#C9A24B" },
            { name: "Olive", hex: "#6B7A3A" },
            { name: "Coral", hex: "#E9744F" },
        ],
    },
    {
        group: "Cool & Jewel",
        swatches: [
            { name: "Navy Blue", hex: "#1B3A5C" },
            { name: "Powder Blue", hex: "#B8D4E3" },
            { name: "Deep Teal", hex: "#1F5C5C" },
            { name: "Sage Green", hex: "#9CAF88" },
            { name: "Forest Green", hex: "#2C4A3B" },
            { name: "Lavender", hex: "#C7B8E0" },
        ],
    },
    {
        group: "Accent",
        swatches: [
            { name: "Blush Pink", hex: "#E8C4C4" },
            { name: "Burgundy", hex: "#6E1F2E" },
            { name: "Dusty Rose", hex: "#C98E93" },
            { name: "Black", hex: "#161616" },
        ],
    },
];

const STEP_META = {
    basic: "Basics", location: "Location", property: "Property", design: "Design",
    space: "Current Space", budget: "Budget", involvement: "Communication",
    files: "Files & Notes", review: "Review",
};

// Fields that must be filled in before the wizard will advance past a step.
// Array-type / special-case fields (checkboxes, uploads) are validated
// separately inside validateStep below.
const REQUIRED_FIELDS = {
    basic: ["title", "category", "propertyStatus", "description"],
    location: ["address", "city", "state", "pincode"],
    property: ["propertySize", "numberOfFloors", "numberOfBedrooms", "numberOfBathrooms"],
    design: [],
    space: ["currentSpaceLikes", "currentSpaceProblems", "spaceUsers"],
    budget: ["budgetMin", "budgetMax", "startDate", "completionDate"],
    involvement: ["clientInvolvement", "preferredCommunication", "preferredWorkingHours"],
    files: [],
    review: [],
};

const FIELD_LABELS = {
    title: "Project Title", category: "Category", propertyStatus: "Property Status",
    description: "Project Description", servicesRequired: "Services Required",
    address: "Street Address", city: "City", state: "State", pincode: "Pincode",
    propertySize: "Property Size", numberOfFloors: "Number of Floors",
    numberOfBedrooms: "Number of Bedrooms", numberOfBathrooms: "Number of Bathrooms",
    designStyle: "Design Style", colorPreferences: "Color Preferences",
    currentSpaceLikes: "Current Space Likes", currentSpaceProblems: "Current Space Problems",
    spaceUsers: "Who Will Use This Space", budgetMin: "Minimum Budget", budgetMax: "Maximum Budget",
    startDate: "Start Date", completionDate: "Completion Date",
    clientInvolvement: "Involvement Level", preferredCommunication: "Preferred Communication",
    preferredWorkingHours: "Preferred Working Hours", propertyPhoto: "Property Photos",
};

const formatEnumLabel = (v) =>
    !v ? "" : v.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");

const getStepsForStatus = (propertyStatus) => {
    const base = ["basic", "location", "property", "design"];
    if (propertyStatus !== "NEW_CONSTRUCTION") base.push("space");
    base.push("budget", "involvement", "files", "review");
    return base;
};

const EMPTY_FORM = {
    title: "", category: "", servicesRequired: [], description: "",
    address: "", city: "", state: "", pincode: "", propertySize: "",
    numberOfFloors: "", numberOfBedrooms: "", numberOfBathrooms: "",
    propertyStatus: "", designStyle: [], colorPreferences: "",
    spaceRequirements: [], accessibilityNeeds: "", spaceUsers: "",
    currentSpaceLikes: "", currentSpaceProblems: "", clientInvolvement: "",
    budgetMin: "", budgetMax: "", startDate: "", completionDate: "",
    priority: "NORMAL", siteVisitRequired: false, preferredCommunication: "",
    preferredWorkingHours: "", additionalNotes: "",
};

// Each file-type now holds an array of upload entries (up to MAX_FILES_PER_TYPE):
// { id, file, status: "uploading" | "success" | "error", error, url }
const EMPTY_FILE_STATE = { floorPlan: [], propertyPhoto: [], referenceImage: [], video: [] };

const inputClass =
    "px-4 py-3 bg-background border border-border rounded-md text-text text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary " +
    "transition-colors placeholder:text-muted/70";

const selectWrapClass =
    "w-full px-4 py-3 bg-background border border-border rounded-md text-text appearance-none " +
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

// Appended to inputClass/selectWrapClass when a field failed validation.
const errorRingClass = "!border-danger focus:!ring-danger/30 focus:!border-danger";

// Description length bounds — mirrors backend validation. A short interior
// design brief needs enough room for scope, materials, and constraints, but
// shouldn't turn into an essay the ops team has to parse by hand.
const DESCRIPTION_MIN_LENGTH = 30;
const DESCRIPTION_MAX_LENGTH = 2000;

const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const isValidHex = (hex) => /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test((hex || "").trim());

// A custom color entry is valid if it's either a proper hex code, or a
// plain color word/name (letters, spaces, hyphens) like "Red" or "Sky Blue".
const isValidColorName = (val) => /^[a-zA-Z][a-zA-Z\s-]{1,29}$/.test((val || "").trim());
const isValidCustomColor = (val) => isValidHex(val) || isValidColorName(val);

// Best-effort mapping so named colors still render a preview swatch.
const NAMED_COLOR_FALLBACK = "#B0B0B0";
function resolveNamedColor(name) {
    if (typeof document === "undefined") return NAMED_COLOR_FALLBACK;
    const el = document.createElement("span");
    el.style.color = "";
    el.style.color = name;
    if (!el.style.color) return NAMED_COLOR_FALLBACK;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    const match = computed.match(/\d+/g);
    if (!match) return NAMED_COLOR_FALLBACK;
    const [r, g, b] = match.map(Number);
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

const getFileKind = (file) => {
    const type = file?.type || "";
    const name = (file?.name || "").toLowerCase();
    if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) return "image";
    if (type.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv)$/.test(name)) return "video";
    if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
    return "other";
};

function isLightColor(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

function ColorPreferencesPicker({ value, onChange, hasError }) {
    const selected = (value || "").split(",").map((v) => v.trim()).filter(Boolean);
    const [customHex, setCustomHex] = useState("#8A8F98");
    const [hexInputError, setHexInputError] = useState("");

    const toggleColor = (label) => {
        const next = selected.includes(label)
            ? selected.filter((v) => v !== label)
            : [...selected, label];
        onChange(next.join(", "));
    };

    const addCustomColor = () => {
        const raw = customHex.trim();
        if (!raw) {
            setHexInputError("Enter a color name or hex code, e.g. Red or #8A8F98");
            return;
        }

        // If it looks like it was meant to be a hex code (starts with # or is
        // all hex digits), validate strictly as hex. Otherwise treat as a
        // plain color name.
        const looksHexIntent = raw.startsWith("#") || /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw);
        if (looksHexIntent) {
            const normalized = raw.startsWith("#") ? raw : `#${raw}`;
            if (!isValidHex(normalized)) {
                setHexInputError("Enter a valid hex code, e.g. #8A8F98");
                return;
            }
            setHexInputError("");
            const label = normalized.toUpperCase();
            if (!selected.includes(label)) onChange([...selected, label].join(", "));
            return;
        }

        if (!isValidColorName(raw)) {
            setHexInputError("Enter a valid color name or hex code, e.g. Red or #8A8F98");
            return;
        }
        setHexInputError("");
        const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        if (!selected.includes(label)) onChange([...selected, label].join(", "));
    };

    const handleHexTextChange = (e) => {
        setCustomHex(e.target.value);
        if (hexInputError) setHexInputError("");
    };

    const swatchHexFor = (label) => {
        for (const group of COLOR_LIBRARY) {
            const found = group.swatches.find((s) => s.name === label);
            if (found) return found.hex;
        }
        if (/^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(label)) return label;
        return resolveNamedColor(label);
    };

    return (
        <div className="space-y-4">
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selected.map((label) => (
                        <span key={label}
                            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 bg-background border border-border rounded-full text-xs font-medium text-text">
                            <span className="w-4 h-4 rounded-full border border-border shrink-0" style={{ backgroundColor: swatchHexFor(label) }} />
                            {label}
                            <button type="button" onClick={() => toggleColor(label)} className="text-muted hover:text-danger">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className={"rounded-md border bg-background p-4 space-y-4 " + (hasError ? "border-danger" : "border-border")}>
                {COLOR_LIBRARY.map((group) => (
                    <div key={group.group}>
                        <div className="text-[11px] uppercase tracking-wide text-muted mb-2">{group.group}</div>
                        <div className="flex flex-wrap gap-3">
                            {group.swatches.map((swatch) => {
                                const isSelected = selected.includes(swatch.name);
                                return (
                                    <button key={swatch.name} type="button" onClick={() => toggleColor(swatch.name)}
                                        title={swatch.name}
                                        className="group flex flex-col items-center gap-1.5 w-14">
                                        <span
                                            className="relative w-10 h-10 rounded-full border-2 transition-transform group-hover:scale-105"
                                            style={{
                                                backgroundColor: swatch.hex,
                                                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                                            }}
                                        >
                                            {isSelected && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <Check size={16} className="drop-shadow" style={{ color: isLightColor(swatch.hex) ? "#161616" : "#FFFFFF" }} />
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-[10px] text-muted text-center leading-tight truncate w-full">{swatch.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="pt-2 border-t border-border">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] uppercase tracking-wide text-muted">Custom</span>
                        <div className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden shrink-0">
                            <input type="color" value={isValidHex(customHex) ? customHex : "#8A8F98"} onChange={(e) => { setCustomHex(e.target.value); setHexInputError(""); }}
                                className="absolute -top-1 -left-1 w-14 h-14 cursor-pointer" />
                        </div>
                        <input
                            type="text"
                            value={customHex}
                            onChange={handleHexTextChange}
                            placeholder="Red or #RRGGBB"
                            maxLength={30}
                            className={
                                "px-3 py-2 w-28 bg-white border rounded-md text-xs font-mono uppercase text-text " +
                                "focus:outline-none focus:ring-2 transition-colors " +
                                (hexInputError
                                    ? "border-danger focus:ring-danger/30 focus:border-danger"
                                    : "border-border focus:ring-primary/20 focus:border-primary")
                            }
                        />
                        <button type="button" onClick={addCustomColor}
                            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-full text-xs font-medium text-text hover:border-primary hover:bg-primary/5 transition-colors">
                            <Plus size={13} /> Add color
                        </button>
                    </div>
                    {hexInputError && (
                        <p className="text-[11px] text-danger mt-1.5">{hexInputError}</p>
                    )}
                </div>
            </div>
            {hasError && (
                <p className="text-xs text-danger">Pick at least one color preference.</p>
            )}
        </div>
    );
}

function FileSlot({ entry, onRemove, onRetry }) {
    if (entry.status === "uploading") {
        return (
            <div className="aspect-square rounded-md border border-border bg-background flex flex-col items-center justify-center gap-1.5">
                <Loader2 size={18} className="animate-spin" style={{ color: "var(--primary)" }} />
                <span className="text-[10px] text-muted px-1 text-center truncate w-full">Uploading…</span>
            </div>
        );
    }

    if (entry.status === "error") {
        return (
            <div className="aspect-square rounded-md border border-danger border-opacity-40 bg-danger bg-opacity-10 flex flex-col items-center justify-center gap-1 relative p-1">
                <AlertCircle size={18} className="text-danger" />
                <span className="text-[9px] text-danger text-center leading-tight px-1 line-clamp-2">{entry.error || "Failed"}</span>
                <div className="absolute top-1 right-1 flex gap-1">
                    <button type="button" onClick={onRetry} className="text-danger hover:opacity-70 bg-white rounded-full p-0.5"><RotateCcw size={12} /></button>
                    <button type="button" onClick={onRemove} className="text-muted hover:text-danger bg-white rounded-full p-0.5"><X size={12} /></button>
                </div>
            </div>
        );
    }

    // success
    const kind = getFileKind(entry.file);
    return (
        <div className="group aspect-square rounded-md border border-success border-opacity-40 bg-white overflow-hidden relative">
            {kind === "image" ? (
                <img src={entry.url || URL.createObjectURL(entry.file)} alt={entry.file?.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-background px-1">
                    {kind === "video" ? <VideoIcon size={20} className="text-muted" /> : <FileIcon size={20} className="text-muted" />}
                    <span className="text-[9px] text-muted text-center leading-tight truncate w-full">{entry.file?.name}</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button type="button" onClick={onRemove}
                className="absolute top-1 right-1 bg-white/90 hover:bg-white text-muted hover:text-danger rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={13} />
            </button>
            <span className="absolute bottom-1 left-1 bg-success text-white rounded-full p-0.5">
                <CheckCircle size={12} />
            </span>
        </div>
    );
}

export default function CreateProjectForm({ onClose }) {
    const { data: enumsData, isLoading: isLoadingEnums } = useGetProjectEnumsQuery();
    const ENUMS = enumsData?.data || {};

    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [files, setFiles] = useState(EMPTY_FILE_STATE);
    const [serverErrors, setServerErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [missingFields, setMissingFields] = useState([]);
    const [stepError, setStepError] = useState("");
    const fileInputRefs = useRef({});

    const stepKeys = getStepsForStatus(formData.propertyStatus);
    const currentIndex = Math.min(step, stepKeys.length) - 1;
    const currentStepKey = stepKeys[currentIndex] || "basic";
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === stepKeys.length - 1;
    const isAnyFileUploading = Object.values(files).some((arr) => arr.some((it) => it.status === "uploading"));

    // Returns the list of missing/invalid field keys for a given step.
    const validateStep = (stepKey) => {
        const missing = [];

        (REQUIRED_FIELDS[stepKey] || []).forEach((field) => {
            const val = formData[field];
            if (val === undefined || val === null || String(val).trim() === "") {
                missing.push(field);
            }
        });

        if (stepKey === "basic" && formData.servicesRequired.length === 0) {
            missing.push("servicesRequired");
        }
        if (stepKey === "basic" && formData.description.trim().length > 0) {
            const len = formData.description.trim().length;
            if (len < DESCRIPTION_MIN_LENGTH || len > DESCRIPTION_MAX_LENGTH) {
                if (!missing.includes("description")) missing.push("description");
            }
        }
        if (stepKey === "design") {
            if (formData.designStyle.length === 0) missing.push("designStyle");
            if (!formData.colorPreferences || !formData.colorPreferences.trim()) missing.push("colorPreferences");
        }
        if (stepKey === "budget") {
            const min = Number(formData.budgetMin);
            const max = Number(formData.budgetMax);
            if (formData.budgetMin !== "" && formData.budgetMax !== "" && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
                if (!missing.includes("budgetMin")) missing.push("budgetMin");
                if (!missing.includes("budgetMax")) missing.push("budgetMax");
            }
        }
        if (stepKey === "files") {
            const hasPhoto = files.propertyPhoto.some((f) => f.status === "success");
            if (!hasPhoto) missing.push("propertyPhoto");
        }

        return missing;
    };

    const clearValidation = () => {
        if (missingFields.length) setMissingFields([]);
        if (stepError) setStepError("");
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        setServerErrors([]);
        clearValidation();
    };

    const handleMultiSelect = (field, value) => {
        setFormData((p) => {
            const cur = p[field] || [];
            return { ...p, [field]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
        });
        setServerErrors([]);
        clearValidation();
    };

    const runUpload = async (fileType, entry) => {
        try {
            const { publicUrl } = await uploadFile(entry.file, "products", fileType);
            setFiles((p) => ({
                ...p,
                [fileType]: p[fileType].map((it) => (it.id === entry.id ? { ...it, status: "success", url: publicUrl } : it)),
            }));
            clearValidation();
        } catch (err) {
            setFiles((p) => ({
                ...p,
                [fileType]: p[fileType].map((it) => (it.id === entry.id ? { ...it, status: "error", error: err?.message || "Something went wrong" } : it)),
            }));
        }
    };

    const handleFileChange = (e, fileType) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;
        const remainingSlots = MAX_FILES_PER_TYPE - files[fileType].length;
        const toAdd = selectedFiles.slice(0, remainingSlots).map((file) => ({
            id: genId(), file, status: "uploading", error: "", url: "",
        }));
        if (toAdd.length === 0) {
            e.target.value = "";
            return;
        }
        setFiles((p) => ({ ...p, [fileType]: [...p[fileType], ...toAdd] }));
        toAdd.forEach((entry) => runUpload(fileType, entry));
        e.target.value = "";
    };

    const handleRetry = (fileType, id) => {
        const entry = files[fileType].find((it) => it.id === id);
        if (!entry) return;
        setFiles((p) => ({
            ...p,
            [fileType]: p[fileType].map((it) => (it.id === id ? { ...it, status: "uploading", error: "" } : it)),
        }));
        runUpload(fileType, { ...entry, status: "uploading" });
    };

    const removeFile = (fileType, id) => {
        setFiles((p) => ({ ...p, [fileType]: p[fileType].filter((it) => it.id !== id) }));
    };

    const resetForm = () => {
        setStep(1);
        setFormData(EMPTY_FORM);
        setFiles(EMPTY_FILE_STATE);
        setServerErrors([]);
        setMissingFields([]);
        setStepError("");
    };

    const handleSubmit = async () => {
        try {
            const urlsFor = (key) => files[key].filter((f) => f.status === "success" && f.url).map((f) => f.url);
            const payload = {
                ...formData,
                floorPlanUrls: urlsFor("floorPlan"),
                propertyPhotoUrls: urlsFor("propertyPhoto"),
                referenceImageUrls: urlsFor("referenceImage"),
                videoUrls: urlsFor("video"),
            };
            await createProject(payload).unwrap();
            setSuccessMessage("Project created successfully!");
            setTimeout(() => {
                resetForm();
                onClose();
            }, 1000);
        } catch (err) {
            // Backend owns validation — surface whatever it returns.
            setServerErrors([
                err?.data?.message || "Failed to create project. Please try again.",
                ...(err?.data?.errors || []),
            ]);
        }
    };

    const handleWizardNext = () => {
        if (isAnyFileUploading) return;

        const missing = validateStep(currentStepKey);
        if (missing.length > 0) {
            setMissingFields(missing);
            const descLen = formData.description.trim().length;
            const descTooShort = missing.includes("description") && descLen > 0 && descLen < DESCRIPTION_MIN_LENGTH;
            const descTooLong = missing.includes("description") && descLen > DESCRIPTION_MAX_LENGTH;

            const otherMissing = missing.filter((f) => f !== "description" || (descLen === 0));
            const parts = [];
            if (otherMissing.length) {
                parts.push(`Please complete the required field${otherMissing.length > 1 ? "s" : ""}: ${otherMissing.map((f) => FIELD_LABELS[f] || f).join(", ")}`);
            }
            if (descTooShort) parts.push(`Project Description must be at least ${DESCRIPTION_MIN_LENGTH} characters (currently ${descLen}).`);
            if (descTooLong) parts.push(`Project Description must be under ${DESCRIPTION_MAX_LENGTH} characters (currently ${descLen}).`);

            setStepError(parts.join(" "));
            return;
        }

        setMissingFields([]);
        setStepError("");

        if (currentStepKey === "review") return handleSubmit();
        setStep((s) => s + 1);
    };

    const handleWizardBack = () => {
        setMissingFields([]);
        setStepError("");
        setStep((s) => Math.max(1, s - 1));
    };

    const closeForm = () => {
        resetForm();
        onClose();
    };

    const errCls = (field) => (missingFields.includes(field) ? errorRingClass : "");

    if (isLoadingEnums) {
        return createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-sm p-8 flex items-center justify-center gap-2 text-muted bg-white border border-border rounded-md">
                    <Loader2 size={18} className="animate-spin" /> Loading form…
                </div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeForm}
        >
            <div
                className="relative w-[75%] max-w-4xl h-[88vh] flex flex-col bg-white border border-border rounded-md overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex justify-between items-start gap-3 p-5 sm:p-6 pb-4 bg-white border-b border-border">
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-heading truncate" style={{ fontFamily: "var(--font-heading)" }}>
                            Create New Project
                        </h2>
                        <p className="text-xs sm:text-sm text-muted mt-1">
                            Step {currentIndex + 1} of {stepKeys.length} · {STEP_META[currentStepKey]}
                        </p>
                    </div>
                    <button onClick={closeForm} className="text-muted hover:text-text transition-colors p-1 -mr-1 shrink-0" aria-label="Cancel">
                        <X size={22} />
                    </button>
                </div>

                <div className="w-full px-5 sm:px-8 pt-5 pb-2 flex-1 min-h-0 overflow-y-auto">
                    {serverErrors.length > 0 && (
                        <div className="mb-5 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-md">
                            <div className="flex gap-3">
                                <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-danger mb-2">Please fix the following</h3>
                                    <ul className="space-y-1 text-sm text-danger text-opacity-90">
                                        {serverErrors.map((e, i) => <li key={i}>• {e}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {stepError && (
                        <div className="mb-5 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-md flex gap-3">
                            <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-danger text-opacity-90">{stepError}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-[30%] min-w-[320px] bg-white border border-border rounded-md shadow-xl flex flex-col items-center gap-4 text-center px-8 py-10 animate-in fade-in zoom-in duration-300">
                                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-success bg-opacity-10">
                                    <CheckCircle size={36} className="text-success" />
                                </span>
                                <div>
                                    <h3 className="text-xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
                                        Project Submitted Successfully
                                    </h3>
                                    <p className="text-sm  text-muted mt-1.5">Your project has been created.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentStepKey === "basic" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Project Title <span className="text-danger">*</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                        placeholder="e.g., Modern Living Room Renovation" className={inputClass + " w-full " + errCls("title")} />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-heading mb-2">Category <span className="text-danger">*</span></label>
                                        <div className="relative">
                                            <select name="category" value={formData.category} onChange={handleInputChange}
                                                className={selectWrapClass + " " + errCls("category")}>
                                                <option value="">Select category</option>
                                                {(ENUMS.category || []).map((c) => <option key={c} value={c}>{formatEnumLabel(c)}</option>)}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-heading mb-2">Property Status <span className="text-danger">*</span></label>
                                        <div className="relative">
                                            <select name="propertyStatus" value={formData.propertyStatus} onChange={handleInputChange}
                                                className={selectWrapClass + " " + errCls("propertyStatus")}>
                                                <option value="">Select status</option>
                                                {(ENUMS.propertyStatus || []).map((s) => <option key={s} value={s}>{formatEnumLabel(s)}</option>)}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Project Description <span className="text-danger">*</span></label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange}
                                        placeholder="Describe your project vision and requirements..." rows="5"
                                        maxLength={DESCRIPTION_MAX_LENGTH}
                                        className={inputClass + " w-full resize-none " + errCls("description")} />
                                    <div className="flex justify-between mt-1.5">
                                        <span className="text-[11px] text-muted">Min {DESCRIPTION_MIN_LENGTH} characters</span>
                                        <span className={"text-[11px] " + (formData.description.trim().length > DESCRIPTION_MAX_LENGTH ? "text-danger" : "text-muted")}>
                                            {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">Services Required <span className="text-danger">*</span></label>
                                <div className={"flex flex-col gap-3 rounded-md " + (missingFields.includes("servicesRequired") ? "ring-1 ring-danger p-2" : "")}>
                                    {(ENUMS.servicesRequired || []).map((service) => (
                                        <label key={service} className="flex items-center gap-3 px-4 py-3.5 bg-background border border-border rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                            <input type="checkbox" checked={formData.servicesRequired.includes(service)}
                                                onChange={() => handleMultiSelect("servicesRequired", service)}
                                                className="w-4 h-4 rounded shrink-0" style={{ accentColor: "var(--primary)" }} />
                                            <span className="text-sm text-text font-medium">{formatEnumLabel(service)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "location" && (
                        <div className="pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                <MapPin size={20} /> Location Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-heading mb-2">Street Address <span className="text-danger">*</span></label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                        placeholder="Street address" className={inputClass + " w-full " + errCls("address")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">City <span className="text-danger">*</span></label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        placeholder="City" className={inputClass + " w-full " + errCls("city")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">State <span className="text-danger">*</span></label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                                        placeholder="State" className={inputClass + " w-full " + errCls("state")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Pincode <span className="text-danger">*</span></label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                                        placeholder="Pincode" className={inputClass + " w-full " + errCls("pincode")} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "property" && (
                        <div className="pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                <Briefcase size={20} /> Property Details
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Size (sq ft) <span className="text-danger">*</span></label>
                                    <input type="number" name="propertySize" value={formData.propertySize} onChange={handleInputChange}
                                        placeholder="e.g., 1200" className={inputClass + " w-full " + errCls("propertySize")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Floors</label>
                                    <input type="number" name="numberOfFloors" value={formData.numberOfFloors} onChange={handleInputChange}
                                        placeholder="e.g., 2" className={inputClass + " w-full"} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Bedrooms</label>
                                    <input type="number" name="numberOfBedrooms" value={formData.numberOfBedrooms} onChange={handleInputChange}
                                        placeholder="e.g., 3" className={inputClass + " w-full"} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Bathrooms</label>
                                    <input type="number" name="numberOfBathrooms" value={formData.numberOfBathrooms} onChange={handleInputChange}
                                        placeholder="e.g., 2" className={inputClass + " w-full"} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "design" && (
                        <div className="space-y-6 pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading" style={{ fontFamily: "var(--font-heading)" }}>Design Preferences</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-3">Design Style <span className="text-danger">*</span></label>
                                    <div className={"grid grid-cols-2 gap-3 rounded-md " + (missingFields.includes("designStyle") ? "ring-1 ring-danger p-2" : "")}>
                                        {(ENUMS.designStyle || []).map((style) => (
                                            <label key={style} className="flex items-center gap-2.5 px-3.5 py-3 bg-background border border-border rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                                <input type="checkbox" checked={formData.designStyle.includes(style)}
                                                    onChange={() => handleMultiSelect("designStyle", style)}
                                                    className="w-4 h-4 rounded shrink-0" style={{ accentColor: "var(--primary)" }} />
                                                <span className="text-xs text-text">{formatEnumLabel(style)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-3">Space Requirements</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(ENUMS.spaceRequirements || []).map((space) => (
                                            <label key={space} className="flex items-center gap-2.5 px-3.5 py-3 bg-background border border-border rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                                                <input type="checkbox" checked={formData.spaceRequirements.includes(space)}
                                                    onChange={() => handleMultiSelect("spaceRequirements", space)}
                                                    className="w-4 h-4 rounded shrink-0" style={{ accentColor: "var(--primary)" }} />
                                                <span className="text-xs text-text">{formatEnumLabel(space)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-heading mb-3">Color Preferences <span className="text-danger">*</span></label>
                                <ColorPreferencesPicker
                                    value={formData.colorPreferences}
                                    onChange={(next) => { setFormData((p) => ({ ...p, colorPreferences: next })); clearValidation(); }}
                                    hasError={missingFields.includes("colorPreferences")}
                                />
                            </div>
                        </div>
                    )}
                    {currentStepKey === "space" && (
                        <div className="pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-5" style={{ fontFamily: "var(--font-heading)" }}>Current Space Context</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">What do you like about your current space? <span className="text-danger">*</span></label>
                                    <textarea name="currentSpaceLikes" value={formData.currentSpaceLikes} onChange={handleInputChange}
                                        placeholder="e.g., Natural light, Layout..." rows="4"
                                        className={inputClass + " w-full resize-none " + errCls("currentSpaceLikes")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">What problems need solving? <span className="text-danger">*</span></label>
                                    <textarea name="currentSpaceProblems" value={formData.currentSpaceProblems} onChange={handleInputChange}
                                        placeholder="e.g., Limited storage, Dark corners..." rows="4"
                                        className={inputClass + " w-full resize-none " + errCls("currentSpaceProblems")} />
                                </div>

                                {/* NEW FIELD — spans both columns */}
                                {/* <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-heading mb-2">Who will use this space? <span className="text-danger">*</span></label>
                                    <textarea name="spaceUsers" value={formData.spaceUsers} onChange={handleInputChange}
                                        placeholder="e.g., Family of 4, elderly parent, home office use..." rows="4"
                                        className={inputClass + " w-full resize-none " + errCls("spaceUsers")} />
                                </div> */}
                            </div>
                        </div>
                    )}

                    {currentStepKey === "budget" && (
                        <div className="pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                <IndianRupee size={20} /> Budget & Timeline
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Minimum Budget (₹) <span className="text-danger">*</span></label>
                                    <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange}
                                        placeholder="0" className={inputClass + " w-full " + errCls("budgetMin")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Maximum Budget (₹) <span className="text-danger">*</span></label>
                                    <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange}
                                        placeholder="0" className={inputClass + " w-full " + errCls("budgetMax")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Priority</label>
                                    <div className="relative">
                                        <select name="priority" value={formData.priority} onChange={handleInputChange}
                                            className={selectWrapClass}>
                                            {(ENUMS.priority || []).map((p) => <option key={p} value={p}>{formatEnumLabel(p)}</option>)}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2"><Calendar size={16} /> Start Date <span className="text-danger">*</span></label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                                        className={inputClass + " w-full " + errCls("startDate")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2"><Calendar size={16} /> Completion Date <span className="text-danger">*</span></label>
                                    <input type="date" name="completionDate" value={formData.completionDate} onChange={handleInputChange}
                                        className={inputClass + " w-full " + errCls("completionDate")} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "involvement" && (
                        <div className="pb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-5" style={{ fontFamily: "var(--font-heading)" }}>Involvement & Communication</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Your Involvement Level <span className="text-danger">*</span></label>
                                    <div className="relative">
                                        <select name="clientInvolvement" value={formData.clientInvolvement} onChange={handleInputChange}
                                            className={selectWrapClass + " " + errCls("clientInvolvement")}>
                                            <option value="">Select involvement level</option>
                                            {(ENUMS.clientInvolvement || []).map((l) => <option key={l} value={l}>{formatEnumLabel(l)}</option>)}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Preferred Communication <span className="text-danger">*</span></label>
                                    <div className="relative">
                                        <select name="preferredCommunication" value={formData.preferredCommunication} onChange={handleInputChange}
                                            className={selectWrapClass + " " + errCls("preferredCommunication")}>
                                            <option value="">Select communication method</option>
                                            {(ENUMS.preferredCommunication || []).map((c) => <option key={c} value={c}>{formatEnumLabel(c)}</option>)}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Preferred Working Hours <span className="text-danger">*</span></label>
                                    <input type="text" name="preferredWorkingHours" value={formData.preferredWorkingHours} onChange={handleInputChange}
                                        placeholder="e.g., 9 AM - 5 PM" className={inputClass + " w-full " + errCls("preferredWorkingHours")} />
                                </div>
                                <label className="flex items-center gap-3 px-4 py-3.5 bg-background border border-border rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors self-end">
                                    <input type="checkbox" name="siteVisitRequired" checked={formData.siteVisitRequired} onChange={handleInputChange}
                                        className="w-5 h-5 rounded shrink-0" style={{ accentColor: "var(--primary)" }} />
                                    <span className="text-text font-medium text-sm">Site visit required</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "files" && (
                        <div className="space-y-7 pb-6">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-heading mb-1 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                    <Upload size={20} /> Project Files
                                </h3>
                                <p className="text-xs text-muted mb-5">Upload up to {MAX_FILES_PER_TYPE} files per category. Property Photos are required.</p>
                                <div className="space-y-6">
                                    {FILE_FIELDS.map(({ key, label, accept }) => {
                                        const entries = files[key];
                                        const canAddMore = entries.length < MAX_FILES_PER_TYPE;
                                        const required = key === "propertyPhoto";
                                        const showError = required && missingFields.includes("propertyPhoto");
                                        return (
                                            <div key={key}>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <label className="text-sm font-medium text-heading">
                                                        {label} {required && <span className="text-danger">*</span>}
                                                    </label>
                                                    <span className="text-xs text-muted font-medium">{entries.length}/{MAX_FILES_PER_TYPE}</span>
                                                </div>
                                                <div className={"grid grid-cols-4 sm:grid-cols-4 gap-3 max-w-md rounded-md " + (showError ? "ring-1 ring-danger p-2" : "")}>
                                                    {entries.map((entry) => (
                                                        <FileSlot
                                                            key={entry.id}
                                                            entry={entry}
                                                            onRemove={() => removeFile(key, entry.id)}
                                                            onRetry={() => handleRetry(key, entry.id)}
                                                        />
                                                    ))}
                                                    {canAddMore && (
                                                        <button type="button" onClick={() => fileInputRefs.current[key]?.click()}
                                                            className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors">
                                                            <Upload size={18} className="text-muted" />
                                                            <span className="text-[10px] text-muted text-center px-1">Add</span>
                                                        </button>
                                                    )}
                                                </div>
                                                {showError && (
                                                    <p className="text-xs text-danger mt-1.5">Upload at least one property photo.</p>
                                                )}
                                                <input type="file" multiple ref={(el) => (fileInputRefs.current[key] = el)}
                                                    onChange={(e) => handleFileChange(e, key)} accept={accept} className="hidden" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-heading mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                    <FileText size={20} /> Additional Information
                                </h3>
                                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange}
                                    placeholder="Any additional notes, constraints, or special requests..." rows="4"
                                    maxLength={1000}
                                    className={inputClass + " w-full resize-none"} />
                                <div className="flex justify-end mt-1.5">
                                    <span className={"text-[11px] " + (formData.additionalNotes.length > 1000 ? "text-danger" : "text-muted")}>
                                        {formData.additionalNotes.length}/1000
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStepKey === "review" && (
                        <div className="pb-6 space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-heading mb-2" style={{ fontFamily: "var(--font-heading)" }}>Review Your Project</h3>
                            <div className="rounded-md border border-border bg-background p-5 space-y-3 text-sm text-text">
                                <p className="text-base"><strong>{formData.title || "Untitled Project"}</strong></p>
                                <p className="text-muted">{formatEnumLabel(formData.category)} · {formatEnumLabel(formData.propertyStatus)}</p>
                                <p>{[formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(", ") || "No address provided"}</p>
                                <p>₹{formData.budgetMin || "—"} - ₹{formData.budgetMax || "—"} · {formData.startDate || "—"} to {formData.completionDate || "—"}</p>
                                {formData.colorPreferences && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {formData.colorPreferences.split(",").map((v) => v.trim()).filter(Boolean).map((label) => (
                                            <span key={label} className="text-xs px-2 py-1 bg-white border border-border rounded-full">{label}</span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-muted">
                                    {(() => {
                                        const total = Object.values(files).reduce((sum, arr) => sum + arr.filter((f) => f.status === "success").length, 0);
                                        return total > 0
                                            ? FILE_FIELDS.filter(({ key }) => files[key].some((f) => f.status === "success"))
                                                .map(({ key, label }) => `${label} (${files[key].filter((f) => f.status === "success").length})`)
                                                .join(", ")
                                            : "No files attached";
                                    })()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 z-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 p-5 sm:p-6 border-t border-border bg-white">
                    {!isFirstStep && (
                        <button type="button" onClick={handleWizardBack}
                            className="flex items-center justify-center gap-1 px-6 py-3 border rounded-md font-semibold w-full sm:w-auto"
                            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                            <ChevronLeft size={18} /> Back
                        </button>
                    )}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                        <button type="button" onClick={closeForm}
                            className="px-6 py-3 border rounded-md font-semibold w-full sm:w-auto"
                            style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleWizardNext} disabled={isCreating || isAnyFileUploading}
                            className="px-6 py-3 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
                            style={{ backgroundColor: "var(--primary)" }}
                            onMouseEnter={(e) => { if (!isCreating && !isAnyFileUploading) e.currentTarget.style.backgroundColor = "var(--primary-hover)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; }}>
                            {isCreating && <Loader2 size={16} className="animate-spin" />}
                            {isLastStep ? (isCreating ? "Creating..." : "Create Project") : isAnyFileUploading ? "Uploading..." : "Next"}
                        </button>
                    </div>
                </div>



            </div>
        </div>,
        document.body
    );
}