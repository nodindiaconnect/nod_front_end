import React, { useState, useRef } from "react"
import {
  Package,
  Tag,
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
} from "lucide-react"
import { useCreateProductMutation } from "./dashboard/materialapislice"
import { uploadFile } from "../../../../superBase" // adjust this import path to where your upload helper lives

const C = {
  primary: "var(--primary)",
  gold: "var(--gold)",
  background: "var(--background)",
  surface: "var(--surface)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  danger: "var(--danger)",
}

const UNIT_OPTIONS = ["Piece", "Box", "Kg", "Sqft", "Meter"]
const AVAILABILITY_OPTIONS = ["In Stock", "Out of Stock"]
const STATUS_OPTIONS = ["Active", "Inactive"]

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

export default function CreateProduct({ onCreated }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [payload, setPayload] = useState(initialPayload)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [createProduct, { isLoading }] = useCreateProductMutation()

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1

  const updateField = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    setErrors((prev) => ({ ...prev, images: undefined }))

    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadFile(file, "products", "product-images"))
      )
      const newUrls = uploaded.map((u) => u.publicUrl)

      setPayload((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
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
      if (!payload.category.trim()) stepErrors.category = "Category is required"
      if (!payload.unit) stepErrors.unit = "Unit is required"
    }
    if (step.key === "pricing") {
      if (!payload.price || Number(payload.price) <= 0) stepErrors.price = "Enter a valid price"
      if (payload.stock === "" || Number(payload.stock) < 0) stepErrors.stock = "Enter a valid stock quantity"
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
      onCreated?.(res?.data)
      setPayload(initialPayload)
      setStepIndex(0)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      setErrors({ submit: err?.data?.message || "Failed to create product. Please try again." })
    }
  }

  return (
    <div className="min-h-screen" style={{ background: C.background }}>
      <div
        className="rounded-sm w-full overflow-hidden flex flex-col"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
            style={{ background: `color-mix(in srgb, ${C.primary} 12%, transparent)` }}
          >
            <PackagePlus size={16} style={{ color: C.primary }} strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-[15px] sm:text-base leading-tight" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              Add New Product
            </h1>
            <p className="text-xs mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Step {stepIndex + 1} of {STEPS.length} — {step.label}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-4 sm:px-5 pt-4">
          {STEPS.map((s, i) => {
            const isActive = i === stepIndex
            const isDone = i < stepIndex
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors"
                    style={{
                      background: isDone
                        ? C.primary
                        : isActive
                        ? `color-mix(in srgb, ${C.primary} 14%, transparent)`
                        : "transparent",
                      border: `1px solid ${isDone ? C.primary : isActive ? C.primary : C.border}`,
                    }}
                  >
                    {isDone ? (
                      <Check size={14} style={{ color: C.surface }} strokeWidth={2.5} />
                    ) : (
                      <s.icon size={14} style={{ color: isActive ? C.primary : C.muted }} strokeWidth={2} />
                    )}
                  </span>
                  <span
                    className="text-[10px] text-center leading-tight"
                    style={{ color: isActive ? C.heading : C.muted, fontFamily: "var(--font-body)", fontWeight: isActive ? 600 : 400 }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 mb-4 mx-1" style={{ background: i < stepIndex ? C.primary : C.border }} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step content */}
        <div className="px-4 sm:px-5 py-5">
          {step.key === "basic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Name" required error={errors.productName}>
                <input
                  type="text"
                  value={payload.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  placeholder="e.g. Ceramic Floor Tile 600x600"
                  style={inputStyle}
                />
              </Field>
              <Field label="SKU (optional)">
                <input
                  type="text"
                  value={payload.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="e.g. TILE-CER-6060"
                  style={inputStyle}
                />
              </Field>
              <Field label="Category" required error={errors.category}>
                <input
                  type="text"
                  value={payload.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  placeholder="e.g. Tiles"
                  style={inputStyle}
                />
              </Field>
              <Field label="Sub Category (optional)">
                <input
                  type="text"
                  value={payload.subCategory}
                  onChange={(e) => updateField("subCategory", e.target.value)}
                  placeholder="e.g. Floor Tiles"
                  style={inputStyle}
                />
              </Field>
              <Field label="Brand (optional)">
                <input
                  type="text"
                  value={payload.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. Kajaria"
                  style={inputStyle}
                />
              </Field>
              <Field label="Unit" required error={errors.unit}>
                <select
                  value={payload.unit}
                  onChange={(e) => updateField("unit", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select unit</option>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </Field>
              <Field label="Description (optional)" full>
                <textarea
                  rows={3}
                  value={payload.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Short description of the product"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
            </div>
          )}

          {step.key === "pricing" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (₹)" required error={errors.price}>
                <input
                  type="number"
                  min="0"
                  value={payload.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="e.g. 450"
                  style={inputStyle}
                />
              </Field>
              <Field label="Discount Price (₹, optional)">
                <input
                  type="number"
                  min="0"
                  value={payload.discountPrice}
                  onChange={(e) => updateField("discountPrice", e.target.value)}
                  placeholder="e.g. 399"
                  style={inputStyle}
                />
              </Field>
              <Field label="Stock Quantity" required error={errors.stock}>
                <input
                  type="number"
                  min="0"
                  value={payload.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  placeholder="e.g. 500"
                  style={inputStyle}
                />
              </Field>
              <Field label="Minimum Order Quantity">
                <input
                  type="number"
                  min="1"
                  value={payload.minimumOrderQuantity}
                  onChange={(e) => updateField("minimumOrderQuantity", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Availability">
                <select
                  value={payload.availability}
                  onChange={(e) => updateField("availability", e.target.value)}
                  style={inputStyle}
                >
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={payload.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {step.key === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Material (optional)">
                <input
                  type="text"
                  value={payload.material}
                  onChange={(e) => updateField("material", e.target.value)}
                  placeholder="e.g. Vitrified Ceramic"
                  style={inputStyle}
                />
              </Field>
              <Field label="Color (optional)">
                <input
                  type="text"
                  value={payload.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  placeholder="e.g. Matte White"
                  style={inputStyle}
                />
              </Field>
              <Field label="Length (optional)">
                <input
                  type="number"
                  min="0"
                  value={payload.length}
                  onChange={(e) => updateField("length", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Width (optional)">
                <input
                  type="number"
                  min="0"
                  value={payload.width}
                  onChange={(e) => updateField("width", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Height (optional)">
                <input
                  type="number"
                  min="0"
                  value={payload.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Weight (optional)">
                <input
                  type="number"
                  min="0"
                  value={payload.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Warranty (optional)">
                <input
                  type="text"
                  value={payload.warranty}
                  onChange={(e) => updateField("warranty", e.target.value)}
                  placeholder="e.g. 2 years"
                  style={inputStyle}
                />
              </Field>
              <Field label="Delivery Time (optional)">
                <input
                  type="text"
                  value={payload.deliveryTime}
                  onChange={(e) => updateField("deliveryTime", e.target.value)}
                  placeholder="e.g. 5-7 business days"
                  style={inputStyle}
                />
              </Field>
              <Field label="Specifications (optional)" full>
                <textarea
                  rows={3}
                  value={payload.specifications}
                  onChange={(e) => updateField("specifications", e.target.value)}
                  placeholder="Any additional technical specifications"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
            </div>
          )}

          {step.key === "media" && (
            <div>
              <Field label="Product Images" error={errors.images}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="product-image-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wide disabled:opacity-60"
                  style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={13} /> Upload Images
                    </>
                  )}
                </button>
                <p className="text-[10px] mt-1.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  You can select multiple images at once. Uploaded images are stored securely and their URLs are attached to the product.
                </p>
              </Field>

              {payload.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {payload.images.map((url) => (
                    <div
                      key={url}
                      className="relative rounded-sm overflow-hidden aspect-square"
                      style={{ border: `1px solid ${C.border}` }}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(url)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.6)" }}
                      >
                        <X size={11} style={{ color: "#fff" }} strokeWidth={2.5} />
                      </button>
                      {payload.thumbnail === url && (
                        <span
                          className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-semibold"
                          style={{ background: C.gold, color: C.surface, fontFamily: "var(--font-body)" }}
                        >
                          Thumbnail
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {payload.images.length === 0 && !isUploading && (
                <p className="text-xs mt-3" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  No images added yet. Images are optional but recommended.
                </p>
              )}
            </div>
          )}

          {errors.submit && (
            <p className="text-xs mt-4" style={{ color: C.danger, fontFamily: "var(--font-body)" }}>
              {errors.submit}
            </p>
          )}
        </div>

        {/* Footer nav */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-3.5"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wide disabled:opacity-40"
            style={{ border: `1px solid ${C.border}`, color: C.heading, fontFamily: "var(--font-body)" }}
          >
            <ChevronLeft size={13} /> Back
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-sm font-semibold uppercase tracking-wide"
              style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
            >
              Next <ChevronRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-sm font-semibold uppercase tracking-wide disabled:opacity-60"
              style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Check size={13} /> Create Product
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] uppercase tracking-wide mb-1.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
        {label} {required && <span style={{ color: C.danger }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[10px] mt-1" style={{ color: C.danger, fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
    </div>
  )
}

const inputStyle = {
  width: "100%",
  fontSize: "13px",
  padding: "8px 10px",
  borderRadius: "2px",
  border: `1px solid ${C.border}`,
  background: C.surface,
  color: C.heading,
  fontFamily: "var(--font-body)",
  outline: "none",
}