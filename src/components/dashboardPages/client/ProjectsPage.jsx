import React, { useState ,useEffect } from "react";
import "../../../theme.css";

const injectModalAnimationOnce = (() => {
    let injected = false;
    return () => {
        if (injected || typeof document === "undefined") return;
        injected = true;
        const style = document.createElement("style");
        style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
        document.head.appendChild(style);
    };
})();
import { useListProjectsQuery, useUpdateProjectAvailabilityMutation } from "./Dashboard/overpageApiSlice";
import Table, { ExpandableCell } from "../../../global/Table";
import Loader from "../../../global/Loader";
import CreateProjectForm from "./CreateProjectForm";
import Pagination from "../../../global/pagination";
import ProjectWorkspace from "../../dashboard/shared/ProjectWorkspace";
import {
    Plus, CheckCircle, MapPin, Briefcase, Calendar,
    FileText, X, Upload, Image as ImageIcon,
    Video as VideoIcon, Users, MessageCircle, Tag, Home, Ruler, Layers,
    BedDouble, Bath, Palette, Sofa, Heart, AlertTriangle, UserCheck, Clock,
    Flag, StickyNote, FolderKanban, IndianRupee, Globe, Lock,
    ListChecks, Wallet, FolderOpen,
} from "lucide-react";


const STATUS_BADGE = {
    WAITING_FOR_QUOTATIONS: { label: "Waiting Quotations", color: "var(--warning)" },
    PROPOSALS_RECEIVED: { label: "Proposals Received", color: "var(--gold)" },
    PAYMENT_REQUIRED: { label: "Payment Due", color: "var(--warning)" },
    IN_PROGRESS: { label: "Active", color: "var(--primary)" },
    COMPLETED: { label: "Completed", color: "var(--success)" },
    CANCELLED: { label: "Cancelled", color: "var(--danger)" },
};

const STATUS_PILL_CONFIG = {
    WAITING_FOR_QUOTATIONS: {
        label: "WAITING QUOTATIONS",
        bg: "#FEF6E7",
        border: "#FCD38D",
        text: "#B45309",
        dot: "#D97706",
    },
    PROPOSALS_RECEIVED: {
        label: "PROPOSALS RECEIVED",
        bg: "#EFF6FF",
        border: "#BFDBFE",
        text: "#1D4ED8",
        dot: "#2563EB",
    },
    PAYMENT_REQUIRED: {
        label: "PAYMENT DUE",
        bg: "#FFFBEB",
        border: "#FDE68A",
        text: "#92400E",
        dot: "#F59E0B",
    },
    IN_PROGRESS: {
        label: "ACTIVE",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        text: "#047857",
        dot: "#059669",
    },
    COMPLETED: {
        label: "COMPLETED",
        bg: "#F0FDF4",
        border: "#BBF7D0",
        text: "#15803D",
        dot: "#16A34A",
    },
    CANCELLED: {
        label: "CANCELLED",
        bg: "#FEF2F2",
        border: "#FECACA",
        text: "#B91C1C",
        dot: "#DC2626",
    },
};

const formatEnumLabel = (v) =>
    !v ? "" : v.split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");

const formatServicesRequired = (project) => {
    if (project.servicesRequired && Array.isArray(project.servicesRequired) && project.servicesRequired.length > 0) {
        const labels = {
            ARCHITECT: "Architecture",
            INTERIOR_DESIGNER: "Interiors",
            CONTRACTOR: "Construction",
        };
        return project.servicesRequired.map((s) => labels[s] || formatEnumLabel(s)).join(", ");
    }
    if (typeof project.servicesRequired === "string" && project.servicesRequired) {
        return formatEnumLabel(project.servicesRequired);
    }
    if (project.propertyStatus) {
        return formatEnumLabel(project.propertyStatus);
    }
    return "Architecture, Interiors & Construction";
};

const formatTimeline = (project) => {
    const formatSingle = (d) => {
        if (!d) return null;
        try {
            const date = new Date(d);
            if (isNaN(date.getTime())) return null;
            return date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return null;
        }
    };

    const start = formatSingle(project.startDate) || (project.createdAt ? formatSingle(project.createdAt) : "9 Oct 2026");
    const end = formatSingle(project.completionDate) || "14 Nov 2026";

    return { start, end };
};

import ProjectDetailsModal from "../../../global/Projectdetailsmodal";
import EditProjectModal from "./EditProjectModal";
import { Pencil, Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";

export default function ProjectsPage() {
    const [showForm, setShowForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [workspaceProjectId, setWorkspaceProjectId] = useState(null);
    const [workspaceInitialTab, setWorkspaceInitialTab] = useState("overview");
    const [activeActionProject, setActiveActionProject] = useState(null);
    const [menuCoords, setMenuCoords] = useState({ top: 0, right: 0, openUp: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: projectsData, isLoading: isLoadingProjects, isFetching, refetch: refetchProjects } = useListProjectsQuery({
        page: currentPage,
        limit: limit,
        ...(statusFilter && { status: statusFilter }),
    });

    const [updateProjectAvailability, { isLoading: isUpdatingAvailability }] = useUpdateProjectAvailabilityMutation();

    // Close action dropdown on outside click, window scroll or resize
    useEffect(() => {
        const handleClose = () => setActiveActionProject(null);
        if (activeActionProject) {
            window.addEventListener("click", handleClose);
            window.addEventListener("scroll", handleClose, true);
            window.addEventListener("resize", handleClose);
            return () => {
                window.removeEventListener("click", handleClose);
                window.removeEventListener("scroll", handleClose, true);
                window.removeEventListener("resize", handleClose);
            };
        }
    }, [activeActionProject]);

    const handleToggleActions = (e, project) => {
        e.stopPropagation();
        if (activeActionProject?.id === project.id) {
            setActiveActionProject(null);
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < 220;

        setMenuCoords({
            top: openUp ? rect.top - 6 : rect.bottom + 6,
            right: window.innerWidth - rect.right,
            openUp,
        });
        setActiveActionProject(project);
    };

    if (workspaceProjectId) {
        return (
            <div className="min-h-screen w-full bg-[var(--background)] p-4 sm:p-6 lg:p-8">
                <ProjectWorkspace
                    projectId={workspaceProjectId}
                    initialTab={workspaceInitialTab}
                    onBack={() => {
                        setWorkspaceProjectId(null);
                        setWorkspaceInitialTab("overview");
                    }}
                />
            </div>
        );
    }

    const handleAvailabilityChange = async (projectId, currentStatus, newStatus) => {
        try {
            await updateProjectAvailability({
                projectId,
                status: newStatus,
            }).unwrap();
            refetchProjects();
        } catch (error) {
            console.error("Failed to update availability:", error);
            alert("Failed to update project status");
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const rawProjects = projectsData?.data || [];
    const pagination = projectsData?.pagination || {};

    const filteredProjects = rawProjects.filter((p) => {
        if (!searchQuery.trim()) return true;
        const term = searchQuery.toLowerCase();
        return (
            p.title?.toLowerCase().includes(term) ||
            p.city?.toLowerCase().includes(term) ||
            p.state?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term) ||
            p.scope?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)]">
            <div className="w-full py-4 px-3 sm:px-6 lg:px-10 sm:py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1
                                className="text-2xl sm:text-3xl font-bold text-[var(--heading)]"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                My Projects
                            </h1>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
                                Client Dashboard
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                            Track and manage your renovation, interior, and architectural projects
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-[var(--gold)] text-black rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-105 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Plus size={16} /> Create New Project
                        </button>
                    </div>
                </div>

                {showForm && (
                    <CreateProjectForm
                        onClose={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            refetchProjects();
                        }}
                    />
                )}

                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                            {[
                                { label: "All Projects", value: "" },
                                { label: "Waiting Quotations", value: "WAITING_FOR_QUOTATIONS" },
                                { label: "Proposals Received", value: "PROPOSALS_RECEIVED" },
                                { label: "Active", value: "IN_PROGRESS" },
                                { label: "Completed", value: "COMPLETED" },
                                { label: "Cancelled", value: "CANCELLED" },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleStatusFilter(tab.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                                        statusFilter === tab.value
                                            ? "bg-[var(--gold)] text-black font-bold shadow-xs"
                                            : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] border border-[var(--border)]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-[var(--border)] rounded-lg text-xs font-bold text-[var(--heading)] outline-none cursor-pointer"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded-lg text-xs text-[var(--heading)] outline-none focus:border-[var(--primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EDE8E1] rounded-2xl shadow-xs overflow-visible">
                        {isLoadingProjects ? (
                            <div className="p-16 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                <span>Loading project records...</span>
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="p-16 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-3">
                                <FolderKanban size={40} className="text-[var(--muted)] opacity-30" />
                                <h4 className="text-sm font-bold text-[var(--heading)]">No projects found</h4>
                                <p className="text-[var(--muted)] max-w-sm">
                                    {statusFilter || searchQuery
                                        ? "No project records match your active search and status filter."
                                        : "You haven't posted any projects yet. Click 'Create New Project' to get started."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto overflow-y-visible rounded-2xl">
                                <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
                                    <thead className="bg-[#FAF7F2] text-[#1A1A1A] font-bold text-[11px] uppercase tracking-wider border-b border-[#EDE8E1]">
                                        <tr>
                                            <th className="px-5 py-4 w-16 text-left">S.NO</th>
                                            <th className="px-5 py-4 min-w-[220px]">PROJECT TITLE</th>
                                            <th className="px-5 py-4 w-48">CATEGORY & SCOPE</th>
                                            <th className="px-5 py-4 w-44">LOCATION</th>
                                            <th className="px-5 py-4 w-44">BUDGET RANGE</th>
                                            <th className="px-5 py-4 w-48 text-center">STATUS</th>
                                            <th className="px-5 py-4 w-44">TIMELINE</th>
                                            <th className="px-5 py-4 w-36 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#EDE8E1] text-[#1A1A1A]">
                                        {filteredProjects.map((project, idx) => {
                                            const sNo = (currentPage - 1) * limit + idx + 1;
                                            const s = STATUS_PILL_CONFIG[project.status] || STATUS_PILL_CONFIG.WAITING_FOR_QUOTATIONS;
                                            const isClosed = project.availabilityStatus === "CLOSED";
                                            const timeline = formatTimeline(project);

                                            return (
                                                <tr
                                                    key={project.id}
                                                    className="hover:bg-[#FAF7F2]/40 transition duration-150"
                                                >
                                                    <td className="px-5 py-4 font-bold text-sm text-[#1A1A1A] align-middle">
                                                        {sNo}
                                                    </td>

                                                    <td className="px-5 py-4 align-middle">
                                                        <div className="flex flex-col">
                                                            <span
                                                                onClick={() => setSelectedProject(project)}
                                                                className="font-bold text-[#1A1A1A] text-sm hover:text-[var(--primary)] transition cursor-pointer"
                                                                title={project.title}
                                                            >
                                                                {project.title}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-normal mt-0.5">
                                                                {formatServicesRequired(project)}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm text-[#1A1A1A]">
                                                                {formatEnumLabel(project.category) || "Residential"}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-normal mt-0.5">
                                                                {project.scope ? formatEnumLabel(project.scope) : (project.propertyStatus ? formatEnumLabel(project.propertyStatus) : "Full Project")}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                                            <div className="flex flex-col text-sm text-[#1A1A1A]">
                                                                <span className="font-medium">{project.city ? `${project.city},` : "—"}</span>
                                                                <span className="text-xs text-gray-500">{project.state || ""}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                        <div className="flex flex-col font-bold text-sm text-[#1A1A1A]">
                                                            <span>₹{project.budgetMin ? Number(project.budgetMin).toLocaleString("en-IN") : "0"} –</span>
                                                            <span>₹{project.budgetMax ? Number(project.budgetMax).toLocaleString("en-IN") : "0"}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap text-center">
                                                        <span
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-2xs"
                                                            style={{
                                                                backgroundColor: s.bg,
                                                                border: `1px solid ${s.border}`,
                                                                color: s.text,
                                                            }}
                                                        >
                                                            <span
                                                                className="w-2 h-2 rounded-full shrink-0"
                                                                style={{ backgroundColor: s.dot }}
                                                            />
                                                            {s.label}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                                                        <div className="flex items-start gap-2">
                                                            <Calendar size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                                            <div className="flex flex-col text-xs font-semibold text-[#1A1A1A]">
                                                                <span>{timeline.start} –</span>
                                                                <span>{timeline.end}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 align-middle whitespace-nowrap text-center">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleToggleActions(e, project)}
                                                            className={`inline-flex items-center justify-between gap-2 px-3.5 py-2 bg-white border rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                                                                activeActionProject?.id === project.id
                                                                    ? "border-gray-900 text-gray-900 bg-gray-50"
                                                                    : "border-gray-200 hover:border-gray-300 text-gray-800 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            <span>Actions</span>
                                                            <ChevronDown
                                                                size={14}
                                                                className={`text-gray-500 transition-transform duration-150 ${activeActionProject?.id === project.id ? "rotate-180" : ""}`}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!isLoadingProjects && filteredProjects.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[#EDE8E1] bg-white text-xs text-gray-500">
                                <div>
                                    Showing <strong className="text-gray-900 font-bold">{(currentPage - 1) * limit + 1}</strong> to{" "}
                                    <strong className="text-gray-900 font-bold">
                                        {Math.min(currentPage * limit, pagination.total || filteredProjects.length)}
                                    </strong>{" "}
                                    of <strong className="text-gray-900 font-bold">{pagination.total || filteredProjects.length}</strong> projects
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>

                                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FAF0E6] text-gray-900 font-bold text-xs">
                                        {currentPage}
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= (pagination.totalPages || Math.ceil((pagination.total || filteredProjects.length) / limit) || 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeActionProject && (
                <div
                    className="fixed w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 divide-y divide-gray-100 text-left"
                    style={{
                        top: `${menuCoords.top}px`,
                        right: `${menuCoords.right}px`,
                        transform: menuCoords.openUp ? "translateY(-100%)" : "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        {activeActionProject.status === "PROPOSALS_RECEIVED" && (
                            <button
                                onClick={() => {
                                    const p = activeActionProject;
                                    setActiveActionProject(null);
                                    setWorkspaceInitialTab("bids");
                                    setWorkspaceProjectId(p.id);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 transition cursor-pointer"
                            >
                                <Sparkles size={14} className="text-amber-600 shrink-0" />
                                <span>Proposals</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const p = activeActionProject;
                                setActiveActionProject(null);
                                setWorkspaceInitialTab("overview");
                                setWorkspaceProjectId(p.id);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition cursor-pointer"
                        >
                            <FolderKanban size={14} className="text-gray-500 shrink-0" />
                            <span>Workspace</span>
                        </button>
                        <button
                            onClick={() => {
                                const p = activeActionProject;
                                setActiveActionProject(null);
                                setSelectedProject(p);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition cursor-pointer"
                        >
                            <Eye size={14} className="text-gray-500 shrink-0" />
                            <span>Specs</span>
                        </button>
                        <button
                            onClick={() => {
                                const p = activeActionProject;
                                setActiveActionProject(null);
                                setEditingProject(p);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition cursor-pointer"
                        >
                            <Pencil size={14} className="text-gray-500 shrink-0" />
                            <span>Edit</span>
                        </button>
                    </div>
                    <div className="py-1">
                        {activeActionProject.availabilityStatus === "CLOSED" ? (
                            <button
                                onClick={() => {
                                    const p = activeActionProject;
                                    setActiveActionProject(null);
                                    handleAvailabilityChange(p.id, "CLOSED", "OPEN");
                                }}
                                disabled={isUpdatingAvailability}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2.5 transition cursor-pointer"
                            >
                                <Globe size={14} className="text-emerald-500 shrink-0" />
                                <span>Open Bidding</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    const p = activeActionProject;
                                    setActiveActionProject(null);
                                    handleAvailabilityChange(p.id, "OPEN", "CLOSED");
                                }}
                                disabled={isUpdatingAvailability}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer"
                            >
                                <Lock size={14} className="text-rose-500 shrink-0" />
                                <span>Close</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    isOpen={!!editingProject}
                    onClose={() => setEditingProject(null)}
                    onUpdated={() => refetchProjects()}
                />
            )}
        </div>
    );
}