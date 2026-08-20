
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    MapPin,
    ChevronDown,
    ChevronRight,
    ArrowLeft,
    ShieldCheck,
    Truck,
    Package,
    Ruler,
    TicketPercent,
    Heart,
    Share2,
    Home,
    Building2,
    FileBadge,
    Users,
    CalendarClock,
    Phone,
    Clock,
    ExternalLink,
    RotateCcw,
    CreditCard,
    Headphones,
} from "lucide-react"
import { useGetPublicProductsQuery } from "./supplyproductsapislice"
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import Loader from "../global/Loader"

// Reusable collapsible row
function Accordion({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => setOpen((o) => !o)}>
                <span className="accordion-title">
                    {icon}
                    {title}
                </span>
                <ChevronDown size={18} className={`accordion-chevron ${open ? "is-open" : ""}`} />
            </button>
            {open && <div className="accordion-body">{children}</div>}
        </div>
    )
}

// Small labeled info row used inside the Supplier Information / Contact Details cards
function InfoRow({ icon, label, value }) {
    if (value == null || value === "") return null
    return (
        <div className="info-row">
            <span className="info-row-icon">{icon}</span>
            <div className="info-row-body">
                <p className="info-row-label">{label}</p>
                <p className="info-row-value">{value}</p>
            </div>
        </div>
    )
}

const TRUST_BADGES = [
    { icon: ShieldCheck, title: "Quality Assured", desc: "All products are quality checked & verified" },
    { icon: CreditCard, title: "Secure Payments", desc: "Multiple secure payment options available" },
    { icon: Truck, title: "On-time Delivery", desc: "Fast and reliable delivery across India" },
    { icon: Headphones, title: "24/7 Support", desc: "We're here to help you anytime" },
]

export default function ProductDetailsPage() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const [imgIndex, setImgIndex] = useState(0)
    const [saved, setSaved] = useState(false)

    const { data: res, isLoading, error } = useGetPublicProductsQuery({ page: 1, limit: 100 })

    const products = res?.data?.products || []
    const suppliers = res?.data?.suppliers || []
    const contactDetailsList = res?.data?.contactDetails || []

    const product = products.find((p) => p.id === productId)
    const supplier = product ? suppliers.find((s) => s.id === product.supplierId) : null
    const contact = product ? contactDetailsList.find((c) => c.supplierId === product.supplierId) : null

    if (isLoading) {
        return (
            <div className="pdp-status">
                <style>{THEME_CSS}</style>
                {/* <Loader /> */}
                <p>Loading product...</p>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="pdp-status">
                <style>{THEME_CSS}</style>
                <p className="pdp-status-error">Product not found.</p>
                <button onClick={() => navigate(-1)} className="link-btn">
                    <ArrowLeft size={16} /> Go back
                </button>
            </div>
        )
    }

    const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean)
    const finalImages = images.length ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]

    const price = Number(product.price)
    const discount = product.discountPrice != null ? Number(product.discountPrice) : null
    const hasDiscount = discount != null && discount > 0
    // Matches "Save ₹X (Y%)" — Y is the discount as a share of the pre-discount price (price + discount).
    const discountPercent = hasDiscount ? Math.round((discount / (price + discount)) * 100) : 0

    const supplierDisplayName = supplier?.name || product.productName
    const supplierId = supplier?.id ? String(supplier.id).slice(-6).toUpperCase() : null

    const callSupplier = () => { window.location.href = `tel:${contact.callNumber}` }
    const whatsappSupplier = () => { window.open(`https://wa.me/91${contact.whatsappNumber}`, "_blank", "noopener,noreferrer") }
    const emailSupplier = () => { window.location.href = `mailto:${contact.email}` }

    const shareListing = () => {
        if (navigator.share) {
            navigator.share({ title: product.productName, url: window.location.href }).catch(() => {})
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const mapEmbedUrl =
        contact?.latitude && contact?.longitude
            ? `https://www.google.com/maps?q=${contact.latitude},${contact.longitude}&output=embed`
            : null

    const mapsSearchUrl =
        contact?.latitude && contact?.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${contact.latitude},${contact.longitude}`
            : contact?.address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  [contact.address, contact.city, contact.state, contact.pincode].filter(Boolean).join(", ")
              )}`
            : null

    return (
        <div className="pdp-root">
            <style>{THEME_CSS}</style>

            {/* TOP BAR */}
            <div className="pdp-topbar">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={15} /> Back to Suppliers
                </button>
                <p className="breadcrumb">
                    <Home size={12} className="breadcrumb-home" />
                    <span>Home</span>
                    <ChevronRight size={12} />
                    <span>Suppliers</span>
                    <ChevronRight size={12} />
                    <span className="breadcrumb-current">{supplierDisplayName}</span>
                </p>
            </div>

            <div className="pdp-wrap">
                {/* ---- Hero: image + primary info card ---- */}
                <div className="pdp-grid">
                    {/* LEFT — media */}
                    <div className="pdp-media">
                        <div className="pdp-image-frame">
                            <img src={finalImages[imgIndex]} alt={product.productName} />
                        </div>

                        {finalImages.length > 1 && (
                            <div className="thumb-row">
                                {finalImages.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIndex(i)}
                                        className={`thumb ${i === imgIndex ? "is-active" : ""}`}
                                    >
                                        <img src={src} alt={`thumb ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — info (plain, no boxed card — matches reference) */}
                    <div className="pdp-info-panel">
                        <div className="pdp-info-topline">
                            {supplier?.verified !== false ? (
                                <span className="badge-verified">
                                    <ShieldCheck size={13} /> Verified Supplier
                                </span>
                            ) : <span />}

                            <div className="icon-actions">
                                <button
                                    type="button"
                                    onClick={() => setSaved((s) => !s)}
                                    aria-label={saved ? "Remove from favorites" : "Save"}
                                    className="icon-btn"
                                >
                                    <Heart size={15} className={saved ? "fill-[var(--gold)] is-saved" : ""} />
                                </button>
                                <button type="button" onClick={shareListing} aria-label="Share" className="icon-btn">
                                    <Share2 size={15} />
                                </button>
                            </div>
                        </div>

                        <h1 className="pdp-title">{supplierDisplayName}</h1>
                        {supplierId && <p className="pdp-subid">Supplier ID: {supplierId}</p>}

                        <div className="price-tag">
                            <div className="price-row">
                                <span className="price-main">₹{price.toLocaleString("en-IN")}</span>
                                {hasDiscount && (
                                    <span className="price-save">
                                        <TicketPercent size={14} />
                                        Save ₹{discount.toLocaleString("en-IN")} ({discountPercent}%)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={`stock-row ${product.availability === "In Stock" ? "is-in-stock" : "is-out-stock"}`}>
                            <span className="stock-dot" />
                            {product.availability} · {product.stock} units available
                        </div>

                        <div className="cta-row">
                            <button onClick={whatsappSupplier} className="cta-secondary cta-whatsapp">
                                <FaWhatsapp size={17} />
                                WhatsApp
                            </button>
                            <button onClick={emailSupplier} className="cta-secondary cta-email">
                                <MdEmail size={17} />
                                Email
                            </button>
                        </div>

                        <div className="accordion-wrap">
                            {product.length != null || product.width != null || product.height != null || product.weight != null ? (
                                <Accordion title="Measurements" icon={<Ruler size={16} />}>
                                    <table className="spec-table">
                                        <tbody>
                                            {product.length != null && <tr><td>Length</td><td>{product.length} mm</td></tr>}
                                            {product.width != null && <tr><td>Width</td><td>{product.width} mm</td></tr>}
                                            {product.height != null && <tr><td>Height</td><td>{product.height} mm</td></tr>}
                                            {product.weight != null && <tr><td>Weight</td><td>{product.weight} kg</td></tr>}
                                        </tbody>
                                    </table>
                                </Accordion>
                            ) : null}

                            <Accordion title="Specifications" icon={<Package size={16} />}>
                                <table className="spec-table">
                                    <tbody>
                                        {product.description && (
                                            <tr><td colSpan={2} className="spec-desc">{product.description}</td></tr>
                                        )}
                                        {product.material && <tr><td>Material</td><td>{product.material}</td></tr>}
                                        {product.color && <tr><td>Color</td><td>{product.color}</td></tr>}
                                        <tr><td>Minimum order</td><td>{product.minimumOrderQuantity} {product.unit}(s)</td></tr>
                                        {product.warranty && <tr><td>Warranty</td><td>{product.warranty}</td></tr>}
                                    </tbody>
                                </table>
                            </Accordion>

                            <Accordion title="Delivery & Shipping" icon={<Truck size={16} />}>
                                <p style={{ margin: 0 }}>
                                    {product.deliveryTime || "Contact the supplier directly for delivery timelines to your location."}
                                </p>
                            </Accordion>

                            <Accordion title="Return Policy" icon={<RotateCcw size={16} />}>
                                <p style={{ margin: 0 }}>
                                    {product.returnPolicy || "Returns are handled directly by the supplier. Contact them via WhatsApp, call, or email to discuss returns or exchanges."}
                                </p>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* ---- Supplier Information / Contact Details / Location ---- */}
                {contact && (
                    <div className="detail-grid">
                        <div className="detail-card">
                            <p className="detail-card-heading">
                                <Building2 size={16} className="detail-card-heading-icon" />
                                Supplier Information
                            </p>
                            <div className="info-list">
                                <InfoRow icon={<Users size={14} />} label="Supplier Name" value={supplier?.name} />
                                <InfoRow icon={<Building2 size={14} />} label="Business Type" value={supplier?.type || product.supplierType} />
                                <InfoRow icon={<FileBadge size={14} />} label="GST Number" value={supplier?.gstNumber} />
                                <InfoRow icon={<CalendarClock size={14} />} label="Years in Business" value={supplier?.experienceYears ? `${supplier.experienceYears}+ Years` : null} />
                                <InfoRow icon={<Users size={14} />} label="Number of Employees" value={supplier?.employeeCount} />
                            </div>
                        </div>

                        <div className="detail-card">
                            <p className="detail-card-heading">
                                <Phone size={16} className="detail-card-heading-icon" />
                                Contact Details
                            </p>
                            <div className="info-list">
                                <InfoRow
                                    icon={<MapPin size={14} />}
                                    label="Address"
                                    value={`${contact.address}, ${contact.city}, ${contact.state} - ${contact.pincode}, ${contact.country}`}
                                />
                                <InfoRow
                                    icon={<FaPhoneAlt size={12} />}
                                    label="Phone"
                                    value={
                                        <button onClick={callSupplier} className="info-row-link">
                                            {contact.callNumber}
                                        </button>
                                    }
                                />
                                <InfoRow
                                    icon={<FaWhatsapp size={14} />}
                                    label="WhatsApp"
                                    value={
                                        <button onClick={whatsappSupplier} className="info-row-link">
                                            {contact.whatsappNumber}
                                        </button>
                                    }
                                />
                                <InfoRow
                                    icon={<MdEmail size={14} />}
                                    label="Email"
                                    value={
                                        <button onClick={emailSupplier} className="info-row-link">
                                            {contact.email}
                                        </button>
                                    }
                                />
                                <InfoRow icon={<Clock size={14} />} label="Working Hours" value={contact.workingHours || "Mon – Sat: 9:00 AM – 7:00 PM"} />
                            </div>
                        </div>

                        <div className="detail-card">
                            <p className="detail-card-heading">
                                <MapPin size={16} className="detail-card-heading-icon" />
                                Location
                            </p>

                            {mapEmbedUrl ? (
                                <div className="map-frame">
                                    <iframe
                                        title="Supplier location"
                                        src={mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: 200, display: "block" }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            ) : (
                                <div className="map-placeholder">
                                    <MapPin size={22} />
                                    <p>Location not available</p>
                                </div>
                            )}

                            <p className="map-address">
                                {contact.address}, {contact.city}, {contact.state} - {contact.pincode}, {contact.country}
                            </p>

                            {mapsSearchUrl && (
                                <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="map-view-btn">
                                    View on Map <ExternalLink size={13} />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* ---- Trust badges ---- */}
                <div className="trust-strip">
                    {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="trust-item">
                            <span className="trust-icon">
                                <Icon size={18} />
                            </span>
                            <div className="trust-copy">
                                <p className="trust-title">{title}</p>
                                <p className="trust-desc">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const THEME_CSS = `
  .pdp-root {
    background: var(--background-secondary);
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--text);
  }

  .pdp-status {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: var(--background-secondary);
    font-family: var(--font-body);
    color: var(--muted);
  }
  .pdp-status-error { color: var(--danger); font-size: 14px; }

  .link-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
  }

  .pdp-topbar {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px 24px 0;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    color: var(--heading);
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 700;
    transition: var(--transition);
  }
  .back-btn:hover { color: var(--gold); }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    font-size: 12.5px;
    color: var(--muted);
    margin: 10px 0 0;
  }
  .breadcrumb-home { color: var(--muted); }
  .breadcrumb-current { color: var(--heading); font-weight: 600; }

  .pdp-wrap {
    max-width: 1280px;
    margin: 0 auto;
    padding: 16px 24px 40px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ---------- Hero ---------- */
  .pdp-grid {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    gap: 24px;
    align-items: start;
  }

  .pdp-image-frame {
    background: var(--background-secondary);
    aspect-ratio: 1 / 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }
  .pdp-image-frame img { width: 100%; height: 100%; object-fit: cover; }

  .thumb-row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .thumb {
    width: 64px;
    height: 64px;
    padding: 0;
    background: var(--background-secondary);
    border: 2px solid transparent;
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  .thumb.is-active { border-color: var(--gold); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }

  .pdp-info-panel {
    /* Plain — no card background, border, or shadow. Sits directly on the
       page next to the image, matching the reference layout. */
    padding-top: 2px;
  }

  .pdp-info-topline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .badge-verified {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--success);
    background: color-mix(in srgb, var(--success) 12%, transparent);
    padding: 6px 12px;
    border-radius: 999px;
  }

  .icon-actions { display: flex; gap: 8px; flex-shrink: 0; }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 8px;
    cursor: pointer;
    color: var(--heading);
    transition: var(--transition);
  }
  .icon-btn:hover { color: var(--gold); border-color: var(--gold); }
  .icon-btn svg.is-saved { fill: var(--gold); color: var(--gold); }

  .pdp-title {
    font-family: var(--font-heading);
    font-size: 24px;
    font-weight: 700;
    color: var(--heading);
    line-height: 1.25;
    margin: 0 0 4px;
  }

  .pdp-subid { font-size: 13px; color: var(--muted); margin: 0 0 18px; }

  .price-tag {
    background: var(--surface);
    border: 1px solid var(--border);
    display: inline-block;
    padding: 12px 18px;
    margin-bottom: 16px;
    border-radius: var(--radius-sm);
  }

  .price-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .price-main { font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: var(--heading); }
  .price-save {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 700;
    color: var(--success);
  }

  .stock-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .stock-row.is-in-stock { color: var(--success); }
  .stock-row.is-out-stock { color: var(--danger); }
  .stock-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  .cta-row { display: flex; gap: 10px; margin-bottom: 20px; }

  .cta-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px 0;
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    color: var(--heading);
    border-radius: 8px;
    transition: var(--transition);
  }

  .cta-whatsapp {
    background: var(--success);
    border-color: var(--success);
    color: var(--surface);
  }
  .cta-whatsapp:hover { filter: brightness(0.94); }

  .cta-email {
    background: var(--surface);
    border-color: var(--danger);
    color: var(--danger);
  }
  .cta-email:hover { background: color-mix(in srgb, var(--danger) 8%, transparent); }

  .accordion-wrap { border-top: 1px solid var(--border); }

  .accordion-item { border-bottom: 1px solid var(--border); }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .accordion-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--heading);
  }

  .accordion-chevron { color: var(--heading); transition: transform .2s ease; flex-shrink: 0; }
  .accordion-chevron.is-open { transform: rotate(180deg); }

  .accordion-body { padding-bottom: 18px; font-size: 13.5px; color: var(--text); line-height: 1.65; }

  .spec-table { width: 100%; font-size: 13.5px; border-collapse: collapse; }
  .spec-table td { padding: 5px 0; }
  .spec-table td:first-child { color: var(--muted); }
  .spec-table td:last-child { text-align: right; color: var(--heading); font-weight: 600; }
  .spec-table td.spec-desc { text-align: left; color: var(--text); font-weight: 400; padding-bottom: 12px; }

  /* ---------- Supplier / Contact / Location cards ---------- */
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .detail-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 20px;
  }

  .detail-card-heading {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--heading);
    margin: 0 0 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .detail-card-heading-icon { color: var(--gold); flex-shrink: 0; }

  .info-list { display: flex; flex-direction: column; gap: 14px; }

  .info-row { display: flex; align-items: flex-start; gap: 10px; }

  .info-row-icon {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 7px;
    background: color-mix(in srgb, var(--gold) 14%, transparent);
    color: var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .info-row-body { min-width: 0; }
  .info-row-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; margin: 0 0 2px; }
  .info-row-value { font-size: 13.5px; color: var(--text); margin: 0; line-height: 1.5; word-break: break-word; }

  .info-row-link {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: 13.5px;
    color: var(--text);
    cursor: pointer;
    text-align: left;
  }
  .info-row-link:hover { color: var(--gold); text-decoration: underline; }

  .map-frame {
    background: var(--background-secondary);
    min-height: 190px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .map-placeholder {
    background: var(--background-secondary);
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .map-placeholder p { font-size: 13px; margin: 0; }

  .map-address { font-size: 12.5px; color: var(--muted); line-height: 1.55; margin: 12px 0 12px; }

  .map-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--heading);
    background: var(--background-secondary);
    border: 1px solid var(--border);
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: var(--transition);
  }
  .map-view-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* ---------- Trust strip ---------- */
  .trust-strip {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 22px 24px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  .trust-item { display: flex; align-items: flex-start; gap: 12px; }

  .trust-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--gold) 16%, transparent);
    color: var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trust-copy { min-width: 0; }
  .trust-title { font-size: 13px; font-weight: 700; color: var(--heading); margin: 0 0 3px; }
  .trust-desc { font-size: 11.5px; color: var(--muted); margin: 0; line-height: 1.5; }

  /* ---------- Responsive ---------- */
  @media (max-width: 1024px) {
    .detail-grid { grid-template-columns: 1fr 1fr; }
    .detail-grid > :nth-child(3) { grid-column: 1 / -1; }
    .trust-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 900px) {
    .pdp-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  @media (max-width: 640px) {
    .pdp-topbar { padding: 16px 16px 0; }
    .pdp-wrap { padding: 14px 16px 32px; gap: 22px; }
    .pdp-info-panel { padding-top: 0; }
    .pdp-title { font-size: 20px; }
    .price-main { font-size: 22px; }
    .cta-row { flex-direction: column; }
    .thumb { width: 52px; height: 52px; }
    .detail-grid { grid-template-columns: 1fr; }
    .detail-grid > :nth-child(3) { grid-column: auto; }
    .trust-strip { grid-template-columns: 1fr; padding: 18px; }
    .breadcrumb { font-size: 11.5px; }
  }

  @media (max-width: 400px) {
    .pdp-title { font-size: 18px; }
    .price-tag { padding: 12px 14px; }
    .price-main { font-size: 20px; }
  }
`