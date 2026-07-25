// // // import { useState, useEffect, useRef, useCallback } from "react"
// // // import { useNavigate } from "react-router-dom"
// // // import { Heart, Bookmark, MapPin, Package, Truck, User, ChevronLeft, ChevronRight, ArrowRight, Loader2, Search, X } from "lucide-react"
// // // import { motion } from "framer-motion"
// // // import { useGetPublicProductsQuery, useLazySearchLocationsQuery } from "./supplyproductsapislice"
// // // import "../theme.css"

// // // export default function FeaturedProducts() {
// // //     const navigate = useNavigate()

// // //     const [page, setPage] = useState(1)
// // //     const [likes, setLikes] = useState({})
// // //     const [saves, setSaves] = useState({})
// // //     const [imgIndex, setImgIndex] = useState({})
// // //     const [allProducts, setAllProducts] = useState([])
// // //     const [allSuppliers, setAllSuppliers] = useState([])
// // //     const [allContacts, setAllContacts] = useState([])

// // //     // ---- LOCATION STATE ----
// // //     const [coords, setCoords] = useState(null)
// // //     const [locationLabel, setLocationLabel] = useState("")
// // //     const [locationStatus, setLocationStatus] = useState("idle") // idle | locating | granted | denied
// // //     const [searchInput, setSearchInput] = useState("")
// // //     const [suggestions, setSuggestions] = useState([])
// // //     const [showSuggestions, setShowSuggestions] = useState(false)
// // //     const debounceRef = useRef(null)
// // //     const searchBoxRef = useRef(null)

// // //     const [triggerSearch, { isFetching: isSearchingLocations }] = useLazySearchLocationsQuery()

// // //     const LIMIT = 12

// // //     // ---- Geolocation on mount ----
// // //     useEffect(() => {
// // //         if (!navigator.geolocation) {
// // //             setLocationStatus("denied")
// // //             return
// // //         }
// // //         setLocationStatus("locating")
// // //         navigator.geolocation.getCurrentPosition(
// // //             (pos) => {
// // //                 setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
// // //                 setLocationLabel("Near you")
// // //                 setLocationStatus("granted")
// // //             },
// // //             (err) => {
// // //                 console.warn("Geolocation unavailable:", err.message)
// // //                 setLocationStatus("denied")
// // //             },
// // //             { enableHighAccuracy: true, timeout: 8000 }
// // //         )
// // //     }, [])

// // //     // ---- Close suggestions on outside click ----
// // //     useEffect(() => {
// // //         const handleClickOutside = (e) => {
// // //             if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
// // //                 setShowSuggestions(false)
// // //             }
// // //         }
// // //         document.addEventListener("mousedown", handleClickOutside)
// // //         return () => document.removeEventListener("mousedown", handleClickOutside)
// // //     }, [])

// // //     // ---- Debounced location search ----
// // //     const handleSearchInput = useCallback((value) => {
// // //         setSearchInput(value)
// // //         if (debounceRef.current) clearTimeout(debounceRef.current)

// // //         if (!value.trim()) {
// // //             setSuggestions([])
// // //             setShowSuggestions(false)
// // //             return
// // //         }

// // //         debounceRef.current = setTimeout(async () => {
// // //             const res = await triggerSearch(value)
// // //             if (res?.data?.data?.length) {
// // //                 setSuggestions(res.data.data)
// // //                 setShowSuggestions(true)
// // //             } else {
// // //                 setSuggestions([])
// // //                 setShowSuggestions(false)
// // //             }
// // //         }, 400)
// // //     }, [triggerSearch])

// // //     const resetProductAccumulation = () => {
// // //         setAllProducts([])
// // //         setAllSuppliers([])
// // //         setAllContacts([])
// // //         setPage(1)
// // //     }

// // //     const selectSuggestion = (s) => {
// // //         setCoords({ lat: s.lat, lng: s.lng })
// // //         setLocationLabel(s.displayName)
// // //         setSearchInput(s.displayName)
// // //         setShowSuggestions(false)
// // //         setLocationStatus("granted")
// // //         resetProductAccumulation()
// // //     }

// // //     const clearLocation = () => {
// // //         setCoords(null)
// // //         setLocationLabel("")
// // //         setSearchInput("")
// // //         setSuggestions([])
// // //         setShowSuggestions(false)
// // //         setLocationStatus("idle")
// // //         resetProductAccumulation()
// // //     }

// // //     // ---- PRODUCTS QUERY ----
// // //     const queryParams = {
// // //         page,
// // //         limit: LIMIT,
// // //         ...(coords && { lat: coords.lat, lng: coords.lng, radiusKm: 50 }),
// // //     }

// // //     const { data: res, isLoading, isFetching, error } = useGetPublicProductsQuery(queryParams)

// // //     // ---- Merge new page results — MUST be in useEffect, not render body ----
// // //     useEffect(() => {
// // //         if (!res?.data) return
// // //         if (res.data.page !== page) return

// // //         const incoming = res.data.products || []

// // //         setAllProducts((prev) => {
// // //             const ids = new Set(prev.map((p) => p.id))
// // //             const fresh = incoming.filter((p) => !ids.has(p.id))
// // //             return fresh.length ? [...prev, ...fresh] : prev
// // //         })

// // //         setAllSuppliers((prev) => {
// // //             const ids = new Set(prev.map((s) => s.id))
// // //             const fresh = (res.data.suppliers || []).filter((s) => !ids.has(s.id))
// // //             return fresh.length ? [...prev, ...fresh] : prev
// // //         })

// // //         setAllContacts((prev) => {
// // //             const ids = new Set(prev.map((c) => c.id))
// // //             const fresh = (res.data.contactDetails || []).filter((c) => !ids.has(c.id))
// // //             return fresh.length ? [...prev, ...fresh] : prev
// // //         })
// // //         // eslint-disable-next-line react-hooks/exhaustive-deps
// // //     }, [res, page])

// // //     const totalPages = res?.data?.totalPages || 1
// // //     const hasMore = page < totalPages

// // //     const getSupplier = (supplierId) => allSuppliers.find((s) => s.id === supplierId)
// // //     const getContact = (supplierId) => allContacts.find((c) => c.supplierId === supplierId)

// // //     const toggleLike = (e, id) => {
// // //         e.preventDefault()
// // //         e.stopPropagation()
// // //         setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
// // //     }

// // //     const toggleSave = (e, id) => {
// // //         e.preventDefault()
// // //         e.stopPropagation()
// // //         setSaves((prev) => ({ ...prev, [id]: !prev[id] }))
// // //     }

// // //     const goToImage = (e, id, dir, totalImages) => {
// // //         e.preventDefault()
// // //         e.stopPropagation()
// // //         setImgIndex((prev) => {
// // //             const current = prev[id] || 0
// // //             const next = (current + dir + totalImages) % totalImages
// // //             return { ...prev, [id]: next }
// // //         })
// // //     }

// // //     const openProduct = (productId) => {
// // //         navigate(`/products/${productId}`)
// // //     }

// // //     const loadMore = () => {
// // //         if (hasMore && !isFetching) setPage((p) => p + 1)
// // //     }

// // //     const getPricing = (product) => {
// // //         const original = Number(product.price)
// // //         const discount = product.discountPrice != null ? Number(product.discountPrice) : null
// // //         const hasDiscount = discount != null && discount > 0 && discount < original
// // //         return { original, discount, hasDiscount }
// // //     }

// // //     if (isLoading && page === 1) {
// // //         return (
// // //             <section className="py-24 md:py-36 text-center">
// // //                 <Loader2 className="mx-auto mb-3 animate-spin text-[var(--gold)]" size={28} />
// // //                 <p className="text-[var(--muted)] font-[var(--font-body)]">Loading products...</p>
// // //             </section>
// // //         )
// // //     }

// // //     if (error && page === 1) {
// // //         return (
// // //             <section className="py-24 md:py-36 text-center">
// // //                 <p className="text-[var(--danger)] font-[var(--font-body)]">Failed to load products.</p>
// // //             </section>
// // //         )
// // //     }

// // //     return (
// // //         <section id="products" className="relative py-4 md:py-4 bg-[var(--background-secondary)] overflow-hidden px-4 sm:px-6 md:px-8">

// // //             <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--gold)]/6 via-[var(--primary)]/2 to-transparent blur-[120px] pointer-events-none" />

// // //             <div className="max-w-7xl mx-auto">

// // //                 <div className="mb-6 md:mb-10 text-center">
// // //                     <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3">
// // //                         Trusted Marketplace
// // //                     </span>
// // //                     <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
// // //                         Find Trusted Material Suppliers
// // //                     </h2>
// // //                     <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-[var(--text)] opacity-90 font-[var(--font-body)]">
// // //                         Connect with verified suppliers for quality construction and interior materials.
// // //                     </p>
// // //                 </div>

// // //                 {/* ---- LOCATION SEARCH BAR ---- */}
// // //                 <div ref={searchBoxRef} className="relative max-w-md mx-auto mb-10 md:mb-14">
// // //                     <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 gap-2 shadow-[var(--shadow-sm)]">
// // //                         <Search size={16} className="text-[var(--muted)] shrink-0" />
// // //                         <input
// // //                             value={searchInput}
// // //                             onChange={(e) => handleSearchInput(e.target.value)}
// // //                             onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
// // //                             placeholder="Search area, street, or locality..."
// // //                             className="flex-1 outline-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] font-[var(--font-body)]"
// // //                         />
// // //                         {isSearchingLocations && <Loader2 size={14} className="animate-spin text-[var(--muted)] shrink-0" />}
// // //                         {(searchInput || coords) && !isSearchingLocations && (
// // //                             <button onClick={clearLocation} aria-label="Clear location" className="shrink-0">
// // //                                 <X size={14} className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors" />
// // //                             </button>
// // //                         )}
// // //                     </div>

// // //                     {showSuggestions && suggestions.length > 0 && (
// // //                         <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 max-h-60 overflow-y-auto shadow-[var(--shadow-lg)]">
// // //                             {suggestions.map((s, i) => (
// // //                                 <li
// // //                                     key={i}
// // //                                     onClick={() => selectSuggestion(s)}
// // //                                     className="flex items-start gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] last:border-b-0"
// // //                                 >
// // //                                     <MapPin size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
// // //                                     <span className="text-[var(--text)] font-[var(--font-body)] leading-snug">{s.displayName}</span>
// // //                                 </li>
// // //                             ))}
// // //                         </ul>
// // //                     )}

// // //                     <div className="mt-2 flex items-center justify-center gap-1.5 min-h-[16px]">
// // //                         {locationStatus === "locating" && (
// // //                             <p className="text-xs text-[var(--muted)] flex items-center gap-1 font-[var(--font-body)]">
// // //                                 <Loader2 size={11} className="animate-spin" /> Detecting your location...
// // //                             </p>
// // //                         )}
// // //                         {coords && locationLabel && locationStatus === "granted" && (
// // //                             <p className="text-xs text-[var(--gold)] flex items-center gap-1 font-[var(--font-body)]">
// // //                                 <MapPin size={11} /> Showing suppliers near: {locationLabel}
// // //                             </p>
// // //                         )}
// // //                         {locationStatus === "denied" && !coords && (
// // //                             <p className="text-xs text-[var(--muted)] font-[var(--font-body)]">
// // //                                 Location unavailable — showing all suppliers. Search above to filter by area.
// // //                             </p>
// // //                         )}
// // //                     </div>
// // //                 </div>

// // //                 {!allProducts.length ? (
// // //                     <p className="text-center text-sm text-[var(--muted)] font-[var(--font-body)]">
// // //                         No products found.
// // //                     </p>
// // //                 ) : (
// // //                     <>
// // //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
// // //                             {allProducts.map((product) => {
// // //                                 const isLiked = !!likes[product.id]
// // //                                 const isSaved = !!saves[product.id]
// // //                                 const supplier = getSupplier(product.supplierId)
// // //                                 const contact = getContact(product.supplierId)
// // //                                 const pricing = getPricing(product)

// // //                                 const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean)
// // //                                 const finalImages = images.length ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]
// // //                                 const currentImg = imgIndex[product.id] || 0

// // //                                 return (
// // //                                     <motion.div
// // //                                         key={product.id}
// // //                                         initial={{ opacity: 0, y: 40 }}
// // //                                         whileInView={{ opacity: 1, y: 0 }}
// // //                                         viewport={{ once: true, margin: "-50px" }}
// // //                                         transition={{ duration: 0.5 }}
// // //                                         onClick={() => openProduct(product.id)}
// // //                                         className="group relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
// // //                                     >
// // //                                         <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
// // //                                             {finalImages.map((src, i) => (
// // //                                                 <img
// // //                                                     key={i}
// // //                                                     src={src}
// // //                                                     alt={`${product.productName} ${i + 1}`}
// // //                                                     loading="lazy"
// // //                                                     className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === currentImg ? "opacity-100" : "opacity-0 pointer-events-none"}`}
// // //                                                 />
// // //                                             ))}

// // //                                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 pointer-events-none" />

// // //                                             {finalImages.length > 1 && (
// // //                                                 <>
// // //                                                     <button
// // //                                                         onClick={(e) => goToImage(e, product.id, -1, finalImages.length)}
// // //                                                         className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
// // //                                                         aria-label="Previous image"
// // //                                                     >
// // //                                                         <ChevronLeft size={16} />
// // //                                                     </button>
// // //                                                     <button
// // //                                                         onClick={(e) => goToImage(e, product.id, 1, finalImages.length)}
// // //                                                         className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
// // //                                                         aria-label="Next image"
// // //                                                     >
// // //                                                         <ChevronRight size={16} />
// // //                                                     </button>
// // //                                                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
// // //                                                         {finalImages.map((_, i) => (
// // //                                                             <span
// // //                                                                 key={i}
// // //                                                                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? "w-4 bg-[var(--gold)]" : "w-1.5 bg-white/50"}`}
// // //                                                             />
// // //                                                         ))}
// // //                                                     </div>
// // //                                                 </>
// // //                                             )}
// // //                                         </div>

// // //                                         <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
// // //                                         <div className="absolute top-0 left-0 w-[2px] h-8 bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

// // //                                         <div className="relative z-20 p-5 flex flex-col items-start flex-1">
// // //                                             <h3 className="text-lg sm:text-xl font-bold text-[var(--heading)] leading-snug mb-1 group-hover:text-[var(--gold)] transition-colors duration-300 font-[var(--font-heading)]">
// // //                                                 {product.productName}
// // //                                             </h3>

// // //                                             <div className="flex items-center gap-1.5 mb-1">
// // //                                                 <User size={12} className="text-[var(--muted)]" />
// // //                                                 <span className="text-xs text-[var(--text)] font-light">{supplier?.name || "Supplier"}</span>
// // //                                             </div>

// // //                                             {supplier?.city && (
// // //                                                 <div className="flex items-center gap-1.5 mb-3">
// // //                                                     <MapPin size={12} className="text-[var(--muted)]" />
// // //                                                     <span className="text-xs text-[var(--text)] font-light">{supplier.city}, {supplier.state}</span>
// // //                                                 </div>
// // //                                             )}

// // //                                             <div className="grid grid-cols-3 gap-4 w-full border-t border-[var(--border)] pt-4 mt-1">
// // //                                                 <div className="flex flex-col min-w-0">
// // //                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
// // //                                                         Price
// // //                                                     </span>
// // //                                                     <span className="text-xs text-[var(--text)] font-bold">
// // //                                                         ₹{pricing.original.toLocaleString("en-IN")}
// // //                                                     </span>
// // //                                                     {pricing.hasDiscount && (
// // //                                                         <span className="text-[10px] text-[var(--gold)] font-medium truncate">
// // //                                                             Offer: ₹{pricing.discount.toLocaleString("en-IN")}
// // //                                                         </span>
// // //                                                     )}
// // //                                                 </div>

// // //                                                 <div className="flex flex-col min-w-0">
// // //                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
// // //                                                         Stock
// // //                                                     </span>
// // //                                                     <span className="text-xs text-[var(--text)] font-medium">
// // //                                                         {product.stock} units
// // //                                                     </span>
// // //                                                 </div>
// // //                                             </div>

// // //                                             <div className="flex items-center justify-between w-full border-t border-[var(--border)] pt-3 mt-3">
// // //                                                 <span className="text-[11px] text-[var(--muted)] font-[var(--font-body)]">
// // //                                                     {contact?.shopName || "View supplier"}
// // //                                                 </span>
// // //                                                 <span className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] font-bold border-b border-[var(--gold)]/40 pb-0.5 group-hover:text-[var(--heading)] group-hover:border-[var(--heading)] transition-colors duration-300">
// // //                                                     View Details
// // //                                                     <ArrowRight size={12} />
// // //                                                 </span>
// // //                                             </div>
// // //                                         </div>
// // //                                     </motion.div>
// // //                                 )
// // //                             })}
// // //                         </div>

// // //                         {hasMore && (
// // //                             <div className="flex justify-center mt-10">
// // //                                 <button
// // //                                     onClick={loadMore}
// // //                                     disabled={isFetching}
// // //                                     className="flex items-center gap-2 px-8 py-3 border border-[var(--gold)]/50 text-[var(--gold)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                                 >
// // //                                     {isFetching ? (
// // //                                         <>
// // //                                             <Loader2 size={14} className="animate-spin" />
// // //                                             Loading...
// // //                                         </>
// // //                                     ) : (
// // //                                         "Load More Products"
// // //                                     )}
// // //                                 </button>
// // //                             </div>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>
// // //         </section>
// // //     )
// // // }


// // import { useState, useEffect, useRef, useCallback } from "react"
// // import { useNavigate } from "react-router-dom"
// // import { Heart, Bookmark, MapPin, Package, Truck, User, ChevronLeft, ChevronRight, ArrowRight, Loader2, Search, X } from "lucide-react"
// // import { motion } from "framer-motion"
// // import { useGetPublicProductsQuery, useLazySearchLocationsQuery } from "./supplyproductsapislice"
// // import "../theme.css"

// // export default function FeaturedProducts() {
// //     const navigate = useNavigate()

// //     const [page, setPage] = useState(1)
// //     const [likes, setLikes] = useState({})
// //     const [saves, setSaves] = useState({})
// //     const [imgIndex, setImgIndex] = useState({})
// //     const [allProducts, setAllProducts] = useState([])
// //     const [allSuppliers, setAllSuppliers] = useState([])
// //     const [allContacts, setAllContacts] = useState([])

// //     // ---- LOCATION STATE ----
// //     const [coords, setCoords] = useState(null)
// //     const [locationLabel, setLocationLabel] = useState("")
// //     const [locationStatus, setLocationStatus] = useState("idle") // idle | locating | granted | denied
// //     const [searchInput, setSearchInput] = useState("")
// //     const [suggestions, setSuggestions] = useState([])
// //     const [showSuggestions, setShowSuggestions] = useState(false)
// //     const debounceRef = useRef(null)
// //     const searchBoxRef = useRef(null)

// //     const [triggerSearch, { isFetching: isSearchingLocations }] = useLazySearchLocationsQuery()

// //     const LIMIT = 12

// //     // Query only fires once we know whether we have a location or not (granted/denied).
// //     // This stops the old race: products loading once with no coords, then again with coords,
// //     // and the two result sets getting merged together in allProducts.
// //     const locationResolved = locationStatus === "granted" || locationStatus === "denied"

// //     const resetProductAccumulation = () => {
// //         setAllProducts([])
// //         setAllSuppliers([])
// //         setAllContacts([])
// //         setPage(1)
// //     }

// //     // ---- Geolocation on mount ----
// //     useEffect(() => {
// //         if (!navigator.geolocation) {
// //             setLocationStatus("denied")
// //             return
// //         }
// //         setLocationStatus("locating")
// //         navigator.geolocation.getCurrentPosition(
// //             (pos) => {
// //                 resetProductAccumulation()
// //                 setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
// //                 setLocationLabel("Near you")
// //                 setLocationStatus("granted")
// //             },
// //             (err) => {
// //                 console.warn("Geolocation unavailable:", err.message)
// //                 setLocationStatus("denied")
// //             },
// //             { enableHighAccuracy: true, timeout: 8000 }
// //         )
// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //     }, [])

// //     // ---- Close suggestions on outside click ----
// //     useEffect(() => {
// //         const handleClickOutside = (e) => {
// //             if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
// //                 setShowSuggestions(false)
// //             }
// //         }
// //         document.addEventListener("mousedown", handleClickOutside)
// //         return () => document.removeEventListener("mousedown", handleClickOutside)
// //     }, [])

// //     // ---- Debounced location search ----
// //     const handleSearchInput = useCallback((value) => {
// //         setSearchInput(value)
// //         if (debounceRef.current) clearTimeout(debounceRef.current)

// //         if (!value.trim()) {
// //             setSuggestions([])
// //             setShowSuggestions(false)
// //             return
// //         }

// //         debounceRef.current = setTimeout(async () => {
// //             const res = await triggerSearch(value)
// //             if (res?.data?.data?.length) {
// //                 setSuggestions(res.data.data)
// //                 setShowSuggestions(true)
// //             } else {
// //                 setSuggestions([])
// //                 setShowSuggestions(false)
// //             }
// //         }, 400)
// //     }, [triggerSearch])

// //     const selectSuggestion = (s) => {
// //         setCoords({ lat: s.lat, lng: s.lng })
// //         setLocationLabel(s.displayName)
// //         setSearchInput(s.displayName)
// //         setShowSuggestions(false)
// //         setLocationStatus("granted")
// //         resetProductAccumulation()
// //     }

// //     const clearLocation = () => {
// //         setCoords(null)
// //         setLocationLabel("")
// //         setSearchInput("")
// //         setSuggestions([])
// //         setShowSuggestions(false)
// //         setLocationStatus("denied") // denied = "resolved, no location" so query still fires
// //         resetProductAccumulation()
// //     }

// //     // ---- PRODUCTS QUERY BODY (sent as JSON payload, not query string) ----
// //     const queryBody = {
// //         page,
// //         limit: LIMIT,
// //         ...(coords && { lat: coords.lat, lng: coords.lng, radiusKm: 50 }),
// //     }

// //     const { data: res, isLoading, isFetching, error } = useGetPublicProductsQuery(queryBody, {
// //         skip: !locationResolved,
// //     })

// //     // ---- Merge new page results — MUST be in useEffect, not render body ----
// //     useEffect(() => {
// //         if (!res?.data) return
// //         if (res.data.page !== page) return

// //         const incoming = res.data.products || []

// //         setAllProducts((prev) => {
// //             const ids = new Set(prev.map((p) => p.id))
// //             const fresh = incoming.filter((p) => !ids.has(p.id))
// //             return fresh.length ? [...prev, ...fresh] : prev
// //         })

// //         setAllSuppliers((prev) => {
// //             const ids = new Set(prev.map((s) => s.id))
// //             const fresh = (res.data.suppliers || []).filter((s) => !ids.has(s.id))
// //             return fresh.length ? [...prev, ...fresh] : prev
// //         })

// //         setAllContacts((prev) => {
// //             const ids = new Set(prev.map((c) => c.id))
// //             const fresh = (res.data.contactDetails || []).filter((c) => !ids.has(c.id))
// //             return fresh.length ? [...prev, ...fresh] : prev
// //         })
// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //     }, [res, page])

// //     const totalPages = res?.data?.totalPages || 1
// //     const hasMore = page < totalPages

// //     const getSupplier = (supplierId) => allSuppliers.find((s) => s.id === supplierId)
// //     const getContact = (supplierId) => allContacts.find((c) => c.supplierId === supplierId)

// //     const toggleLike = (e, id) => {
// //         e.preventDefault()
// //         e.stopPropagation()
// //         setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
// //     }

// //     const toggleSave = (e, id) => {
// //         e.preventDefault()
// //         e.stopPropagation()
// //         setSaves((prev) => ({ ...prev, [id]: !prev[id] }))
// //     }

// //     const goToImage = (e, id, dir, totalImages) => {
// //         e.preventDefault()
// //         e.stopPropagation()
// //         setImgIndex((prev) => {
// //             const current = prev[id] || 0
// //             const next = (current + dir + totalImages) % totalImages
// //             return { ...prev, [id]: next }
// //         })
// //     }

// //     const openProduct = (productId) => {
// //         navigate(`/products/${productId}`)
// //     }

// //     const loadMore = () => {
// //         if (hasMore && !isFetching) setPage((p) => p + 1)
// //     }

// //     const getPricing = (product) => {
// //         const original = Number(product.price)
// //         const discount = product.discountPrice != null ? Number(product.discountPrice) : null
// //         const hasDiscount = discount != null && discount > 0 && discount < original
// //         return { original, discount, hasDiscount }
// //     }

// //     if ((isLoading || !locationResolved) && page === 1) {
// //         return (
// //             <section className="py-24 md:py-36 text-center">
// //                 <Loader2 className="mx-auto mb-3 animate-spin text-[var(--gold)]" size={28} />
// //                 <p className="text-[var(--muted)] font-[var(--font-body)]">
// //                     {locationResolved ? "Loading products..." : "Detecting your location..."}
// //                 </p>
// //             </section>
// //         )
// //     }

// //     if (error && page === 1) {
// //         return (
// //             <section className="py-24 md:py-36 text-center">
// //                 <p className="text-[var(--danger)] font-[var(--font-body)]">Failed to load products.</p>
// //             </section>
// //         )
// //     }

// //     return (
// //         <section id="products" className="relative py-4 md:py-4 bg-[var(--background-secondary)] overflow-hidden px-4 sm:px-6 md:px-8">

// //             <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--gold)]/6 via-[var(--primary)]/2 to-transparent blur-[120px] pointer-events-none" />

// //             <div className="max-w-7xl mx-auto">

// //                 <div className="mb-6 md:mb-10 text-center">
// //                     <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3">
// //                         Trusted Marketplace
// //                     </span>
// //                     <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
// //                         Find Trusted Material Suppliers
// //                     </h2>
// //                     <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-[var(--text)] opacity-90 font-[var(--font-body)]">
// //                         Connect with verified suppliers for quality construction and interior materials.
// //                     </p>
// //                 </div>

// //                 {/* ---- LOCATION SEARCH BAR ---- */}
// //                 <div ref={searchBoxRef} className="relative max-w-md mx-auto mb-10 md:mb-14">
// //                     <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 gap-2 shadow-[var(--shadow-sm)]">
// //                         <Search size={16} className="text-[var(--muted)] shrink-0" />
// //                         <input
// //                             value={searchInput}
// //                             onChange={(e) => handleSearchInput(e.target.value)}
// //                             onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
// //                             placeholder="Search area, street, or locality..."
// //                             className="flex-1 outline-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] font-[var(--font-body)]"
// //                         />
// //                         {isSearchingLocations && <Loader2 size={14} className="animate-spin text-[var(--muted)] shrink-0" />}
// //                         {(searchInput || coords) && !isSearchingLocations && (
// //                             <button onClick={clearLocation} aria-label="Clear location" className="shrink-0">
// //                                 <X size={14} className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors" />
// //                             </button>
// //                         )}
// //                     </div>

// //                     {showSuggestions && suggestions.length > 0 && (
// //                         <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 max-h-60 overflow-y-auto shadow-[var(--shadow-lg)]">
// //                             {suggestions.map((s, i) => (
// //                                 <li
// //                                     key={i}
// //                                     onClick={() => selectSuggestion(s)}
// //                                     className="flex items-start gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] last:border-b-0"
// //                                 >
// //                                     <MapPin size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
// //                                     <span className="text-[var(--text)] font-[var(--font-body)] leading-snug">{s.displayName}</span>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     )}

// //                     <div className="mt-2 flex items-center justify-center gap-1.5 min-h-[16px]">
// //                         {locationStatus === "locating" && (
// //                             <p className="text-xs text-[var(--muted)] flex items-center gap-1 font-[var(--font-body)]">
// //                                 <Loader2 size={11} className="animate-spin" /> Detecting your location...
// //                             </p>
// //                         )}
// //                         {coords && locationLabel && locationStatus === "granted" && (
// //                             <p className="text-xs text-[var(--gold)] flex items-center gap-1 font-[var(--font-body)]">
// //                                 <MapPin size={11} /> Showing suppliers near: {locationLabel}
// //                             </p>
// //                         )}
// //                         {locationStatus === "denied" && !coords && (
// //                             <p className="text-xs text-[var(--muted)] font-[var(--font-body)]">
// //                                 Location unavailable — showing all suppliers. Search above to filter by area.
// //                             </p>
// //                         )}
// //                     </div>
// //                 </div>

// //                 {!allProducts.length ? (
// //                     <p className="text-center text-sm text-[var(--muted)] font-[var(--font-body)]">
// //                         No products found.
// //                     </p>
// //                 ) : (
// //                     <>
// //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
// //                             {allProducts.map((product) => {
// //                                 const isLiked = !!likes[product.id]
// //                                 const isSaved = !!saves[product.id]
// //                                 const supplier = getSupplier(product.supplierId)
// //                                 const contact = getContact(product.supplierId)
// //                                 const pricing = getPricing(product)

// //                                 const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean)
// //                                 const finalImages = images.length ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]
// //                                 const currentImg = imgIndex[product.id] || 0

// //                                 return (
// //                                     <motion.div
// //                                         key={product.id}
// //                                         initial={{ opacity: 0, y: 40 }}
// //                                         whileInView={{ opacity: 1, y: 0 }}
// //                                         viewport={{ once: true, margin: "-50px" }}
// //                                         transition={{ duration: 0.5 }}
// //                                         onClick={() => openProduct(product.id)}
// //                                         className="group relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
// //                                     >
// //                                         <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
// //                                             {finalImages.map((src, i) => (
// //                                                 <img
// //                                                     key={i}
// //                                                     src={src}
// //                                                     alt={`${product.productName} ${i + 1}`}
// //                                                     loading="lazy"
// //                                                     className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === currentImg ? "opacity-100" : "opacity-0 pointer-events-none"}`}
// //                                                 />
// //                                             ))}

// //                                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 pointer-events-none" />

// //                                             {finalImages.length > 1 && (
// //                                                 <>
// //                                                     <button
// //                                                         onClick={(e) => goToImage(e, product.id, -1, finalImages.length)}
// //                                                         className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
// //                                                         aria-label="Previous image"
// //                                                     >
// //                                                         <ChevronLeft size={16} />
// //                                                     </button>
// //                                                     <button
// //                                                         onClick={(e) => goToImage(e, product.id, 1, finalImages.length)}
// //                                                         className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
// //                                                         aria-label="Next image"
// //                                                     >
// //                                                         <ChevronRight size={16} />
// //                                                     </button>
// //                                                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
// //                                                         {finalImages.map((_, i) => (
// //                                                             <span
// //                                                                 key={i}
// //                                                                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? "w-4 bg-[var(--gold)]" : "w-1.5 bg-white/50"}`}
// //                                                             />
// //                                                         ))}
// //                                                     </div>
// //                                                 </>
// //                                             )}
// //                                         </div>

// //                                         <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
// //                                         <div className="absolute top-0 left-0 w-[2px] h-8 bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

// //                                         <div className="relative z-20 p-5 flex flex-col items-start flex-1">
// //                                             <h3 className="text-lg sm:text-xl font-bold text-[var(--heading)] leading-snug mb-1 group-hover:text-[var(--gold)] transition-colors duration-300 font-[var(--font-heading)]">
// //                                                 {product.productName}
// //                                             </h3>

// //                                             <div className="flex items-center gap-1.5 mb-1">
// //                                                 <User size={12} className="text-[var(--muted)]" />
// //                                                 <span className="text-xs text-[var(--text)] font-light">{supplier?.name || "Supplier"}</span>
// //                                             </div>

// //                                             {supplier?.city && (
// //                                                 <div className="flex items-center gap-1.5 mb-3">
// //                                                     <MapPin size={12} className="text-[var(--muted)]" />
// //                                                     <span className="text-xs text-[var(--text)] font-light">{supplier.city}, {supplier.state}</span>
// //                                                 </div>
// //                                             )}

// //                                             <div className="grid grid-cols-3 gap-4 w-full border-t border-[var(--border)] pt-4 mt-1">
// //                                                 <div className="flex flex-col min-w-0">
// //                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
// //                                                         Price
// //                                                     </span>
// //                                                     <span className="text-xs text-[var(--text)] font-bold">
// //                                                         ₹{pricing.original.toLocaleString("en-IN")}
// //                                                     </span>
// //                                                     {pricing.hasDiscount && (
// //                                                         <span className="text-[10px] text-[var(--gold)] font-medium truncate">
// //                                                             Offer: ₹{pricing.discount.toLocaleString("en-IN")}
// //                                                         </span>
// //                                                     )}
// //                                                 </div>

// //                                                 <div className="flex flex-col min-w-0">
// //                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
// //                                                         Stock
// //                                                     </span>
// //                                                     <span className="text-xs text-[var(--text)] font-medium">
// //                                                         {product.stock} units
// //                                                     </span>
// //                                                 </div>
// //                                             </div>

// //                                             <div className="flex items-center justify-between w-full border-t border-[var(--border)] pt-3 mt-3">
// //                                                 <span className="text-[11px] text-[var(--muted)] font-[var(--font-body)]">
// //                                                     {contact?.shopName || "View supplier"}
// //                                                 </span>
// //                                                 <span className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] font-bold border-b border-[var(--gold)]/40 pb-0.5 group-hover:text-[var(--heading)] group-hover:border-[var(--heading)] transition-colors duration-300">
// //                                                     View Details
// //                                                     <ArrowRight size={12} />
// //                                                 </span>
// //                                             </div>
// //                                         </div>
// //                                     </motion.div>
// //                                 )
// //                             })}
// //                         </div>

// //                         {hasMore && (
// //                             <div className="flex justify-center mt-10">
// //                                 <button
// //                                     onClick={loadMore}
// //                                     disabled={isFetching}
// //                                     className="flex items-center gap-2 px-8 py-3 border border-[var(--gold)]/50 text-[var(--gold)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
// //                                 >
// //                                     {isFetching ? (
// //                                         <>
// //                                             <Loader2 size={14} className="animate-spin" />
// //                                             Loading...
// //                                         </>
// //                                     ) : (
// //                                         "Load More Products"
// //                                     )}
// //                                 </button>
// //                             </div>
// //                         )}
// //                     </>
// //                 )}
// //             </div>
// //         </section>
// //     )
// // }



// import { useState, useEffect, useRef, useCallback } from "react"
// import { useNavigate } from "react-router-dom"
// import { MapPin, User, ChevronLeft, ChevronRight, ArrowRight, Loader2, Search, X } from "lucide-react"
// import { motion } from "framer-motion"
// import { useGetPublicProductsQuery, useLazySearchLocationsQuery } from "./supplyproductsapislice"
// import "../theme.css"

// const MIN_QUERY_LENGTH = 2
// const DEBOUNCE_MS = 350

// export default function FeaturedProducts() {
//     const navigate = useNavigate()

//     const [page, setPage] = useState(1)
//     const [imgIndex, setImgIndex] = useState({})
//     const [allProducts, setAllProducts] = useState([])
//     const [allSuppliers, setAllSuppliers] = useState([])
//     const [allContacts, setAllContacts] = useState([])

//     // ---- LOCATION STATE ----
//     const [coords, setCoords] = useState(null)
//     const [locationLabel, setLocationLabel] = useState("")
//     const [locationStatus, setLocationStatus] = useState("idle") // idle | locating | granted | denied
//     const [searchInput, setSearchInput] = useState("")
//     const [suggestions, setSuggestions] = useState([])
//     const [showSuggestions, setShowSuggestions] = useState(false)
//     const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
//     const [searchedNoResults, setSearchedNoResults] = useState(false)
//     const [selectedState, setSelectedState] = useState(null)
//     const debounceRef = useRef(null)
//     const searchBoxRef = useRef(null)
//     const requestSeqRef = useRef(0) // guards against out-of-order responses

//     const [triggerSearch, { isFetching: isSearchingLocations }] = useLazySearchLocationsQuery()

//     const LIMIT = 12

//     // Query only fires once we know whether we have a location or not (granted/denied).
//     // Stops the old race: products loading once with no coords, then again with coords,
//     // and the two result sets merging together in allProducts.
//     const locationResolved = locationStatus === "granted" || locationStatus === "denied"

//     const resetProductAccumulation = () => {
//         setAllProducts([])
//         setAllSuppliers([])
//         setAllContacts([])
//         setPage(1)
//     }

//     // ---- Geolocation on mount ----
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setLocationStatus("denied")
//             return
//         }
//         setLocationStatus("locating")
//         navigator.geolocation.getCurrentPosition(
//             (pos) => {
//                 resetProductAccumulation()
//                 setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
//                 setLocationLabel("Near you")
//                 setLocationStatus("granted")
//             },
//             (err) => {
//                 console.warn("Geolocation unavailable:", err.message)
//                 setLocationStatus("denied")
//             },
//             { enableHighAccuracy: true, timeout: 8000 }
//         )
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     // ---- Close suggestions on outside click ----
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
//                 setShowSuggestions(false)
//                 setActiveSuggestionIndex(-1)
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside)
//         return () => document.removeEventListener("mousedown", handleClickOutside)
//     }, [])

//     // ---- Clean up any pending debounce on unmount ----
//     useEffect(() => {
//         return () => {
//             if (debounceRef.current) clearTimeout(debounceRef.current)
//         }
//     }, [])

//     // ---- Debounced, real-time location search ----
//     const handleSearchInput = useCallback((value) => {
//         setSearchInput(value)
//         setActiveSuggestionIndex(-1)
//         if (debounceRef.current) clearTimeout(debounceRef.current)

//         const trimmed = value.trim()

//         if (trimmed.length < MIN_QUERY_LENGTH) {
//             setSuggestions([])
//             setShowSuggestions(false)
//             setSearchedNoResults(false)
//             return
//         }

//         const thisRequestId = ++requestSeqRef.current

//         debounceRef.current = setTimeout(async () => {
//             const res = await triggerSearch(trimmed)

//             if (thisRequestId !== requestSeqRef.current) return

//             const results = res?.data?.data || []
//             setSuggestions(results)
//             setShowSuggestions(true)
//             setSearchedNoResults(results.length === 0)

//             // NEW: auto-select the top match and trigger product fetch
//             if (results.length > 0) {
//                 const top = results[0]
//                 setCoords({ lat: top.lat, lng: top.lng })
//                 setLocationLabel(top.displayName)
//                 setLocationStatus("granted")
//                 resetProductAccumulation()
//             }
//         }, DEBOUNCE_MS)
//     }, [triggerSearch])

//     const selectSuggestion = (s) => {
//         setLocationLabel(s.displayName)
//         setSearchInput(s.displayName)
//         setShowSuggestions(false)
//         setActiveSuggestionIndex(-1)
//         setLocationStatus("granted")

//         if (s.isStateLevel && s.state) {
//             // state-only match → exact state filter, not radius
//             setCoords(null)
//             setSelectedState(s.state)   // new state var, add via useState
//         } else {
//             setSelectedState(null)
//             setCoords({ lat: s.lat, lng: s.lng })
//         }
//         resetProductAccumulation()
//     }

//     const clearLocation = () => {
//         setCoords(null)
//         setSelectedState(null)
//         setLocationLabel("")
//         setSearchInput("")
//         setSuggestions([])
//         setShowSuggestions(false)
//         setActiveSuggestionIndex(-1)
//         setSearchedNoResults(false)
//         setLocationStatus("denied")
//         resetProductAccumulation()
//     }

//     // ---- Keyboard navigation for suggestions (real-time UX like production apps) ----
//     const handleSearchKeyDown = (e) => {
//         if (!showSuggestions || suggestions.length === 0) return

//         if (e.key === "ArrowDown") {
//             e.preventDefault()
//             setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length)
//         } else if (e.key === "ArrowUp") {
//             e.preventDefault()
//             setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
//         } else if (e.key === "Enter") {
//             e.preventDefault()
//             if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
//                 selectSuggestion(suggestions[activeSuggestionIndex])
//             }
//         } else if (e.key === "Escape") {
//             setShowSuggestions(false)
//             setActiveSuggestionIndex(-1)
//         }
//     }

//     // ---- PRODUCTS QUERY BODY (sent as JSON payload) ----
//     const queryBody = {
//         page,
//         limit: LIMIT,
//         ...(coords && { lat: coords.lat, lng: coords.lng, radiusKm: 50 }),
//         ...(selectedState && { state: selectedState }),
//     }

//     const { data: res, isLoading, isFetching, error } = useGetPublicProductsQuery(queryBody, {
//         skip: !locationResolved,
//     })

//     // ---- Merge new page results — MUST be in useEffect, not render body ----
//     useEffect(() => {
//         if (!res?.data) return
//         if (res.data.page !== page) return

//         const incoming = res.data.products || []

//         setAllProducts((prev) => {
//             const ids = new Set(prev.map((p) => p.id))
//             const fresh = incoming.filter((p) => !ids.has(p.id))
//             return fresh.length ? [...prev, ...fresh] : prev
//         })

//         setAllSuppliers((prev) => {
//             const ids = new Set(prev.map((s) => s.id))
//             const fresh = (res.data.suppliers || []).filter((s) => !ids.has(s.id))
//             return fresh.length ? [...prev, ...fresh] : prev
//         })

//         setAllContacts((prev) => {
//             const ids = new Set(prev.map((c) => c.id))
//             const fresh = (res.data.contactDetails || []).filter((c) => !ids.has(c.id))
//             return fresh.length ? [...prev, ...fresh] : prev
//         })
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [res, page])

//     const totalPages = res?.data?.totalPages || 1
//     const hasMore = page < totalPages

//     const getSupplier = (supplierId) => allSuppliers.find((s) => s.id === supplierId)
//     const getContact = (supplierId) => allContacts.find((c) => c.supplierId === supplierId)

//     const goToImage = (e, id, dir, totalImages) => {
//         e.preventDefault()
//         e.stopPropagation()
//         setImgIndex((prev) => {
//             const current = prev[id] || 0
//             const next = (current + dir + totalImages) % totalImages
//             return { ...prev, [id]: next }
//         })
//     }

//     const openProduct = (productId) => {
//         navigate(`/products/${productId}`)
//     }

//     const loadMore = () => {
//         if (hasMore && !isFetching) setPage((p) => p + 1)
//     }

//     const getPricing = (product) => {
//         const original = Number(product.price)
//         const discount = product.discountPrice != null ? Number(product.discountPrice) : null
//         const hasDiscount = discount != null && discount > 0 && discount < original
//         return { original, discount, hasDiscount }
//     }

//     if ((isLoading || !locationResolved) && page === 1) {
//         return (
//             <section className="py-24 md:py-36 text-center">
//                 <Loader2 className="mx-auto mb-3 animate-spin text-[var(--gold)]" size={28} />
//                 <p className="text-[var(--muted)] font-[var(--font-body)]">
//                     {locationResolved ? "Loading products..." : "Detecting your location..."}
//                 </p>
//             </section>
//         )
//     }

//     if (error && page === 1) {
//         return (
//             <section className="py-24 md:py-36 text-center">
//                 <p className="text-[var(--danger)] font-[var(--font-body)]">Failed to load products.</p>
//             </section>
//         )
//     }

//     return (
//         <section id="products" className="relative py-4 md:py-4 bg-[var(--background-secondary)] overflow-hidden px-4 sm:px-6 md:px-8">

//             <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--gold)]/6 via-[var(--primary)]/2 to-transparent blur-[120px] pointer-events-none" />

//             <div className="max-w-7xl mx-auto">

//                 <div className="mb-6 md:mb-10 text-center">
//                     <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3">
//                         Trusted Marketplace
//                     </span>
//                     <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
//                         Find Trusted Material Suppliers
//                     </h2>
//                     <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-[var(--text)] opacity-90 font-[var(--font-body)]">
//                         Connect with verified suppliers for quality construction and interior materials.
//                     </p>
//                 </div>

//                 {/* ---- LOCATION SEARCH BAR (real-time autocomplete) ---- */}
//                 <div ref={searchBoxRef} className="relative max-w-md mx-auto mb-10 md:mb-14">
//                     <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 gap-2 shadow-[var(--shadow-sm)]">
//                         <Search size={16} className="text-[var(--muted)] shrink-0" />
//                         <input
//                             value={searchInput}
//                             onChange={(e) => handleSearchInput(e.target.value)}
//                             onKeyDown={handleSearchKeyDown}
//                             onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
//                             placeholder="Search area, street, or locality..."
//                             className="flex-1 outline-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] font-[var(--font-body)]"
//                             aria-autocomplete="list"
//                             aria-expanded={showSuggestions}
//                         />
//                         {isSearchingLocations && <Loader2 size={14} className="animate-spin text-[var(--muted)] shrink-0" />}
//                         {(searchInput || coords) && !isSearchingLocations && (
//                             <button onClick={clearLocation} aria-label="Clear location" className="shrink-0">
//                                 <X size={14} className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors" />
//                             </button>
//                         )}
//                     </div>

//                     {showSuggestions && suggestions.length > 0 && (
//                         <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 max-h-60 overflow-y-auto shadow-[var(--shadow-lg)]">
//                             {suggestions.map((s, i) => (
//                                 <li
//                                     key={`${s.lat}-${s.lng}-${i}`}
//                                     onClick={() => selectSuggestion(s)}
//                                     onMouseEnter={() => setActiveSuggestionIndex(i)}
//                                     className={`flex items-start gap-2 px-3 py-2.5 text-sm cursor-pointer transition-colors border-b border-[var(--border)] last:border-b-0 ${i === activeSuggestionIndex ? "bg-[var(--background-secondary)]" : "hover:bg-[var(--background-secondary)]"
//                                         }`}
//                                 >
//                                     <MapPin size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
//                                     <span className="text-[var(--text)] font-[var(--font-body)] leading-snug">{s.displayName}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}

//                     {showSuggestions && suggestions.length === 0 && searchedNoResults && !isSearchingLocations && (
//                         <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 shadow-[var(--shadow-lg)]">
//                             <li className="px-3 py-2.5 text-sm text-[var(--muted)] font-[var(--font-body)]">
//                                 No locations found for "{searchInput}"
//                             </li>
//                         </ul>
//                     )}

//                     <div className="mt-2 flex items-center justify-center gap-1.5 min-h-[16px]">
//                         {locationStatus === "locating" && (
//                             <p className="text-xs text-[var(--muted)] flex items-center gap-1 font-[var(--font-body)]">
//                                 <Loader2 size={11} className="animate-spin" /> Detecting your location...
//                             </p>
//                         )}
//                         {coords && locationLabel && locationStatus === "granted" && (
//                             <p className="text-xs text-[var(--gold)] flex items-center gap-1 font-[var(--font-body)]">
//                                 <MapPin size={11} /> Showing suppliers near: {locationLabel}
//                             </p>
//                         )}
//                         {locationStatus === "denied" && !coords && (
//                             <p className="text-xs text-[var(--muted)] font-[var(--font-body)]">
//                                 Location unavailable — showing all suppliers. Search above to filter by area.
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 {!allProducts.length ? (
//                     <p className="text-center text-sm text-[var(--muted)] font-[var(--font-body)]">
//                         No products found.
//                     </p>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//                             {allProducts.map((product) => {
//                                 const supplier = getSupplier(product.supplierId)
//                                 const contact = getContact(product.supplierId)
//                                 const pricing = getPricing(product)

//                                 const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean)
//                                 const finalImages = images.length ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]
//                                 const currentImg = imgIndex[product.id] || 0

//                                 return (
//                                     <motion.div
//                                         key={product.id}
//                                         initial={{ opacity: 0, y: 40 }}
//                                         whileInView={{ opacity: 1, y: 0 }}
//                                         viewport={{ once: true, margin: "-50px" }}
//                                         transition={{ duration: 0.5 }}
//                                         onClick={() => openProduct(product.id)}
//                                         className="group relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
//                                     >
//                                         <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
//                                             {finalImages.map((src, i) => (
//                                                 <img
//                                                     key={i}
//                                                     src={src}
//                                                     alt={`${product.productName} ${i + 1}`}
//                                                     loading="lazy"
//                                                     className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === currentImg ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//                                                 />
//                                             ))}

//                                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 pointer-events-none" />

//                                             {finalImages.length > 1 && (
//                                                 <>
//                                                     <button
//                                                         onClick={(e) => goToImage(e, product.id, -1, finalImages.length)}
//                                                         className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
//                                                         aria-label="Previous image"
//                                                     >
//                                                         <ChevronLeft size={16} />
//                                                     </button>
//                                                     <button
//                                                         onClick={(e) => goToImage(e, product.id, 1, finalImages.length)}
//                                                         className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
//                                                         aria-label="Next image"
//                                                     >
//                                                         <ChevronRight size={16} />
//                                                     </button>
//                                                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
//                                                         {finalImages.map((_, i) => (
//                                                             <span
//                                                                 key={i}
//                                                                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? "w-4 bg-[var(--gold)]" : "w-1.5 bg-white/50"}`}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </div>

//                                         <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                                         <div className="absolute top-0 left-0 w-[2px] h-8 bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                                         <div className="relative z-20 p-5 flex flex-col items-start flex-1">
//                                             <h3 className="text-lg sm:text-xl font-bold text-[var(--heading)] leading-snug mb-1 group-hover:text-[var(--gold)] transition-colors duration-300 font-[var(--font-heading)]">
//                                                 {product.productName}
//                                             </h3>

//                                             <div className="flex items-center gap-1.5 mb-1">
//                                                 <User size={12} className="text-[var(--muted)]" />
//                                                 <span className="text-xs text-[var(--text)] font-light">{supplier?.name || "Supplier"}</span>
//                                             </div>

//                                             {supplier?.city && (
//                                                 <div className="flex items-center gap-1.5 mb-3">
//                                                     <MapPin size={12} className="text-[var(--muted)]" />
//                                                     <span className="text-xs text-[var(--text)] font-light">
//                                                         {supplier.city}, {supplier.state}
//                                                         {supplier.distanceKm != null && ` · ${supplier.distanceKm} km away`}
//                                                     </span>
//                                                 </div>
//                                             )}

//                                             <div className="grid grid-cols-3 gap-4 w-full border-t border-[var(--border)] pt-4 mt-1">
//                                                 <div className="flex flex-col min-w-0">
//                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
//                                                         Price
//                                                     </span>
//                                                     <span className="text-xs text-[var(--text)] font-bold">
//                                                         ₹{pricing.original.toLocaleString("en-IN")}
//                                                     </span>
//                                                     {pricing.hasDiscount && (
//                                                         <span className="text-[10px] text-[var(--gold)] font-medium truncate">
//                                                             Offer: ₹{pricing.discount.toLocaleString("en-IN")}
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 <div className="flex flex-col min-w-0">
//                                                     <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
//                                                         Stock
//                                                     </span>
//                                                     <span className="text-xs text-[var(--text)] font-medium">
//                                                         {product.stock} units
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-center justify-between w-full border-t border-[var(--border)] pt-3 mt-3">
//                                                 <span className="text-[11px] text-[var(--muted)] font-[var(--font-body)]">
//                                                     {contact?.shopName || "View supplier"}
//                                                 </span>
//                                                 <span className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] font-bold border-b border-[var(--gold)]/40 pb-0.5 group-hover:text-[var(--heading)] group-hover:border-[var(--heading)] transition-colors duration-300">
//                                                     View Details
//                                                     <ArrowRight size={12} />
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 )
//                             })}
//                         </div>

//                         {hasMore && (
//                             <div className="flex justify-center mt-10">
//                                 <button
//                                     onClick={loadMore}
//                                     disabled={isFetching}
//                                     className="flex items-center gap-2 px-8 py-3 border border-[var(--gold)]/50 text-[var(--gold)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {isFetching ? (
//                                         <>
//                                             <Loader2 size={14} className="animate-spin" />
//                                             Loading...
//                                         </>
//                                     ) : (
//                                         "Load More Products"
//                                     )}
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </section>
//     )
// }



import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, User, ChevronLeft, ChevronRight, ArrowRight, Loader2, Search, X } from "lucide-react"
import { motion } from "framer-motion"
import { useGetPublicProductsQuery, useLazySearchLocationsQuery } from "./supplyproductsapislice"
import "../theme.css"

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 350

export default function FeaturedProducts() {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [imgIndex, setImgIndex] = useState({})
    const [allProducts, setAllProducts] = useState([])
    const [allSuppliers, setAllSuppliers] = useState([])
    const [allContacts, setAllContacts] = useState([])

    // ---- LOCATION STATE ----
    // locationQuery is the plain text sent to the backend and matched against
    // ContactDetails (state/city/address/mapAddress/pincode) via `contains`.
    // No lat/lng, no geocoding round-trip needed for filtering — geocode is
    // only used to power the autocomplete dropdown suggestions below.
    const [locationQuery, setLocationQuery] = useState("")
    const [locationLabel, setLocationLabel] = useState("")
    const [locationStatus, setLocationStatus] = useState("idle") // idle | locating | granted | denied
    const [searchInput, setSearchInput] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
    const [searchedNoResults, setSearchedNoResults] = useState(false)

    const debounceRef = useRef(null)
    const searchBoxRef = useRef(null)
    const requestSeqRef = useRef(0) // guards against out-of-order responses

    const [triggerSearch, { isFetching: isSearchingLocations }] = useLazySearchLocationsQuery()

    const LIMIT = 12

    // Query only fires once we know whether we have a location or not (granted/denied).
    const locationResolved = locationStatus === "granted" || locationStatus === "denied"

    const resetProductAccumulation = () => {
        setAllProducts([])
        setAllSuppliers([])
        setAllContacts([])
        setPage(1)
    }

    // ---- On mount: no browser geolocation needed for filtering anymore since
    // we filter by typed text, not coordinates. We just mark location as
    // "denied" (i.e. resolved / no filter) so the initial products query fires
    // right away showing everything, and the user can narrow down by typing.
    useEffect(() => {
        setLocationStatus("denied")
    }, [])

    // ---- Close suggestions on outside click ----
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setShowSuggestions(false)
                setActiveSuggestionIndex(-1)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // ---- Clean up any pending debounce on unmount ----
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    // ---- Debounced, real-time location search (autocomplete suggestions only) ----
    const handleSearchInput = useCallback((value) => {
        setSearchInput(value)
        setActiveSuggestionIndex(-1)
        if (debounceRef.current) clearTimeout(debounceRef.current)

        const trimmed = value.trim()

        if (trimmed.length < MIN_QUERY_LENGTH) {
            setSuggestions([])
            setShowSuggestions(false)
            setSearchedNoResults(false)
            return
        }

        const thisRequestId = ++requestSeqRef.current

        debounceRef.current = setTimeout(async () => {
            const res = await triggerSearch(trimmed)

            // Ignore stale responses — a newer keystroke has already fired a new request
            if (thisRequestId !== requestSeqRef.current) return

            const results = res?.data?.data || []
            setSuggestions(results)
            setShowSuggestions(true)
            setSearchedNoResults(results.length === 0)
        }, DEBOUNCE_MS)
    }, [triggerSearch])

    // Picking a suggestion from the dropdown: just take its displayName text
    // and send THAT as locationQuery. Backend does a plain `contains` match
    // against supplier location fields — no coordinates involved.
    const selectSuggestion = (s) => {
        setLocationLabel(s.displayName)
        setSearchInput(s.displayName)
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        setLocationStatus("granted")
        setLocationQuery(s.displayName)
        resetProductAccumulation()
    }

    const clearLocation = () => {
        setLocationQuery("")
        setLocationLabel("")
        setSearchInput("")
        setSuggestions([])
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        setSearchedNoResults(false)
        setLocationStatus("denied") // denied = "resolved, no location filter" so query still fires
        resetProductAccumulation()
    }

    // ---- Keyboard navigation for suggestions ----
    const handleSearchKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                selectSuggestion(suggestions[activeSuggestionIndex])
            } else if (searchInput.trim().length >= MIN_QUERY_LENGTH) {
                // No suggestion highlighted — just search with whatever text is typed
                setLocationLabel(searchInput.trim())
                setLocationQuery(searchInput.trim())
                setLocationStatus("granted")
                setShowSuggestions(false)
                setActiveSuggestionIndex(-1)
                resetProductAccumulation()
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false)
            setActiveSuggestionIndex(-1)
        }
    }

    // ---- PRODUCTS QUERY BODY (sent as JSON payload) ----
    const queryBody = {
        page,
        limit: LIMIT,
        ...(locationQuery && { locationQuery }),
    }

    const { data: res, isLoading, isFetching, error } = useGetPublicProductsQuery(queryBody, {
        skip: !locationResolved,
    })

    // ---- Merge new page results — MUST be in useEffect, not render body ----
    useEffect(() => {
        if (!res?.data) return
        if (res.data.page !== page) return

        const incoming = res.data.products || []

        setAllProducts((prev) => {
            const ids = new Set(prev.map((p) => p.id))
            const fresh = incoming.filter((p) => !ids.has(p.id))
            return fresh.length ? [...prev, ...fresh] : prev
        })

        setAllSuppliers((prev) => {
            const ids = new Set(prev.map((s) => s.id))
            const fresh = (res.data.suppliers || []).filter((s) => !ids.has(s.id))
            return fresh.length ? [...prev, ...fresh] : prev
        })

        setAllContacts((prev) => {
            const ids = new Set(prev.map((c) => c.id))
            const fresh = (res.data.contactDetails || []).filter((c) => !ids.has(c.id))
            return fresh.length ? [...prev, ...fresh] : prev
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [res, page])

    const totalPages = res?.data?.totalPages || 1
    const hasMore = page < totalPages

    const getSupplier = (supplierId) => allSuppliers.find((s) => s.id === supplierId)
    const getContact = (supplierId) => allContacts.find((c) => c.supplierId === supplierId)

    const goToImage = (e, id, dir, totalImages) => {
        e.preventDefault()
        e.stopPropagation()
        setImgIndex((prev) => {
            const current = prev[id] || 0
            const next = (current + dir + totalImages) % totalImages
            return { ...prev, [id]: next }
        })
    }

    const openProduct = (productId) => {
        navigate(`/products/${productId}`)
    }

    const loadMore = () => {
        if (hasMore && !isFetching) setPage((p) => p + 1)
    }

    const getPricing = (product) => {
        const original = Number(product.price)
        const discount = product.discountPrice != null ? Number(product.discountPrice) : null
        const hasDiscount = discount != null && discount > 0 && discount < original
        return { original, discount, hasDiscount }
    }

    if ((isLoading || !locationResolved) && page === 1) {
        return (
            <section className="py-24 md:py-36 text-center">
                <Loader2 className="mx-auto mb-3 animate-spin text-[var(--gold)]" size={28} />
                <p className="text-[var(--muted)] font-[var(--font-body)]">
                    Loading products...
                </p>
            </section>
        )
    }

    if (error && page === 1) {
        return (
            <section className="py-24 md:py-36 text-center">
                <p className="text-[var(--danger)] font-[var(--font-body)]">Failed to load products.</p>
            </section>
        )
    }

    return (
        <section id="products" className="relative py-4 md:py-4 bg-[var(--background-secondary)] overflow-hidden px-4 sm:px-6 md:px-8">

            <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--gold)]/6 via-[var(--primary)]/2 to-transparent blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">

                <div className="mb-6 md:mb-10 text-center">
                    <span className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3">
                        Trusted Marketplace
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--heading)] leading-tight font-[var(--font-heading)]">
                        Find Trusted Material Suppliers
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-[var(--text)] opacity-90 font-[var(--font-body)]">
                        Connect with verified suppliers for quality construction and interior materials.
                    </p>
                </div>

                {/* ---- LOCATION SEARCH BAR (real-time autocomplete, plain text match) ---- */}
                <div ref={searchBoxRef} className="relative max-w-md mx-auto mb-10 md:mb-14">
                    <div className="flex items-center border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 gap-2 shadow-[var(--shadow-sm)]">
                        <Search size={16} className="text-[var(--muted)] shrink-0" />
                        <input
                            value={searchInput}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            placeholder="Search state, city, area, or pincode..."
                            className="flex-1 outline-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] font-[var(--font-body)]"
                            aria-autocomplete="list"
                            aria-expanded={showSuggestions}
                        />
                        {isSearchingLocations && <Loader2 size={14} className="animate-spin text-[var(--muted)] shrink-0" />}
                        {(searchInput || locationQuery) && !isSearchingLocations && (
                            <button onClick={clearLocation} aria-label="Clear location" className="shrink-0">
                                <X size={14} className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors" />
                            </button>
                        )}
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 max-h-60 overflow-y-auto shadow-[var(--shadow-lg)]">
                            {suggestions.map((s, i) => (
                                <li
                                    key={`${s.displayName}-${i}`}
                                    onClick={() => selectSuggestion(s)}
                                    onMouseEnter={() => setActiveSuggestionIndex(i)}
                                    className={`flex items-start gap-2 px-3 py-2.5 text-sm cursor-pointer transition-colors border-b border-[var(--border)] last:border-b-0 ${
                                        i === activeSuggestionIndex ? "bg-[var(--background-secondary)]" : "hover:bg-[var(--background-secondary)]"
                                    }`}
                                >
                                    <MapPin size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                                    <span className="text-[var(--text)] font-[var(--font-body)] leading-snug">{s.displayName}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {showSuggestions && suggestions.length === 0 && searchedNoResults && !isSearchingLocations && (
                        <ul className="absolute z-30 top-full left-0 right-0 bg-[var(--surface)] border border-[var(--border)] mt-1 shadow-[var(--shadow-lg)]">
                            <li className="px-3 py-2.5 text-sm text-[var(--muted)] font-[var(--font-body)]">
                                No locations found for "{searchInput}"
                            </li>
                        </ul>
                    )}

                    <div className="mt-2 flex items-center justify-center gap-1.5 min-h-[16px]">
                        {locationQuery && locationLabel && locationStatus === "granted" && (
                            <p className="text-xs text-[var(--gold)] flex items-center gap-1 font-[var(--font-body)]">
                                <MapPin size={11} /> Showing suppliers matching: {locationLabel}
                            </p>
                        )}
                        {locationStatus === "denied" && !locationQuery && (
                            <p className="text-xs text-[var(--muted)] font-[var(--font-body)]">
                                Showing all suppliers. Search above to filter by area.
                            </p>
                        )}
                    </div>
                </div>

                {!allProducts.length ? (
                    <p className="text-center text-sm text-[var(--muted)] font-[var(--font-body)]">
                        No products found.
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {allProducts.map((product) => {
                                const supplier = getSupplier(product.supplierId)
                                const contact = getContact(product.supplierId)
                                const pricing = getPricing(product)

                                const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean)
                                const finalImages = images.length ? images : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]
                                const currentImg = imgIndex[product.id] || 0

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5 }}
                                        onClick={() => openProduct(product.id)}
                                        className="group relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
                                            {finalImages.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt={`${product.productName} ${i + 1}`}
                                                    loading="lazy"
                                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === currentImg ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                                />
                                            ))}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 pointer-events-none" />

                                            {finalImages.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => goToImage(e, product.id, -1, finalImages.length)}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => goToImage(e, product.id, 1, finalImages.length)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-[#ffffff] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hover:text-[var(--gold)]"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                                        {finalImages.map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? "w-4 bg-[var(--gold)]" : "w-1.5 bg-white/50"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-0 left-0 w-[2px] h-8 bg-[var(--gold)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-20 p-5 flex flex-col items-start flex-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-[var(--heading)] leading-snug mb-1 group-hover:text-[var(--gold)] transition-colors duration-300 font-[var(--font-heading)]">
                                                {product.productName}
                                            </h3>

                                            <div className="flex items-center gap-1.5 mb-1">
                                                <User size={12} className="text-[var(--muted)]" />
                                                <span className="text-xs text-[var(--text)] font-light">{supplier?.name || "Supplier"}</span>
                                            </div>

                                            {supplier?.city && (
                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <MapPin size={12} className="text-[var(--muted)]" />
                                                    <span className="text-xs text-[var(--text)] font-light">
                                                        {supplier.city}, {supplier.state}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-3 gap-4 w-full border-t border-[var(--border)] pt-4 mt-1">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
                                                        Price
                                                    </span>
                                                    <span className="text-xs text-[var(--text)] font-bold">
                                                        ₹{pricing.original.toLocaleString("en-IN")}
                                                    </span>
                                                    {pricing.hasDiscount && (
                                                        <span className="text-[10px] text-[var(--gold)] font-medium truncate">
                                                            Offer: ₹{pricing.discount.toLocaleString("en-IN")}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[9px] text-[var(--muted)] uppercase tracking-wider">
                                                        Stock
                                                    </span>
                                                    <span className="text-xs text-[var(--text)] font-medium">
                                                        {product.stock} units
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between w-full border-t border-[var(--border)] pt-3 mt-3">
                                                <span className="text-[11px] text-[var(--muted)] font-[var(--font-body)]">
                                                    {contact?.shopName || "View supplier"}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] font-bold border-b border-[var(--gold)]/40 pb-0.5 group-hover:text-[var(--heading)] group-hover:border-[var(--heading)] transition-colors duration-300">
                                                    View Details
                                                    <ArrowRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={loadMore}
                                    disabled={isFetching}
                                    className="flex items-center gap-2 px-8 py-3 border border-[var(--gold)]/50 text-[var(--gold)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold)] hover:text-[var(--background)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFetching ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More Products"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

