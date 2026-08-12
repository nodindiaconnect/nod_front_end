import React, { useEffect, useRef, useState } from "react"
import {
  Package,
  IndianRupee,
  Ruler,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  PackagePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  RotateCcw,
} from "lucide-react"
import { useCreateProductMutation } from "./dashboard/materialapislice"
import { uploadFile } from "../../../../superBase" // adjust this import path to where your upload helper lives

const C = {
  primary: "var(--primary)",
  primaryHover: "var(--primary-hover)",
  gold: "var(--gold)",
  background: "var(--background)",
  surface: "var(--surface)",
  backgroundSecondary: "var(--background-secondary)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  success: "var(--success, #1a7f4b)",
  successBg: "var(--success-bg, rgba(26, 127, 75, 0.1))",
  danger: "var(--danger, #d1483f)",
  dangerBg: "var(--danger-bg, rgba(209, 72, 63, 0.1))",
  shadowLg: "var(--shadow-lg, 0 20px 50px rgba(0,0,0,0.18))",
  radiusSm: "var(--radius-sm, 6px)",
  radiusMd: "var(--radius-md, 10px)",
  radiusLg: "var(--radius-lg, 16px)",
  transition: "var(--transition, 150ms ease)",
}

const UNIT_OPTIONS = ["Piece", "Box", "Kg", "Sqft", "Meter"]
const AVAILABILITY_OPTIONS = ["In Stock", "Out of Stock"]
const STATUS_OPTIONS = ["Active", "Inactive"]

// Keep these in sync with FIELD_LIMITS on the backend controller.
const FIELD_LIMITS = {
  sku: 50,
  productName: 150,
  category: 60,
  subCategory: 60,
  brand: 60,
  description: 1000,
  specifications: 2000,
  unit: 30,
  material: 60,
  color: 40,
  warranty: 100,
  deliveryTime: 100,
  thumbnail: 500,
}
const MAX_IMAGES = 10

const STEPS = [
  { key: "basic", label: "Basic Info", icon: Package },
  { key: "pricing", label: "Pricing & Stock", icon: IndianRupee },
  { key: "specs", label: "Specifications", icon: Ruler },
  { key: "media", label: "Images", icon: ImageIcon },
]

const initialPayload = {
  sku: "",
  productName: "",
  category: "",
  subCategory: "",
  brand: "",
  description: "",
  specifications: "",
  unit: "",
  price: "",
  discountPrice: "",
  stock: "",
  minimumOrderQuantity: "1",
  availability: "In Stock",
  status: "Active",
  material: "",
  color: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  warranty: "",
  deliveryTime: "",
  images: [],
  thumbnail: "",
}

function formatINR(n) {
  if (n === null || n === undefined || n === "") return "-"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n))
}

/* ------------------------------------------------------------------ */
/* Trigger + modal shell                                              */
/* ------------------------------------------------------------------ */

export default function AddProductModal({ onCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  // 'form' while the user is filling the wizard, 'result' once the API has responded
  const [view, setView] = useState("form")
  const [result, setResult] = useState(null) // { status: 'success' | 'error', data?, message? }
  const [payload, setPayload] = useState(initialPayload)
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  const [createProduct, { isLoading }] = useCreateProductMutation()

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1

  const resetAll = () => {
    setPayload(initialPayload)
    setStepIndex(0)
    setErrors({})
    setResult(null)
    setView("form")
  }

  const openModal = () => {
    resetAll()
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    // small delay not required visually, but reset state so next open starts clean
    resetAll()
  }

  // Escape-to-close + focus + body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused && previouslyFocused.focus && previouslyFocused.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const updateField = (field, value) => {
    const limit = FIELD_LIMITS[field]
    const nextValue = typeof value === "string" && limit ? value.slice(0, limit) : value
    setPayload((prev) => ({ ...prev, [field]: nextValue }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remainingSlots = MAX_IMAGES - payload.images.length
    if (remainingSlots <= 0) {
      setErrors((prev) => ({ ...prev, images: `You can upload a maximum of ${MAX_IMAGES} images.` }))
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    const filesToUpload = files.slice(0, remainingSlots)
    const skippedCount = files.length - filesToUpload.length

    setIsUploading(true)
    setErrors((prev) => ({
      ...prev,
      images: skippedCount > 0 ? `Only ${remainingSlots} more image(s) allowed. ${skippedCount} file(s) were skipped.` : undefined,
    }))

    try {
      const uploaded = await Promise.all(
        filesToUpload.map((file) => uploadFile(file, "products", "product-images"))
      )
      const newUrls = uploaded.map((u) => u.publicUrl)

      setPayload((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls].slice(0, MAX_IMAGES),
        thumbnail: prev.thumbnail || newUrls[0],
      }))
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        images: err?.message || "Failed to upload image(s). Please try again.",
      }))
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeImageUrl = (url) => {
    setPayload((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
      thumbnail: prev.thumbnail === url ? (prev.images.filter((i) => i !== url)[0] || "") : prev.thumbnail,
    }))
  }

  const validateStep = () => {
    const stepErrors = {}
    if (step.key === "basic") {
      if (!payload.productName.trim()) stepErrors.productName = "Product name is required"
      else if (payload.productName.length > FIELD_LIMITS.productName) stepErrors.productName = `Max ${FIELD_LIMITS.productName} characters`
      if (!payload.category.trim()) stepErrors.category = "Category is required"
      else if (payload.category.length > FIELD_LIMITS.category) stepErrors.category = `Max ${FIELD_LIMITS.category} characters`
      if (!payload.unit) stepErrors.unit = "Unit is required"
      if (payload.sku && payload.sku.length > FIELD_LIMITS.sku) stepErrors.sku = `Max ${FIELD_LIMITS.sku} characters`
      if (payload.subCategory && payload.subCategory.length > FIELD_LIMITS.subCategory) stepErrors.subCategory = `Max ${FIELD_LIMITS.subCategory} characters`
      if (payload.brand && payload.brand.length > FIELD_LIMITS.brand) stepErrors.brand = `Max ${FIELD_LIMITS.brand} characters`
      if (payload.description && payload.description.length > FIELD_LIMITS.description) stepErrors.description = `Max ${FIELD_LIMITS.description} characters`
    }
    if (step.key === "pricing") {
      if (!payload.price || Number(payload.price) <= 0) stepErrors.price = "Enter a valid price"
      if (payload.stock === "" || Number(payload.stock) < 0) stepErrors.stock = "Enter a valid stock quantity"
    }
    if (step.key === "specs") {
      if (payload.material && payload.material.length > FIELD_LIMITS.material) stepErrors.material = `Max ${FIELD_LIMITS.material} characters`
      if (payload.color && payload.color.length > FIELD_LIMITS.color) stepErrors.color = `Max ${FIELD_LIMITS.color} characters`
      if (payload.warranty && payload.warranty.length > FIELD_LIMITS.warranty) stepErrors.warranty = `Max ${FIELD_LIMITS.warranty} characters`
      if (payload.deliveryTime && payload.deliveryTime.length > FIELD_LIMITS.deliveryTime) stepErrors.deliveryTime = `Max ${FIELD_LIMITS.deliveryTime} characters`
      if (payload.specifications && payload.specifications.length > FIELD_LIMITS.specifications) stepErrors.specifications = `Max ${FIELD_LIMITS.specifications} characters`
    }
    if (step.key === "media") {
      if (payload.images.length > MAX_IMAGES) stepErrors.images = `Max ${MAX_IMAGES} images allowed`
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  const buildFinalPayload = () => ({
    sku: payload.sku || undefined,
    productName: payload.productName,
    category: payload.category,
    subCategory: payload.subCategory || undefined,
    brand: payload.brand || undefined,
    description: payload.description || undefined,
    specifications: payload.specifications || undefined,
    unit: payload.unit,
    price: Number(payload.price),
    discountPrice: payload.discountPrice ? Number(payload.discountPrice) : undefined,
    stock: Number(payload.stock),
    minimumOrderQuantity: Number(payload.minimumOrderQuantity) || 1,
    availability: payload.availability,
    status: payload.status,
    material: payload.material || undefined,
    color: payload.color || undefined,
    length: payload.length ? Number(payload.length) : undefined,
    width: payload.width ? Number(payload.width) : undefined,
    height: payload.height ? Number(payload.height) : undefined,
    weight: payload.weight ? Number(payload.weight) : undefined,
    warranty: payload.warranty || undefined,
    deliveryTime: payload.deliveryTime || undefined,
    images: payload.images,
    thumbnail: payload.thumbnail || undefined,
  })

  const handleSubmit = async () => {
    if (!validateStep()) return
    try {
      const res = await createProduct(buildFinalPayload()).unwrap()
      // API shape: { success, status_code, message, data: {...} }
      onCreated?.(res?.data)
      setResult({
        status: "success",
        message: res?.message || "Product created successfully",
        statusCode: res?.status_code,
        data: res?.data,
      })
      setView("result")
    } catch (err) {
      setResult({
        status: "error",
        message: err?.data?.message || err?.message || "Failed to create product. Please try again.",
        statusCode: err?.data?.status_code || err?.status,
      })
      setView("result")
    }
  }

  return (
    <>
      {/* Trigger */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "100vh", boxSizing: "border-box" }}>
        <button
          type="button"
          onClick={openModal}
          className="add-product-trigger"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: C.radiusSm,
            border: "none",
            background: C.primary,
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: C.transition,
          }}
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
          Add Product
        </button>
      </div>

      {isOpen && (
        <div
          onClick={closeModal}
          className="apm-overlay"
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
            animation: "apmFadeIn 0.2s ease",
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="apm-title"
            onClick={(e) => e.stopPropagation()}
            className="apm-panel"
            style={{
              background: C.surface,
              borderRadius: C.radiusLg,
              maxWidth: 640,
              width: "100%",
              maxHeight: "86vh",
              boxShadow: C.shadowLg,
              animation: "apmSlideUp 0.28s ease",
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
            <div className="apm-grabber" aria-hidden="true" />

            {/* Header */}
            <div
              className="apm-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "20px 22px 0",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: `color-mix(in srgb, ${C.primary} 12%, transparent)`,
                  }}
                >
                  <PackagePlus size={16} style={{ color: C.primary }} strokeWidth={2} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <h2
                    id="apm-title"
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: C.heading,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {view === "form" ? "Add New Product" : result?.status === "success" ? "Product Created" : "Something Went Wrong"}
                  </h2>
                  {view === "form" && (
                    <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.muted, fontFamily: "var(--font-body)" }}>
                      Step {stepIndex + 1} of {STEPS.length} &middot; {step.label}
                    </p>
                  )}
                </div>
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeModal}
                aria-label="Close"
                className="apm-icon-btn"
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

            {/* Step indicator (form view only) */}
            {view === "form" && (
              <div className="apm-steps" style={{ display: "flex", alignItems: "center", padding: "16px 22px 0" }}>
                {STEPS.map((s, i) => {
                  const isActive = i === stepIndex
                  const isDone = i < stepIndex
                  return (
                    <React.Fragment key={s.key}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 60 }}>
                        <span
                          className="flex items-center justify-center rounded-full shrink-0"
                          style={{
                            width: 30,
                            height: 30,
                            transition: C.transition,
                            background: isDone
                              ? C.primary
                              : isActive
                              ? `color-mix(in srgb, ${C.primary} 14%, transparent)`
                              : "transparent",
                            border: `1.5px solid ${isDone || isActive ? C.primary : C.border}`,
                          }}
                        >
                          {isDone ? (
                            <Check size={14} style={{ color: "#fff" }} strokeWidth={2.5} />
                          ) : (
                            <s.icon size={14} style={{ color: isActive ? C.primary : C.muted }} strokeWidth={2} />
                          )}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            textAlign: "center",
                            lineHeight: 1.2,
                            color: isActive ? C.heading : C.muted,
                            fontWeight: isActive ? 700 : 500,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="apm-step-connector"
                          style={{ height: 1.5, flex: 1, margin: "0 4px 18px", background: i < stepIndex ? C.primary : C.border, transition: C.transition }}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}

            {/* Body */}
            <div
              className="apm-body"
              style={{
                padding: "18px 22px 22px",
                borderTop: view === "form" ? `1px solid ${C.border}` : "none",
                marginTop: view === "form" ? 14 : 0,
                overflowY: "auto",
                flex: 1,
                minHeight: 0,
              }}
            >
              {view === "form" && (
                <FormSteps
                  step={step}
                  payload={payload}
                  errors={errors}
                  updateField={updateField}
                  isUploading={isUploading}
                  fileInputRef={fileInputRef}
                  handleFileSelect={handleFileSelect}
                  removeImageUrl={removeImageUrl}
                />
              )}

              {view === "result" && result?.status === "success" && <SuccessResult result={result} />}
              {view === "result" && result?.status === "error" && <ErrorResult result={result} />}
            </div>

            {/* Footer */}
            <div
              className="apm-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "14px 22px",
                borderTop: `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            >
              {view === "form" && (
                <>
                  <button
                    type="button"
                    onClick={stepIndex === 0 ? closeModal : goBack}
                    className="apm-btn apm-btn--ghost"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 18px",
                      borderRadius: C.radiusSm,
                      border: `1px solid ${C.border}`,
                      background: "transparent",
                      color: C.text,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: C.transition,
                    }}
                  >
                    {stepIndex > 0 && <ChevronLeft size={14} strokeWidth={2.25} aria-hidden="true" />}
                    {stepIndex === 0 ? "Cancel" : "Back"}
                  </button>

                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="apm-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 22px",
                        borderRadius: C.radiusSm,
                        border: "none",
                        background: C.primary,
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: C.transition,
                      }}
                    >
                      Next
                      <ChevronRight size={14} strokeWidth={2.25} aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="apm-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 22px",
                        borderRadius: C.radiusSm,
                        border: "none",
                        background: C.gold,
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        opacity: isLoading ? 0.65 : 1,
                        transition: C.transition,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={14} className="apm-spin" aria-hidden="true" /> Creating...
                        </>
                      ) : (
                        <>
                          <Check size={14} strokeWidth={2.25} aria-hidden="true" /> Create Product
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              {view === "result" && result?.status === "success" && (
                <>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="apm-btn apm-btn--ghost"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 18px",
                      borderRadius: C.radiusSm,
                      border: `1px solid ${C.border}`,
                      background: "transparent",
                      color: C.text,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={14} strokeWidth={2.25} aria-hidden="true" />
                    Add Another
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="apm-btn"
                    style={{
                      padding: "10px 22px",
                      borderRadius: C.radiusSm,
                      border: "none",
                      background: C.primary,
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </>
              )}

              {view === "result" && result?.status === "error" && (
                <>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="apm-btn apm-btn--ghost"
                    style={{
                      padding: "10px 18px",
                      borderRadius: C.radiusSm,
                      border: `1px solid ${C.border}`,
                      background: "transparent",
                      color: C.text,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("form")}
                    className="apm-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 22px",
                      borderRadius: C.radiusSm,
                      border: "none",
                      background: C.primary,
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={14} strokeWidth={2.25} aria-hidden="true" />
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>

          <style>{`
            @keyframes apmFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes apmSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes apmSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            @keyframes apmSpin { to { transform: rotate(360deg); } }
            @keyframes apmPop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }

            .apm-spin { animation: apmSpin 0.7s linear infinite; }
            .apm-grabber { display: none; }
            .add-product-trigger:hover { background: ${C.primaryHover}; }
            .apm-icon-btn:hover { color: ${C.heading}; }
            .apm-btn--ghost:hover { border-color: ${C.primary}; color: ${C.primary}; }
            .apm-btn:focus-visible, .apm-icon-btn:focus-visible { outline: 2px solid ${C.primary}; outline-offset: 2px; }

            .apm-body::-webkit-scrollbar { width: 8px; }
            .apm-body::-webkit-scrollbar-track { background: transparent; }
            .apm-body::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }

            @media (max-width: 1024px) and (min-width: 761px) {
              .apm-overlay { align-items: flex-end !important; padding: 0 !important; }
              .apm-panel {
                max-width: 100% !important;
                width: 100% !important;
                border-radius: 20px 20px 0 0 !important;
                max-height: 88vh !important;
                animation: apmSheetUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) !important;
              }
              .apm-grabber { display: block !important; width: 40px; height: 4px; border-radius: 4px; background: ${C.border}; margin: 10px auto 0; }
            }

            @media (max-width: 760px) {
              .apm-overlay { align-items: flex-end !important; padding: 0 !important; }
              .apm-panel {
                max-width: 100% !important;
                width: 100% !important;
                max-height: 92vh !important;
                border-radius: 20px 20px 0 0 !important;
                animation: apmSheetUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) !important;
                padding-bottom: env(safe-area-inset-bottom, 0px);
              }
              .apm-grabber { display: block !important; width: 36px; height: 4px; border-radius: 4px; background: ${C.border}; margin: 10px auto 0; }
              .apm-header { padding: 14px 16px 0 !important; }
              .apm-steps { padding: 12px 12px 0 !important; overflow-x: auto !important; }
              .apm-body { padding: 14px 16px 18px !important; }
              .apm-footer { padding: 12px 16px !important; flex-direction: column-reverse !important; }
              .apm-footer button { width: 100% !important; justify-content: center !important; }
              .apm-form-grid { grid-template-columns: 1fr !important; }
            }

            @media (prefers-reduced-motion: reduce) {
              .apm-overlay, .apm-panel, .apm-spin { animation: none !important; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Wizard steps                                                       */
/* ------------------------------------------------------------------ */

function FormSteps({ step, payload, errors, updateField, isUploading, fileInputRef, handleFileSelect, removeImageUrl }) {
  return (
    <>
      {step.key === "basic" && (
        <div className="apm-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Product Name" required error={errors.productName} count={payload.productName.length} max={FIELD_LIMITS.productName}>
            <input type="text" value={payload.productName} maxLength={FIELD_LIMITS.productName} onChange={(e) => updateField("productName", e.target.value)} placeholder="e.g. Ceramic Floor Tile 600x600" style={inputStyle} />
          </Field>
          <Field label="SKU (optional)" error={errors.sku} count={payload.sku.length} max={FIELD_LIMITS.sku}>
            <input type="text" value={payload.sku} maxLength={FIELD_LIMITS.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="e.g. TILE-CER-6060" style={inputStyle} />
          </Field>
          <Field label="Category" required error={errors.category} count={payload.category.length} max={FIELD_LIMITS.category}>
            <input type="text" value={payload.category} maxLength={FIELD_LIMITS.category} onChange={(e) => updateField("category", e.target.value)} placeholder="e.g. Tiles" style={inputStyle} />
          </Field>
          <Field label="Sub Category (optional)" error={errors.subCategory} count={payload.subCategory.length} max={FIELD_LIMITS.subCategory}>
            <input type="text" value={payload.subCategory} maxLength={FIELD_LIMITS.subCategory} onChange={(e) => updateField("subCategory", e.target.value)} placeholder="e.g. Floor Tiles" style={inputStyle} />
          </Field>
          <Field label="Brand (optional)" error={errors.brand} count={payload.brand.length} max={FIELD_LIMITS.brand}>
            <input type="text" value={payload.brand} maxLength={FIELD_LIMITS.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="e.g. Kajaria" style={inputStyle} />
          </Field>
          <Field label="Unit" required error={errors.unit}>
            <select value={payload.unit} onChange={(e) => updateField("unit", e.target.value)} style={inputStyle}>
              <option value="">Select unit</option>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
          <Field label="Description (optional)" full error={errors.description} count={payload.description.length} max={FIELD_LIMITS.description}>
            <textarea rows={3} value={payload.description} maxLength={FIELD_LIMITS.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Short description of the product" style={{ ...inputStyle, resize: "vertical" }} />
          </Field>
        </div>
      )}

      {step.key === "pricing" && (
        <div className="apm-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Price (₹)" required error={errors.price}>
            <input type="number" min="0" value={payload.price} onChange={(e) => updateField("price", e.target.value)} placeholder="e.g. 450" style={inputStyle} />
          </Field>
          <Field label="Discount Price (₹, optional)">
            <input type="number" min="0" value={payload.discountPrice} onChange={(e) => updateField("discountPrice", e.target.value)} placeholder="e.g. 399" style={inputStyle} />
          </Field>
          <Field label="Stock Quantity" required error={errors.stock}>
            <input type="number" min="0" value={payload.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="e.g. 500" style={inputStyle} />
          </Field>
          {/* <Field label="Minimum Order Quantity">
            <input type="number" min="1" value={payload.minimumOrderQuantity} onChange={(e) => updateField("minimumOrderQuantity", e.target.value)} style={inputStyle} />
          </Field> */}
          <Field label="Availability">
            <select value={payload.availability} onChange={(e) => updateField("availability", e.target.value)} style={inputStyle}>
              {AVAILABILITY_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={payload.status} onChange={(e) => updateField("status", e.target.value)} style={inputStyle}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step.key === "specs" && (
        <div className="apm-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Material (optional)" error={errors.material} count={payload.material.length} max={FIELD_LIMITS.material}>
            <input type="text" value={payload.material} maxLength={FIELD_LIMITS.material} onChange={(e) => updateField("material", e.target.value)} placeholder="e.g. Vitrified Ceramic" style={inputStyle} />
          </Field>
          <Field label="Color (optional)" error={errors.color} count={payload.color.length} max={FIELD_LIMITS.color}>
            <input type="text" value={payload.color} maxLength={FIELD_LIMITS.color} onChange={(e) => updateField("color", e.target.value)} placeholder="e.g. Matte White" style={inputStyle} />
          </Field>
          <Field label="Length (optional)">
            <input type="number" min="0" value={payload.length} onChange={(e) => updateField("length", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Width (optional)">
            <input type="number" min="0" value={payload.width} onChange={(e) => updateField("width", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Height (optional)">
            <input type="number" min="0" value={payload.height} onChange={(e) => updateField("height", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Weight (optional)">
            <input type="number" min="0" value={payload.weight} onChange={(e) => updateField("weight", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Warranty (optional)" error={errors.warranty} count={payload.warranty.length} max={FIELD_LIMITS.warranty}>
            <input type="text" value={payload.warranty} maxLength={FIELD_LIMITS.warranty} onChange={(e) => updateField("warranty", e.target.value)} placeholder="e.g. 2 years" style={inputStyle} />
          </Field>
          <Field label="Delivery Time (optional)" error={errors.deliveryTime} count={payload.deliveryTime.length} max={FIELD_LIMITS.deliveryTime}>
            <input type="text" value={payload.deliveryTime} maxLength={FIELD_LIMITS.deliveryTime} onChange={(e) => updateField("deliveryTime", e.target.value)} placeholder="e.g. 5-7 business days" style={inputStyle} />
          </Field>
          <Field label="Specifications (optional)" full error={errors.specifications} count={payload.specifications.length} max={FIELD_LIMITS.specifications}>
            <textarea rows={3} value={payload.specifications} maxLength={FIELD_LIMITS.specifications} onChange={(e) => updateField("specifications", e.target.value)} placeholder="Any additional technical specifications" style={{ ...inputStyle, resize: "vertical" }} />
          </Field>
        </div>
      )}

      {step.key === "media" && (
        <div>
          <Field label={`Product Images (${payload.images.length}/${MAX_IMAGES})`} error={errors.images}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="apm-product-image-upload" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || payload.images.length >= MAX_IMAGES}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{
                padding: "10px 18px",
                borderRadius: C.radiusSm,
                border: "none",
                background: C.primary,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                fontFamily: "var(--font-body)",
                cursor: isUploading || payload.images.length >= MAX_IMAGES ? "default" : "pointer",
                opacity: isUploading || payload.images.length >= MAX_IMAGES ? 0.65 : 1,
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="apm-spin" aria-hidden="true" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={13} aria-hidden="true" /> Upload Images
                </>
              )}
            </button>
            <p style={{ fontSize: 11, marginTop: 8, color: C.muted, fontFamily: "var(--font-body)" }}>
              You can upload up to {MAX_IMAGES} images. Uploaded images are stored securely and their URLs are attached to the product.
            </p>
          </Field>

          {payload.images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12, marginTop: 16 }}>
              {payload.images.map((url) => (
                <div key={url} style={{ position: "relative", borderRadius: C.radiusSm, overflow: "hidden", aspectRatio: "1 / 1", border: `1px solid ${C.border}` }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(url)}
                    aria-label="Remove image"
                    style={{
                      position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer",
                    }}
                  >
                    <X size={11} style={{ color: "#fff" }} strokeWidth={2.5} />
                  </button>
                  {payload.thumbnail === url && (
                    <span
                      style={{
                        position: "absolute", bottom: 4, left: 4, fontSize: 9, padding: "2px 6px",
                        borderRadius: 3, textTransform: "uppercase", fontWeight: 700,
                        background: C.gold, color: "#fff", fontFamily: "var(--font-body)",
                      }}
                    >
                      Thumbnail
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {payload.images.length === 0 && !isUploading && (
            <p style={{ fontSize: 12, marginTop: 12, color: C.muted, fontFamily: "var(--font-body)" }}>
              No images added yet. Images are optional but recommended.
            </p>
          )}
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Result screens — driven directly by the API response               */
/* ------------------------------------------------------------------ */

function SuccessResult({ result }) {
  const data = result.data || {}
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "8px 4px 4px" }}>
      <span
        className="apm-pop"
        style={{
          width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: C.successBg, marginBottom: 14, animation: "apmPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <CheckCircle2 size={30} style={{ color: C.success }} strokeWidth={2} />
      </span>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.heading, fontFamily: "var(--font-heading)" }}>
        {result.message}
      </p>
      {result.statusCode && (
        <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.muted, fontFamily: "var(--font-body)" }}>
          Status {result.statusCode}
        </p>
      )}

      <div
        style={{
          marginTop: 20, width: "100%", textAlign: "left", borderRadius: C.radiusMd,
          border: `1px solid ${C.border}`, background: "var(--background-secondary, rgba(0,0,0,0.02))",
          padding: 16, display: "flex", gap: 14,
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: C.radiusSm, overflow: "hidden", flexShrink: 0,
            background: C.border, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {data.thumbnail ? (
            <img src={data.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <ImageIcon size={20} style={{ color: C.muted }} />
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.heading, fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.productName || "—"}
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted, fontFamily: "var(--font-body)" }}>
            {data.category || "—"}{data.unit ? ` · ${data.unit}` : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 8, fontSize: 12, fontFamily: "var(--font-body)" }}>
            <span style={{ color: C.text }}><strong style={{ color: C.heading }}>{formatINR(data.price)}</strong></span>
            <span style={{ color: C.muted }}>Stock: {data.stock ?? "—"}</span>
            <span style={{ color: C.muted }}>{data.availability || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorResult({ result }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "8px 4px 4px" }}>
      <span
        style={{
          width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: C.dangerBg, marginBottom: 14, animation: "apmPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <AlertCircle size={30} style={{ color: C.danger }} strokeWidth={2} />
      </span>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.heading, fontFamily: "var(--font-heading)" }}>
        Product wasn't created
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, fontFamily: "var(--font-body)", maxWidth: 400 }}>
        {result.message}
      </p>
      {result.statusCode && (
        <p style={{ margin: "6px 0 0", fontSize: 11.5, color: C.muted, fontFamily: "var(--font-body)" }}>
          Status {result.statusCode}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared field wrapper                                               */
/* ------------------------------------------------------------------ */

function Field({ label, required, error, full, count, max, children }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", color: C.muted, fontFamily: "var(--font-body)" }}>
          {label} {required && <span style={{ color: C.danger }}>*</span>}
        </label>
        {typeof max === "number" && (
          <span style={{ fontSize: 10, color: count >= max ? C.danger : C.muted, fontFamily: "var(--font-body)" }}>
            {count}/{max}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p style={{ fontSize: 11, marginTop: 4, color: C.danger, fontFamily: "var(--font-body)" }}>{error}</p>
      )}
    </div>
  )
}

const inputStyle = {
  width: "100%",
  fontSize: "13px",
  padding: "9px 11px",
  borderRadius: "6px",
  border: `1px solid ${C.border}`,
  background: C.surface,
  color: C.heading,
  fontFamily: "var(--font-body)",
  outline: "none",
  boxSizing: "border-box",
}


