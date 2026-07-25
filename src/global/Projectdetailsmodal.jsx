import React, { useState, useEffect, useRef, useMemo } from "react"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  MapPin,
  Building2,
  Palette,
  Sofa,
  Wallet,
  MessageCircle,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Film,
  ExternalLink,
  Calendar,
  IndianRupee,
  Ruler,
  Layers,
  ClipboardList,
  BedDouble,
  Bath,
  CalendarCheck,
  ListChecks,
} from "lucide-react"

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

const ATTACHMENT_LABELS = {
  FLOOR_PLAN: "Floor plan",
  PROPERTY_PHOTO: "Property photo",
  REFERENCE_IMAGE: "Reference image",
  VIDEO: "Video",
}

// Decorative icon per section — rendered without any background chip, just tinted glyphs.
const SECTION_ICONS = {
  Basics: ClipboardList,
  Location: MapPin,
  Property: Building2,
  Design: Palette,
  "Current space": Sofa,
  Budget: Wallet,
  Communication: MessageCircle,
  Attachments: Paperclip,
  "Files & notes": FileText,
}

// Decorative icon per field label, purely to aid scanning — optional, falls back to none.
const FIELD_ICONS = {
  Address: MapPin,
  City: MapPin,
  "Property size": Ruler,
  Floors: Layers,
  Bedrooms: BedDouble,
  Bathrooms: Bath,
  "Site visit required": CalendarCheck,
  "Budget range": IndianRupee,
  "Start date": Calendar,
  "Completion date": Calendar,
  "Preferred communication": MessageCircle,
  "Services required": ListChecks,
}

const IMAGE_ATTACHMENT_TYPES = ["PROPERTY_PHOTO", "REFERENCE_IMAGE", "FLOOR_PLAN_IMAGE"]

function isImageUrl(url = "") {
  return /\.(jpe?g|png|gif|webp|avif)$/i.test(url)
}

function isPdfUrl(url = "") {
  return /\.pdf$/i.test(url)
}

function isVideoUrl(url = "") {
  return /\.(mp4|webm|mov|m4v)$/i.test(url)
}

function formatCurrency(n) {
  if (n === null || n === undefined) return "-"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}

function isEmpty(v) {
  if (v === null || v === undefined) return true
  if (typeof v === "string" && v.trim() === "") return true
  if (Array.isArray(v) && v.length === 0) return true
  return false
}

/* Each section declares its own fields as a function of the project so we can:
   1) drop a field that has no real data instead of printing "-"
   2) drop the whole section/step when none of its fields have data
   `full: true` marks a field that should span both grid columns (long text). */
function buildSections(project) {
  const sections = [
    {
      label: "Basics",
      fields: [
        { label: "Project title", value: project.title },
        { label: "Category", value: project.category },
        { label: "Property status", value: project.propertyStatus },
        {
          label: "Services required",
          value: project.servicesRequired?.length ? project.servicesRequired.join(", ") : null,
        },
        { label: "Description", value: project.description, full: true },
      ],
    },
    {
      label: "Location",
      fields: [
        { label: "Address", value: project.address, full: true },
        { label: "City", value: project.city },
        { label: "State", value: project.state },
        { label: "Pincode", value: project.pincode },
      ],
    },
    {
      label: "Property",
      fields: [
        { label: "Property size", value: project.propertySize ? `${project.propertySize} sq.ft` : null },
        { label: "Floors", value: project.numberOfFloors },
        { label: "Bedrooms", value: project.numberOfBedrooms },
        { label: "Bathrooms", value: project.numberOfBathrooms },
        {
          label: "Site visit required",
          value: project.siteVisitRequired === undefined ? null : project.siteVisitRequired ? "Yes" : "No",
        },
      ],
    },
    {
      label: "Design",
      fields: [
        {
          label: "Design style",
          value: project.designStyle?.length ? project.designStyle.join(", ") : null,
        },
        { label: "Color preferences", value: project.colorPreferences },
        {
          label: "Space requirements",
          value: project.spaceRequirements?.length ? project.spaceRequirements.join(", ") : null,
        },
        { label: "Accessibility needs", value: project.accessibilityNeeds, full: true },
      ],
    },
    {
      label: "Current space",
      fields: [
        { label: "Space users", value: project.spaceUsers },
        { label: "What client likes", value: project.currentSpaceLikes, full: true },
        { label: "Current problems", value: project.currentSpaceProblems, full: true },
        { label: "Client involvement", value: project.clientInvolvement },
      ],
    },
    {
      label: "Budget",
      fields: [
        {
          label: "Budget range",
          value:
            project.budgetMin != null || project.budgetMax != null
              ? `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax)}`
              : null,
        },
        { label: "Start date", value: project.startDate ? new Date(project.startDate).toLocaleDateString() : null },
        {
          label: "Completion date",
          value: project.completionDate ? new Date(project.completionDate).toLocaleDateString() : null,
        },
        { label: "Priority", value: project.priority },
      ],
    },
    {
      label: "Communication",
      fields: [
        { label: "Preferred communication", value: project.preferredCommunication },
        { label: "Preferred working hours", value: project.preferredWorkingHours },
      ],
    },
    {
      label: "Attachments",
      isAttachments: true,
      fields: [],
    },
    {
      label: "Files & notes",
      fields: [
        { label: "Status", value: project.status },
        { label: "Additional notes", value: project.additionalNotes, full: true },
      ],
    },
  ]

  return sections
    .map((section) => {
      if (section.isAttachments) {
        const hasAttachments = project.attachments && project.attachments.length > 0
        return { ...section, hasContent: hasAttachments }
      }
      return { ...section, fields: section.fields.filter((f) => !isEmpty(f.value)), hasContent: undefined }
    })
    .filter((section) => (section.isAttachments ? section.hasContent : section.fields.length > 0))
}

/* Every value is wrapped so long, unbroken strings (urls, ids, long text)
   always wrap onto new lines instead of overflowing or forcing scroll. */
function ModalRow({ label, value, full }) {
  const Icon = FIELD_ICONS[label]
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: `1px solid ${C.border}`,
        gridColumn: full ? "1 / -1" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: C.fontBody,
          fontSize: 12,
          color: C.primary,
          fontWeight: 600,
          marginBottom: 4,
          letterSpacing: "0.01em",
        }}
      >
        {Icon && <Icon size={13} strokeWidth={2.25} style={{ flexShrink: 0 }} aria-hidden="true" />}
        <span>{label}</span>
      </div>
      <div
        style={{
          fontFamily: C.fontBody,
          fontSize: 14,
          color: C.heading,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  )
}

/* Lightbox for viewing a single image attachment at full size. */
function ImageLightbox({ attachment, onClose }) {
  if (!attachment) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 8, 6, 0.85)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        cursor: "zoom-out",
        animation: "modalFadeIn 0.2s ease",
      }}
    >
      <figure style={{ margin: 0, maxWidth: "92vw", maxHeight: "88vh", display: "flex", flexDirection: "column", gap: 10 }}>
        <img
          src={attachment.url}
          alt={ATTACHMENT_LABELS[attachment.type] || "Attachment"}
          style={{
            maxWidth: "92vw",
            maxHeight: "78vh",
            objectFit: "contain",
            borderRadius: C.radiusSm,
            boxShadow: C.shadowLg,
            display: "block",
            margin: "0 auto",
          }}
        />
        <figcaption
          style={{
            fontFamily: C.fontBody,
            fontSize: 13,
            color: "#fff",
            textAlign: "center",
          }}
        >
          {ATTACHMENT_LABELS[attachment.type] || "Attachment"}
        </figcaption>
      </figure>
      <button
        onClick={onClose}
        aria-label="Close image preview"
        className="icon-btn"
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 36,
          height: 36,
          border: "none",
          background: "transparent",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))",
        }}
      >
        <X size={22} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}

/* One tile in the attachments grid. Routes to the right preview based on
   the file's type/extension: inline image, inline video, or a PDF/file link card. */
function AttachmentTile({ attachment, onOpenImage }) {
  const label = ATTACHMENT_LABELS[attachment.type] || attachment.type
  const url = attachment.url || ""

  const tileShellStyle = {
    borderRadius: C.radiusMd,
    border: `1px solid ${C.border}`,
    background: C.backgroundSecondary,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: C.transition,
  }

  if (isImageUrl(url)) {
    return (
      <div className="attachment-tile" style={tileShellStyle}>
        <button
          type="button"
          onClick={() => onOpenImage(attachment)}
          aria-label={`View full size ${label}`}
          style={{
            all: "unset",
            cursor: "zoom-in",
            display: "block",
            width: "100%",
            aspectRatio: "4 / 3",
            position: "relative",
            background: C.border,
          }}
        >
          <img
            src={url}
            alt={label}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <ImageIcon
            size={15}
            strokeWidth={2.25}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "#fff",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.65))",
            }}
          />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 10px",
            fontFamily: C.fontBody,
            fontSize: 12,
            fontWeight: 600,
            color: C.heading,
          }}
        >
          {label}
        </div>
      </div>
    )
  }

  if (isVideoUrl(url)) {
    return (
      <div className="attachment-tile" style={tileShellStyle}>
        <div style={{ position: "relative" }}>
          <video
            src={url}
            controls
            preload="metadata"
            style={{ width: "100%", aspectRatio: "4 / 3", background: "#000", display: "block" }}
          />
          <Film
            size={15}
            strokeWidth={2.25}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "#fff",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.65))",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 10px",
            fontFamily: C.fontBody,
            fontSize: 12,
            fontWeight: 600,
            color: C.heading,
          }}
        >
          {label}
        </div>
      </div>
    )
  }

  // PDF or any other file type: show an icon card that links out.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="attachment-tile"
      style={{
        ...tileShellStyle,
        textDecoration: "none",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "4 / 3",
        gap: 8,
        color: C.heading,
      }}
    >
      <FileText size={30} strokeWidth={1.75} color={C.primary} aria-hidden="true" />
      <span style={{ fontFamily: C.fontBody, fontSize: 12, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: C.fontBody,
          fontSize: 11,
          fontWeight: 600,
          color: C.primary,
        }}
      >
        {isPdfUrl(url) ? "Open PDF" : "Open file"}
        <ExternalLink size={12} strokeWidth={2.25} aria-hidden="true" />
      </span>
    </a>
  )
}

function AttachmentsGrid({ attachments }) {
  const [lightboxAttachment, setLightboxAttachment] = useState(null)

  if (!attachments || attachments.length === 0) return null

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {attachments.map((a) => (
          <AttachmentTile key={a.id} attachment={a} onOpenImage={setLightboxAttachment} />
        ))}
      </div>
      {lightboxAttachment && (
        <ImageLightbox attachment={lightboxAttachment} onClose={() => setLightboxAttachment(null)} />
      )}
    </>
  )
}

function StepIndicator({ steps, current, onJump }) {
  return (
    <div
      role="tablist"
      aria-label="Project detail sections"
      className="modal-step-indicator"
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        rowGap: 12,
        padding: "14px 8px 12px",
      }}
    >
      {steps.map((label, i) => {
        const Icon = SECTION_ICONS[label]
        const done = i < current
        const active = i === current
        const tone = done || active ? C.primary : C.border
        return (
          <React.Fragment key={label}>
            <button
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`step-panel-${i}`}
              id={`step-tab-${i}`}
              onClick={() => onJump(i)}
              className="step-tab"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                minWidth: 60,
                background: "transparent",
                border: "none",
                padding: 0,
                font: "inherit",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `1.5px solid ${tone}`,
                  background: "transparent",
                  color: active ? C.primary : done ? C.primary : C.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: C.transition,
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : Icon ? (
                  <Icon size={13} strokeWidth={2.25} />
                ) : (
                  <span style={{ fontFamily: C.fontBody, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                )}
              </span>
              <span
                style={{
                  fontFamily: C.fontBody,
                  fontSize: 10,
                  color: active ? C.heading : C.muted,
                  fontWeight: active ? 700 : 500,
                  marginTop: 4,
                  textAlign: "center",
                  whiteSpace: "normal",
                  maxWidth: 72,
                }}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="modal-step-connector"
                style={{
                  flex: "1 1 16px",
                  height: 1.5,
                  background: i < current ? C.primary : C.border,
                  marginTop: 13,
                  minWidth: 16,
                  alignSelf: "flex-start",
                  transition: C.transition,
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function ProjectDetailsModal({ project, onClose, onBid }) {
  const [step, setStep] = useState(0)
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  const sections = useMemo(() => (project ? buildSections(project) : []), [project])
  const stepLabels = sections.map((s) => s.label)

  useEffect(() => {
    if (project) setStep(0)
  }, [project])

  useEffect(() => {
    if (!project) return

    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused && previouslyFocused.focus && previouslyFocused.focus()
    }
  }, [project, onClose])

  if (!project) return null
  if (sections.length === 0) return null

  const safeStep = Math.min(step, sections.length - 1)
  const isLast = safeStep === sections.length - 1
  const isFirst = safeStep === 0
  const currentSection = sections[safeStep]
  const CurrentIcon = SECTION_ICONS[currentSection.label]

  return (
    <div
      onClick={onClose}
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 16, 12, 0.55)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
        boxSizing: "border-box",
        animation: "modalFadeIn 0.25s ease",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-step-desc"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel"
        style={{
          background: C.surface,
          borderRadius: C.radiusLg,
          maxWidth: 920,
          width: "100%",
          maxHeight: "82vh",
          boxShadow: C.shadowLg,
          animation: "modalSlideUp 0.3s ease",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${C.primary}, ${C.gold})`,
          }}
        />

        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            padding: "24px 24px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Building2
              size={20}
              strokeWidth={2}
              color={C.primary}
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div style={{ minWidth: 0 }}>
              <h2
                id="modal-title"
                style={{
                  fontFamily: C.fontHeading,
                  color: C.heading,
                  fontSize: 20,
                  margin: 0,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {project.title}
              </h2>
              <p
                id="modal-step-desc"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: C.fontBody,
                  color: C.muted,
                  fontSize: 13,
                  margin: "4px 0 0",
                }}
              >
                Section {safeStep + 1} of {sections.length} &middot; {currentSection.label}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close project details dialog"
            className="icon-btn"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 6,
              flexShrink: 0,
              borderRadius: C.radiusSm,
            }}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div style={{ flexShrink: 0 }}>
          <StepIndicator steps={stepLabels} current={safeStep} onJump={setStep} />
        </div>

        <div
          id={`step-panel-${safeStep}`}
          role="tabpanel"
          aria-labelledby={`step-tab-${safeStep}`}
          className="modal-body"
          style={{
            padding: "4px 24px 20px",
            borderTop: `1px solid ${C.border}`,
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          {currentSection.isAttachments ? (
            <AttachmentsGrid attachments={project.attachments} />
          ) : (
            <div
              className="modal-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 32,
              }}
            >
              {currentSection.fields.map((f) => (
                <ModalRow key={f.label} label={f.label} value={f.value} full={f.full} />
              ))}
            </div>
          )}
        </div>

        <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "16px 24px",
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={isFirst ? onClose : () => setStep((s) => s - 1)}
            className="footer-btn footer-btn--ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px 22px",
              borderRadius: C.radiusSm,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.text,
              fontFamily: C.fontBody,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: C.transition,
            }}
          >
            {!isFirst && <ChevronLeft size={15} strokeWidth={2.25} aria-hidden="true" />}
            {isFirst ? "Close" : "Back"}
          </button>

          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="footer-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "11px 26px",
                borderRadius: C.radiusSm,
                border: "none",
                background: C.primary,
                color: "#fff",
                fontFamily: C.fontBody,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: C.transition,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
            >
              Next
              <ChevronRight size={15} strokeWidth={2.25} aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={() => onBid(project)}
              className="footer-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "11px 26px",
                borderRadius: C.radiusSm,
                border: "none",
                background: C.gold,
                color: "#fff",
                fontFamily: C.fontBody,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: C.transition,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.goldHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.gold)}
            >
              Send bid
              <Send size={14} strokeWidth={2.25} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .modal-overlay { overflow-y: auto; }

        .step-tab:focus-visible,
        .icon-btn:focus-visible,
        .footer-btn:focus-visible {
          outline: 2px solid ${C.primary};
          outline-offset: 2px;
          border-radius: ${C.radiusSm};
        }

        .step-tab:hover span:first-child { border-color: ${C.primary}; }

        .icon-btn:hover { color: ${C.heading}; }

        .footer-btn--ghost:hover {
          border-color: ${C.primary};
          color: ${C.primary};
        }

        .attachment-tile {
          box-shadow: ${C.shadowSm};
        }
        .attachment-tile:hover {
          box-shadow: ${C.shadowMd};
          border-color: ${C.primary};
          transform: translateY(-1px);
        }

        .modal-body::-webkit-scrollbar { width: 8px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
        .modal-body::-webkit-scrollbar-thumb:hover { background: ${C.primary}; }

        @media (max-width: 760px) {
          .modal-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 640px) {
          .modal-panel { max-height: 94vh; border-radius: ${C.radiusMd}; }
          .modal-header h2 { font-size: 18px !important; }
          .modal-step-indicator { justify-content: flex-start; gap: 6px; }
          .modal-step-connector { display: none; }
          .modal-footer { flex-direction: column-reverse; }
          .modal-footer button { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay, .modal-panel, .attachment-tile { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  )
}