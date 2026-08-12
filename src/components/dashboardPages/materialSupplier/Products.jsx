// // import React, { useEffect, useMemo, useRef, useState } from "react"
// // import {
// //   Pencil,
// //   Trash2,
// //   X,
// //   Save,
// //   AlertTriangle,
// //   Package,
// //   Search,
// //   Eye,
// //   ImageOff,
// //   ChevronLeft,
// //   ChevronRight,
// //   Tag,
// //   Ruler,
// //   Weight,
// //   ShieldCheck,
// //   Truck,
// //   Boxes,
// //   Upload,
// //   Loader2,
// //   Star,
// // } from "lucide-react"
// // import {
// //   useGetSupplierProductsQuery,
// //   useUpdateProductMutation,
// //   useDeleteProductMutation,
// // } from "./dashboard/materialapislice"
// // import { uploadFile } from "../../../../superBase" // adjust this import path to where your upload helper lives

// // const C = {
// //   primary: "var(--primary, #3a2418)",
// //   primaryHover: "var(--primary-hover, #2a1a10)",
// //   gold: "var(--gold, #c9973a)",
// //   goldHover: "var(--gold-hover, #b3852f)",
// //   background: "var(--background, #f7f5f2)",
// //   surface: "var(--surface, #ffffff)",
// //   heading: "var(--heading, #2a2018)",
// //   text: "var(--text, #4a4038)",
// //   muted: "var(--muted, #8a8078)",
// //   border: "var(--border, #e5e0d8)",
// //   danger: "var(--danger, #b3402f)",
// //   dangerHover: "var(--danger-hover, #942f20)",
// //   success: "var(--success, #3f7d4f)",
// //   radiusSm: "var(--radius-sm, 6px)",
// //   radiusMd: "var(--radius-md, 10px)",
// //   radiusLg: "var(--radius-lg, 14px)",
// //   fontHeading: "var(--font-heading, inherit)",
// //   fontBody: "var(--font-body, inherit)",
// //   transition: "var(--transition, 0.15s ease)",
// // }

// // const EDITABLE_FIELDS = [
// //   { key: "productName", label: "Product name", type: "text", required: true },
// //   { key: "category", label: "Category", type: "text", required: true },
// //   { key: "subCategory", label: "Sub category", type: "text" },
// //   { key: "brand", label: "Brand", type: "text" },
// //   { key: "unit", label: "Unit", type: "text", required: true },
// //   { key: "price", label: "Price", type: "number", required: true },
// //   { key: "discountPrice", label: "Discount price", type: "number" },
// //   { key: "stock", label: "Stock", type: "number" },
// //   { key: "minimumOrderQuantity", label: "Min order qty", type: "number" },
// //   { key: "material", label: "Material", type: "text" },
// //   { key: "color", label: "Color", type: "text" },
// //   {
// //     key: "availability",
// //     label: "Availability",
// //     type: "select",
// //     options: ["In Stock", "Out of Stock"],
// //   },
// //   {
// //     key: "status",
// //     label: "Status",
// //     type: "select",
// //     options: ["Active", "Inactive"],
// //   },
// //   { key: "description", label: "Description", type: "textarea", full: true },
// // ]

// // /* ---------- responsive hook ---------- */
// // function useIsMobile(breakpoint = 720) {
// //   const [isMobile, setIsMobile] = useState(
// //     typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
// //   )
// //   useEffect(() => {
// //     const onResize = () => setIsMobile(window.innerWidth <= breakpoint)
// //     window.addEventListener("resize", onResize)
// //     return () => window.removeEventListener("resize", onResize)
// //   }, [breakpoint])
// //   return isMobile
// // }

// // /* ---------- shared bits ---------- */
// // function StatusPill({ value }) {
// //   const active = value === "Active" || value === "In Stock"
// //   return (
// //     <span
// //       style={{
// //         display: "inline-flex",
// //         alignItems: "center",
// //         gap: 5,
// //         padding: "3px 9px",
// //         borderRadius: 999,
// //         fontSize: 11,
// //         fontWeight: 600,
// //         fontFamily: C.fontBody,
// //         whiteSpace: "nowrap",
// //         color: active ? C.success : C.muted,
// //         background: active ? "rgba(63,125,79,0.1)" : "rgba(138,128,120,0.12)",
// //         border: `1px solid ${active ? C.success : C.border}`,
// //       }}
// //     >
// //       <span
// //         style={{
// //           width: 6,
// //           height: 6,
// //           borderRadius: "50%",
// //           background: active ? C.success : C.muted,
// //           flexShrink: 0,
// //         }}
// //       />
// //       {value}
// //     </span>
// //   )
// // }

// // function ProductThumb({ src, alt, size = 44 }) {
// //   const [broken, setBroken] = useState(false)
// //   if (!src || broken) {
// //     return (
// //       <div
// //         style={{
// //           width: size,
// //           height: size,
// //           borderRadius: C.radiusSm,
// //           background: C.background,
// //           border: `1px solid ${C.border}`,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           flexShrink: 0,
// //         }}
// //       >
// //         <ImageOff size={Math.max(14, size * 0.36)} color={C.muted} strokeWidth={1.75} />
// //       </div>
// //     )
// //   }
// //   return (
// //     <img
// //       src={src}
// //       alt={alt}
// //       onError={() => setBroken(true)}
// //       style={{
// //         width: size,
// //         height: size,
// //         borderRadius: C.radiusSm,
// //         objectFit: "cover",
// //         border: `1px solid ${C.border}`,
// //         flexShrink: 0,
// //       }}
// //     />
// //   )
// // }

// // function DetailRow({ icon: Icon, label, value }) {
// //   if (value === null || value === undefined || value === "") return null
// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         justifyContent: "space-between",
// //         gap: 12,
// //         padding: "9px 0",
// //         borderBottom: `1px solid ${C.border}`,
// //       }}
// //     >
// //       <span
// //         style={{
// //           display: "flex",
// //           alignItems: "center",
// //           gap: 6,
// //           fontSize: 12,
// //           color: C.muted,
// //           fontWeight: 600,
// //           flexShrink: 0,
// //         }}
// //       >
// //         {Icon && <Icon size={13} strokeWidth={2.25} />}
// //         {label}
// //       </span>
// //       <span style={{ fontSize: 13, color: C.heading, fontWeight: 500, textAlign: "right" }}>
// //         {value}
// //       </span>
// //     </div>
// //   )
// // }

// // /* ---------- view modal ---------- */
// // function ViewProductModal({ product, onClose, onEdit }) {
// //   const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []
// //   const [activeImg, setActiveImg] = useState(0)
// //   const [broken, setBroken] = useState(false)
// //   const isMobile = useIsMobile()

// //   const dimensions = [product.length, product.width, product.height]
// //     .filter((v) => v !== null && v !== undefined)
// //     .join(" × ")

// //   return (
// //     <div
// //       onClick={onClose}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         background: "rgba(20, 16, 12, 0.55)",
// //         display: "flex",
// //         alignItems: isMobile ? "flex-end" : "center",
// //         justifyContent: "center",
// //         zIndex: 1000,
// //         padding: isMobile ? 0 : 16,
// //         boxSizing: "border-box",
// //       }}
// //     >
// //       <div
// //         onClick={(e) => e.stopPropagation()}
// //         style={{
// //           background: C.surface,
// //           borderRadius: isMobile ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
// //           maxWidth: 860,
// //           width: "100%",
// //           maxHeight: isMobile ? "92vh" : "88vh",
// //           display: "flex",
// //           flexDirection: "column",
// //           overflow: "hidden",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "flex-start",
// //             padding: isMobile ? "16px 16px 14px" : "20px 24px",
// //             borderBottom: `1px solid ${C.border}`,
// //             flexShrink: 0,
// //             gap: 12,
// //           }}
// //         >
// //           <div style={{ minWidth: 0 }}>
// //             <h2
// //               style={{
// //                 margin: 0,
// //                 fontFamily: C.fontHeading,
// //                 fontSize: isMobile ? 17 : 19,
// //                 color: C.heading,
// //                 overflowWrap: "anywhere",
// //               }}
// //             >
// //               {product.productName}
// //             </h2>
// //             <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
// //               <StatusPill value={product.status} />
// //               <StatusPill value={product.availability} />
// //               {product.sku && (
// //                 <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>
// //                   SKU: {product.sku}
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             aria-label="Close"
// //             style={{
// //               background: "transparent",
// //               border: "none",
// //               cursor: "pointer",
// //               color: C.muted,
// //               padding: 4,
// //               flexShrink: 0,
// //             }}
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <div
// //           style={{
// //             padding: isMobile ? 16 : "20px 24px",
// //             overflowY: "auto",
// //             display: "grid",
// //             gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
// //             gap: isMobile ? 18 : 24,
// //           }}
// //         >
// //           <div>
// //             {images.length > 0 ? (
// //               <>
// //                 <div
// //                   style={{
// //                     position: "relative",
// //                     width: "100%",
// //                     aspectRatio: "4 / 3",
// //                     borderRadius: C.radiusMd,
// //                     overflow: "hidden",
// //                     border: `1px solid ${C.border}`,
// //                     background: C.background,
// //                   }}
// //                 >
// //                   {broken ? (
// //                     <div
// //                       style={{
// //                         width: "100%",
// //                         height: "100%",
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                       }}
// //                     >
// //                       <ImageOff size={28} color={C.muted} />
// //                     </div>
// //                   ) : (
// //                     <img
// //                       src={images[activeImg]}
// //                       alt={`${product.productName} ${activeImg + 1}`}
// //                       onError={() => setBroken(true)}
// //                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
// //                     />
// //                   )}
// //                   {images.length > 1 && (
// //                     <>
// //                       <button
// //                         type="button"
// //                         onClick={() => {
// //                           setBroken(false)
// //                           setActiveImg((i) => (i - 1 + images.length) % images.length)
// //                         }}
// //                         aria-label="Previous image"
// //                         style={navBtnStyle("left")}
// //                       >
// //                         <ChevronLeft size={16} />
// //                       </button>
// //                       <button
// //                         type="button"
// //                         onClick={() => {
// //                           setBroken(false)
// //                           setActiveImg((i) => (i + 1) % images.length)
// //                         }}
// //                         aria-label="Next image"
// //                         style={navBtnStyle("right")}
// //                       >
// //                         <ChevronRight size={16} />
// //                       </button>
// //                       <div
// //                         style={{
// //                           position: "absolute",
// //                           bottom: 8,
// //                           right: 8,
// //                           background: "rgba(0,0,0,0.55)",
// //                           color: "#fff",
// //                           fontSize: 11,
// //                           fontWeight: 600,
// //                           padding: "2px 8px",
// //                           borderRadius: 999,
// //                         }}
// //                       >
// //                         {activeImg + 1} / {images.length}
// //                       </div>
// //                     </>
// //                   )}
// //                 </div>
// //                 {images.length > 1 && (
// //                   <div
// //                     style={{
// //                       display: "flex",
// //                       gap: 8,
// //                       marginTop: 10,
// //                       flexWrap: "wrap",
// //                       overflowX: isMobile ? "auto" : "visible",
// //                     }}
// //                   >
// //                     {images.map((img, i) => (
// //                       <button
// //                         key={i}
// //                         type="button"
// //                         onClick={() => {
// //                           setBroken(false)
// //                           setActiveImg(i)
// //                         }}
// //                         style={{
// //                           padding: 0,
// //                           border: `2px solid ${i === activeImg ? C.primary : "transparent"}`,
// //                           borderRadius: C.radiusSm,
// //                           cursor: "pointer",
// //                           background: "none",
// //                           flexShrink: 0,
// //                         }}
// //                       >
// //                         <ProductThumb src={img} alt={`thumb ${i + 1}`} size={48} />
// //                       </button>
// //                     ))}
// //                   </div>
// //                 )}
// //               </>
// //             ) : (
// //               <div
// //                 style={{
// //                   width: "100%",
// //                   aspectRatio: "4 / 3",
// //                   borderRadius: C.radiusMd,
// //                   border: `1px dashed ${C.border}`,
// //                   display: "flex",
// //                   flexDirection: "column",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   gap: 6,
// //                   color: C.muted,
// //                 }}
// //               >
// //                 <ImageOff size={26} />
// //                 <span style={{ fontSize: 12 }}>No images added</span>
// //               </div>
// //             )}

// //             {product.description && (
// //               <div style={{ marginTop: 18 }}>
// //                 <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 6 }}>
// //                   Description
// //                 </div>
// //                 <p
// //                   style={{
// //                     margin: 0,
// //                     fontSize: 13,
// //                     color: C.text,
// //                     lineHeight: 1.6,
// //                     whiteSpace: "pre-wrap",
// //                   }}
// //                 >
// //                   {product.description}
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           <div>
// //             <div style={{ marginBottom: 16 }}>
// //               <div
// //                 style={{
// //                   fontSize: isMobile ? 18 : 20,
// //                   fontWeight: 700,
// //                   color: C.heading,
// //                   fontFamily: C.fontHeading,
// //                 }}
// //               >
// //                 ₹{Number(product.price).toLocaleString("en-IN")}
// //                 <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}> / {product.unit}</span>
// //               </div>
// //               {product.discountPrice ? (
// //                 <div style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
// //                   Offer price: ₹{Number(product.discountPrice).toLocaleString("en-IN")}
// //                 </div>
// //               ) : null}
// //             </div>

// //             <DetailRow icon={Tag} label="Category" value={product.category} />
// //             <DetailRow icon={Tag} label="Sub category" value={product.subCategory} />
// //             <DetailRow icon={Tag} label="Brand" value={product.brand} />
// //             <DetailRow icon={Boxes} label="Stock" value={product.stock} />
// //             <DetailRow icon={Boxes} label="Min order qty" value={product.minimumOrderQuantity} />
// //             <DetailRow icon={Tag} label="Material" value={product.material} />
// //             <DetailRow icon={Tag} label="Color" value={product.color} />
// //             <DetailRow icon={Ruler} label="Dimensions (L×W×H)" value={dimensions || null} />
// //             <DetailRow icon={Weight} label="Weight" value={product.weight} />
// //             <DetailRow icon={ShieldCheck} label="Warranty" value={product.warranty} />
// //             <DetailRow icon={Truck} label="Delivery time" value={product.deliveryTime} />
// //           </div>
// //         </div>

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "flex-end",
// //             gap: 10,
// //             padding: isMobile ? "14px 16px" : "16px 24px",
// //             borderTop: `1px solid ${C.border}`,
// //             flexShrink: 0,
// //           }}
// //         >
// //           <button type="button" onClick={onClose} style={secondaryBtnStyle}>
// //             Close
// //           </button>
// //           <button
// //             type="button"
// //             onClick={() => onEdit(product)}
// //             style={{ ...primaryBtnStyle, flex: isMobile ? 1 : "unset", justifyContent: "center" }}
// //           >
// //             <Pencil size={14} strokeWidth={2.25} />
// //             Edit product
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // function navBtnStyle(side) {
// //   return {
// //     position: "absolute",
// //     top: "50%",
// //     [side]: 8,
// //     transform: "translateY(-50%)",
// //     width: 30,
// //     height: 30,
// //     borderRadius: "50%",
// //     border: "none",
// //     background: "rgba(0,0,0,0.55)",
// //     color: "#fff",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     cursor: "pointer",
// //   }
// // }

// // /* ---------- edit modal ---------- */
// // function EditProductModal({ product, onClose, onSaved }) {
// //   const isMobile = useIsMobile()
// //   const fileInputRef = useRef(null)
// //   const [form, setForm] = useState(() => ({
// //     productName: product.productName || "",
// //     category: product.category || "",
// //     subCategory: product.subCategory || "",
// //     brand: product.brand || "",
// //     unit: product.unit || "",
// //     price: product.price ?? "",
// //     discountPrice: product.discountPrice ?? "",
// //     stock: product.stock ?? "",
// //     minimumOrderQuantity: product.minimumOrderQuantity ?? "",
// //     material: product.material || "",
// //     color: product.color || "",
// //     availability: product.availability || "In Stock",
// //     status: product.status || "Active",
// //     description: product.description || "",
// //   }))
// //   const [images, setImages] = useState(() => product.images || [])
// //   const [thumbnail, setThumbnail] = useState(() => product.thumbnail || product.images?.[0] || "")
// //   const [isUploading, setIsUploading] = useState(false)
// //   const [error, setError] = useState("")
// //   const [updateProduct, { isLoading }] = useUpdateProductMutation()

// //   const handleChange = (key, value) => {
// //     setForm((f) => ({ ...f, [key]: value }))
// //   }

// //   const handleFileSelect = async (e) => {
// //     const files = Array.from(e.target.files || [])
// //     if (files.length === 0) return

// //     setIsUploading(true)
// //     setError("")

// //     try {
// //       const uploaded = await Promise.all(
// //         files.map((file) => uploadFile(file, "products", "product-images"))
// //       )
// //       const newUrls = uploaded.map((u) => u.publicUrl)

// //       setImages((prev) => [...prev, ...newUrls])
// //       setThumbnail((prev) => prev || newUrls[0])
// //     } catch (err) {
// //       setError(err?.message || "Failed to upload image(s). Please try again.")
// //     } finally {
// //       setIsUploading(false)
// //       if (fileInputRef.current) fileInputRef.current.value = ""
// //     }
// //   }

// //   const removeImage = (url) => {
// //     setImages((prev) => {
// //       const next = prev.filter((img) => img !== url)
// //       setThumbnail((t) => (t === url ? next[0] || "" : t))
// //       return next
// //     })
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setError("")

// //     if (!form.productName || !form.category || !form.unit || form.price === "") {
// //       setError("Product name, category, unit and price are required.")
// //       return
// //     }

// //     try {
// //       await updateProduct({
// //         id: product.id,
// //         ...form,
// //         price: Number(form.price),
// //         discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
// //         stock: form.stock === "" ? undefined : Number(form.stock),
// //         minimumOrderQuantity:
// //           form.minimumOrderQuantity === "" ? undefined : Number(form.minimumOrderQuantity),
// //         images,
// //         thumbnail: thumbnail || images[0] || "",
// //       }).unwrap()
// //       onSaved?.()
// //       onClose()
// //     } catch (err) {
// //       setError(err?.data?.message || "Failed to update product. Please try again.")
// //     }
// //   }

// //   return (
// //     <div
// //       onClick={onClose}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         background: "rgba(20, 16, 12, 0.55)",
// //         display: "flex",
// //         alignItems: isMobile ? "flex-end" : "center",
// //         justifyContent: "center",
// //         zIndex: 1000,
// //         padding: isMobile ? 0 : 16,
// //         boxSizing: "border-box",
// //       }}
// //     >
// //       <form
// //         onClick={(e) => e.stopPropagation()}
// //         onSubmit={handleSubmit}
// //         style={{
// //           background: C.surface,
// //           borderRadius: isMobile ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
// //           maxWidth: 720,
// //           width: "100%",
// //           maxHeight: isMobile ? "94vh" : "88vh",
// //           display: "flex",
// //           flexDirection: "column",
// //           overflow: "hidden",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             padding: isMobile ? "16px 16px 14px" : "20px 24px",
// //             borderBottom: `1px solid ${C.border}`,
// //             flexShrink: 0,
// //           }}
// //         >
// //           <h2
// //             style={{
// //               margin: 0,
// //               fontFamily: C.fontHeading,
// //               fontSize: isMobile ? 16 : 18,
// //               color: C.heading,
// //               display: "flex",
// //               alignItems: "center",
// //               gap: 8,
// //             }}
// //           >
// //             <Pencil size={17} strokeWidth={2} color={C.primary} />
// //             Edit product
// //           </h2>
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             aria-label="Close"
// //             style={{
// //               background: "transparent",
// //               border: "none",
// //               cursor: "pointer",
// //               color: C.muted,
// //               padding: 4,
// //             }}
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <div
// //           style={{
// //             padding: isMobile ? 16 : "20px 24px",
// //             overflowY: "auto",
// //           }}
// //         >
// //           {/* ---- image management ---- */}
// //           <div style={{ marginBottom: 20 }}>
// //             <label
// //               style={{
// //                 display: "block",
// //                 fontFamily: C.fontBody,
// //                 fontSize: 12,
// //                 fontWeight: 600,
// //                 color: C.primary,
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Product images
// //             </label>

// //             <input
// //               ref={fileInputRef}
// //               type="file"
// //               accept="image/*"
// //               multiple
// //               onChange={handleFileSelect}
// //               className="hidden"
// //               style={{ display: "none" }}
// //             />

// //             {images.length > 0 && (
// //               <div
// //                 style={{
// //                   display: "grid",
// //                   gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
// //                   gap: 10,
// //                   marginBottom: 12,
// //                 }}
// //               >
// //                 {images.map((url) => (
// //                   <div
// //                     key={url}
// //                     style={{
// //                       position: "relative",
// //                       borderRadius: C.radiusSm,
// //                       overflow: "hidden",
// //                       border: `1px solid ${C.border}`,
// //                       aspectRatio: "1 / 1",
// //                     }}
// //                   >
// //                     <img
// //                       src={url}
// //                       alt=""
// //                       style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => removeImage(url)}
// //                       aria-label="Remove image"
// //                       style={{
// //                         position: "absolute",
// //                         top: 4,
// //                         right: 4,
// //                         width: 20,
// //                         height: 20,
// //                         borderRadius: "50%",
// //                         border: "none",
// //                         background: "rgba(0,0,0,0.6)",
// //                         color: "#fff",
// //                         display: "flex",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                         cursor: "pointer",
// //                       }}
// //                     >
// //                       <X size={11} strokeWidth={2.5} />
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={() => setThumbnail(url)}
// //                       aria-label="Set as thumbnail"
// //                       title="Set as thumbnail"
// //                       style={{
// //                         position: "absolute",
// //                         bottom: 4,
// //                         left: 4,
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: 3,
// //                         padding: "2px 6px",
// //                         borderRadius: 999,
// //                         border: "none",
// //                         cursor: "pointer",
// //                         fontSize: 9,
// //                         fontWeight: 700,
// //                         textTransform: "uppercase",
// //                         background: thumbnail === url ? C.gold : "rgba(0,0,0,0.55)",
// //                         color: "#fff",
// //                       }}
// //                     >
// //                       <Star size={9} strokeWidth={2.5} fill={thumbnail === url ? "#fff" : "none"} />
// //                       {thumbnail === url ? "Thumbnail" : "Set"}
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             <button
// //               type="button"
// //               onClick={() => fileInputRef.current?.click()}
// //               disabled={isUploading}
// //               style={{
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: 6,
// //                 padding: "8px 14px",
// //                 borderRadius: C.radiusSm,
// //                 border: `1px solid ${C.border}`,
// //                 background: C.background,
// //                 color: C.heading,
// //                 fontFamily: C.fontBody,
// //                 fontWeight: 600,
// //                 fontSize: 12,
// //                 cursor: isUploading ? "default" : "pointer",
// //                 opacity: isUploading ? 0.7 : 1,
// //               }}
// //             >
// //               {isUploading ? (
// //                 <>
// //                   <Loader2 size={13} className="animate-spin" /> Uploading...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Upload size={13} /> Upload images
// //                 </>
// //               )}
// //             </button>

// //             {images.length === 0 && !isUploading && (
// //               <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
// //                 No images yet. Upload some to help buyers recognize this product.
// //               </p>
// //             )}
// //           </div>

// //           {/* ---- other fields ---- */}
// //           <div
// //             style={{
// //               display: "grid",
// //               gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
// //               columnGap: 20,
// //               rowGap: 16,
// //             }}
// //           >
// //             {EDITABLE_FIELDS.map((field) => (
// //               <div key={field.key} style={{ gridColumn: field.full && !isMobile ? "1 / -1" : "auto" }}>
// //                 <label
// //                   style={{
// //                     display: "block",
// //                     fontFamily: C.fontBody,
// //                     fontSize: 12,
// //                     fontWeight: 600,
// //                     color: C.primary,
// //                     marginBottom: 5,
// //                   }}
// //                 >
// //                   {field.label}
// //                   {field.required && <span style={{ color: C.danger }}> *</span>}
// //                 </label>

// //                 {field.type === "select" ? (
// //                   <select
// //                     value={form[field.key]}
// //                     onChange={(e) => handleChange(field.key, e.target.value)}
// //                     style={inputStyle}
// //                   >
// //                     {field.options.map((opt) => (
// //                       <option key={opt} value={opt}>
// //                         {opt}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 ) : field.type === "textarea" ? (
// //                   <textarea
// //                     value={form[field.key]}
// //                     onChange={(e) => handleChange(field.key, e.target.value)}
// //                     rows={3}
// //                     style={{ ...inputStyle, resize: "vertical" }}
// //                   />
// //                 ) : (
// //                   <input
// //                     type={field.type}
// //                     value={form[field.key]}
// //                     onChange={(e) => handleChange(field.key, e.target.value)}
// //                     style={inputStyle}
// //                     step={field.type === "number" ? "any" : undefined}
// //                   />
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {error && (
// //           <div
// //             style={{
// //               margin: isMobile ? "0 16px 12px" : "0 24px 12px",
// //               padding: "10px 12px",
// //               borderRadius: C.radiusSm,
// //               background: "rgba(179,64,47,0.08)",
// //               border: `1px solid ${C.danger}`,
// //               color: C.danger,
// //               fontFamily: C.fontBody,
// //               fontSize: 13,
// //             }}
// //           >
// //             {error}
// //           </div>
// //         )}

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "flex-end",
// //             gap: 10,
// //             padding: isMobile ? "14px 16px" : "16px 24px",
// //             borderTop: `1px solid ${C.border}`,
// //             flexShrink: 0,
// //           }}
// //         >
// //           <button type="button" onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset" }}>
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={isLoading || isUploading}
// //             style={{
// //               ...primaryBtnStyle,
// //               flex: isMobile ? 1 : "unset",
// //               justifyContent: "center",
// //               cursor: isLoading || isUploading ? "default" : "pointer",
// //               opacity: isLoading || isUploading ? 0.7 : 1,
// //             }}
// //           >
// //             <Save size={14} strokeWidth={2.25} />
// //             {isLoading ? "Saving..." : "Save changes"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   )
// // }

// // /* ---------- delete modal ---------- */
// // function DeleteConfirmModal({ product, onClose, onDeleted }) {
// //   const isMobile = useIsMobile()
// //   const [deleteProduct, { isLoading }] = useDeleteProductMutation()
// //   const [error, setError] = useState("")

// //   const handleDelete = async () => {
// //     setError("")
// //     try {
// //       await deleteProduct(product.id).unwrap()
// //       onDeleted?.()
// //       onClose()
// //     } catch (err) {
// //       setError(err?.data?.message || "Failed to delete product. Please try again.")
// //     }
// //   }

// //   return (
// //     <div
// //       onClick={onClose}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         background: "rgba(20, 16, 12, 0.55)",
// //         display: "flex",
// //         alignItems: isMobile ? "flex-end" : "center",
// //         justifyContent: "center",
// //         zIndex: 1000,
// //         padding: isMobile ? 0 : 16,
// //       }}
// //     >
// //       <div
// //         onClick={(e) => e.stopPropagation()}
// //         style={{
// //           background: C.surface,
// //           borderRadius: isMobile ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
// //           maxWidth: 400,
// //           width: "100%",
// //           padding: 24,
// //           boxSizing: "border-box",
// //         }}
// //       >
// //         <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
// //           <div
// //             style={{
// //               flexShrink: 0,
// //               width: 36,
// //               height: 36,
// //               borderRadius: "50%",
// //               background: "rgba(179,64,47,0.1)",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //             }}
// //           >
// //             <AlertTriangle size={18} color={C.danger} strokeWidth={2.25} />
// //           </div>
// //           <div>
// //             <h3 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: 16, color: C.heading }}>
// //               Delete product?
// //             </h3>
// //             <p
// //               style={{
// //                 margin: "6px 0 0",
// //                 fontFamily: C.fontBody,
// //                 fontSize: 13,
// //                 color: C.text,
// //                 lineHeight: 1.5,
// //               }}
// //             >
// //               This will permanently remove <strong>{product.productName}</strong> from your
// //               catalog. This action can't be undone.
// //             </p>
// //           </div>
// //         </div>

// //         {error && (
// //           <div
// //             style={{
// //               marginTop: 14,
// //               padding: "10px 12px",
// //               borderRadius: C.radiusSm,
// //               background: "rgba(179,64,47,0.08)",
// //               border: `1px solid ${C.danger}`,
// //               color: C.danger,
// //               fontFamily: C.fontBody,
// //               fontSize: 13,
// //             }}
// //           >
// //             {error}
// //           </div>
// //         )}

// //         <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
// //           <button onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset" }}>
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleDelete}
// //             disabled={isLoading}
// //             style={{
// //               display: "inline-flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: 6,
// //               padding: "9px 18px",
// //               borderRadius: C.radiusSm,
// //               border: "none",
// //               background: C.danger,
// //               color: "#fff",
// //               fontFamily: C.fontBody,
// //               fontWeight: 600,
// //               fontSize: 13,
// //               cursor: isLoading ? "default" : "pointer",
// //               opacity: isLoading ? 0.7 : 1,
// //               flex: isMobile ? 1 : "unset",
// //             }}
// //           >
// //             <Trash2 size={14} strokeWidth={2.25} />
// //             {isLoading ? "Deleting..." : "Delete"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // const inputStyle = {
// //   width: "100%",
// //   boxSizing: "border-box",
// //   padding: "9px 11px",
// //   borderRadius: C.radiusSm,
// //   border: `1px solid ${C.border}`,
// //   fontFamily: C.fontBody,
// //   fontSize: 13,
// //   color: C.heading,
// //   background: C.background,
// //   outline: "none",
// // }

// // const primaryBtnStyle = {
// //   display: "inline-flex",
// //   alignItems: "center",
// //   gap: 7,
// //   padding: "10px 22px",
// //   borderRadius: C.radiusSm,
// //   border: "none",
// //   background: C.primary,
// //   color: "#fff",
// //   fontFamily: C.fontBody,
// //   fontWeight: 600,
// //   fontSize: 13,
// //   cursor: "pointer",
// // }

// // const secondaryBtnStyle = {
// //   padding: "10px 20px",
// //   borderRadius: C.radiusSm,
// //   border: `1px solid ${C.border}`,
// //   background: "transparent",
// //   color: C.text,
// //   fontFamily: C.fontBody,
// //   fontWeight: 600,
// //   fontSize: 13,
// //   cursor: "pointer",
// // }

// // /* ---------- product table (desktop) ---------- */
// // function ProductsTable({ products, onView, onEdit, onDelete }) {
// //   return (
// //     <div
// //       style={{
// //         border: `1px solid ${C.border}`,
// //         borderRadius: C.radiusMd,
// //         overflow: "hidden",
// //         background: C.surface,
// //       }}
// //     >
// //       <div style={{ overflowX: "auto" }}>
// //         <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
// //           <thead>
// //             <tr style={{ background: C.background }}>
// //               {["Image", "Product", "Category", "Price", "Stock", "Availability", "Status", "Actions"].map(
// //                 (h, i) => (
// //                   <th
// //                     key={h}
// //                     style={{
// //                       textAlign: i === 7 ? "right" : "left",
// //                       padding: "12px 16px",
// //                       fontSize: 11,
// //                       fontWeight: 700,
// //                       letterSpacing: "0.04em",
// //                       textTransform: "uppercase",
// //                       color: C.muted,
// //                       borderBottom: `1px solid ${C.border}`,
// //                       whiteSpace: "nowrap",
// //                     }}
// //                   >
// //                     {h}
// //                   </th>
// //                 )
// //               )}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {products.map((row, idx) => (
// //               <tr
// //                 key={row.id}
// //                 style={{
// //                   borderBottom: idx === products.length - 1 ? "none" : `1px solid ${C.border}`,
// //                   transition: C.transition,
// //                 }}
// //                 onMouseEnter={(e) => (e.currentTarget.style.background = C.background)}
// //                 onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
// //               >
// //                 <td style={{ padding: "12px 16px" }}>
// //                   <ProductThumb src={row.thumbnail || row.images?.[0]} alt={row.productName} />
// //                 </td>
// //                 <td style={{ padding: "12px 16px", maxWidth: 260 }}>
// //                   <div style={{ fontWeight: 600, color: C.heading, overflowWrap: "anywhere" }}>
// //                     {row.productName}
// //                   </div>
// //                   <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
// //                     {[row.brand, row.sku].filter(Boolean).join(" · ")}
// //                   </div>
// //                 </td>
// //                 <td style={{ padding: "12px 16px", fontSize: 13, color: C.text, whiteSpace: "nowrap" }}>
// //                   {row.category}
// //                 </td>
// //                 <td style={{ padding: "12px 16px", fontSize: 13, color: C.heading, whiteSpace: "nowrap" }}>
// //                   <div style={{ fontWeight: 600 }}>₹{Number(row.price).toLocaleString("en-IN")}</div>
// //                   {row.discountPrice ? (
// //                     <div style={{ fontSize: 11, color: C.success }}>
// //                       ₹{Number(row.discountPrice).toLocaleString("en-IN")} offer
// //                     </div>
// //                   ) : null}
// //                 </td>
// //                 <td style={{ padding: "12px 16px", fontSize: 13, color: C.text }}>{row.stock ?? "—"}</td>
// //                 <td style={{ padding: "12px 16px" }}>
// //                   <StatusPill value={row.availability} />
// //                 </td>
// //                 <td style={{ padding: "12px 16px" }}>
// //                   <StatusPill value={row.status} />
// //                 </td>
// //                 <td style={{ padding: "12px 16px" }}>
// //                   <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
// //                     <button type="button" onClick={() => onView(row)} style={actionBtnStyle(C.muted)}>
// //                       <Eye size={13} strokeWidth={2.25} />
// //                       View
// //                     </button>
// //                     <button type="button" onClick={() => onEdit(row)} style={actionBtnStyle(C.primary)}>
// //                       <Pencil size={13} strokeWidth={2.25} />
// //                       Edit
// //                     </button>
// //                     <button type="button" onClick={() => onDelete(row)} style={actionBtnStyle(C.danger)}>
// //                       <Trash2 size={13} strokeWidth={2.25} />
// //                       Delete
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   )
// // }

// // /* ---------- product cards (mobile) ---------- */
// // function ProductsCards({ products, onView, onEdit, onDelete }) {
// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
// //       {products.map((row) => (
// //         <div
// //           key={row.id}
// //           style={{
// //             border: `1px solid ${C.border}`,
// //             borderRadius: C.radiusMd,
// //             background: C.surface,
// //             padding: 14,
// //           }}
// //         >
// //           <div style={{ display: "flex", gap: 12 }}>
// //             <ProductThumb src={row.thumbnail || row.images?.[0]} alt={row.productName} size={56} />
// //             <div style={{ flex: 1, minWidth: 0 }}>
// //               <div style={{ fontWeight: 600, color: C.heading, fontSize: 14, overflowWrap: "anywhere" }}>
// //                 {row.productName}
// //               </div>
// //               <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
// //                 {[row.brand, row.sku].filter(Boolean).join(" · ")}
// //               </div>
// //               <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
// //                 <StatusPill value={row.status} />
// //                 <StatusPill value={row.availability} />
// //               </div>
// //             </div>
// //           </div>

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginTop: 12,
// //               paddingTop: 12,
// //               borderTop: `1px solid ${C.border}`,
// //               fontSize: 13,
// //             }}
// //           >
// //             <span style={{ color: C.muted }}>
// //               Category: <span style={{ color: C.text, fontWeight: 500 }}>{row.category}</span>
// //             </span>
// //             <span style={{ fontWeight: 700, color: C.heading }}>
// //               ₹{Number(row.price).toLocaleString("en-IN")}
// //             </span>
// //           </div>

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginTop: 6,
// //               fontSize: 13,
// //             }}
// //           >
// //             <span style={{ color: C.muted }}>
// //               Stock: <span style={{ color: C.text, fontWeight: 500 }}>{row.stock ?? "—"}</span>
// //             </span>
// //             {row.discountPrice ? (
// //               <span style={{ fontSize: 12, color: C.success, fontWeight: 600 }}>
// //                 Offer ₹{Number(row.discountPrice).toLocaleString("en-IN")}
// //               </span>
// //             ) : null}
// //           </div>

// //           <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
// //             <button
// //               type="button"
// //               onClick={() => onView(row)}
// //               style={{ ...actionBtnStyle(C.muted), flex: 1, justifyContent: "center" }}
// //             >
// //               <Eye size={13} strokeWidth={2.25} />
// //               View
// //             </button>
// //             <button
// //               type="button"
// //               onClick={() => onEdit(row)}
// //               style={{ ...actionBtnStyle(C.primary), flex: 1, justifyContent: "center" }}
// //             >
// //               <Pencil size={13} strokeWidth={2.25} />
// //               Edit
// //             </button>
// //             <button
// //               type="button"
// //               onClick={() => onDelete(row)}
// //               style={{ ...actionBtnStyle(C.danger), flex: 1, justifyContent: "center" }}
// //             >
// //               <Trash2 size={13} strokeWidth={2.25} />
// //               Delete
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   )
// // }

// // /* ---------- page ---------- */
// // export default function SupplierProductsPage() {
// //   const [search, setSearch] = useState("")
// //   const [page, setPage] = useState(1)
// //   const [viewingProduct, setViewingProduct] = useState(null)
// //   const [editingProduct, setEditingProduct] = useState(null)
// //   const [deletingProduct, setDeletingProduct] = useState(null)
// //   const isMobile = useIsMobile()
// //   const limit = 10

// //   const { data, isLoading, isFetching, isError, refetch } = useGetSupplierProductsQuery({
// //     page,
// //     limit,
// //     search,
// //   })

// //   const products = data?.data?.products || []
// //   const totalPages = data?.data?.totalPages || 1
// //   const total = data?.data?.total ?? products.length

// //   return (
// //     <div style={{ padding: isMobile ? 16 : 24, fontFamily: C.fontBody }}>
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: isMobile ? "flex-start" : "center",
// //           flexDirection: isMobile ? "column" : "row",
// //           flexWrap: "wrap",
// //           gap: 12,
// //           marginBottom: 18,
// //         }}
// //       >
// //         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //           <Package size={20} color={C.primary} strokeWidth={2} />
// //           <div>
// //             <h1 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isMobile ? 18 : 20, color: C.heading }}>
// //               My products
// //             </h1>
// //             <span style={{ fontSize: 12, color: C.muted }}>{total} total</span>
// //           </div>
// //         </div>

// //         <div style={{ position: "relative", width: isMobile ? "100%" : "auto" }}>
// //           <Search
// //             size={15}
// //             style={{
// //               position: "absolute",
// //               left: 10,
// //               top: "50%",
// //               transform: "translateY(-50%)",
// //               color: C.muted,
// //             }}
// //           />
// //           <input
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value)
// //               setPage(1)
// //             }}
// //             placeholder="Search products..."
// //             style={{
// //               width: isMobile ? "100%" : 220,
// //               boxSizing: "border-box",
// //               padding: "9px 12px 9px 32px",
// //               borderRadius: C.radiusSm,
// //               border: `1px solid ${C.border}`,
// //               fontSize: 13,
// //               outline: "none",
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {isError ? (
// //         <div
// //           style={{
// //             padding: 32,
// //             textAlign: "center",
// //             color: C.danger,
// //             border: `1px solid ${C.border}`,
// //             borderRadius: C.radiusMd,
// //           }}
// //         >
// //           Couldn't load your products.{" "}
// //           <button
// //             onClick={refetch}
// //             style={{
// //               color: C.primary,
// //               textDecoration: "underline",
// //               background: "none",
// //               border: "none",
// //               cursor: "pointer",
// //             }}
// //           >
// //             Try again
// //           </button>
// //         </div>
// //       ) : isLoading ? (
// //         <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Loading products...</div>
// //       ) : products.length === 0 ? (
// //         <div
// //           style={{
// //             padding: 40,
// //             textAlign: "center",
// //             color: C.muted,
// //             border: `1px dashed ${C.border}`,
// //             borderRadius: C.radiusMd,
// //           }}
// //         >
// //           You haven't added any products yet.
// //         </div>
// //       ) : (
// //         <>
// //           <div style={{ opacity: isFetching ? 0.6 : 1, transition: C.transition }}>
// //             {isMobile ? (
// //               <ProductsCards
// //                 products={products}
// //                 onView={setViewingProduct}
// //                 onEdit={setEditingProduct}
// //                 onDelete={setDeletingProduct}
// //               />
// //             ) : (
// //               <ProductsTable
// //                 products={products}
// //                 onView={setViewingProduct}
// //                 onEdit={setEditingProduct}
// //                 onDelete={setDeletingProduct}
// //               />
// //             )}
// //           </div>

// //           {totalPages > 1 && (
// //             <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
// //               <button
// //                 disabled={page <= 1}
// //                 onClick={() => setPage((p) => p - 1)}
// //                 style={pagerBtnStyle(page <= 1)}
// //               >
// //                 Prev
// //               </button>
// //               <span style={{ fontSize: 13, color: C.muted, alignSelf: "center" }}>
// //                 Page {page} of {totalPages}
// //               </span>
// //               <button
// //                 disabled={page >= totalPages}
// //                 onClick={() => setPage((p) => p + 1)}
// //                 style={pagerBtnStyle(page >= totalPages)}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {viewingProduct && (
// //         <ViewProductModal
// //           product={viewingProduct}
// //           onClose={() => setViewingProduct(null)}
// //           onEdit={(p) => {
// //             setViewingProduct(null)
// //             setEditingProduct(p)
// //           }}
// //         />
// //       )}

// //       {editingProduct && (
// //         <EditProductModal
// //           product={editingProduct}
// //           onClose={() => setEditingProduct(null)}
// //           onSaved={refetch}
// //         />
// //       )}

// //       {deletingProduct && (
// //         <DeleteConfirmModal
// //           product={deletingProduct}
// //           onClose={() => setDeletingProduct(null)}
// //           onDeleted={refetch}
// //         />
// //       )}
// //     </div>
// //   )
// // }

// // function actionBtnStyle(color) {
// //   return {
// //     display: "inline-flex",
// //     alignItems: "center",
// //     gap: 5,
// //     padding: "6px 10px",
// //     borderRadius: C.radiusSm,
// //     border: `1px solid ${color}`,
// //     background: "transparent",
// //     color,
// //     fontSize: 12,
// //     fontWeight: 600,
// //     cursor: "pointer",
// //     whiteSpace: "nowrap",
// //   }
// // }

// // function pagerBtnStyle(disabled) {
// //   return {
// //     padding: "7px 14px",
// //     borderRadius: C.radiusSm,
// //     border: `1px solid ${C.border}`,
// //     background: disabled ? C.background : C.surface,
// //     color: disabled ? C.muted : C.text,
// //     fontSize: 13,
// //     cursor: disabled ? "default" : "pointer",
// //   }
// // }



// import React, { useEffect, useRef, useState } from "react"
// import {
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   AlertTriangle,
//   Package,
//   Search,
//   Eye,
//   ImageOff,
//   ChevronLeft,
//   ChevronRight,
//   Tag,
//   Ruler,
//   Weight,
//   ShieldCheck,
//   Truck,
//   Boxes,
//   Upload,
//   Loader2,
//   Star,
// } from "lucide-react"
// import {
//   useGetSupplierProductsQuery,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } from "./dashboard/materialapislice"
// import { uploadFile } from "../../../../superBase"
// import Table from "../../../global/Table"
// import Pagination from "../../../global/pagination"

// const C = {
//   primary: "var(--primary, #3a2418)",
//   primaryHover: "var(--primary-hover, #2a1a10)",
//   gold: "var(--gold, #c9973a)",
//   goldHover: "var(--gold-hover, #b3852f)",
//   background: "var(--background, #f7f5f2)",
//   surface: "var(--surface, #ffffff)",
//   heading: "var(--heading, #2a2018)",
//   text: "var(--text, #4a4038)",
//   muted: "var(--muted, #8a8078)",
//   border: "var(--border, #e5e0d8)",
//   danger: "var(--danger, #b3402f)",
//   dangerHover: "var(--danger-hover, #942f20)",
//   success: "var(--success, #3f7d4f)",
//   radiusSm: "var(--radius-sm, 6px)",
//   radiusMd: "var(--radius-md, 10px)",
//   radiusLg: "var(--radius-lg, 14px)",
//   fontHeading: "var(--font-heading, inherit)",
//   fontBody: "var(--font-body, inherit)",
//   transition: "var(--transition, 0.15s ease)",
// }

// const EDITABLE_FIELDS = [
//   { key: "productName", label: "Product name", type: "text", required: true },
//   { key: "category", label: "Category", type: "text", required: true },
//   { key: "subCategory", label: "Sub category", type: "text" },
//   { key: "brand", label: "Brand", type: "text" },
//   { key: "unit", label: "Unit", type: "text", required: true },
//   { key: "price", label: "Price", type: "number", required: true },
//   { key: "discountPrice", label: "Discount price", type: "number" },
//   { key: "stock", label: "Stock", type: "number" },
//   { key: "minimumOrderQuantity", label: "Min order qty", type: "number" },
//   { key: "material", label: "Material", type: "text" },
//   { key: "color", label: "Color", type: "text" },
//   { key: "availability", label: "Availability", type: "select", options: ["In Stock", "Out of Stock"] },
//   { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
//   { key: "description", label: "Description", type: "textarea", full: true },
// ]

// /* ---------- responsive hook ---------- */
// function useIsMobile(breakpoint = 720) {
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
//   )
//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth <= breakpoint)
//     window.addEventListener("resize", onResize)
//     return () => window.removeEventListener("resize", onResize)
//   }, [breakpoint])
//   return isMobile
// }
// function useIsTablet(breakpoint = 1024) {
//   const [isTablet, setIsTablet] = useState(
//     typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
//   )
//   useEffect(() => {
//     const onResize = () => setIsTablet(window.innerWidth <= breakpoint)
//     window.addEventListener("resize", onResize)
//     return () => window.removeEventListener("resize", onResize)
//   }, [breakpoint])
//   return isTablet
// }

// /* ---------- shared bits ---------- */
// function StatusPill({ value }) {
//   const active = value === "Active" || value === "In Stock"
//   return (
//     <span
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 5,
//         padding: "3px 9px",
//         borderRadius: 999,
//         fontSize: 11,
//         fontWeight: 600,
//         fontFamily: C.fontBody,
//         whiteSpace: "nowrap",
//         color: active ? C.success : C.muted,
//         background: active ? "rgba(63,125,79,0.1)" : "rgba(138,128,120,0.12)",
//         border: `1px solid ${active ? C.success : C.border}`,
//       }}
//     >
//       <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.success : C.muted, flexShrink: 0 }} />
//       {value}
//     </span>
//   )
// }

// function ProductThumb({ src, alt, size = 44 }) {
//   const [broken, setBroken] = useState(false)
//   if (!src || broken) {
//     return (
//       <div
//         style={{
//           width: size, height: size, borderRadius: C.radiusSm, background: C.background,
//           border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//         }}
//       >
//         <ImageOff size={Math.max(14, size * 0.36)} color={C.muted} strokeWidth={1.75} />
//       </div>
//     )
//   }
//   return (
//     <img
//       src={src}
//       alt={alt}
//       onError={() => setBroken(true)}
//       style={{ width: size, height: size, borderRadius: C.radiusSm, objectFit: "cover", border: `1px solid ${C.border}`, flexShrink: 0 }}
//     />
//   )
// }

// function DetailRow({ icon: Icon, label, value }) {
//   if (value === null || value === undefined || value === "") return null
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
//       <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, fontWeight: 600, flexShrink: 0 }}>
//         {Icon && <Icon size={13} strokeWidth={2.25} />}
//         {label}
//       </span>
//       <span style={{ fontSize: 13, color: C.heading, fontWeight: 500, textAlign: "right" }}>{value}</span>
//     </div>
//   )
// }

// /* ---------- view modal (also used as "Read more" detail modal) ---------- */
// function ViewProductModal({ product, onClose, onEdit }) {
//   const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []
//   const [activeImg, setActiveImg] = useState(0)
//   const [broken, setBroken] = useState(false)
//   const isMobile = useIsMobile()
//   const isTablet = useIsTablet()
//   const sheetMode = isMobile || isTablet

//   const dimensions = [product.length, product.width, product.height]
//     .filter((v) => v !== null && v !== undefined)
//     .join(" × ")

//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && onClose()
//     document.addEventListener("keydown", onKey)
//     const originalOverflow = document.body.style.overflow
//     document.body.style.overflow = "hidden"
//     return () => {
//       document.removeEventListener("keydown", onKey)
//       document.body.style.overflow = originalOverflow
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <div
//       onClick={onClose}
//       className="spp-overlay"
//       style={{
//         position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)",
//         display: "flex", alignItems: sheetMode ? "flex-end" : "center", justifyContent: "center",
//         zIndex: 1000, padding: sheetMode ? 0 : 16, boxSizing: "border-box",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="spp-view-panel"
//         style={{
//           background: C.surface,
//           borderRadius: sheetMode ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
//           maxWidth: 860, width: "100%", maxHeight: sheetMode ? "92vh" : "88vh",
//           display: "flex", flexDirection: "column", overflow: "hidden",
//         }}
//       >
//         <div className="spp-grabber" aria-hidden="true" />
//         <div
//           style={{
//             display: "flex", justifyContent: "space-between", alignItems: "flex-start",
//             padding: isMobile ? "14px 16px 12px" : "20px 24px",
//             borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 12,
//           }}
//         >
//           <div style={{ minWidth: 0 }}>
//             <h2 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isMobile ? 17 : 19, color: C.heading, overflowWrap: "anywhere" }}>
//               {product.productName}
//             </h2>
//             <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
//               <StatusPill value={product.status} />
//               <StatusPill value={product.availability} />
//               {product.sku && <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>SKU: {product.sku}</span>}
//             </div>
//           </div>
//           <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, padding: 4, flexShrink: 0 }}>
//             <X size={20} />
//           </button>
//         </div>

//         <div
//           className="spp-view-grid"
//           style={{
//             padding: isMobile ? 16 : "20px 24px", overflowY: "auto",
//             display: "grid", gridTemplateColumns: sheetMode ? "1fr" : "1fr 1fr", gap: isMobile ? 18 : 24,
//           }}
//         >
//           <div>
//             {images.length > 0 ? (
//               <>
//                 <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: C.radiusMd, overflow: "hidden", border: `1px solid ${C.border}`, background: C.background }}>
//                   {broken ? (
//                     <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <ImageOff size={28} color={C.muted} />
//                     </div>
//                   ) : (
//                     <img
//                       src={images[activeImg]}
//                       alt={`${product.productName} ${activeImg + 1}`}
//                       onError={() => setBroken(true)}
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   )}
//                   {images.length > 1 && (
//                     <>
//                       <button
//                         type="button"
//                         onClick={() => { setBroken(false); setActiveImg((i) => (i - 1 + images.length) % images.length) }}
//                         aria-label="Previous image"
//                         style={navBtnStyle("left")}
//                       >
//                         <ChevronLeft size={16} />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => { setBroken(false); setActiveImg((i) => (i + 1) % images.length) }}
//                         aria-label="Next image"
//                         style={navBtnStyle("right")}
//                       >
//                         <ChevronRight size={16} />
//                       </button>
//                       <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>
//                         {activeImg + 1} / {images.length}
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 {images.length > 1 && (
//                   <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", overflowX: isMobile ? "auto" : "visible" }}>
//                     {images.map((img, i) => (
//                       <button
//                         key={i}
//                         type="button"
//                         onClick={() => { setBroken(false); setActiveImg(i) }}
//                         style={{ padding: 0, border: `2px solid ${i === activeImg ? C.primary : "transparent"}`, borderRadius: C.radiusSm, cursor: "pointer", background: "none", flexShrink: 0 }}
//                       >
//                         <ProductThumb src={img} alt={`thumb ${i + 1}`} size={48} />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: C.radiusMd, border: `1px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted }}>
//                 <ImageOff size={26} />
//                 <span style={{ fontSize: 12 }}>No images added</span>
//               </div>
//             )}

//             {product.description && (
//               <div style={{ marginTop: 18 }}>
//                 <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 6 }}>Description</div>
//                 <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{product.description}</p>
//               </div>
//             )}
//           </div>

//           <div>
//             <div style={{ marginBottom: 16 }}>
//               <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: C.heading, fontFamily: C.fontHeading }}>
//                 ₹{Number(product.price).toLocaleString("en-IN")}
//                 <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}> / {product.unit}</span>
//               </div>
//               {product.discountPrice ? (
//                 <div style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
//                   Offer price: ₹{Number(product.discountPrice).toLocaleString("en-IN")}
//                 </div>
//               ) : null}
//             </div>

//             <DetailRow icon={Tag} label="Category" value={product.category} />
//             <DetailRow icon={Tag} label="Sub category" value={product.subCategory} />
//             <DetailRow icon={Tag} label="Brand" value={product.brand} />
//             <DetailRow icon={Boxes} label="Stock" value={product.stock} />
//             <DetailRow icon={Boxes} label="Min order qty" value={product.minimumOrderQuantity} />
//             <DetailRow icon={Tag} label="Material" value={product.material} />
//             <DetailRow icon={Tag} label="Color" value={product.color} />
//             <DetailRow icon={Ruler} label="Dimensions (L×W×H)" value={dimensions || null} />
//             <DetailRow icon={Weight} label="Weight" value={product.weight} />
//             <DetailRow icon={ShieldCheck} label="Warranty" value={product.warranty} />
//             <DetailRow icon={Truck} label="Delivery time" value={product.deliveryTime} />
//           </div>
//         </div>

//         <div className="spp-view-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: isMobile ? "14px 16px" : "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
//           <button type="button" onClick={onClose} style={secondaryBtnStyle}>Close</button>
//           <button type="button" onClick={() => onEdit(product)} style={{ ...primaryBtnStyle, flex: isMobile ? 1 : "unset", justifyContent: "center" }}>
//             <Pencil size={14} strokeWidth={2.25} />
//             Edit product
//           </button>
//         </div>
//       </div>

//       <style>{`
//         .spp-grabber { display: none; }
//         @media (max-width: 1024px) {
//           .spp-grabber { display: block; width: 38px; height: 4px; border-radius: 4px; background: ${C.border}; margin: 10px auto 0; }
//           .spp-view-footer { flex-direction: column-reverse; }
//           .spp-view-footer button { width: 100%; justify-content: center; }
//         }
//       `}</style>
//     </div>
//   )
// }

// function navBtnStyle(side) {
//   return {
//     position: "absolute", top: "50%", [side]: 8, transform: "translateY(-50%)",
//     width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)",
//     color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
//   }
// }

// /* ---------- edit modal ---------- */
// function EditProductModal({ product, onClose, onSaved }) {
//   const isMobile = useIsMobile()
//   const isTablet = useIsTablet()
//   const sheetMode = isMobile || isTablet
//   const fileInputRef = useRef(null)
//   const [form, setForm] = useState(() => ({
//     productName: product.productName || "",
//     category: product.category || "",
//     subCategory: product.subCategory || "",
//     brand: product.brand || "",
//     unit: product.unit || "",
//     price: product.price ?? "",
//     discountPrice: product.discountPrice ?? "",
//     stock: product.stock ?? "",
//     minimumOrderQuantity: product.minimumOrderQuantity ?? "",
//     material: product.material || "",
//     color: product.color || "",
//     availability: product.availability || "In Stock",
//     status: product.status || "Active",
//     description: product.description || "",
//   }))
//   const [images, setImages] = useState(() => product.images || [])
//   const [thumbnail, setThumbnail] = useState(() => product.thumbnail || product.images?.[0] || "")
//   const [isUploading, setIsUploading] = useState(false)
//   const [error, setError] = useState("")
//   const [updateProduct, { isLoading }] = useUpdateProductMutation()

//   const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }))

//   const handleFileSelect = async (e) => {
//     const files = Array.from(e.target.files || [])
//     if (files.length === 0) return
//     setIsUploading(true)
//     setError("")
//     try {
//       const uploaded = await Promise.all(files.map((file) => uploadFile(file, "products", "product-images")))
//       const newUrls = uploaded.map((u) => u.publicUrl)
//       setImages((prev) => [...prev, ...newUrls])
//       setThumbnail((prev) => prev || newUrls[0])
//     } catch (err) {
//       setError(err?.message || "Failed to upload image(s). Please try again.")
//     } finally {
//       setIsUploading(false)
//       if (fileInputRef.current) fileInputRef.current.value = ""
//     }
//   }

//   const removeImage = (url) => {
//     setImages((prev) => {
//       const next = prev.filter((img) => img !== url)
//       setThumbnail((t) => (t === url ? next[0] || "" : t))
//       return next
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")
//     if (!form.productName || !form.category || !form.unit || form.price === "") {
//       setError("Product name, category, unit and price are required.")
//       return
//     }
//     try {
//       await updateProduct({
//         id: product.id,
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
//         stock: form.stock === "" ? undefined : Number(form.stock),
//         minimumOrderQuantity: form.minimumOrderQuantity === "" ? undefined : Number(form.minimumOrderQuantity),
//         images,
//         thumbnail: thumbnail || images[0] || "",
//       }).unwrap()
//       onSaved?.()
//       onClose()
//     } catch (err) {
//       setError(err?.data?.message || "Failed to update product. Please try again.")
//     }
//   }

//   useEffect(() => {
//     const originalOverflow = document.body.style.overflow
//     document.body.style.overflow = "hidden"
//     return () => { document.body.style.overflow = originalOverflow }
//   }, [])

//   return (
//     <div
//       onClick={onClose}
//       className="spp-overlay"
//       style={{
//         position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)",
//         display: "flex", alignItems: sheetMode ? "flex-end" : "center", justifyContent: "center",
//         zIndex: 1000, padding: sheetMode ? 0 : 16, boxSizing: "border-box",
//       }}
//     >
//       <form
//         onClick={(e) => e.stopPropagation()}
//         onSubmit={handleSubmit}
//         className="spp-edit-panel"
//         style={{
//           background: C.surface,
//           borderRadius: sheetMode ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
//           maxWidth: 720, width: "100%", maxHeight: sheetMode ? "94vh" : "88vh",
//           display: "flex", flexDirection: "column", overflow: "hidden",
//         }}
//       >
//         <div className="spp-grabber" aria-hidden="true" />
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "14px 16px 12px" : "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
//           <h2 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isMobile ? 16 : 18, color: C.heading, display: "flex", alignItems: "center", gap: 8 }}>
//             <Pencil size={17} strokeWidth={2} color={C.primary} />
//             Edit product
//           </h2>
//           <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
//             <X size={20} />
//           </button>
//         </div>

//         <div style={{ padding: isMobile ? 16 : "20px 24px", overflowY: "auto" }}>
//           <div style={{ marginBottom: 20 }}>
//             <label style={{ display: "block", fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 8 }}>
//               Product images
//             </label>
//             <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
//             {images.length > 0 && (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 10, marginBottom: 12 }}>
//                 {images.map((url) => (
//                   <div key={url} style={{ position: "relative", borderRadius: C.radiusSm, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1 / 1" }}>
//                     <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//                     <button type="button" onClick={() => removeImage(url)} aria-label="Remove image" style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                       <X size={11} strokeWidth={2.5} />
//                     </button>
//                     <button type="button" onClick={() => setThumbnail(url)} aria-label="Set as thumbnail" title="Set as thumbnail" style={{ position: "absolute", bottom: 4, left: 4, display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: thumbnail === url ? C.gold : "rgba(0,0,0,0.55)", color: "#fff" }}>
//                       <Star size={9} strokeWidth={2.5} fill={thumbnail === url ? "#fff" : "none"} />
//                       {thumbnail === url ? "Thumbnail" : "Set"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, background: C.background, color: C.heading, fontFamily: C.fontBody, fontWeight: 600, fontSize: 12, cursor: isUploading ? "default" : "pointer", opacity: isUploading ? 0.7 : 1 }}>
//               {isUploading ? (<><Loader2 size={13} className="animate-spin" /> Uploading...</>) : (<><Upload size={13} /> Upload images</>)}
//             </button>
//             {images.length === 0 && !isUploading && (
//               <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>No images yet. Upload some to help buyers recognize this product.</p>
//             )}
//           </div>

//           <div className="spp-edit-grid" style={{ display: "grid", gridTemplateColumns: sheetMode ? "1fr" : "1fr 1fr", columnGap: 20, rowGap: 16 }}>
//             {EDITABLE_FIELDS.map((field) => (
//               <div key={field.key} style={{ gridColumn: field.full && !sheetMode ? "1 / -1" : "auto" }}>
//                 <label style={{ display: "block", fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 5 }}>
//                   {field.label}
//                   {field.required && <span style={{ color: C.danger }}> *</span>}
//                 </label>
//                 {field.type === "select" ? (
//                   <select value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} style={inputStyle}>
//                     {field.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
//                   </select>
//                 ) : field.type === "textarea" ? (
//                   <textarea value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
//                 ) : (
//                   <input type={field.type} value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} style={inputStyle} step={field.type === "number" ? "any" : undefined} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {error && (
//           <div style={{ margin: isMobile ? "0 16px 12px" : "0 24px 12px", padding: "10px 12px", borderRadius: C.radiusSm, background: "rgba(179,64,47,0.08)", border: `1px solid ${C.danger}`, color: C.danger, fontFamily: C.fontBody, fontSize: 13 }}>
//             {error}
//           </div>
//         )}

//         <div className="spp-edit-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: isMobile ? "14px 16px" : "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
//           <button type="button" onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset" }}>Cancel</button>
//           <button type="submit" disabled={isLoading || isUploading} style={{ ...primaryBtnStyle, flex: isMobile ? 1 : "unset", justifyContent: "center", cursor: isLoading || isUploading ? "default" : "pointer", opacity: isLoading || isUploading ? 0.7 : 1 }}>
//             <Save size={14} strokeWidth={2.25} />
//             {isLoading ? "Saving..." : "Save changes"}
//           </button>
//         </div>
//       </form>

//       <style>{`
//         @media (max-width: 1024px) {
//           .spp-edit-footer { flex-direction: column-reverse; }
//           .spp-edit-footer button { width: 100%; justify-content: center; }
//         }
//       `}</style>
//     </div>
//   )
// }

// /* ---------- delete modal ---------- */
// function DeleteConfirmModal({ product, onClose, onDeleted }) {
//   const isMobile = useIsMobile()
//   const [deleteProduct, { isLoading }] = useDeleteProductMutation()
//   const [error, setError] = useState("")

//   const handleDelete = async () => {
//     setError("")
//     try {
//       await deleteProduct(product.id).unwrap()
//       onDeleted?.()
//       onClose()
//     } catch (err) {
//       setError(err?.data?.message || "Failed to delete product. Please try again.")
//     }
//   }

//   return (
//     <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 1000, padding: isMobile ? 0 : 16 }}>
//       <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: isMobile ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd, maxWidth: 400, width: "100%", padding: 24, boxSizing: "border-box" }}>
//         <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
//           <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(179,64,47,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <AlertTriangle size={18} color={C.danger} strokeWidth={2.25} />
//           </div>
//           <div>
//             <h3 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: 16, color: C.heading }}>Delete product?</h3>
//             <p style={{ margin: "6px 0 0", fontFamily: C.fontBody, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
//               This will permanently remove <strong>{product.productName}</strong> from your catalog. This action can't be undone.
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: C.radiusSm, background: "rgba(179,64,47,0.08)", border: `1px solid ${C.danger}`, color: C.danger, fontFamily: C.fontBody, fontSize: 13 }}>
//             {error}
//           </div>
//         )}

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
//           <button onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset" }}>Cancel</button>
//           <button
//             onClick={handleDelete}
//             disabled={isLoading}
//             style={{
//               display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
//               padding: "9px 18px", borderRadius: C.radiusSm, border: "none", background: C.danger, color: "#fff",
//               fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: isLoading ? "default" : "pointer",
//               opacity: isLoading ? 0.7 : 1, flex: isMobile ? 1 : "unset",
//             }}
//           >
//             <Trash2 size={14} strokeWidth={2.25} />
//             {isLoading ? "Deleting..." : "Delete"}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// const inputStyle = {
//   width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: C.radiusSm,
//   border: `1px solid ${C.border}`, fontFamily: C.fontBody, fontSize: 13, color: C.heading,
//   background: C.background, outline: "none",
// }

// const primaryBtnStyle = {
//   display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: C.radiusSm,
//   border: "none", background: C.primary, color: "#fff", fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
// }

// const secondaryBtnStyle = {
//   padding: "10px 20px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, background: "transparent",
//   color: C.text, fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
// }

// function actionBtnStyle(color) {
//   return {
//     display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: C.radiusSm,
//     border: `1px solid ${color}`, background: "transparent", color, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
//   }
// }

// /* ------------------------------------------------------------------ */
// /* Page — Table + Pagination wired to the API response shape          */
// /* ------------------------------------------------------------------ */

// export default function SupplierProductsPage() {
//   const [search, setSearch] = useState("")
//   const [page, setPage] = useState(1)
//   const [viewingProduct, setViewingProduct] = useState(null)
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [deletingProduct, setDeletingProduct] = useState(null)
//   const isMobile = useIsMobile()
//   const limit = 10

//   const { data, isLoading, isFetching, isError, refetch } = useGetSupplierProductsQuery({
//     page,
//     limit,
//     search,
//   })

//   const products = data?.data?.products || []
//   const total = data?.data?.total ?? products.length
//   const totalPages = data?.data?.totalPages ?? Math.max(1, Math.ceil(total / limit))

//   // Columns for the shared Table component
//   const columns = [
//     {
//       key: "thumbnail",
//       label: "Image",
//       width: "76px",
//       render: (row) => <ProductThumb src={row.thumbnail || row.images?.[0]} alt={row.productName} />,
//     },
//     {
//       key: "productName",
//       label: "Product",
//       render: (row) => (
//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontWeight: 600, color: C.heading, overflowWrap: "anywhere" }}>{row.productName}</div>
//           <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
//             {[row.brand, row.sku].filter(Boolean).join(" · ")}
//           </div>
//         </div>
//       ),
//     },
//     { key: "category", label: "Category" },
//     {
//       key: "description",
//       label: "Description",
//       width: "260px",
//       truncate: true,
//       maxLines: 2,
//       render: (row) => row.description,
//     },
//     {
//       key: "price",
//       label: "Price",
//       render: (row) => (
//         <div style={{ whiteSpace: "nowrap" }}>
//           <div style={{ fontWeight: 600, color: C.heading }}>₹{Number(row.price).toLocaleString("en-IN")}</div>
//           {row.discountPrice ? (
//             <div style={{ fontSize: 11, color: C.success }}>₹{Number(row.discountPrice).toLocaleString("en-IN")} offer</div>
//           ) : null}
//         </div>
//       ),
//     },
//     { key: "stock", label: "Stock", render: (row) => row.stock ?? "—" },
//     { key: "availability", label: "Availability", render: (row) => <StatusPill value={row.availability} /> },
//     { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
//     {
//       key: "actions",
//       label: "Actions",
//       className: "text-right",
//       render: (row) => (
//         <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
//           <button type="button" onClick={(e) => { e.stopPropagation(); setViewingProduct(row) }} style={actionBtnStyle(C.muted)}>
//             <Eye size={13} strokeWidth={2.25} /> View
//           </button>
//           <button type="button" onClick={(e) => { e.stopPropagation(); setEditingProduct(row) }} style={actionBtnStyle(C.primary)}>
//             <Pencil size={13} strokeWidth={2.25} /> Edit
//           </button>
//           <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingProduct(row) }} style={actionBtnStyle(C.danger)}>
//             <Trash2 size={13} strokeWidth={2.25} /> Delete
//           </button>
//         </div>
//       ),
//     },
//   ]

//   return (
//     <div className="spp-page" style={{ padding: isMobile ? 16 : 24, fontFamily: C.fontBody }}>
//       <div className="spp-header" style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <Package size={20} color={C.primary} strokeWidth={2} />
//           <div>
//             <h1 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isMobile ? 18 : 20, color: C.heading }}>My products</h1>
//             <span style={{ fontSize: 12, color: C.muted }}>{total} total</span>
//           </div>
//         </div>

//         <div style={{ position: "relative", width: isMobile ? "100%" : "auto" }}>
//           <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1) }}
//             placeholder="Search products..."
//             style={{ width: isMobile ? "100%" : 220, boxSizing: "border-box", padding: "9px 12px 9px 32px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, fontSize: 13, outline: "none" }}
//           />
//         </div>
//       </div>

//       {isError ? (
//         <div style={{ padding: 32, textAlign: "center", color: C.danger, border: `1px solid ${C.border}`, borderRadius: C.radiusMd }}>
//           Couldn't load your products.{" "}
//           <button onClick={refetch} style={{ color: C.primary, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
//             Try again
//           </button>
//         </div>
//       ) : isLoading ? (
//         <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Loading products...</div>
//       ) : (
//         <>
//           <div className="spp-table-wrap" style={{ opacity: isFetching ? 0.6 : 1, transition: C.transition }}>
//             <Table
//               columns={columns}
//               data={products}
//               rowKey="id"
//               emptyMessage="You haven't added any products yet."
//               onRowClick={(row) => setViewingProduct(row)}
//               minWidth={960}
//               startIndex={(page - 1) * limit}
//             />
//           </div>

//           <Pagination
//             pagination={{ total, page, limit, totalPages }}
//             onPageChange={(p) => setPage(p)}
//             isFetching={isFetching}
//           />
//         </>
//       )}

//       {viewingProduct && (
//         <ViewProductModal
//           product={viewingProduct}
//           onClose={() => setViewingProduct(null)}
//           onEdit={(p) => { setViewingProduct(null); setEditingProduct(p) }}
//         />
//       )}

//       {editingProduct && (
//         <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSaved={refetch} />
//       )}

//       {deletingProduct && (
//         <DeleteConfirmModal product={deletingProduct} onClose={() => setDeletingProduct(null)} onDeleted={refetch} />
//       )}

//       <style>{`
//         @media (max-width: 640px) {
//           .spp-page { padding: 12px !important; }
//         }
//         @media (max-width: 1024px) {
//           .spp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
//         }
//       `}</style>
//     </div>
//   )
// }


import React, { useEffect, useRef, useState } from "react"
import {
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Package,
  Search,
  Eye,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Tag,
  Ruler,
  Weight,
  ShieldCheck,
  Truck,
  Boxes,
  Upload,
  Loader2,
  Star,
} from "lucide-react"
import {
  useGetSupplierProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./dashboard/materialapislice"
import { uploadFile } from "../../../../superBase"
import Table from "../../../global/Table"
import Pagination from "../../../global/pagination"

const C = {
  primary: "var(--primary, #3a2418)",
  primaryHover: "var(--primary-hover, #2a1a10)",
  gold: "var(--gold, #c9973a)",
  goldHover: "var(--gold-hover, #b3852f)",
  background: "var(--background, #f7f5f2)",
  surface: "var(--surface, #ffffff)",
  heading: "var(--heading, #2a2018)",
  text: "var(--text, #4a4038)",
  muted: "var(--muted, #8a8078)",
  border: "var(--border, #e5e0d8)",
  danger: "var(--danger, #b3402f)",
  dangerHover: "var(--danger-hover, #942f20)",
  success: "var(--success, #3f7d4f)",
  radiusSm: "var(--radius-sm, 6px)",
  radiusMd: "var(--radius-md, 10px)",
  radiusLg: "var(--radius-lg, 14px)",
  fontHeading: "var(--font-heading, inherit)",
  fontBody: "var(--font-body, inherit)",
  transition: "var(--transition, 0.15s ease)",
}

const EDITABLE_FIELDS = [
  { key: "productName", label: "Product name", type: "text", required: true },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "subCategory", label: "Sub category", type: "text" },
  { key: "brand", label: "Brand", type: "text" },
  { key: "unit", label: "Unit", type: "text", required: true },
  { key: "price", label: "Price", type: "number", required: true },
  { key: "discountPrice", label: "Discount price", type: "number" },
  { key: "stock", label: "Stock", type: "number" },
  { key: "minimumOrderQuantity", label: "Min order qty", type: "number" },
  { key: "material", label: "Material", type: "text" },
  { key: "color", label: "Color", type: "text" },
  { key: "availability", label: "Availability", type: "select", options: ["In Stock", "Out of Stock"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  { key: "description", label: "Description", type: "textarea", full: true },
]

/* ---------- responsive hooks ---------- */
function useMediaQuery(breakpoint) {
  const [matches, setMatches] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  )
  useEffect(() => {
    const onResize = () => setMatches(window.innerWidth <= breakpoint)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [breakpoint])
  return matches
}
// Named breakpoints: xs (phones), sm (large phones), md (tablets)
function useIsXs() { return useMediaQuery(400) }
function useIsMobile(breakpoint = 720) { return useMediaQuery(breakpoint) }
function useIsTablet(breakpoint = 1024) { return useMediaQuery(breakpoint) }

/* ---------- shared bits ---------- */
function StatusPill({ value }) {
  const active = value === "Active" || value === "In Stock"
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: C.fontBody,
        whiteSpace: "nowrap",
        color: active ? C.success : C.muted,
        background: active ? "rgba(63,125,79,0.1)" : "rgba(138,128,120,0.12)",
        border: `1px solid ${active ? C.success : C.border}`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.success : C.muted, flexShrink: 0 }} />
      {value}
    </span>
  )
}

function ProductThumb({ src, alt, size = 44 }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: C.radiusSm, background: C.background,
          border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <ImageOff size={Math.max(14, size * 0.36)} color={C.muted} strokeWidth={1.75} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      style={{ width: size, height: size, borderRadius: C.radiusSm, objectFit: "cover", border: `1px solid ${C.border}`, flexShrink: 0 }}
    />
  )
}

function DetailRow({ icon: Icon, label, value }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, fontWeight: 600, flexShrink: 0 }}>
        {Icon && <Icon size={13} strokeWidth={2.25} />}
        {label}
      </span>
      <span style={{ fontSize: 13, color: C.heading, fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </div>
  )
}

/* ---------- view modal (also used as "Read more" detail modal) ---------- */
function ViewProductModal({ product, onClose, onEdit }) {
  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []
  const [activeImg, setActiveImg] = useState(0)
  const [broken, setBroken] = useState(false)
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isXs = useIsXs()
  const sheetMode = isMobile || isTablet

  const dimensions = [product.length, product.width, product.height]
    .filter((v) => v !== null && v !== undefined)
    .join(" × ")

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = originalOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={onClose}
      className="spp-overlay"
      style={{
        position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)",
        display: "flex", alignItems: sheetMode ? "flex-end" : "center", justifyContent: "center",
        zIndex: 1000, padding: sheetMode ? 0 : 16, boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="spp-view-panel"
        style={{
          background: C.surface,
          borderRadius: sheetMode ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
          maxWidth: 860, width: "100%", maxHeight: sheetMode ? "94vh" : "88vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div className="spp-grabber" aria-hidden="true" />
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: isXs ? "12px 14px 10px" : isMobile ? "14px 16px 12px" : "20px 24px",
            borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isXs ? 15 : isMobile ? 17 : 19, color: C.heading, overflowWrap: "anywhere", lineHeight: 1.3 }}>
              {product.productName}
            </h2>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <StatusPill value={product.status} />
              <StatusPill value={product.availability} />
              {product.sku && <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>SKU: {product.sku}</span>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, padding: 4, flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        <div
          className="spp-view-grid"
          style={{
            padding: isXs ? 14 : isMobile ? 16 : "20px 24px", overflowY: "auto",
            display: "grid", gridTemplateColumns: sheetMode ? "1fr" : "1fr 1fr", gap: isMobile ? 18 : 24,
          }}
        >
          <div>
            {images.length > 0 ? (
              <>
                <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: C.radiusMd, overflow: "hidden", border: `1px solid ${C.border}`, background: C.background }}>
                  {broken ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImageOff size={28} color={C.muted} />
                    </div>
                  ) : (
                    <img
                      src={images[activeImg]}
                      alt={`${product.productName} ${activeImg + 1}`}
                      onError={() => setBroken(true)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => { setBroken(false); setActiveImg((i) => (i - 1 + images.length) % images.length) }}
                        aria-label="Previous image"
                        style={navBtnStyle("left")}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setBroken(false); setActiveImg((i) => (i + 1) % images.length) }}
                        aria-label="Next image"
                        style={navBtnStyle("right")}
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>
                        {activeImg + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: isMobile ? "nowrap" : "wrap", overflowX: isMobile ? "auto" : "visible", paddingBottom: isMobile ? 2 : 0 }} className="spp-noscrollbar">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setBroken(false); setActiveImg(i) }}
                        style={{ padding: 0, border: `2px solid ${i === activeImg ? C.primary : "transparent"}`, borderRadius: C.radiusSm, cursor: "pointer", background: "none", flexShrink: 0 }}
                      >
                        <ProductThumb src={img} alt={`thumb ${i + 1}`} size={48} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: C.radiusMd, border: `1px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: C.muted }}>
                <ImageOff size={26} />
                <span style={{ fontSize: 12 }}>No images added</span>
              </div>
            )}

            {product.description && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 6 }}>Description</div>
                <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{product.description}</p>
              </div>
            )}
          </div>

          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: isXs ? 17 : isMobile ? 18 : 20, fontWeight: 700, color: C.heading, fontFamily: C.fontHeading, overflowWrap: "anywhere" }}>
                ₹{Number(product.price).toLocaleString("en-IN")}
                <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}> / {product.unit}</span>
              </div>
              {product.discountPrice ? (
                <div style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
                  Offer price: ₹{Number(product.discountPrice).toLocaleString("en-IN")}
                </div>
              ) : null}
            </div>

            <DetailRow icon={Tag} label="Category" value={product.category} />
            <DetailRow icon={Tag} label="Sub category" value={product.subCategory} />
            <DetailRow icon={Tag} label="Brand" value={product.brand} />
            <DetailRow icon={Boxes} label="Stock" value={product.stock} />
            <DetailRow icon={Boxes} label="Min order qty" value={product.minimumOrderQuantity} />
            <DetailRow icon={Tag} label="Material" value={product.material} />
            <DetailRow icon={Tag} label="Color" value={product.color} />
            <DetailRow icon={Ruler} label="Dimensions (L×W×H)" value={dimensions || null} />
            <DetailRow icon={Weight} label="Weight" value={product.weight} />
            <DetailRow icon={ShieldCheck} label="Warranty" value={product.warranty} />
            <DetailRow icon={Truck} label="Delivery time" value={product.deliveryTime} />
          </div>
        </div>

        <div className="spp-view-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: isXs ? "12px 14px" : isMobile ? "14px 16px" : "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={secondaryBtnStyle}>Close</button>
          <button type="button" onClick={() => onEdit(product)} style={{ ...primaryBtnStyle, flex: isMobile ? 1 : "unset", justifyContent: "center" }}>
            <Pencil size={14} strokeWidth={2.25} />
            Edit product
          </button>
        </div>
      </div>

      <style>{`
        .spp-grabber { display: none; }
        .spp-noscrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .spp-noscrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .spp-grabber { display: block; width: 38px; height: 4px; border-radius: 4px; background: ${C.border}; margin: 10px auto 0; }
          .spp-view-footer { flex-direction: column-reverse; }
          .spp-view-footer button { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}

function navBtnStyle(side) {
  return {
    position: "absolute", top: "50%", [side]: 8, transform: "translateY(-50%)",
    width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  }
}

/* ---------- edit modal ---------- */
function EditProductModal({ product, onClose, onSaved }) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isXs = useIsXs()
  const sheetMode = isMobile || isTablet
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(() => ({
    productName: product.productName || "",
    category: product.category || "",
    subCategory: product.subCategory || "",
    brand: product.brand || "",
    unit: product.unit || "",
    price: product.price ?? "",
    discountPrice: product.discountPrice ?? "",
    stock: product.stock ?? "",
    minimumOrderQuantity: product.minimumOrderQuantity ?? "",
    material: product.material || "",
    color: product.color || "",
    availability: product.availability || "In Stock",
    status: product.status || "Active",
    description: product.description || "",
  }))
  const [images, setImages] = useState(() => product.images || [])
  const [thumbnail, setThumbnail] = useState(() => product.thumbnail || product.images?.[0] || "")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setIsUploading(true)
    setError("")
    try {
      const uploaded = await Promise.all(files.map((file) => uploadFile(file, "products", "product-images")))
      const newUrls = uploaded.map((u) => u.publicUrl)
      setImages((prev) => [...prev, ...newUrls])
      setThumbnail((prev) => prev || newUrls[0])
    } catch (err) {
      setError(err?.message || "Failed to upload image(s). Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeImage = (url) => {
    setImages((prev) => {
      const next = prev.filter((img) => img !== url)
      setThumbnail((t) => (t === url ? next[0] || "" : t))
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!form.productName || !form.category || !form.unit || form.price === "") {
      setError("Product name, category, unit and price are required.")
      return
    }
    try {
      await updateProduct({
        id: product.id,
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
        stock: form.stock === "" ? undefined : Number(form.stock),
        minimumOrderQuantity: form.minimumOrderQuantity === "" ? undefined : Number(form.minimumOrderQuantity),
        images,
        thumbnail: thumbnail || images[0] || "",
      }).unwrap()
      onSaved?.()
      onClose()
    } catch (err) {
      setError(err?.data?.message || "Failed to update product. Please try again.")
    }
  }

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = originalOverflow }
  }, [])

  return (
    <div
      onClick={onClose}
      className="spp-overlay"
      style={{
        position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)",
        display: "flex", alignItems: sheetMode ? "flex-end" : "center", justifyContent: "center",
        zIndex: 1000, padding: sheetMode ? 0 : 16, boxSizing: "border-box",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="spp-edit-panel"
        style={{
          background: C.surface,
          borderRadius: sheetMode ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd,
          maxWidth: 720, width: "100%", maxHeight: sheetMode ? "96vh" : "88vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div className="spp-grabber" aria-hidden="true" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isXs ? "12px 14px 10px" : isMobile ? "14px 16px 12px" : "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isXs ? 15 : isMobile ? 16 : 18, color: C.heading, display: "flex", alignItems: "center", gap: 8 }}>
            <Pencil size={17} strokeWidth={2} color={C.primary} />
            Edit product
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: isXs ? 14 : isMobile ? 16 : "20px 24px", overflowY: "auto" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 8 }}>
              Product images
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
            {images.length > 0 && (
              <div className="spp-image-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 10, marginBottom: 12 }}>
                {images.map((url) => (
                  <div key={url} style={{ position: "relative", borderRadius: C.radiusSm, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1 / 1" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <button type="button" onClick={() => removeImage(url)} aria-label="Remove image" style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <X size={11} strokeWidth={2.5} />
                    </button>
                    <button type="button" onClick={() => setThumbnail(url)} aria-label="Set as thumbnail" title="Set as thumbnail" style={{ position: "absolute", bottom: 4, left: 4, display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: thumbnail === url ? C.gold : "rgba(0,0,0,0.55)", color: "#fff" }}>
                      <Star size={9} strokeWidth={2.5} fill={thumbnail === url ? "#fff" : "none"} />
                      {thumbnail === url ? "Thumbnail" : "Set"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, background: C.background, color: C.heading, fontFamily: C.fontBody, fontWeight: 600, fontSize: 12, cursor: isUploading ? "default" : "pointer", opacity: isUploading ? 0.7 : 1, width: isXs ? "100%" : "auto", justifyContent: isXs ? "center" : "flex-start" }}>
              {isUploading ? (<><Loader2 size={13} className="animate-spin" /> Uploading...</>) : (<><Upload size={13} /> Upload images</>)}
            </button>
            {images.length === 0 && !isUploading && (
              <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>No images yet. Upload some to help buyers recognize this product.</p>
            )}
          </div>

          <div className="spp-edit-grid" style={{ display: "grid", gridTemplateColumns: sheetMode ? "1fr" : "1fr 1fr", columnGap: 20, rowGap: 16 }}>
            {EDITABLE_FIELDS.map((field) => (
              <div key={field.key} style={{ gridColumn: field.full && !sheetMode ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontFamily: C.fontBody, fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 5 }}>
                  {field.label}
                  {field.required && <span style={{ color: C.danger }}> *</span>}
                </label>
                {field.type === "select" ? (
                  <select value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} style={inputStyle}>
                    {field.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                ) : (
                  <input type={field.type} value={form[field.key]} onChange={(e) => handleChange(field.key, e.target.value)} style={inputStyle} step={field.type === "number" ? "any" : undefined} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ margin: isXs ? "0 14px 12px" : isMobile ? "0 16px 12px" : "0 24px 12px", padding: "10px 12px", borderRadius: C.radiusSm, background: "rgba(179,64,47,0.08)", border: `1px solid ${C.danger}`, color: C.danger, fontFamily: C.fontBody, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div className="spp-edit-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: isXs ? "12px 14px" : isMobile ? "14px 16px" : "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset" }}>Cancel</button>
          <button type="submit" disabled={isLoading || isUploading} style={{ ...primaryBtnStyle, flex: isMobile ? 1 : "unset", justifyContent: "center", cursor: isLoading || isUploading ? "default" : "pointer", opacity: isLoading || isUploading ? 0.7 : 1 }}>
            <Save size={14} strokeWidth={2.25} />
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 1024px) {
          .spp-edit-footer { flex-direction: column-reverse; }
          .spp-edit-footer button { width: 100%; justify-content: center; }
        }
        @media (max-width: 400px) {
          .spp-image-grid { grid-template-columns: repeat(auto-fill, minmax(54px, 1fr)); gap: 8px; }
        }
      `}</style>
    </div>
  )
}

/* ---------- delete modal ---------- */
function DeleteConfirmModal({ product, onClose, onDeleted }) {
  const isMobile = useIsMobile()
  const isXs = useIsXs()
  const [deleteProduct, { isLoading }] = useDeleteProductMutation()
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setError("")
    try {
      await deleteProduct(product.id).unwrap()
      onDeleted?.()
      onClose()
    } catch (err) {
      setError(err?.data?.message || "Failed to delete product. Please try again.")
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20, 16, 12, 0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 1000, padding: isMobile ? 0 : 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: isMobile ? `${C.radiusLg} ${C.radiusLg} 0 0` : C.radiusMd, maxWidth: 400, width: "100%", padding: isXs ? 18 : 24, boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(179,64,47,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={18} color={C.danger} strokeWidth={2.25} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: 16, color: C.heading }}>Delete product?</h3>
            <p style={{ margin: "6px 0 0", fontFamily: C.fontBody, fontSize: 13, color: C.text, lineHeight: 1.5, overflowWrap: "anywhere" }}>
              This will permanently remove <strong>{product.productName}</strong> from your catalog. This action can't be undone.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: C.radiusSm, background: "rgba(179,64,47,0.08)", border: `1px solid ${C.danger}`, color: C.danger, fontFamily: C.fontBody, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, flexDirection: isXs ? "column-reverse" : "row" }}>
          <button onClick={onClose} style={{ ...secondaryBtnStyle, flex: isMobile ? 1 : "unset", width: isXs ? "100%" : "auto" }}>Cancel</button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 18px", borderRadius: C.radiusSm, border: "none", background: C.danger, color: "#fff",
              fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: isLoading ? "default" : "pointer",
              opacity: isLoading ? 0.7 : 1, flex: isMobile ? 1 : "unset", width: isXs ? "100%" : "auto",
            }}
          >
            <Trash2 size={14} strokeWidth={2.25} />
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: C.radiusSm,
  border: `1px solid ${C.border}`, fontFamily: C.fontBody, fontSize: 13, color: C.heading,
  background: C.background, outline: "none",
}

const primaryBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: C.radiusSm,
  border: "none", background: C.primary, color: "#fff", fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
}

const secondaryBtnStyle = {
  padding: "10px 20px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, background: "transparent",
  color: C.text, fontFamily: C.fontBody, fontWeight: 600, fontSize: 13, cursor: "pointer",
}

function actionBtnStyle(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: C.radiusSm,
    border: `1px solid ${color}`, background: "transparent", color, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  }
}

/* ------------------------------------------------------------------ */
/* Page — Table + Pagination wired to the API response shape          */
/* ------------------------------------------------------------------ */

export default function SupplierProductsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const isMobile = useIsMobile()
  const isXs = useIsXs()
  const limit = 10

  const { data, isLoading, isFetching, isError, refetch } = useGetSupplierProductsQuery({
    page,
    limit,
    search,
  })

  const products = data?.data?.products || []
  const total = data?.data?.total ?? products.length
  const totalPages = data?.data?.totalPages ?? Math.max(1, Math.ceil(total / limit))

  // Columns for the shared Table component
  const columns = [
    {
      key: "thumbnail",
      label: "Image",
      width: "76px",
      render: (row) => <ProductThumb src={row.thumbnail || row.images?.[0]} alt={row.productName} />,
    },
    {
      key: "productName",
      label: "Product",
      render: (row) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: C.heading, overflowWrap: "anywhere" }}>{row.productName}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
            {[row.brand, row.sku].filter(Boolean).join(" · ")}
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "description",
      label: "Description",
      width: "260px",
      truncate: true,
      maxLines: 2,
      render: (row) => row.description,
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 600, color: C.heading }}>₹{Number(row.price).toLocaleString("en-IN")}</div>
          {row.discountPrice ? (
            <div style={{ fontSize: 11, color: C.success }}>₹{Number(row.discountPrice).toLocaleString("en-IN")} offer</div>
          ) : null}
        </div>
      ),
    },
    { key: "stock", label: "Stock", render: (row) => row.stock ?? "—" },
    { key: "availability", label: "Availability", render: (row) => <StatusPill value={row.availability} /> },
    { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="spp-action-group" style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button type="button" onClick={(e) => { e.stopPropagation(); setViewingProduct(row) }} style={actionBtnStyle(C.muted)} title="View">
            <Eye size={13} strokeWidth={2.25} /> <span className="spp-action-label">View</span>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setEditingProduct(row) }} style={actionBtnStyle(C.primary)} title="Edit">
            <Pencil size={13} strokeWidth={2.25} /> <span className="spp-action-label">Edit</span>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingProduct(row) }} style={actionBtnStyle(C.danger)} title="Delete">
            <Trash2 size={13} strokeWidth={2.25} /> <span className="spp-action-label">Delete</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="spp-page" style={{ padding: isXs ? 12 : isMobile ? 16 : 24, fontFamily: C.fontBody, maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      <div className="spp-header" style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Package size={20} color={C.primary} strokeWidth={2} />
          <div>
            <h1 style={{ margin: 0, fontFamily: C.fontHeading, fontSize: isXs ? 16 : isMobile ? 18 : 20, color: C.heading }}>My products</h1>
            <span style={{ fontSize: 12, color: C.muted }}>{total} total</span>
          </div>
        </div>

        <div style={{ position: "relative", width: isMobile ? "100%" : "auto" }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            style={{ width: isMobile ? "100%" : 220, boxSizing: "border-box", padding: "9px 12px 9px 32px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, fontSize: 13, outline: "none" }}
          />
        </div>
      </div>

      {isError ? (
        <div style={{ padding: 32, textAlign: "center", color: C.danger, border: `1px solid ${C.border}`, borderRadius: C.radiusMd }}>
          Couldn't load your products.{" "}
          <button onClick={refetch} style={{ color: C.primary, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Loading products...</div>
      ) : (
        <>
          <div className="spp-table-wrap spp-noscrollbar" style={{ opacity: isFetching ? 0.6 : 1, transition: C.transition, width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Table
              columns={columns}
              data={products}
              rowKey="id"
              emptyMessage="You haven't added any products yet."
              onRowClick={(row) => setViewingProduct(row)}
              minWidth={960}
              startIndex={(page - 1) * limit}
            />
          </div>

          <div className="spp-pagination-wrap" style={{ marginTop: 12, display: "flex", justifyContent: isMobile ? "center" : "flex-end", flexWrap: "wrap" }}>
            <Pagination
              pagination={{ total, page, limit, totalPages }}
              onPageChange={(p) => setPage(p)}
              isFetching={isFetching}
            />
          </div>
        </>
      )}

      {viewingProduct && (
        <ViewProductModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onEdit={(p) => { setViewingProduct(null); setEditingProduct(p) }}
        />
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSaved={refetch} />
      )}

      {deletingProduct && (
        <DeleteConfirmModal product={deletingProduct} onClose={() => setDeletingProduct(null)} onDeleted={refetch} />
      )}

      <style>{`
        .spp-noscrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .spp-noscrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 1024px) {
          .spp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
        @media (max-width: 640px) {
          .spp-page { padding: 12px !important; }
        }
        /* Icon-only action buttons on narrow phones to avoid row overflow */
        @media (max-width: 480px) {
          .spp-action-group { gap: 4px !important; }
          .spp-action-label { display: none; }
        }
        @media (max-width: 380px) {
          .spp-header h1 { font-size: 15px !important; }
        }
      `}</style>
    </div>
  )
}