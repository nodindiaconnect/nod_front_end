import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, ChevronDown, ArrowLeft, ShieldCheck, Truck, Package, Ruler, TicketPercent } from "lucide-react"
import { useGetPublicProductsQuery } from "./supplyproductsapislice"
import { FaWhatsapp, FaPhoneAlt, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Loader from "../global/Loader";

const WhatsAppIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" fill="currentColor" />
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" fill="var(--surface)" />
    </svg>
)

const GmailIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="var(--surface)" stroke="currentColor" strokeWidth="1" />
        <path d="M3 6.5 12 13l9-6.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
)

const CallIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4.5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" fill="currentColor" />
    </svg>
)

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

export default function ProductDetailsPage() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const [imgIndex, setImgIndex] = useState(0)

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

    const original = Number(product.price)
    const discount = product.discountPrice != null ? Number(product.discountPrice) : null
    const hasDiscount = discount != null && discount > 0 && discount < original

    const callSupplier = () => { window.location.href = `tel:${contact.callNumber}` }
    const whatsappSupplier = () => { window.open(`https://wa.me/91${contact.whatsappNumber}`, "_blank", "noopener,noreferrer") }
    const emailSupplier = () => { window.location.href = `mailto:${contact.email}` }

    const mapEmbedUrl =
        contact?.latitude && contact?.longitude
            ? `https://www.google.com/maps?q=${contact.latitude},${contact.longitude}&output=embed`
            : null

    return (
        <div className="pdp-root">
            <style>{THEME_CSS}</style>

            {/* TOP BAR */}
            <div className="pdp-topbar">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={14} /> Back to products
                </button>
                <p className="breadcrumb">
                    {product.category}{product.subCategory ? ` / ${product.subCategory}` : ""} / <span className="breadcrumb-current">{product.productName}</span>
                </p>
            </div>

            <div className="pdp-wrap">
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

                    {/* RIGHT — details */}
                    <div className="pdp-info">
                        {/* {supplier?.isVerified && (
                            <span className="badge-verified">
                                <ShieldCheck size={14} /> Verified supplier
                            </span>
                        )} */}

                        <h1 className="pdp-title">{product.productName}</h1>

                        {product.brand && <p className="pdp-brand">{product.brand}</p>}


                        <div className="price-tag flex flex-col gap-1">
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-[var(--text)]">
                                    ₹{original.toLocaleString("en-IN")}
                                </span>

                                {hasDiscount && (
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                                        <TicketPercent size={14} />
                                        Save ₹{discount.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>
{/* 
                            {hasDiscount && (
                                <p className="text-xs text-[var(--muted)]">
                                    Special Offer Available
                                </p>
                            )} */}
                        </div>

                        <div className={`stock-row ${product.availability === "In Stock" ? "is-in-stock" : "is-out-stock"}`}>
                            <span className="stock-dot" />
                            {product.availability} · {product.stock} units available
                        </div>

                        <div className="cta-row">
                            <button
                                onClick={whatsappSupplier}
                                className="cta-secondary flex items-center gap-2 !bg-[#00d756] !border-[#00D756] "
                            >
                                <FaWhatsapp size={18} className="text-[#ffffff]" />
                                WhatsApp
                            </button>

                            <button
                                onClick={emailSupplier}
                                className="cta-secondary flex items-center gap-2 !bg-[#FDECEC] !border-[#EA4335] hover:!bg-[#FAD9D7]"
                            >
                                <MdEmail size={18} className="text-[#C5221F]" />
                                Email
                            </button>
                        </div>
                        <div className="accordion-wrap">
                            {product.description && (
                                <Accordion title="Product details" defaultOpen>
                                    <p style={{ margin: 0 }}>{product.description}</p>
                                </Accordion>
                            )}

                            <Accordion title="Measurements" icon={<Ruler size={16} />}>
                                <table className="spec-table">
                                    <tbody>
                                        {product.length != null && (
                                            <tr><td>Length</td><td>{product.length} mm</td></tr>
                                        )}
                                        {product.width != null && (
                                            <tr><td>Width</td><td>{product.width} mm</td></tr>
                                        )}
                                        {product.height != null && (
                                            <tr><td>Height</td><td>{product.height} mm</td></tr>
                                        )}
                                        {product.weight != null && (
                                            <tr><td>Weight</td><td>{product.weight} kg</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </Accordion>

                            <Accordion title="Specifications" icon={<Package size={16} />}>
                                <table className="spec-table">
                                    <tbody>
                                        {product.material && (
                                            <tr><td>Material</td><td>{product.material}</td></tr>
                                        )}
                                        {product.color && (
                                            <tr><td>Color</td><td>{product.color}</td></tr>
                                        )}
                                        <tr><td>Minimum order</td><td>{product.minimumOrderQuantity} {product.unit}(s)</td></tr>
                                        {product.warranty && (
                                            <tr><td>Warranty</td><td>{product.warranty}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </Accordion>

                            <Accordion title="Delivery" icon={<Truck size={16} />}>
                                <p style={{ margin: 0 }}>{product.deliveryTime || "Contact the supplier directly for delivery timelines to your location."}</p>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* SUPPLIER + LOCATION */}
                {contact && (
                    <div className="sold-by">

                        <div className="sold-grid">
                            <div>
                                <p className="shop-name">{contact.shopName}</p>
                                {supplier?.name && <p className="supplier-name">{supplier.name}</p>}

                                <div className="address-row">
                                    <MapPin size={16} className="address-icon" />
                                    <p className="address-text">
                                        {contact.address}, {contact.city}, {contact.state} - {contact.pincode}, {contact.country}
                                    </p>
                                </div>

                                <div className="contact-list">
                                    <button onClick={callSupplier} className="contact-btn">
                                        <FaPhoneAlt size={15} color="#2563EB" />
                                        <span>{contact.callNumber}</span>
                                    </button>

                                    <button onClick={whatsappSupplier} className="contact-btn">
                                        <FaWhatsapp size={18} color="#00d756" />
                                        <span>{contact.whatsappNumber}</span>
                                    </button>

                                    <button onClick={emailSupplier} className="contact-btn">
                                        <MdEmail size={18} color="#EA4335" />
                                        <span>{contact.email}</span>
                                    </button>
                                </div>
                            </div>

                            {mapEmbedUrl ? (
                                <div className="map-frame">
                                    <iframe
                                        title="Supplier location"
                                        src={mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: 260, display: "block" }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            ) : (
                                <div className="map-placeholder">
                                    <p>Location not available</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const THEME_CSS = `
  .pdp-root {
    background: var(--background);
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
    background: var(--background);
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px 0;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
  }
  .back-btn:hover { color: var(--primary-hover); }

  .breadcrumb {
    font-size: 12px;
    color: var(--muted);
    margin-top: 12px;
  }
  .breadcrumb-current { color: var(--heading); }

  .pdp-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 14px 30px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .pdp-grid {
    display: grid;
    grid-template-columns: minmax(0,1.1fr) minmax(0,1fr);
    gap: 48px;
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
    box-shadow: var(--shadow-sm);
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
  .thumb.is-active { border-color: var(--primary); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }

  .badge-verified {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 8px;
  }

  .pdp-title {
    font-family: var(--font-heading);
    font-size: 26px;
    font-weight: 700;
    color: var(--heading);
    line-height: 1.25;
    margin: 0 0 4px;
  }

  .pdp-brand { font-size: 14px; color: var(--muted); margin: 0 0 16px; }

  .price-tag {
    background: var(--background-secondary);
    border: 1px solid var(--border);
    display: inline-block;
    padding: 12px 16px;
    margin-bottom: 16px;
    border-radius: var(--radius-sm);
  }

  .price-row { display: flex; align-items: baseline; gap: 6px; }
  .price-main { font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: var(--heading); }
  .price-unit { font-size: 13px; color: var(--text); font-weight: 600; }
  .price-offer { font-size: 13px; color: var(--gold-hover); margin: 4px 0 0; font-weight: 600; }

  .stock-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .stock-row.is-in-stock { color: var(--success); }
  .stock-row.is-out-stock { color: var(--danger); }
  .stock-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

  .cta-primary {
    width: 100%;
    background: var(--primary);
    color: var(--surface);
    font-size: 15px;
    font-weight: 700;
    padding: 14px 0;
    border: none;
    cursor: pointer;
    margin-bottom: 12px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  .cta-primary:hover { background: var(--primary-hover); }

  .cta-row { display: flex; gap: 10px; margin-bottom: 28px; }

  .cta-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 0;
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--heading);
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  .cta-secondary:hover { background: var(--background-secondary); box-shadow: var(--shadow-sm); }

  .accordion-wrap { border-top: 1px solid var(--border); }

  .accordion-item { border-bottom: 1px solid var(--border); }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .accordion-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: var(--heading);
  }

  .accordion-chevron { color: var(--heading); transition: transform .2s ease; }
  .accordion-chevron.is-open { transform: rotate(180deg); }

  .accordion-body { padding-bottom: 20px; font-size: 14px; color: var(--text); line-height: 1.6; }

  .spec-table { width: 100%; font-size: 14px; border-collapse: collapse; }
  .spec-table td { padding: 4px 0; }
  .spec-table td:first-child { color: var(--muted); }
  .spec-table td:last-child { text-align: right; color: var(--heading); }

  .sold-by { border-top: 1px solid var(--border); padding-top: 32px; }

  .sold-by-heading {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 700;
    color: var(--heading);
    margin-bottom: 20px;
  }

  .sold-grid {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1.2fr);
    gap: 32px;
  }

  .shop-name { font-size: 16px; font-weight: 700; color: var(--heading); margin: 0 0 4px; }
  .supplier-name { font-size: 13px; color: var(--muted); margin: 0 0 16px; }

  .address-row { display: flex; gap: 8px; margin-bottom: 20px; }
  .address-icon { color: var(--muted); flex-shrink: 0; margin-top: 2px; }
  .address-text { font-size: 14px; color: var(--text); margin: 0; line-height: 1.6; }

  .contact-list { display: flex; flex-direction: column; gap: 10px; }

  .contact-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--heading);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .contact-btn:hover { color: var(--primary); }
  .contact-btn svg { color: var(--primary); }

  .map-frame {
    background: var(--background-secondary);
    min-height: 260px;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .map-placeholder {
    background: var(--background-secondary);
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
  }
  .map-placeholder p { font-size: 13px; color: var(--muted); }

  /* ---------- Responsive ---------- */
  @media (max-width: 960px) {
    .pdp-grid { grid-template-columns: 1fr; gap: 32px; }
    .sold-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  @media (max-width: 640px) {
    .pdp-topbar { padding: 16px 16px 0; }
    .pdp-wrap { padding: 16px 16px 40px; gap: 28px; }
    .pdp-title { font-size: 21px; }
    .price-main { font-size: 26px; }
    .cta-row { flex-direction: column; }
    .thumb { width: 52px; height: 52px; }
    .sold-by-heading { font-size: 18px; }
  }

  @media (max-width: 400px) {
    .pdp-title { font-size: 19px; }
    .price-tag { padding: 10px 12px; }
    .price-main { font-size: 22px; }
  }
`