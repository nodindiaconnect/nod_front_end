import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wallet,
  Store,
  Package,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  MessageCircle,
  Eye,
  X,
} from "lucide-react"
import {
  useGetSupplierUserDetailsQuery,
  useGetContactDetailsQuery,
  useDeleteContactDetailsMutation,
  useGetSupplierProductsQuery,
} from "./materialapislice"
import Loader from "../../../../global/Loader"
import ContactDetailsModal from "./ContactDetailsModal"

const C = {
  primary: "var(--primary)",
  gold: "var(--gold)",
  background: "var(--background)",
  surface: "var(--surface)",
  backgroundSecondary: "var(--background-secondary)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  success: "var(--success)",
  danger: "var(--danger)",
}

export default function MaterialSupplierDashboard() {
  const navigate = useNavigate()
  const { data: userRes, isLoading, error, refetch } = useGetSupplierUserDetailsQuery()
  const { data: contactRes, isLoading: contactLoading } = useGetContactDetailsQuery()
  const [deleteContactDetails, { isLoading: deleting }] = useDeleteContactDetailsMutation()

  // Fetch up to 8 uploaded products to display in the showcase portfolio
  const { data: productsRes, isLoading: productsLoading } = useGetSupplierProductsQuery({
    page: 1,
    limit: 8,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const u = userRes?.data || {}
  const contact = contactRes?.data || null
  const productsList = productsRes?.data?.products || []
  const totalUploadedProducts = productsRes?.data?.total ?? u.totalProducts ?? 0

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-8" style={{ background: C.background }}>
        <p style={{ color: C.danger, fontFamily: "var(--font-body)" }}>Failed to load supplier dashboard.</p>
        <button
          onClick={() => refetch()}
          className="text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wide"
          style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
        >
          Retry
        </button>
      </div>
    )
  }

  const profileRows = [
    { icon: Mail, label: "Email", value: u.email },
    { icon: Phone, label: "Phone", value: u.phone ? ` ${u.phone}` : "" },
    { icon: MapPin, label: "City", value: u.city },
    { icon: MapPin, label: "State", value: u.state },
    { icon: ShieldCheck, label: "Country", value: u.country },
  ]

  const maxProductStat = Math.max(Number(u.totalProducts) || 0, 1)

  const productStats = [
    { icon: Package, label: "Total Products", value: u.totalProducts ?? 0, color: C.heading },
    { icon: CheckCircle2, label: "Active Products", value: u.activeProducts ?? 0, color: C.success },
    { icon: XCircle, label: "Out of Stock", value: u.outOfStockProducts ?? 0, color: C.danger },
  ]

  const handleDelete = async () => {
    if (!window.confirm("Delete your contact details? This cannot be undone.")) return
    try {
      await deleteContactDetails().unwrap()
    } catch (err) {
      alert(err?.data?.message || "Failed to delete contact details")
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: C.background }}>
      <div
        className="rounded-md w-full overflow-hidden flex flex-col"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5">
          {/* User Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-14 h-14 rounded-md flex items-center justify-center shrink-0"
              style={{ background: C.backgroundSecondary }}
            >
              <span
                className="text-xl"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                {(u.name?.[0] || "U").toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h1
                className="text-lg sm:text-xl leading-tight break-words flex items-center gap-1.5"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}
              >
                Welcome back, {u.name?.split(" ")[0] || "there"}
                <span role="img" aria-label="wave">👋</span>
              </h1>
              <p className="text-xs sm:text-sm mt-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                Manage your product listings and business profile.
              </p>
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: C.muted, fontFamily: "var(--font-body)" }}
              >
                Wallet Balance
              </p>
              <p
                className="text-xl leading-none mt-1"
                style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                ₹{(Number(u.walletBalance) || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold"
              style={{ border: `1px solid ${C.border}`, color: C.heading, fontFamily: "var(--font-body)" }}
            >
              <Wallet size={16} style={{ color: C.heading }} strokeWidth={2} />
              Wallet
            </button>
          </div>
        </div>

        {/* Product stat cards */}
        <div className="px-5 sm:px-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Products
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {productStats.map((stat) => {
              const barPct = Math.min(100, (Number(stat.value) / maxProductStat) * 100)
              return (
                <div
                  key={stat.label}
                  className="rounded-md p-4 flex flex-col gap-3.5"
                  style={{ border: `1px solid ${C.border}`, background: C.surface }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${stat.color} 14%, transparent)` }}
                    >
                      <stat.icon size={16} style={{ color: stat.color }} strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-xl tabular-nums leading-none"
                        style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}
                      >
                        {stat.value}
                      </div>
                      <span
                        className="text-[10px] font-semibold tracking-wide uppercase leading-tight block mt-1 truncate"
                        style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 rounded-md w-full overflow-hidden" style={{ background: C.border }}>
                    <div className="h-full rounded-md" style={{ width: `${barPct}%`, background: stat.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── UPLOADED PRODUCTS & MATERIAL PORTFOLIO SHOWCASE ── */}
        <div className="px-5 sm:px-6 py-6" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                >
                  Material Portfolio & Catalog
                </span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: C.backgroundSecondary, color: C.heading }}
                >
                  {totalUploadedProducts} Total
                </span>
              </div>
              <h2
                className="text-base sm:text-lg font-bold mt-1"
                style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
              >
                Uploaded Materials & Products
              </h2>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                These products serve as your public portfolio projects, showcasing your inventory to designers, contractors, and clients.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {u?.id && (
                <button
                  onClick={() => navigate(`/portfolio/${u.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold cursor-pointer transition hover:bg-black/5"
                  style={{ border: `1px solid ${C.border}`, color: C.heading, background: C.surface }}
                  title="Preview how clients see your portfolio"
                >
                  <ExternalLink size={14} />
                  Public Portfolio
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard/products")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold cursor-pointer transition hover:bg-black/5"
                style={{ border: `1px solid ${C.border}`, color: C.heading, background: C.surface }}
              >
                <Package size={14} />
                Full Catalog
              </button>
              <button
                onClick={() => navigate("/dashboard/products/create")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wide cursor-pointer transition hover:opacity-90"
                style={{ background: C.heading, color: C.surface }}
              >
                <Plus size={14} />
                Upload Product
              </button>
            </div>
          </div>

          {/* Products Content */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-md animate-pulse"
                  style={{ background: C.backgroundSecondary }}
                />
              ))}
            </div>
          ) : productsList.length === 0 ? (
            <div
              className="rounded-md p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-3"
              style={{ background: C.backgroundSecondary, border: `1px dashed ${C.border}` }}
            >
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${C.gold} 16%, transparent)` }}
              >
                <Package size={26} style={{ color: C.gold }} strokeWidth={1.75} />
              </span>
              <div className="max-w-md">
                <h3
                  className="text-base font-bold"
                  style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
                >
                  No materials or products uploaded yet
                </h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  Your uploaded products are displayed directly in your public portfolio and search catalog. Add tiles, marbles, wood, paints, or sanitaryware to start receiving project requests!
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/products/create")}
                className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase px-4 py-2.5 rounded-md cursor-pointer"
                style={{ background: C.primary, color: C.surface }}
              >
                <Plus size={14} />
                Upload Your First Material
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productsList.map((product) => {
                const img =
                  product.thumbnail ||
                  (Array.isArray(product.images) && product.images[0]) ||
                  (typeof product.images === "string" ? product.images : null)
                const inStock = product.stock > 0 && product.availability !== "Out of Stock"

                return (
                  <div
                    key={product.id}
                    className="group rounded-md overflow-hidden flex flex-col transition-all hover:shadow-md"
                    style={{
                      border: `1px solid ${C.border}`,
                      background: C.surface,
                    }}
                  >
                    {/* Image Box */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[var(--background-secondary)]">
                      {img ? (
                        <img
                          src={img}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xs font-medium"
                          style={{ color: C.muted }}
                        >
                          <Package size={28} />
                        </div>
                      )}
                      <span
                        className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs"
                        style={{
                          background: inStock ? "rgba(46, 125, 50, 0.88)" : "rgba(180, 40, 40, 0.88)",
                          color: "#fff",
                        }}
                      >
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>

                      {product.category && (
                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/65 text-white backdrop-blur-xs max-w-[85%] truncate">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Info Body */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                      <div>
                        <h4
                          className="text-sm font-semibold truncate leading-tight"
                          style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
                          title={product.productName}
                        >
                          {product.productName}
                        </h4>
                        {product.brand && (
                          <p className="text-[11px] mt-0.5 truncate" style={{ color: C.muted }}>
                            Brand: <span className="font-medium" style={{ color: C.text }}>{product.brand}</span>
                          </p>
                        )}
                        {product.material && (
                          <p className="text-[11px] truncate" style={{ color: C.muted }}>
                            Material: <span className="font-medium" style={{ color: C.text }}>{product.material}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className="text-sm font-bold"
                              style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
                            >
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>
                            {product.unit && (
                              <span className="text-[11px]" style={{ color: C.muted }}>
                                / {product.unit}
                              </span>
                            )}
                          </div>
                          {product.discountPrice && Number(product.discountPrice) < Number(product.price) && (
                            <span className="text-[10px] line-through" style={{ color: C.muted }}>
                              ₹{Number(product.discountPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="p-1.5 rounded-md hover:bg-black/5 cursor-pointer"
                            style={{ border: `1px solid ${C.border}`, color: C.heading }}
                            title="Quick View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="p-1.5 rounded-md hover:bg-black/5 cursor-pointer"
                            style={{ border: `1px solid ${C.border}`, color: C.primary }}
                            title="View Public Product Page"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Profile details */}
        <div className="px-5 sm:px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Profile
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {profileRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 p-4 rounded-md"
                style={{ border: `1px solid ${C.border}` }}
              >
                <span
                  className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${C.primary} 14%, transparent)` }}
                >
                  <row.icon size={16} style={{ color: C.primary }} strokeWidth={2.25} />
                </span>
                <div className="leading-tight min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                    {row.label}
                  </div>
                  <div className="text-sm truncate" style={{ color: C.heading, fontFamily: "var(--font-body)", fontWeight: 600 }}>
                    {row.value || "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="px-5 sm:px-6 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 w-full">
              <span
                className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap"
                style={{ color: C.muted, fontFamily: "var(--font-body)" }}
              >
                Contact Details
              </span>
              <div className="h-px flex-1" style={{ background: C.border }} />
            </div>

            {!contact && !contactLoading && (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-4 py-2.5 rounded-md font-semibold uppercase tracking-wide shrink-0"
                style={{ background: C.heading, color: C.surface, fontFamily: "var(--font-body)" }}
              >
                <Plus size={14} />
                Add Contact Details
              </button>
            )}
          </div>

          {/* Loading */}
          {contactLoading ? (
            <p className="text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              Loading contact details...
            </p>
          ) : !contact ? (
            <div
              className="rounded-md p-6 flex flex-col items-center justify-center text-center gap-2"
              style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}
            >
              <span
                className="w-12 h-12 rounded-md flex items-center justify-center mb-1"
                style={{ background: `color-mix(in srgb, ${C.gold} 16%, transparent)` }}
              >
                <Store size={20} style={{ color: C.gold }} strokeWidth={1.75} />
              </span>
              <p className="text-sm" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                No contact details added yet.
              </p>
            </div>
          ) : (
            <div className="rounded-md p-4 sm:p-5" style={{ border: `1px solid ${C.border}` }}>
              {/* Shop Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1 flex items-start gap-3">
                  <span
                    className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${C.primary} 14%, transparent)` }}
                  >
                    <Store size={18} style={{ color: C.primary }} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="text-base font-semibold break-words"
                      style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
                    >
                      {contact.shopName}
                    </h3>
                    <p
                      className="text-xs sm:text-sm mt-1.5 break-words"
                      style={{ color: C.text, fontFamily: "var(--font-body)" }}
                    >
                      {contact.address}, {contact.city}, {contact.state} -{" "}
                      {contact.pincode}, {contact.country}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="p-2 rounded-md"
                    style={{ border: `1px solid ${C.border}`, color: C.primary }}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 rounded-md"
                    style={{ border: `1px solid ${C.border}`, color: C.danger }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5"
              >
                <div className="rounded-md p-3" style={{ background: C.backgroundSecondary }}>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide block"
                    style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                  >
                    WhatsApp
                  </span>
                  <span className="text-sm break-all" style={{ color: C.heading, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                    {contact.whatsappNumber}
                  </span>
                </div>

                <div className="rounded-md p-3" style={{ background: C.backgroundSecondary }}>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide block"
                    style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                  >
                    Call
                  </span>
                  <span className="text-sm break-all" style={{ color: C.heading, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                    {contact.callNumber}
                  </span>
                </div>

                <div className="rounded-md p-3" style={{ background: C.backgroundSecondary }}>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide block"
                    style={{ color: C.muted, fontFamily: "var(--font-body)" }}
                  >
                    Email
                  </span>
                  <span className="text-sm break-all" style={{ color: C.heading, fontFamily: "var(--font-body)", fontWeight: 500 }}>
                    {contact.email}
                  </span>
                </div>
              </div>

              {/* Map */}
              {contact.latitude && contact.longitude && (
                <div className="mt-5">
                  <a
                    href={`https://www.google.com/maps?q=${contact.latitude},${contact.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md"
                    style={{ color: C.primary, border: `1px solid ${C.border}`, fontFamily: "var(--font-body)" }}
                  >
                    <ExternalLink size={14} />
                    View on Map
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer help bar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4"
          style={{ background: C.backgroundSecondary, borderTop: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              <MessageCircle size={16} style={{ color: C.heading }} strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.heading, fontFamily: "var(--font-body)" }}>
                Need help managing your listings?
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                Add products and keep your contact details up to date.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-2xl p-5 max-h-[90vh] flex flex-col"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.border }}>
              <div className="min-w-0 pr-3">
                <h3
                  className="text-base font-bold truncate"
                  style={{ color: C.heading, fontFamily: "var(--font-heading)" }}
                >
                  {quickViewProduct.productName}
                </h3>
                {quickViewProduct.category && (
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                    {quickViewProduct.category} {quickViewProduct.subCategory ? `› ${quickViewProduct.subCategory}` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4">
              {/* Product image */}
              {(quickViewProduct.images?.[0] || quickViewProduct.thumbnail) && (
                <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={quickViewProduct.images?.[0] || quickViewProduct.thumbnail}
                    alt={quickViewProduct.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                  <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                    Price & Unit
                  </span>
                  <span className="font-bold text-sm" style={{ color: C.heading }}>
                    ₹{Number(quickViewProduct.price).toLocaleString("en-IN")} / {quickViewProduct.unit || "unit"}
                  </span>
                </div>
                <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                  <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                    Stock Availability
                  </span>
                  <span className="font-semibold" style={{ color: C.heading }}>
                    {quickViewProduct.stock} units ({quickViewProduct.availability || "In Stock"})
                  </span>
                </div>
                {quickViewProduct.brand && (
                  <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                    <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                      Brand
                    </span>
                    <span className="font-semibold" style={{ color: C.heading }}>
                      {quickViewProduct.brand}
                    </span>
                  </div>
                )}
                {quickViewProduct.material && (
                  <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                    <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                      Material
                    </span>
                    <span className="font-semibold" style={{ color: C.heading }}>
                      {quickViewProduct.material}
                    </span>
                  </div>
                )}
                {quickViewProduct.color && (
                  <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                    <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                      Color
                    </span>
                    <span className="font-semibold" style={{ color: C.heading }}>
                      {quickViewProduct.color}
                    </span>
                  </div>
                )}
                {quickViewProduct.warranty && (
                  <div className="p-2.5 rounded" style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}` }}>
                    <span className="text-[10px] uppercase font-semibold block" style={{ color: C.muted }}>
                      Warranty
                    </span>
                    <span className="font-semibold" style={{ color: C.heading }}>
                      {quickViewProduct.warranty}
                    </span>
                  </div>
                )}
              </div>

              {quickViewProduct.description && (
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: C.heading }}>
                    Description
                  </span>
                  <p
                    className="text-xs leading-relaxed p-3 rounded"
                    style={{ background: C.backgroundSecondary, border: `1px solid ${C.border}`, color: C.text }}
                  >
                    {quickViewProduct.description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: C.border }}>
              <button
                onClick={() => {
                  navigate(`/products/${quickViewProduct.id}`)
                }}
                className="px-4 py-2 rounded-md text-xs font-semibold text-white cursor-pointer inline-flex items-center gap-1.5"
                style={{ background: C.primary }}
              >
                <ExternalLink size={14} />
                Open Product Page
              </button>
            </div>
          </div>
        </div>
      )}

      <ContactDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} existing={contact} />
    </div>
  )
}

