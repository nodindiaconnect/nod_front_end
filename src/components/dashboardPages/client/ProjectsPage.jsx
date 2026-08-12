
import React, { useState } from "react";
import "../../../theme.css";
import { useListProjectsQuery, useUpdateProjectAvailabilityMutation } from "./Dashboard/overpageApiSlice";
import Table, { ExpandableCell } from "../../../global/Table";
import Loader from "../../../global/Loader";
import CreateProjectForm from "./CreateProjectForm";
import Pagination from "../../../global/pagination";
import {
    Plus, CheckCircle, MapPin, Briefcase, Calendar,
    FileText, ChevronLeft, ChevronRight, X, Upload, Image as ImageIcon,
    Video as VideoIcon, Users, MessageCircle, Tag, Home, Ruler, Layers,
    BedDouble, Bath, Palette, Sofa, Heart, AlertTriangle, UserCheck, Clock,
    Wallet, Flag, StickyNote, FolderKanban, IndianRupee, Globe, Lock
} from "lucide-react";

const STATUS_BADGE = {
    WAITING_FOR_QUOTATIONS: { label: "Waiting Quotations", color: "var(--warning)" },
    PROPOSALS_RECEIVED: { label: "Proposals Received", color: "var(--gold)" },
    IN_PROGRESS: { label: "Active", color: "var(--primary)" },
    COMPLETED: { label: "Completed", color: "var(--success)" },
    CANCELLED: { label: "Cancelled", color: "var(--danger)" },
};

const FILE_FIELDS = [
    { key: "floorPlan", label: "Floor Plan", attachmentType: "FLOOR_PLAN" },
    { key: "propertyPhoto", label: "Property Photos", attachmentType: "PROPERTY_PHOTO" },
    { key: "referenceImage", label: "Reference Images", attachmentType: "REFERENCE_IMAGE" },
    { key: "video", label: "Video Tour", attachmentType: "VIDEO" },
];

const STEP_META = {
    basic: "Basics", location: "Location", property: "Property", design: "Design",
    space: "Current Space", budget: "Budget", involvement: "Communication", files: "Files & Notes",
};

const STATUS_STYLE = {
    WAITING_FOR_QUOTATIONS: "Waiting Quotations",
    PROPOSALS_RECEIVED: "Proposals Received",
    IN_PROGRESS: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const formatEnumLabel = (v) =>
    !v ? "" : v.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");

const isVideoUrl = (url = "") => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);

const getSectionsForStatus = (propertyStatus) => {
    const base = ["basic", "location", "property", "design"];
    if (propertyStatus !== "NEW_CONSTRUCTION") base.push("space");
    base.push("budget", "involvement", "files");
    return base;
};


function SectionHeading({ children, Icon }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            {Icon && (
                <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--background-secondary)" }}>
                    <Icon size={15} style={{ color: "var(--primary)" }} />
                </div>
            )}
            <h3
                className="text-sm uppercase tracking-wide text-heading"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
                {children}
            </h3>
        </div>
    );
}

function DetailRow({ label, value, Icon }) {
    return (
        <div className="flex items-start gap-3 py-3 px-1">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "var(--background-secondary)" }}>
                {Icon && <Icon size={15} style={{ color: "var(--primary)" }} />}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wide text-muted mb-0.5" style={{ fontWeight: 700 }}>
                    {label}
                </div>
                <div className="text-sm text-heading break-words" style={{ fontWeight: 400 }}>
                    {value === "" || value === null || value === undefined ? "—" : value}
                </div>
            </div>
        </div>
    );
}

function DetailGrid({ items }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 rounded-sm border border-border p-2 sm:p-3 bg-background">
            {items.map((item, idx) => <DetailRow key={idx} {...item} />)}
        </div>
    );
}

function ProjectDetailsModal({ project, onClose }) {
    const [sectionIndex, setSectionIndex] = useState(0);
    if (!project) return null;

    const isVideoUrl = (url = "") => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);
    const isPdfUrl = (url = "") => /\.pdf$/i.test(url);
    const isUnrenderableImage = (url = "") => /\.(heic|heif)$/i.test(url);

    const sectionKeys = getSectionsForStatus(project.propertyStatus);
    const currentKey = sectionKeys[sectionIndex] || sectionKeys[0];
    const isFirst = sectionIndex === 0;
    const isLast = sectionIndex === sectionKeys.length - 1;

    const attachmentsByType = (project.attachments || []).reduce((acc, att) => {
        acc[att.type] = acc[att.type] || [];
        acc[att.type].push(att);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
            <div className="w-full sm:max-w-3xl bg-white sm:rounded-sm flex flex-col" style={{ maxHeight: "92vh" }} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-start gap-3 p-4 sm:p-5 border-b border-border">
                    <div className="min-w-0 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--primary)" }}>
                            <Briefcase size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2
                                className="text-lg sm:text-xl"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 700,
                                    color: "var(--heading)",
                                }}
                            >
                                <span
                                    className="text-sm font-semibold uppercase tracking-wider mr-2"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    Title :--
                                </span>

                                <span className="text-heading">
                                    {project.title || "Project Details"}
                                </span>
                            </h2>
                            <p className="text-xs sm:text-sm text-muted mt-0.5" style={{ fontWeight: 400 }}>
                                Section {sectionIndex + 1} of {sectionKeys.length} · {STEP_META[currentKey]}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-text transition-colors p-1 -mr-1 shrink-0" aria-label="Close">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-5 py-4 overflow-y-auto flex-1 space-y-5">

                    {currentKey === "basic" && (
                        <>
                            <div>
                                <SectionHeading Icon={FileText}>Basic Information</SectionHeading>
                                <div className="space-y-3">
                                    <DetailGrid items={[
                                        { label: "Project Title", value: project.title, Icon: FileText },
                                        { label: "Current Stage", value: formatEnumLabel(project.status), Icon: CheckCircle },
                                    ]} />
                                    <DetailGrid items={[
                                        { label: "Category", value: formatEnumLabel(project.category), Icon: Tag },
                                        { label: "Property Status", value: formatEnumLabel(project.propertyStatus), Icon: Home },
                                    ]} />
                                    <DetailGrid items={[
                                        { label: "Services Required", value: (project.servicesRequired || []).map(formatEnumLabel).join(", "), Icon: Briefcase },
                                    ]} />
                                </div>
                            </div>

                            <div>
                                <SectionHeading Icon={FileText}>Description</SectionHeading>
                                <div className="rounded-sm border border-border p-3 bg-background">
                                    <div className="text-sm text-heading whitespace-pre-wrap break-words" style={{ fontWeight: 400 }}>
                                        {project.description || "—"}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {currentKey === "location" && (
                        <div>
                            <SectionHeading Icon={MapPin}>Location Details</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "Address", value: project.address, Icon: MapPin },
                                    { label: "City", value: project.city, Icon: MapPin },
                                ]} />
                                <DetailGrid items={[
                                    { label: "State", value: project.state, Icon: MapPin },
                                    { label: "Pincode", value: project.pincode, Icon: MapPin },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "property" && (
                        <div>
                            <SectionHeading Icon={Briefcase}>Property Details</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "Property Size (sq ft)", value: project.propertySize, Icon: Ruler },
                                    { label: "Number of Floors", value: project.numberOfFloors, Icon: Layers },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Number of Bedrooms", value: project.numberOfBedrooms, Icon: BedDouble },
                                    { label: "Number of Bathrooms", value: project.numberOfBathrooms, Icon: Bath },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "design" && (
                        <div>
                            <SectionHeading Icon={Palette}>Design Preferences</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "Design Style", value: (project.designStyle || []).map(formatEnumLabel).join(", "), Icon: Palette },
                                    { label: "Space Requirements", value: (project.spaceRequirements || []).map(formatEnumLabel).join(", "), Icon: Sofa },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Color Preferences", value: project.colorPreferences, Icon: Palette },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "space" && (
                        <div>
                            <SectionHeading Icon={Heart}>Current Space Context</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "What they like", value: project.currentSpaceLikes, Icon: Heart },
                                    { label: "Problems to solve", value: project.currentSpaceProblems, Icon: AlertTriangle },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Accessibility Needs", value: project.accessibilityNeeds, Icon: UserCheck },
                                    { label: "Who uses the space", value: project.spaceUsers, Icon: Users },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "budget" && (
                        <div>
                            <SectionHeading Icon={IndianRupee}>Budget & Timeline</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "Minimum Budget", value: project.budgetMin ? `₹${project.budgetMin}` : "", Icon: IndianRupee },
                                    { label: "Maximum Budget", value: project.budgetMax ? `₹${project.budgetMax}` : "", Icon: IndianRupee },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Start Date", value: project.startDate ? new Date(project.startDate).toLocaleDateString() : "", Icon: Calendar },
                                    { label: "Completion Date", value: project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "", Icon: Calendar },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Priority", value: formatEnumLabel(project.priority), Icon: Flag },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "involvement" && (
                        <div>
                            <SectionHeading Icon={Users}>Involvement & Communication</SectionHeading>
                            <div className="space-y-3">
                                <DetailGrid items={[
                                    { label: "Client Involvement", value: formatEnumLabel(project.clientInvolvement), Icon: Users },
                                    { label: "Preferred Communication", value: formatEnumLabel(project.preferredCommunication), Icon: MessageCircle },
                                ]} />
                                <DetailGrid items={[
                                    { label: "Preferred Working Hours", value: project.preferredWorkingHours, Icon: Clock },
                                    { label: "Site Visit Required", value: project.siteVisitRequired ? "Yes" : "No", Icon: MapPin },
                                ]} />
                            </div>
                        </div>
                    )}

                    {currentKey === "files" && (
                        <>
                            <div>
                                <SectionHeading Icon={Upload}>Attachments</SectionHeading>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {FILE_FIELDS.map(({ key, label, attachmentType }) => {
                                        const items = attachmentsByType[attachmentType] || [];
                                        return (
                                            <div key={key} className="rounded-sm border border-border p-3 bg-background">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--background-secondary)" }}>
                                                        <ImageIcon size={14} style={{ color: "var(--primary)" }} />
                                                    </div>
                                                    <span className="text-xs text-heading uppercase tracking-wide" style={{ fontWeight: 700 }}>{label}</span>
                                                </div>
                                                {items.length === 0 ? (
                                                    <div className="text-sm text-muted italic pl-1" style={{ fontWeight: 400 }}>
                                                        No {label.toLowerCase()} uploaded
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {items.map((att) => (
                                                            <a key={att.id} href={att.url} target="_blank" rel="noreferrer"
                                                                className="block rounded-sm overflow-hidden border border-border hover:border-primary transition-colors bg-white aspect-square relative">
                                                                {isVideoUrl(att.url) ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                        <VideoIcon size={20} className="text-muted" />
                                                                        <span className="text-[9px] text-muted px-1 text-center" style={{ fontWeight: 400 }}>View video</span>
                                                                    </div>
                                                                ) : isPdfUrl(att.url) ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                        <FileText size={20} className="text-muted" />
                                                                        <span className="text-[9px] text-muted px-1 text-center" style={{ fontWeight: 400 }}>View PDF</span>
                                                                    </div>
                                                                ) : isUnrenderableImage(att.url) ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                        <ImageIcon size={20} className="text-muted" />
                                                                        <span className="text-[9px] text-muted px-1 text-center" style={{ fontWeight: 400 }}>View image</span>
                                                                    </div>
                                                                ) : (
                                                                    <img src={att.url} alt={label} className="w-full h-full object-cover" />
                                                                )}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <SectionHeading Icon={StickyNote}>Additional Notes</SectionHeading>
                                <div className="rounded-sm border border-border p-3 bg-background">
                                    <div className="text-sm text-heading whitespace-pre-wrap break-words" style={{ fontWeight: 400 }}>
                                        {project.additionalNotes || "—"}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-4 sm:p-5 border-t border-border">
                    {!isFirst ? (
                        <button type="button" onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
                            className="flex items-center gap-1 px-5 py-2.5 border rounded-sm"
                            style={{ borderColor: "var(--primary)", color: "var(--primary)", fontWeight: 600 }}>
                            <ChevronLeft size={18} /> Back
                        </button>
                    ) : <span />}
                    <div className="ml-auto flex gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-sm"
                            style={{ borderColor: "var(--border)", color: "var(--muted)", fontWeight: 600 }}>
                            Close
                        </button>
                        {!isLast && (
                            <button type="button" onClick={() => setSectionIndex((i) => Math.min(sectionKeys.length - 1, i + 1))}
                                className="flex items-center gap-1 px-5 py-2.5 text-white rounded-sm"
                                style={{ backgroundColor: "var(--primary)", fontWeight: 600 }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}>
                                Next <ChevronRight size={18} />
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
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");

    const { data: projectsData, isLoading: isLoadingProjects, isFetching } = useListProjectsQuery({
        page: currentPage,
        limit: limit,
        ...(statusFilter && { status: statusFilter }),
    });



    const handleAvailabilityChange = async (projectId, currentStatus, newStatus) => {
        try {
            await updateProjectAvailability({
                projectId,
                status: newStatus,
            }).unwrap();
            // Success - refetch will happen automatically via invalidatesTags
        } catch (error) {
            console.error("Failed to update availability:", error);
            alert("Failed to update project status");
        }
    };


    const [updateProjectAvailability, { isLoading: isUpdatingAvailability }] = useUpdateProjectAvailabilityMutation();

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const projectColumns = [
        {
            key: "title",
            label: "Project Details",
            icon: FolderKanban,
            width: "20%",
            render: (project) => (
                <div className="min-w-0 flex flex-col gap-4">

                    {/* Title */}
                    <div>
                        <div
                            className="text-[11px] font-extrabold uppercase tracking-widest mb-2"
                            style={{ color: "var(--heading)" }}
                        >
                            TITLE
                        </div>

                        <div
                            className="text-base font-semibold leading-6"
                            style={{
                                color: "var(--text)",
                                fontFamily: "var(--font-heading)",
                            }}
                        >
                            {project.title}
                        </div>
                    </div>

                    {/* Divider */}
                    {/* <div className="border-t border-border"></div> */}

                    {/* Description */}
                    <div>
                        <div
                            className="text-[11px] font-extrabold uppercase tracking-widest mb-2"
                            style={{ color: "var(--heading)" }}
                        >
                            DESCRIPTION
                        </div>

                        <div
                            className="text-sm leading-6"
                            style={{ color: "var(--text)" }}
                        >
                            <p className="line-clamp-2">
                                {project.description}
                            </p>

                            {project.description &&
                                project.description.length > 80 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProject(project);
                                        }}
                                        className="text-xs font-semibold mt-2 hover:underline"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        Read more →
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            label: "Category & Priority",
            icon: Tag,
            width: "15%",
            render: (project) => (
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <ExpandableCell
                            text={formatEnumLabel(project.category)}
                            maxLines={1}
                        />
                    </span>

                    <span className="text-lg font-bold text-text leading-none">
                        &amp;
                    </span>

                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium">
                        <ExpandableCell
                            text={formatEnumLabel(project.priority)}
                            maxLines={1}
                        />
                    </span>
                </div>
            ),
        },
        {
            key: "location", label: "Location", icon: MapPin, width: "15%",
            render: (project) => <ExpandableCell text={`${project.city}, ${project.state}`} maxLines={2} />,
        },
        {
            key: "budget", label: "Budget", icon: IndianRupee, width: "14%",
            render: (project) => (
                <span className="text-xs leading-snug">
                    ₹{project.budgetMin} – ₹{project.budgetMax}
                </span>
            ),
        },
        {
            key: "status", label: "Status", icon: CheckCircle, width: "13%",
            render: (project) => {
                const s = STATUS_BADGE[project.status] || STATUS_BADGE.WAITING_FOR_QUOTATIONS;
                return (
                    <span
                        className="text-[10px] px-2 py-1 rounded-sm font-semibold uppercase tracking-wide inline-block"
                        style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}
                    >
                        {s.label}
                    </span>
                );
            },
        },
        {
            key: "timeline", label: "Timeline", icon: Calendar, width: "13%",
            render: (project) => (
                <span className="text-xs">
                    {new Date(project.startDate).toLocaleDateString()} – {new Date(project.completionDate).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: "actions", label: "Actions", width: "20%",
            render: (project) => (
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1.5 text-white rounded-sm font-medium text-xs transition-colors whitespace-nowrap"
                        style={{ backgroundColor: "var(--primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                    >
                        Details
                    </button>

                    {project.availabilityStatus === "CLOSED" ? (
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-sm font-medium text-xs transition-colors whitespace-nowrap text-white"
                            style={{ backgroundColor: "#10b981" }}
                            disabled={isUpdatingAvailability}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAvailabilityChange(project.id, "CLOSED", "OPEN");
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
                        >
                            <Globe size={14} /> Publish
                        </button>
                    ) : (
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-sm font-medium text-xs transition-colors whitespace-nowrap text-white"
                            style={{ backgroundColor: "#ef4444" }}
                            disabled={isUpdatingAvailability}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAvailabilityChange(project.id, "OPEN", "CLOSED");
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
                        >
                            <Lock size={14} /> Close
                        </button>
                    )}
                </div>
            ),
        },

    ];

    return (
        <div className="min-h-screen w-full bg-background text-text">
            <div className="w-full max-w-none py-2 px-3 sm:px-6 lg:px-10 sm:py-8">
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                        Projects
                    </h1>
                    <p className="text-sm sm:text-base text-muted">Create and manage your design projects</p>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mb-6 flex items-center gap-2 px-6 py-3 text-white rounded-sm font-medium transition-colors w-full sm:w-auto justify-center"
                        style={{ backgroundColor: "var(--primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                    >
                        <Plus size={20} /> Create New Project
                    </button>
                )}

                {showForm && <CreateProjectForm onClose={() => setShowForm(false)} />}

                <div className="w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
                            Your Projects
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {["", "WAITING_FOR_QUOTATIONS", "PROPOSALS_RECEIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
                                <button
                                    key={s || "ALL"}
                                    onClick={() => handleStatusFilter(s)}
                                    className="text-[10px] sm:text-[11px] px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors"
                                    style={{
                                        backgroundColor: statusFilter === s ? "var(--primary)" : "var(--background-secondary)",
                                        color: statusFilter === s ? "#fff" : "var(--muted)",
                                    }}
                                >
                                    {s ? STATUS_STYLE[s] : "All"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoadingProjects ? (
                        <Loader />
                    ) : projectsData?.data && projectsData.data.length > 0 ? (
                        <>
                            <div className="w-full overflow-x-auto">
                                <Table
                                    columns={projectColumns}
                                    data={projectsData.data}
                                    showSerialNo={true}
                                    startIndex={(currentPage - 1) * limit}
                                    rowKey="id"
                                    minWidth="900px"
                                    emptyMessage="No projects yet."
                                />
                            </div>

                            <Pagination
                                pagination={projectsData.pagination}
                                onPageChange={handlePageChange}
                                isFetching={isFetching}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase size={48} className="mx-auto text-muted opacity-50 mb-4" />
                            <p className="text-muted mb-4">
                                {statusFilter ? "No projects match this filter." : "No projects yet. Create one to get started."}
                            </p>
                            {!statusFilter && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-2 text-white rounded-sm font-medium transition-colors"
                                    style={{ backgroundColor: "var(--primary)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                                >
                                    Create Your First Project
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </div>
    );
}
