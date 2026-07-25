
import React, { useState } from "react"
import { useGetDesignerProjectsQuery } from "./dashboard/DesignerDashboardApiSlice"
import ProjectDetailsModal from "../../../global/Projectdetailsmodal"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  RefreshCw,
  AlertCircle,
  Loader2,
  ImageOff,
  Image as ImageIcon,
  MapPin,
  FolderOpen,
  Clock,
  Hourglass,
  CheckCircle2,
  XCircle,
  LayoutGrid,
} from "lucide-react"
import Loader from "../../../global/Loader"
const C = {
  primary: "var(--primary)",
  primaryHover: "var(--primary-hover)",
  gold: "var(--gold)",
  goldHover: "var(--gold-hover)",
  background: "var(--background)",
  surface: "var(--surface)",
  backgroundSecondary: "var(--background-secondary)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  shadowSm: "var(--shadow-sm)",
  shadowMd: "var(--shadow-md)",
  shadowLg: "var(--shadow-lg)",
  radiusSm: "var(--radius-sm)",
  radiusMd: "var(--radius-md)",
  radiusLg: "var(--radius-lg)",
  fontHeading: "var(--font-heading)",
  fontBody: "var(--font-body)",
  transition: "var(--transition)",
}

const STATUS_MAP = {
  WAITING_FOR_QUOTATIONS: { label: "Awaiting Quotes", color: C.warning, icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: C.gold, icon: Hourglass },
  COMPLETED: { label: "Completed", color: C.success, icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: C.danger, icon: XCircle },
}

const IMAGE_TYPES = ["PROPERTY_PHOTO", "REFERENCE_IMAGE"]

function formatCurrency(n) {
  if (n === null || n === undefined) return "-"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}

function StatusBadge({ status, size = "normal" }) {
  const info = STATUS_MAP[status] || { label: status, color: C.muted, icon: null }
  const Icon = info.icon
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: size === "small" ? "3px 9px" : "4px 12px",
        borderRadius: 999,
        fontSize: size === "small" ? 10 : 12,
        fontWeight: 600,
        fontFamily: C.fontBody,
        color: "#fff",
        background: info.color,
      }}
    >
      {Icon ? (
        <Icon size={size === "small" ? 10 : 12} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
      )}
      {info.label}
    </span>
  )
}

/* ---------- Image carousel used inside each card ---------- */
function CardImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0)
  const hasMultiple = images.length > 1

  const goTo = (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    setIndex(((i % images.length) + images.length) % images.length)
  }
  const goPrev = (e) => goTo(e, index - 1)
  const goNext = (e) => goTo(e, index + 1)

  if (images.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: C.muted,
        }}
      >
        <ImageOff size={22} strokeWidth={1.75} aria-hidden="true" />
        <span style={{ fontFamily: C.fontBody, fontSize: 12, textAlign: "center", padding: "0 12px" }}>
          No image available
        </span>
      </div>
    )
  }

  return (
    <>
      {images.map((img, i) => (
        <img
          key={img.id || i}
          src={img.url}
          alt={`Photo ${i + 1} for ${title}`}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />
      ))}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="carousel-arrow carousel-arrow--left"
          >
            <ChevronLeft size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="carousel-arrow carousel-arrow--right"
          >
            <ChevronRight size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(20,16,12,0.55)",
              backdropFilter: "blur(2px)",
              color: "#fff",
              fontSize: 11,
              fontFamily: C.fontBody,
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 999,
            }}
          >
            <ImageIcon size={11} strokeWidth={2.25} aria-hidden="true" />
            {index + 1}/{images.length}
          </span>

          <div
            className="carousel-dots"
            role="tablist"
            aria-label="Photo selector"
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}`}
                onClick={(e) => goTo(e, i)}
                style={{
                  width: i === index ? 16 : 6,
                  height: 6,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
                  transition: C.transition,
                }}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* ---------- Card: carousel on top, caption + buttons always visible below ---------- */
function ProjectCard({ project, onViewDetails, onBid }) {
  const images = project.attachments.filter((a) => IMAGE_TYPES.includes(a.type))
  const budgetLabel = `Estimated budget ${formatCurrency(project.budgetMin)} to ${formatCurrency(project.budgetMax)}`

  const handleViewDetails = () => onViewDetails(project)
  const handleImageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleViewDetails()
    }
  }

  return (
    <div
      className="project-card"
      style={{
        borderRadius: C.radiusMd,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        background: C.surface,
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleViewDetails}
        onKeyDown={handleImageKeyDown}
        aria-label={`View details for ${project.title}, ${budgetLabel}`}
        className="card-image-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          background: C.backgroundSecondary,
          cursor: "pointer",
        }}
      >
        <CardImageCarousel images={images} title={project.title} />

        <div
          className="card-overlay"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(20,16,12,0) 40%, rgba(20,16,12,0.85) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "14px",
            opacity: 0,
            transition: "opacity 0.3s ease",
            textAlign: "left",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: C.fontBody,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Est. budget
          </span>
          <span
            style={{
              color: "#fff",
              fontFamily: C.fontBody,
              fontSize: 14,
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: C.fontBody,
              fontSize: 11,
              marginTop: 4,
              overflowWrap: "anywhere",
            }}
          >
            {project.servicesRequired.join(", ")}
          </span>
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontFamily: C.fontHeading,
              color: C.heading,
              fontSize: 16,
              margin: 0,
              lineHeight: 1.3,
              overflowWrap: "anywhere",
            }}
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} size="small" />
        </div>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: C.fontBody,
            color: C.muted,
            fontSize: 12,
            margin: "0 0 12px",
            overflowWrap: "anywhere",
          }}
        >
          <MapPin size={12} strokeWidth={2.25} aria-hidden="true" style={{ flexShrink: 0 }} />
          {project.city}, {project.state}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
          <button
            onClick={() => onViewDetails(project)}
            className="card-btn card-btn--ghost"
            style={{
              flex: "1 1 120px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "10px",
              borderRadius: C.radiusSm,
              border: `1px solid ${C.primary}`,
              background: "transparent",
              color: C.primary,
              fontFamily: C.fontBody,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              transition: C.transition,
            }}
          >
            <Eye size={14} strokeWidth={2.25} aria-hidden="true" />
            View details
          </button>
          <button
            onClick={() => onBid(project)}
            aria-label={`Send bid for ${project.title}`}
            className="card-btn"
            style={{
              flex: "1 1 120px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "10px",
              borderRadius: C.radiusSm,
              border: "none",
              background: C.gold,
              color: "#fff",
              fontFamily: C.fontBody,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              transition: C.transition,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.goldHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.gold)}
          >
            <Send size={13} strokeWidth={2.25} aria-hidden="true" />
            Send bid
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProposalsPage() {
  const { data, isLoading, isError, refetch } = useGetDesignerProjectsQuery()
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = data?.data || []

  const handleBid = (project) => {
    console.log("Send bid for project:", project.id)
  }

  if (isLoading) {
    return (
      <Loader />
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.background,
          gap: 12,
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        <AlertCircle size={28} strokeWidth={1.75} color={C.danger} aria-hidden="true" />
        <div style={{ fontFamily: C.fontBody, color: C.danger, fontSize: 15 }}>Failed to load projects.</div>
        <button
          onClick={refetch}
          className="card-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 20px",
            borderRadius: C.radiusSm,
            border: "none",
            background: C.primary,
            color: "#fff",
            fontFamily: C.fontBody,
            fontWeight: 600,
            cursor: "pointer",
            transition: C.transition,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
        >
          <RefreshCw size={14} strokeWidth={2.25} aria-hidden="true" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: C.background, minHeight: "100vh", padding: "32px 16px" }}>
      <style>{`
        .project-card:hover,
        .project-card:focus-within {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--gold);
        }
        .project-card:hover .card-overlay,
        .project-card:focus-within .card-overlay {
          opacity: 1;
        }

        .card-image-wrap:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: -2px;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(20, 16, 12, 0.45);
          backdrop-filter: blur(2px);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition), opacity 0.2s ease;
          z-index: 2;
          opacity: 0;
        }
        .project-card:hover .carousel-arrow,
        .project-card:focus-within .carousel-arrow {
          opacity: 1;
        }
        .carousel-arrow:hover { background: rgba(20, 16, 12, 0.75); }
        .carousel-arrow:focus-visible {
          opacity: 1;
          outline: 2px solid #fff;
          outline-offset: 1px;
        }
        .carousel-arrow--left { left: 8px; }
        .carousel-arrow--right { right: 8px; }

        .card-btn--ghost:hover {
          background: var(--primary) !important;
          color: #fff !important;
        }

        @media (hover: none) {
          .carousel-arrow { opacity: 1; background: rgba(20, 16, 12, 0.55); }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card, .carousel-arrow { transition: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: C.fontHeading,
            color: C.heading,
            fontSize: 28,
            marginBottom: 6,
          }}
        >
          <LayoutGrid size={24} strokeWidth={2} color={C.primary} aria-hidden="true" />
          Available projects
        </h1>
        <p style={{ fontFamily: C.fontBody, color: C.muted, fontSize: 14, marginBottom: 28 }}>
          Browse projects matching your services and submit your proposal.
        </p>

        {projects.length === 0 ? (
          <div
            style={{
              background: C.surface,
              borderRadius: C.radiusMd,
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: C.shadowSm,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FolderOpen size={28} strokeWidth={1.5} color={C.muted} aria-hidden="true" />
            <p style={{ fontFamily: C.fontBody, color: C.muted, fontSize: 15, margin: 0 }}>
              No projects available right now.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewDetails={setSelectedProject} onBid={handleBid} />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} onBid={handleBid} />
    </div>
  )
}

