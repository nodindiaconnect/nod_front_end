import React, { useState } from "react";
import {
  X,
  Briefcase,
  Calendar,
  IndianRupee,
  FileText,
  Tag,
  Home,
  CheckCircle,
  Flag,
  Users,
  MessageCircle,
  Clock,
  Ruler,
  Layers,
  BedDouble,
  Bath,
  Palette,
  FolderOpen,
  StickyNote,
  ListChecks,
  ExternalLink,
  ChevronRight,
  MapPin,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import "../theme.css";
import { useGetProjectByIdQuery } from "../components/dashboardPages/client/Dashboard/overpageApiSlice";

const SECTION_META = [
  { key: "basics", label: "Basics", Icon: ListChecks },
  { key: "timeline", label: "Timeline", Icon: Calendar },
  { key: "budget", label: "Budget & Cost", Icon: WalletIcon },
  { key: "services", label: "Services & Design", Icon: Briefcase },
  { key: "documents", label: "Documents & Media", Icon: FolderOpen },
  { key: "notes", label: "Notes", Icon: StickyNote },
];

function WalletIcon(props) {
  return <IndianRupee {...props} />;
}

const formatEnumLabel = (v) =>
  !v ? "" : String(v).split("_").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ");

const isVideoUrl = (url = "") => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);
const isPdfUrl = (url = "") => /\.pdf$/i.test(url);

function InfoField({ label, value, Icon }) {
  const displayValue =
    value !== null && value !== undefined && String(value).trim() !== ""
      ? value
      : "—";

  return (
    <div className="flex items-start gap-3 py-1.5 px-1 rounded-md">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: "var(--background-secondary)",
          color: "var(--primary)",
        }}
      >
        {Icon ? <Icon size={16} /> : <FileText size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
          {label}
        </span>
        <span className="text-sm font-semibold text-heading break-words">
          {displayValue}
        </span>
      </div>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border p-3.5 bg-white"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
    >
      {items.map((item, idx) => (
        <InfoField key={idx} {...item} />
      ))}
    </div>
  );
}

function SectionHeading({ Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-heading pt-1">
      {Icon && (
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Icon size={13} />
        </div>
      )}
      <span style={{ fontFamily: "var(--font-heading)" }}>{children}</span>
    </div>
  );
}

export default function ProjectDetailsModal({ project: initialProject, onClose }) {
  const [activeKey, setActiveKey] = useState(SECTION_META[0].key);
  const [docFilter, setDocFilter] = useState("ALL");

  const projectId = initialProject?.id || initialProject?.projectId;
  const { data: fullProjectData } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  const project = fullProjectData?.data || initialProject;

  if (!project) return null;

  const activeIndex = SECTION_META.findIndex((s) => s.key === activeKey);
  const isLast = activeIndex === SECTION_META.length - 1;

  const goNext = () => {
    if (!isLast) setActiveKey(SECTION_META[activeIndex + 1].key);
  };

  const ATTACHMENT_TYPE_LABELS = {
    FLOOR_PLAN: "Floor Plan",
    PROPERTY_PHOTO: "Property Photo",
    REFERENCE_IMAGE: "Reference Image",
    VIDEO: "Video Tour",
    DOCUMENT: "Document",
  };

  const seenUrls = new Set();
  const rawList = [
    ...(Array.isArray(project.attachments)
      ? project.attachments.map((a) => ({
          url: a.url,
          type: a.type || "DOCUMENT",
          label:
            ATTACHMENT_TYPE_LABELS[a.type] ||
            formatEnumLabel(a.type) ||
            "Attachment",
        }))
      : []),
    ...(project.floorPlanUrls || []).map((u) => ({
      url: u,
      type: "FLOOR_PLAN",
      label: "Floor Plan",
    })),
    ...(project.propertyPhotoUrls || []).map((u) => ({
      url: u,
      type: "PROPERTY_PHOTO",
      label: "Property Photo",
    })),
    ...(project.referenceImageUrls || []).map((u) => ({
      url: u,
      type: "REFERENCE_IMAGE",
      label: "Reference Image",
    })),
    ...(project.videoUrls || []).map((u) => ({
      url: u,
      type: "VIDEO",
      label: "Video Tour",
    })),
  ];

  const mediaList = rawList.filter((m) => {
    if (!m.url || seenUrls.has(m.url)) return false;
    seenUrls.add(m.url);
    return true;
  });

  const filteredMedia = mediaList.filter((m) => {
    if (docFilter === "ALL") return true;
    return m.type === docFilter;
  });

  const docCounts = {
    ALL: mediaList.length,
    FLOOR_PLAN: mediaList.filter((m) => m.type === "FLOOR_PLAN").length,
    PROPERTY_PHOTO: mediaList.filter((m) => m.type === "PROPERTY_PHOTO").length,
    REFERENCE_IMAGE: mediaList.filter((m) => m.type === "REFERENCE_IMAGE").length,
    VIDEO: mediaList.filter((m) => m.type === "VIDEO").length,
  };

  // Location string formatter
  const locationParts = [project.address, project.city, project.state, project.pincode].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "—";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-4xl bg-white sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          maxHeight: "90vh",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex justify-between items-start gap-3 p-4 sm:p-5 border-b border-border relative z-10 bg-white"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
        >
          <div className="min-w-0 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-hover, var(--primary)))",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              <Briefcase size={19} />
            </div>
            <div className="min-w-0">
              <h2
                className="text-lg sm:text-xl text-heading truncate"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                {project.title || "Project Details"}
              </h2>
              <p
                className="text-xs sm:text-sm text-muted mt-0.5"
                style={{ fontWeight: 500 }}
              >
                Section {activeIndex + 1} of {SECTION_META.length} ·{" "}
                {SECTION_META[activeIndex]?.label}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white hover:bg-red-500 transition-all duration-150 p-1.5 -mr-1 shrink-0 rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: left vertical sidebar + right content pane (No Scrollbars) */}
        <div className="flex flex-1 min-h-0 flex-col sm:flex-row overflow-hidden">
          {/* Left vertical stepper sidebar */}
          <div
            className="sm:w-60 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border overflow-x-auto sm:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              background:
                "linear-gradient(180deg, var(--background-secondary), var(--background))",
            }}
          >
            <div className="flex sm:flex-col p-2 sm:p-3 gap-1.5">
              {SECTION_META.map((section, idx) => {
                const isActive = section.key === activeKey;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActiveKey(section.key)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left whitespace-nowrap transition-all duration-150 cursor-pointer"
                    style={{
                      backgroundColor: isActive ? "var(--primary)" : "transparent",
                      color: isActive ? "#fff" : "var(--heading)",
                      fontWeight: isActive ? 700 : 500,
                      boxShadow: isActive
                        ? "0 4px 12px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.1)"
                        : "none",
                      transform: isActive ? "translateX(2px)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor =
                          "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-colors"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.25)"
                          : "var(--background)",
                        color: isActive ? "#fff" : "var(--muted)",
                        fontWeight: 700,
                        boxShadow: isActive
                          ? "none"
                          : "inset 0 0 0 1px rgba(0,0,0,0.06)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right content pane */}
          <div className="flex-1 px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto space-y-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* SECTION 1: BASICS */}
            {activeKey === "basics" && (
              <>
                <SectionHeading Icon={FileText}>Basic Information</SectionHeading>
                <InfoGrid
                  items={[
                    {
                      label: "Project Title",
                      value: project.title,
                      Icon: FileText,
                    },
                    {
                      label: "Current Stage",
                      value: formatEnumLabel(project.status),
                      Icon: CheckCircle,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Category",
                      value: formatEnumLabel(project.category),
                      Icon: Tag,
                    },
                    {
                      label: "Project Scope",
                      value: formatEnumLabel(project.scope),
                      Icon: Layers,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Property Status",
                      value: formatEnumLabel(project.propertyStatus),
                      Icon: Home,
                    },
                    {
                      label: "Location",
                      value: locationStr,
                      Icon: MapPin,
                    },
                  ]}
                />
                <SectionHeading Icon={FileText}>Description</SectionHeading>
                <div
                  className="rounded-xl border border-border p-3.5 bg-white"
                  style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
                >
                  <div
                    className="text-sm text-heading whitespace-pre-wrap break-words"
                    style={{ fontWeight: 400, lineHeight: 1.6 }}
                  >
                    {project.description || "—"}
                  </div>
                </div>
              </>
            )}

            {/* SECTION 2: TIMELINE */}
            {activeKey === "timeline" && (
              <>
                <SectionHeading Icon={Calendar}>Timeline & Execution Details</SectionHeading>
                <InfoGrid
                  items={[
                    {
                      label: "Target Start Date",
                      value: project.startDate
                        ? new Date(project.startDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—",
                      Icon: Calendar,
                    },
                    {
                      label: "Target Completion Date",
                      value: project.completionDate
                        ? new Date(project.completionDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—",
                      Icon: Calendar,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Priority",
                      value: formatEnumLabel(project.priority),
                      Icon: Flag,
                    },
                    {
                      label: "Client Involvement",
                      value: formatEnumLabel(project.clientInvolvement),
                      Icon: Users,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Preferred Communication",
                      value: formatEnumLabel(project.preferredCommunication),
                      Icon: MessageCircle,
                    },
                    {
                      label: "Preferred Working Hours",
                      value: project.preferredWorkingHours || "—",
                      Icon: Clock,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Site Visit Requirement",
                      value: project.siteVisitRequired
                        ? "Site Visit Required Before Execution"
                        : "Remote Ready / Site Visit Optional",
                      Icon: MapPin,
                    },
                    {
                      label: "Availability Status",
                      value: formatEnumLabel(project.availabilityStatus || "OPEN"),
                      Icon: CheckCircle,
                    },
                  ]}
                />
              </>
            )}

            {/* SECTION 3: BUDGET & PROPERTY SPECS */}
            {activeKey === "budget" && (
              <>
                <SectionHeading Icon={IndianRupee}>
                  Budget & Property Specifications
                </SectionHeading>
                <InfoGrid
                  items={[
                    {
                      label: "Minimum Budget",
                      value:
                        project.budgetMin != null
                          ? `₹${Number(project.budgetMin).toLocaleString("en-IN")}`
                          : "—",
                      Icon: IndianRupee,
                    },
                    {
                      label: "Maximum Budget",
                      value:
                        project.budgetMax != null
                          ? `₹${Number(project.budgetMax).toLocaleString("en-IN")}`
                          : "—",
                      Icon: IndianRupee,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Property Size (sq ft)",
                      value:
                        project.propertySize != null
                          ? `${Number(project.propertySize).toLocaleString("en-IN")} sq ft`
                          : "—",
                      Icon: Ruler,
                    },
                    {
                      label: "Number of Floors",
                      value:
                        project.numberOfFloors != null
                          ? `${project.numberOfFloors} Floor${Number(project.numberOfFloors) === 1 ? "" : "s"}`
                          : "—",
                      Icon: Layers,
                    },
                  ]}
                />
                <InfoGrid
                  items={[
                    {
                      label: "Bedrooms",
                      value:
                        project.numberOfBedrooms != null
                          ? `${project.numberOfBedrooms} BHK / Bedrooms`
                          : "—",
                      Icon: BedDouble,
                    },
                    {
                      label: "Bathrooms",
                      value:
                        project.numberOfBathrooms != null
                          ? `${project.numberOfBathrooms} Bathrooms`
                          : "—",
                      Icon: Bath,
                    },
                  ]}
                />
              </>
            )}

            {/* SECTION 4: SERVICES & DESIGN */}
            {activeKey === "services" && (
              <>
                <SectionHeading Icon={Briefcase}>Services Required</SectionHeading>
                <div
                  className="rounded-xl border border-border p-4 bg-white space-y-3"
                  style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Required Disciplines
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.servicesRequired) && project.servicesRequired.length > 0 ? (
                      project.servicesRequired.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FAF0E6] text-gray-900 border border-[#EDE8E1]"
                        >
                          {formatEnumLabel(srv)}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted">No specific services selected</span>
                    )}
                  </div>
                </div>

                <SectionHeading Icon={Palette}>Design & Space Preferences</SectionHeading>
                <InfoGrid
                  items={[
                    {
                      label: "Design Style(s)",
                      value: Array.isArray(project.designStyle) && project.designStyle.length > 0
                        ? project.designStyle.map(formatEnumLabel).join(", ")
                        : "—",
                      Icon: Palette,
                    },
                    {
                      label: "Color Preferences",
                      value: project.colorPreferences || "—",
                      Icon: Palette,
                    },
                  ]}
                />

                <InfoGrid
                  items={[
                    {
                      label: "Space Requirements",
                      value: Array.isArray(project.spaceRequirements) && project.spaceRequirements.length > 0
                        ? project.spaceRequirements.map(formatEnumLabel).join(", ")
                        : "—",
                      Icon: Layers,
                    },
                    {
                      label: "Who Will Use This Space",
                      value: project.spaceUsers || "—",
                      Icon: Users,
                    },
                  ]}
                />

                {(project.currentSpaceLikes || project.currentSpaceProblems || project.accessibilityNeeds) && (
                  <InfoGrid
                    items={[
                      {
                        label: "Current Space Likes",
                        value: project.currentSpaceLikes || "—",
                        Icon: FileText,
                      },
                      {
                        label: "Current Space Problems",
                        value: project.currentSpaceProblems || "—",
                        Icon: FileText,
                      },
                    ]}
                  />
                )}
              </>
            )}

            {/* SECTION 5: DOCUMENTS & MEDIA */}
            {activeKey === "documents" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <SectionHeading Icon={FolderOpen}>
                    Project Documents & Media ({mediaList.length})
                  </SectionHeading>

                  {/* Filter Pills */}
                  {mediaList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {[
                        { key: "ALL", label: `All (${docCounts.ALL})` },
                        ...(docCounts.FLOOR_PLAN > 0 ? [{ key: "FLOOR_PLAN", label: `Floor Plans (${docCounts.FLOOR_PLAN})` }] : []),
                        ...(docCounts.PROPERTY_PHOTO > 0 ? [{ key: "PROPERTY_PHOTO", label: `Photos (${docCounts.PROPERTY_PHOTO})` }] : []),
                        ...(docCounts.REFERENCE_IMAGE > 0 ? [{ key: "REFERENCE_IMAGE", label: `References (${docCounts.REFERENCE_IMAGE})` }] : []),
                        ...(docCounts.VIDEO > 0 ? [{ key: "VIDEO", label: `Videos (${docCounts.VIDEO})` }] : []),
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setDocFilter(tab.key)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                            docFilter === tab.key
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredMedia.length === 0 ? (
                  <div className="text-sm text-muted italic rounded-xl border border-border p-8 bg-gray-50 text-center space-y-1">
                    <FolderOpen size={32} className="mx-auto text-gray-400 mb-2 opacity-50" />
                    <div>No documents or photos found for this category.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredMedia.map((m, i) => {
                      const isPdf = isPdfUrl(m.url);
                      const isVideo = isVideoUrl(m.url);

                      return (
                        <a
                          key={i}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative rounded-xl border border-border bg-white p-2.5 flex flex-col items-center justify-between hover:border-[var(--primary)] hover:shadow-md transition cursor-pointer"
                        >
                          <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center relative">
                            {isVideo ? (
                              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white gap-1">
                                <Video size={24} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">Video Tour</span>
                              </div>
                            ) : isPdf ? (
                              <div className="w-full h-full bg-red-50 border border-red-100 flex flex-col items-center justify-center text-red-600 gap-1.5 p-2">
                                <FileSpreadsheet size={26} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 text-center">
                                  PDF Blueprint
                                </span>
                              </div>
                            ) : (
                              <img
                                src={m.url}
                                alt={m.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              />
                            )}

                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                              {m.label}
                            </span>
                          </div>

                          <div className="w-full mt-2 flex items-center justify-between text-[11px] font-semibold text-heading px-0.5">
                            <span className="truncate">{m.label} #{i + 1}</span>
                            <ExternalLink size={12} className="text-gray-400 group-hover:text-[var(--primary)] shrink-0 ml-1" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* SECTION 6: NOTES */}
            {activeKey === "notes" && (
              <>
                <SectionHeading Icon={StickyNote}>Additional Client Notes</SectionHeading>
                <div
                  className="rounded-xl border border-border p-4 bg-white space-y-3"
                  style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
                >
                  <div
                    className="text-sm text-heading whitespace-pre-wrap break-words leading-relaxed"
                    style={{ fontWeight: 400 }}
                  >
                    {project.additionalNotes || "No additional notes provided for this project."}
                  </div>
                </div>

                {project.client && (
                  <>
                    <SectionHeading Icon={Users}>Client Overview</SectionHeading>
                    <InfoGrid
                      items={[
                        {
                          label: "Client Name",
                          value: project.client.name || "Client",
                          Icon: Users,
                        },
                        {
                          label: "Client Email",
                          value: project.client.email || "—",
                          Icon: MessageCircle,
                        },
                      ]}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer: Close + Next button */}
        <div
          className="flex items-center gap-3 p-4 sm:p-5 border-t border-border relative z-10 bg-white"
          style={{ boxShadow: "0 -1px 2px rgba(16,24,40,0.04)" }}
        >
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border rounded-xl transition-all duration-150 hover:shadow-sm cursor-pointer"
              style={{
                borderColor: "var(--border)",
                color: "var(--muted)",
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--background-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Close
            </button>

            {!isLast && (
              <button
                type="button"
                onClick={goNext}
                className="px-6 py-2.5 rounded-xl text-white transition-all duration-150 hover:shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: "var(--primary)",
                  fontWeight: 600,
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}