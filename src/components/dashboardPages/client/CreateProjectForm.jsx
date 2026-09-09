import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "../../../theme.css";
import {
    useCreateProjectMutation,
    useGetProjectEnumsQuery,
} from "./Dashboard/overpageApiSlice";
import { useGetCategoriesAndSpecializationsQuery } from "../../../Authentication/authApiSlice";
import { uploadFile } from "../../../../superBase";
import {
    Upload, AlertCircle, CheckCircle, MapPin, Briefcase, Calendar,
    IndianRupee, FileText, ChevronDown, ChevronLeft, ChevronRight, X,
    Loader2, RotateCcw, Image as ImageIcon, Video as VideoIcon, Users,
    MessageCircle, Tag, Home, Ruler, Layers, BedDouble, Bath, Palette,
    Sofa, Heart, AlertTriangle, UserCheck, Clock, Wallet, Flag, StickyNote,
    Plus, Check, FileIcon, Sparkles,
} from "lucide-react";


const MAX_FILES_PER_TYPE = 4;

const FALLBACK_CATEGORIES = [
    {
        name: "Interior Designer",
        specializations: [
            "Residential Interior",
            "Commercial & Office Interior",
            "Modular Kitchen & Wardrobe",
            "Hospitality & Restaurant",
            "Living & Luxury Spaces",
            "Retail & Showroom Design",
        ],
    },
    {
        name: "Exterior Designer",
        specializations: [
            "Residential Elevation",
            "Commercial Facade Design",
            "Modern Villa Elevation",
            "Facade & Cladding Design",
            "Exterior Remodeling & Lighting",
        ],
    },
    {
        name: "AutoCAD Drafter",
        specializations: [
            "2D Architectural Drafting",
            "Working & Detail Drawings",
            "MEP & HVAC Drafting",
            "Approval & Submission Drawings",
            "Structural Layout Drafting",
        ],
    },
    {
        name: "Landscape Designer",
        specializations: [
            "Garden & Lawn Design",
            "Terrace & Balcony Gardens",
            "Urban & Public Landscapes",
            "Farmhouse & Resort Landscapes",
            "Hardscape & Water Features",
        ],
    },
    {
        name: "BIM Engineer",
        specializations: [
            "Revit BIM Modeling",
            "Clash Detection & Coordination",
            "4D / 5D BIM Simulation",
            "MEP BIM Modeling",
            "Structural BIM Engineering",
        ],
    },
    {
        name: "Product Designer",
        specializations: [
            "Custom Furniture Design",
            "Lighting & Luminaire Design",
            "Home Decor & Artifacts",
            "Millwork & Joinery Design",
            "Industrial Product Design",
        ],
    },
    {
        name: "Graphic Designer",
        specializations: [
            "Environmental & Signage Graphics",
            "Architectural Presentation & Pitch Decks",
            "Wall Art & Murals",
            "Brand Identity & Signage",
            "Marketing Collateral & 3D Infographics",
        ],
    },
    {
        name: "3D Modeler",
        specializations: [
            "3D Architectural Modeling",
            "Photorealistic Rendering",
            "3ds Max / Blender / SketchUp Modeling",
            "Furniture & Prop 3D Modeling",
            "Texturing & Lighting Specialist",
        ],
    },
    {
        name: "Walkthrough Specialist",
        specializations: [
            "3D Architectural Animation",
            "Lumion / Unreal Engine Walkthrough",
            "360° Virtual Tours & Panoramas",
            "Real-Time VR Experiences",
            "Cinematic Video Rendering",
        ],
    },
    {
        name: "Estimation Engineer",
        specializations: [
            "BOQ & Cost Estimation",
            "Quantity Surveying & Material Takeoff",
            "Material & Labor Costing",
            "Rate Analysis & Budgeting",
            "Tender & Contract Estimation",
        ],
    },
];

const SERVICES_OPTIONS = [
    {
        key: "ARCHITECT",
        label: "Architect",
        badge: "Planning & Structure",
        desc: "Design, structural blueprints, layout & approvals",
    },
    {
        key: "INTERIOR_DESIGNER",
        label: "Designer",
        badge: "Aesthetics & 3D",
        desc: "Interior concepts, layout, 3D visualizer & aesthetics",
    },
    {
        key: "CONTRACTOR",
        label: "Contractor",
        badge: "Build & Execution",
        desc: "Civil construction, MEP, fabrication & turnkey execution",
    },
];

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
    designerCategory: "Designer Category", designerSpecialization: "Specialization",
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
    title: "", category: "", scope: "FULL_PROJECT", servicesRequired: ["ARCHITECT", "CONTRACTOR", "INTERIOR_DESIGNER"], description: "",
    designerCategory: "", designerSpecialization: "", designerSpecializationLevel: "",
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

const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

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

    const { data: catSpecializationsRes } = useGetCategoriesAndSpecializationsQuery();
    const designerCategoriesList = (catSpecializationsRes?.data && catSpecializationsRes.data.length > 0)
        ? catSpecializationsRes.data
        : FALLBACK_CATEGORIES;

    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [files, setFiles] = useState(EMPTY_FILE_STATE);
    const [serverErrors, setServerErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [missingFields, setMissingFields] = useState([]);
    const [stepError, setStepError] = useState("");
    const fileInputRefs = useRef({});

    const selectedCatObj = designerCategoriesList.find(
        (c) => c.name === formData.designerCategory || c.id === formData.designerCategory
    );
    const availableDesignerSpecializations = selectedCatObj?.specializations || [];

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

        if (stepKey === "basic") {
            if (formData.servicesRequired.length === 0) {
                missing.push("servicesRequired");
            }
            if (formData.scope === "DESIGN_ONLY") {
                if (!formData.designerCategory) missing.push("designerCategory");
                if (!formData.designerSpecialization) missing.push("designerSpecialization");
            }
            if (formData.description.trim().length > 0) {
                const len = formData.description.trim().length;
                if (len < DESCRIPTION_MIN_LENGTH || len > DESCRIPTION_MAX_LENGTH) {
                    if (!missing.includes("description")) missing.push("description");
                }
            }
        }
        if (stepKey === "design") {
            if (formData.designStyle.length === 0) missing.push("designStyle");
            if (!formData.colorPreferences || !formData.colorPreferences.trim()) missing.push("colorPreferences");
        }
        if (stepKey === "budget") {
            const min = Number(formData.budgetMin);
            const max = Number(formData.budgetMax);

            if (formData.budgetMin === "" || Number.isNaN(min) || min < 1000) {
                if (!missing.includes("budgetMin")) missing.push("budgetMin");
            }
            if (formData.budgetMax === "" || Number.isNaN(max) || max < 1000) {
                if (!missing.includes("budgetMax")) missing.push("budgetMax");
            }
            if (formData.budgetMin !== "" && formData.budgetMax !== "" && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
                if (!missing.includes("budgetMin")) missing.push("budgetMin");
                if (!missing.includes("budgetMax")) missing.push("budgetMax");
            }
            const today = getTodayDateString();
            if (formData.startDate && formData.startDate < today) {
                if (!missing.includes("startDate")) missing.push("startDate");
            }
            if (formData.completionDate) {
                if (formData.completionDate < today) {
                    if (!missing.includes("completionDate")) missing.push("completionDate");
                }
                if (formData.startDate && formData.completionDate < formData.startDate) {
                    if (!missing.includes("completionDate")) missing.push("completionDate");
                }
            }
        }
        if (stepKey === "files") {
            const hasPhoto = files.propertyPhoto.some((f) => f.status === "success");
            if (!hasPhoto) missing.push("propertyPhoto");
            const hasRejected = Object.values(files).some((arr) => arr.some((it) => it.status === "error"));
            if (hasRejected) missing.push("rejectedFiles");
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
            let notes = formData.additionalNotes || "";
            if (formData.designerSpecialization) {
                const specTag = `[Designer Requirement: Category - ${formData.designerCategory || "Designer"}, Specialization - ${formData.designerSpecialization}${formData.designerSpecializationLevel ? `, Level - ${formData.designerSpecializationLevel}` : ""}]`;
                if (!notes.includes(specTag)) {
                    notes = notes ? `${notes}\n\n${specTag}` : specTag;
                }
            }
            const payload = {
                ...formData,
                additionalNotes: notes,
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

            if (currentStepKey === "budget") {
                const min = Number(formData.budgetMin);
                const max = Number(formData.budgetMax);
                if (formData.budgetMin !== "" && !Number.isNaN(min) && min < 1000) {
                    parts.push("Minimum Budget must be at least ₹1,000.");
                }
                if (formData.budgetMax !== "" && !Number.isNaN(max) && max < 1000) {
                    parts.push("Maximum Budget must be at least ₹1,000.");
                }
                if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
                    parts.push("Maximum Budget must be greater than or equal to Minimum Budget.");
                }
            }

            const today = getTodayDateString();
            if (formData.startDate && formData.startDate < today) {
                parts.push("Start Date cannot be in the past.");
            }
            if (formData.completionDate && formData.startDate && formData.completionDate < formData.startDate) {
                parts.push("Completion Date must be on or after Start Date.");
            } else if (formData.completionDate && formData.completionDate < today) {
                parts.push("Completion Date cannot be in the past.");
            }

            if (currentStepKey === "files" && missing.includes("rejectedFiles")) {
                parts.push("One or more images contain prohibited contact info (phone numbers or emails). Please remove rejected images to continue.");
            }

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
                className="relative w-full sm:w-[92%] md:w-[85%] lg:w-[75%] max-w-4xl max-h-[92vh] h-full sm:h-[88vh] flex flex-col bg-white border border-border rounded-lg sm:rounded-md overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex justify-between items-start gap-3 p-4 sm:p-6 pb-3 sm:pb-4 bg-white border-b border-border">
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-2xl font-bold text-heading truncate" style={{ fontFamily: "var(--font-heading)" }}>
                            Create New Project
                        </h2>
                        <p className="text-xs sm:text-sm text-muted mt-1">
                            Step {currentIndex + 1} of {stepKeys.length} · {STEP_META[currentStepKey]}
                        </p>
                    </div>
                    <button onClick={closeForm} className="text-muted hover:text-text transition-colors p-1 -mr-1 shrink-0 cursor-pointer" aria-label="Cancel">
                        <X size={22} />
                    </button>
                </div>

                <div className="w-full px-4 sm:px-8 pt-4 sm:pt-5 pb-2 flex-1 min-h-0 overflow-y-auto modal-scrollbar custom-scrollbar">
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

                        <div className="space-y-6">
                            {/* 4-Way Scope Selector */}
                            <div>
                                <label className="block text-sm font-bold text-heading mb-2">
                                    Project Scope <span className="text-danger">*</span>
                                </label>
                                <p className="text-xs text-muted mb-3">
                                    Choose the scope of work. Only role-relevant verified professionals will be notified.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {[
                                        {
                                            id: "FULL_PROJECT",
                                            title: "Full Project",
                                            subtitle: "Architecture + Build + Interiors",
                                            roles: ["ARCHITECT", "CONTRACTOR", "INTERIOR_DESIGNER"],
                                            badge: "3-Phase Pipeline",
                                        },
                                        {
                                            id: "ARCHITECTURE_ONLY",
                                            title: "Architecture & Planning",
                                            subtitle: "Blueprints, Structure & Approvals",
                                            roles: ["ARCHITECT"],
                                            badge: "Architects Only",
                                        },
                                        {
                                            id: "CONSTRUCTION_ONLY",
                                            title: "Construction & Build",
                                            subtitle: "Civil, MEP & Structural Execution",
                                            roles: ["CONTRACTOR"],
                                            badge: "Contractors Only",
                                        },
                                        {
                                            id: "DESIGN_ONLY",
                                            title: "Designer",
                                            subtitle: "Design Concepts, 3D & Styling",
                                            roles: ["INTERIOR_DESIGNER"],
                                            badge: "Designers Only",
                                        },
                                    ].map((opt) => {
                                        const isSelected = formData.scope === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => {
                                                    setFormData((p) => ({
                                                        ...p,
                                                        scope: opt.id,
                                                        servicesRequired: opt.roles,
                                                    }));
                                                    clearValidation();
                                                }}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                                                    isSelected
                                                        ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-xs"
                                                        : "border-border bg-background hover:border-[var(--primary)]/40 hover:bg-black/5"
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold text-heading">{opt.title}</span>
                                                        <span
                                                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                                isSelected
                                                                    ? "bg-[var(--primary)] text-white"
                                                                    : "bg-black/10 text-muted"
                                                            }`}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-muted leading-tight">{opt.subtitle}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Designer Category & Specialization Dropdowns */}
                            {(formData.scope === "DESIGN_ONLY" || formData.scope === "FULL_PROJECT" || formData.servicesRequired.includes("INTERIOR_DESIGNER")) && (
                                <div className="p-4 sm:p-5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 space-y-3 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[var(--primary)]/15">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shrink-0" />
                                            <h4 className="text-xs sm:text-sm font-bold text-heading uppercase tracking-wider">
                                                Designer Category & Specialization
                                            </h4>
                                        </div>
                                        <span className="text-[11px] text-muted">
                                            Choose category & specialization for your designer
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
                                        {/* Category Dropdown */}
                                        <div>
                                            <label className="block text-xs font-semibold text-heading mb-1.5">
                                                Designer Category <span className="text-danger">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="designerCategory"
                                                    value={formData.designerCategory || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setFormData((p) => ({
                                                            ...p,
                                                            designerCategory: val,
                                                            designerSpecialization: "",
                                                        }));
                                                        clearValidation();
                                                    }}
                                                    className={selectWrapClass + " text-xs sm:text-sm " + (missingFields.includes("designerCategory") ? errorRingClass : "")}
                                                >
                                                    <option value="">Select Designer Category</option>
                                                    {designerCategoriesList.map((cat) => (
                                                        <option key={cat.id || cat.name} value={cat.name}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Specialization Dropdown */}
                                        <div>
                                            <label className="block text-xs font-semibold text-heading mb-1.5">
                                                Specialization <span className="text-danger">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="designerSpecialization"
                                                    value={formData.designerSpecialization || ""}
                                                    disabled={!formData.designerCategory || availableDesignerSpecializations.length === 0}
                                                    onChange={(e) => {
                                                        setFormData((p) => ({
                                                            ...p,
                                                            designerSpecialization: e.target.value,
                                                        }));
                                                        clearValidation();
                                                    }}
                                                    className={selectWrapClass + " text-xs sm:text-sm " + (missingFields.includes("designerSpecialization") ? errorRingClass : "")}
                                                >
                                                    <option value="">
                                                        {!formData.designerCategory
                                                            ? "Select Category First"
                                                            : availableDesignerSpecializations.length === 0
                                                            ? "No Specializations Available"
                                                            : "Select Specialization"}
                                                    </option>
                                                    {availableDesignerSpecializations.map((spec) => {
                                                        const specName = typeof spec === "string" ? spec : spec.name;
                                                        const specId = typeof spec === "object" ? spec.id : specName;
                                                        return (
                                                            <option key={specId || specName} value={specName}>
                                                                {specName}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Specialization Level */}
                                        <div>
                                            <label className="block text-xs font-semibold text-heading mb-1.5">
                                                Specialization Level <span className="text-muted font-normal">(Optional)</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="designerSpecializationLevel"
                                                    value={formData.designerSpecializationLevel || ""}
                                                    onChange={(e) => {
                                                        setFormData((p) => ({
                                                            ...p,
                                                            designerSpecializationLevel: e.target.value,
                                                        }));
                                                    }}
                                                    className={selectWrapClass + " text-xs sm:text-sm"}
                                                >
                                                    <option value="">Any Level</option>
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Professional">Professional</option>
                                                </select>
                                                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3-Phase Pipeline Preview when FULL_PROJECT is selected */}
                            {formData.scope === "FULL_PROJECT" && (
                                <div className="p-4 bg-[var(--background-secondary)] rounded-lg border border-border space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                                        <Layers size={15} /> 3-Phase Multi-Award Workflow Preview
                                    </div>
                                    <p className="text-xs text-muted">
                                        You can award one winning bid per profession independently. Execution and milestone payments proceed in strict sequential phases:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                                        <div className="p-2.5 bg-white rounded border border-border/80 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                                            <div>
                                                <span className="font-bold text-heading block">Planning Phase</span>
                                                <span className="text-[10px] text-muted">Led by Architect</span>
                                            </div>
                                        </div>
                                        <div className="p-2.5 bg-white rounded border border-border/80 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">2</span>
                                            <div>
                                                <span className="font-bold text-heading block">Construction Phase</span>
                                                <span className="text-[10px] text-muted">Led by Contractor</span>
                                            </div>
                                        </div>
                                        <div className="p-2.5 bg-white rounded border border-border/80 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                                            <div>
                                                <span className="font-bold text-heading block">Interiors Phase</span>
                                                <span className="text-[10px] text-muted">Led by Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-heading mb-2">Project Title <span className="text-danger">*</span></label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                            placeholder="e.g., Modern Villa Construction & Interior Design" className={inputClass + " w-full " + errCls("title")} />
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
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-heading">
                                                Services Required <span className="text-danger">*</span>
                                            </label>
                                            <p className="text-xs text-muted">
                                                Select a specific service, multiple services, or all three for your project
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const allKeys = SERVICES_OPTIONS.map((s) => s.key);
                                                const allSelected = allKeys.every((k) => formData.servicesRequired.includes(k));
                                                setFormData((p) => ({
                                                    ...p,
                                                    servicesRequired: allSelected ? [] : allKeys,
                                                    scope: allSelected ? p.scope : "FULL_PROJECT",
                                                }));
                                                clearValidation();
                                            }}
                                            className="self-start sm:self-auto text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 transition-colors cursor-pointer"
                                        >
                                            {SERVICES_OPTIONS.every((s) => formData.servicesRequired.includes(s.key))
                                                ? "Deselect All"
                                                : "Select All 3 Services"}
                                        </button>
                                    </div>

                                    <div className={"flex flex-col gap-3 rounded-lg " + (missingFields.includes("servicesRequired") ? "ring-2 ring-danger p-2 bg-danger/5" : "")}>
                                        {SERVICES_OPTIONS.map((service) => {
                                            const isChecked = formData.servicesRequired.includes(service.key);
                                            return (
                                                <label
                                                    key={service.key}
                                                    className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                                                        isChecked
                                                            ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-xs"
                                                            : "border-border bg-background hover:border-[var(--primary)]/40 hover:bg-black/5"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={service.key}
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            setFormData((p) => {
                                                                const cur = p.servicesRequired || [];
                                                                const next = cur.includes(service.key)
                                                                    ? cur.filter((v) => v !== service.key)
                                                                    : [...cur, service.key];
                                                                let newScope = p.scope;
                                                                if (next.length === 3) newScope = "FULL_PROJECT";
                                                                else if (next.length === 1 && next[0] === "ARCHITECT") newScope = "ARCHITECTURE_ONLY";
                                                                else if (next.length === 1 && next[0] === "CONTRACTOR") newScope = "CONSTRUCTION_ONLY";
                                                                else if (next.length === 1 && next[0] === "INTERIOR_DESIGNER") newScope = "DESIGN_ONLY";
                                                                return { ...p, servicesRequired: next, scope: newScope };
                                                            });
                                                            setServerErrors([]);
                                                            clearValidation();
                                                        }}
                                                        className="w-4 h-4 rounded shrink-0 cursor-pointer"
                                                        style={{ accentColor: "var(--primary)" }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                                            <span className={`text-sm font-bold ${isChecked ? "text-[var(--primary)]" : "text-heading"}`}>
                                                                {service.label}
                                                            </span>
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                                isChecked ? "bg-[var(--primary)] text-white" : "bg-black/10 text-muted"
                                                            }`}>
                                                                {service.badge}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted leading-snug">
                                                            {service.desc}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {missingFields.includes("servicesRequired") && (
                                        <p className="text-xs text-danger mt-1.5 font-medium">
                                            Please select at least one service required.
                                        </p>
                                    )}
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
                                    <input type="number" name="budgetMin" min="1000" value={formData.budgetMin} onChange={handleInputChange}
                                        placeholder="1000" className={inputClass + " w-full " + errCls("budgetMin")} />
                                    <p className="text-[11px] text-muted mt-1">Min. ₹1,000</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">Maximum Budget (₹) <span className="text-danger">*</span></label>
                                    <input type="number" name="budgetMax" min="1000" value={formData.budgetMax} onChange={handleInputChange}
                                        placeholder="5000" className={inputClass + " w-full " + errCls("budgetMax")} />
                                    <p className="text-[11px] text-muted mt-1">Must be ≥ Min Budget</p>
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
                                    <input type="date" name="startDate" min={getTodayDateString()} value={formData.startDate} onChange={handleInputChange}
                                        className={inputClass + " w-full " + errCls("startDate")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2"><Calendar size={16} /> Completion Date <span className="text-danger">*</span></label>
                                    <input type="date" name="completionDate" min={formData.startDate || getTodayDateString()} value={formData.completionDate} onChange={handleInputChange}
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
                                {formData.designerSpecialization && (
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--primary)] font-semibold bg-[var(--primary)]/5 p-2 rounded border border-[var(--primary)]/20">
                                        <span>Designer: {formData.designerCategory || "Designer"}</span>
                                        <span>•</span>
                                        <span>Specialization: {formData.designerSpecialization}</span>
                                        {formData.designerSpecializationLevel && (
                                            <>
                                                <span>•</span>
                                                <span className="px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[11px] font-bold">
                                                    {formData.designerSpecializationLevel}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
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