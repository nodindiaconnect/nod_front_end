


// import React, { useState } from "react"
// import { Mail, Phone, MapPin, ShieldCheck, Wallet, Store, Package, CheckCircle2, XCircle, Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
// import {
//   useGetSupplierUserDetailsQuery,
//   useGetContactDetailsQuery,
//   useDeleteContactDetailsMutation,
// } from "./materialapislice"
// import Loader from "../../../../global/Loader"
// import ContactDetailsModal from "./ContactDetailsModal"

// const C = {
//   primary: "var(--primary)",
//   gold: "var(--gold)",
//   background: "var(--background)",
//   surface: "var(--surface)",
//   heading: "var(--heading)",
//   text: "var(--text)",
//   muted: "var(--muted)",
//   border: "var(--border)",
//   danger: "var(--danger)",
// }

// export default function MaterialSupplierDashboard() {
//   const { data: userRes, isLoading, error, refetch } = useGetSupplierUserDetailsQuery()
//   const { data: contactRes, isLoading: contactLoading } = useGetContactDetailsQuery()
//   const [deleteContactDetails, { isLoading: deleting }] = useDeleteContactDetailsMutation()

//   const [modalOpen, setModalOpen] = useState(false)

//   const u = userRes?.data || {}
//   const contact = contactRes?.data || null

//   if (isLoading) {
//     return <Loader />
//   }

//   if (error) {
//     return (
//       <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-8" style={{ background: C.background }}>
//         <p style={{ color: C.danger, fontFamily: "var(--font-body)" }}>Failed to load supplier dashboard.</p>
//         <button
//           onClick={() => refetch()}
//           className="text-xs px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wide"
//           style={{ background: C.primary, color: C.surface, fontFamily: "var(--font-body)" }}
//         >
//           Retry
//         </button>
//       </div>
//     )
//   }

//   const profileRows = [
//     { icon: Mail, label: "Email", value: u.email },
//     { icon: Phone, label: "Phone", value: u.phone ? ` ${u.phone}` : "" },
//     { icon: MapPin, label: "City", value: u.city },
//     { icon: MapPin, label: "State", value: u.state },
//     { icon: ShieldCheck, label: "Country", value: u.country },
//   ]

//   const productStats = [
//     { icon: Package, label: "Total Products", value: u.totalProducts ?? 0, color: C.primary },
//     { icon: CheckCircle2, label: "Active Products", value: u.activeProducts ?? 0, color: "var(--gold)" },
//     { icon: XCircle, label: "Out of Stock", value: u.outOfStockProducts ?? 0, color: C.danger },
//   ]

//   const handleDelete = async () => {
//     if (!window.confirm("Delete your contact details? This cannot be undone.")) return
//     try {
//       await deleteContactDetails().unwrap()
//     } catch (err) {
//       alert(err?.data?.message || "Failed to delete contact details")
//     }
//   }

//   return (
//     <div className="min-h-screen" style={{ background: C.background }}>
//       <div
//         className="rounded-sm w-full overflow-hidden flex flex-col"
//         style={{
//           background: C.surface,
//           border: `1px solid ${C.border}`,
//           boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04), 0 1px 8px rgba(15, 15, 15, 0.03)",
//         }}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
//           <div>
//             <h1 className="text-[15px] sm:text-base leading-tight" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}>
//               User — {u.name?.split(" ")[0] || "there"}
//             </h1>
//             <p className="text-xs mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
//               Manage your product listings and business profile.
//             </p>
//           </div>
//           <div className="flex items-center gap-2.5 shrink-0">
//             <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ background: `color-mix(in srgb, ${C.gold} 12%, transparent)` }}>
//               <Wallet size={13} style={{ color: C.gold }} strokeWidth={2} />
//             </span>
//             <div className="leading-tight text-right hidden sm:block">
//               <div className="text-[10px] uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Wallet balance</div>
//               <div className="text-sm tabular-nums" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 600 }}>
//                 ₹{(Number(u.walletBalance) || 0).toLocaleString("en-IN")}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product stat cards */}
//         <div className="px-4 sm:px-5 pt-5">
//           <div className="flex items-center gap-3 mb-3.5">
//             <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
//               Products
//             </span>
//             <div className="h-px flex-1" style={{ background: C.border }} />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {productStats.map((stat) => (
//               <div
//                 key={stat.label}
//                 className="flex items-center gap-3 p-4 rounded-sm"
//                 style={{ border: `1px solid ${C.border}`, background: C.surface }}
//               >
//                 <span
//                   className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
//                   style={{ background: `color-mix(in srgb, ${stat.color} 12%, transparent)` }}
//                 >
//                   <stat.icon size={18} style={{ color: stat.color }} strokeWidth={2} />
//                 </span>
//                 <div className="leading-tight">
//                   <div className="text-[10px] uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
//                     {stat.label}
//                   </div>
//                   <div className="text-xl tabular-nums" style={{ color: C.heading, fontFamily: "var(--font-heading)", fontWeight: 700 }}>
//                     {stat.value}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Profile details */}
//         <div className="px-4 sm:px-5 py-5">
//           <div className="flex items-center gap-3 mb-3.5">
//             <span className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
//               Profile
//             </span>
//             <div className="h-px flex-1" style={{ background: C.border }} />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {profileRows.map((row) => (
//               <div key={row.label} className="flex items-center gap-3 p-3 rounded-sm" style={{ border: `1px solid ${C.border}` }}>
//                 <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: `color-mix(in srgb, ${C.primary} 12%, transparent)` }}>
//                   <row.icon size={14} style={{ color: C.primary }} strokeWidth={2} />
//                 </span>
//                 <div className="leading-tight">
//                   <div className="text-[10px] uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>{row.label}</div>
//                   <div className="text-sm" style={{ color: C.heading, fontFamily: "var(--font-body)", fontWeight: 500 }}>{row.value || "—"}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Contact Details */}
//         <div
//           className="px-4 sm:px-5 py-5"
//           style={{ borderTop: `1px solid ${C.border}` }}
//         >
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//             <div className="flex items-center gap-3 w-full">
//               <span
//                 className="text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap"
//                 style={{
//                   color: C.muted,
//                   fontFamily: "var(--font-body)",
//                 }}
//               >
//                 Contact Details
//               </span>

//               <div
//                 className="h-px flex-1"
//                 style={{ background: C.border }}
//               />
//             </div>

//             {!contact && !contactLoading && (
//               <button
//                 onClick={() => setModalOpen(true)}
//                 className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-sm font-semibold uppercase tracking-wide"
//                 style={{
//                   background: C.primary,
//                   color: C.surface,
//                   fontFamily: "var(--font-body)",
//                 }}
//               >
//                 <Plus size={14} />
//                 Add Contact Details
//               </button>
//             )}
//           </div>

//           {/* Loading */}
//           {contactLoading ? (
//             <p
//               className="text-sm"
//               style={{
//                 color: C.muted,
//                 fontFamily: "var(--font-body)",
//               }}
//             >
//               Loading contact details...
//             </p>
//           ) : !contact ? (
//             <p
//               className="text-sm"
//               style={{
//                 color: C.muted,
//                 fontFamily: "var(--font-body)",
//               }}
//             >
//               No contact details added yet.
//             </p>
//           ) : (
//             <div
//               className="rounded-sm p-4 sm:p-5"
//               style={{
//                 border: `1px solid ${C.border}`,
//               }}
//             >
//               {/* Shop Info */}
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                 <div className="min-w-0 flex-1">
//                   <h3
//                     className="text-base font-semibold break-words"
//                     style={{
//                       color: C.heading,
//                       fontFamily: "var(--font-heading)",
//                     }}
//                   >
//                     {contact.shopName}
//                   </h3>

//                   <p
//                     className="text-xs sm:text-sm mt-2 break-words"
//                     style={{
//                       color: C.text,
//                       fontFamily: "var(--font-body)",
//                     }}
//                   >
//                     {contact.address}, {contact.city}, {contact.state} -{" "}
//                     {contact.pincode}, {contact.country}
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 self-start sm:self-auto">
//                   <button
//                     onClick={() => setModalOpen(true)}
//                     className="p-2 rounded-sm"
//                     style={{
//                       border: `1px solid ${C.border}`,
//                       color: C.primary,
//                     }}
//                     title="Edit"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={handleDelete}
//                     disabled={deleting}
//                     className="p-2 rounded-sm"
//                     style={{
//                       border: `1px solid ${C.border}`,
//                       color: C.danger,
//                     }}
//                     title="Delete"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-sm"
//                 style={{
//                   fontFamily: "var(--font-body)",
//                 }}
//               >
//                 <div className="break-all">
//                   <span style={{ color: C.muted }}>WhatsApp:</span>
//                   <br />
//                   {contact.whatsappNumber}
//                 </div>

//                 <div className="break-all">
//                   <span style={{ color: C.muted }}>Call:</span>
//                   <br />
//                   {contact.callNumber}
//                 </div>

//                 <div className="break-all">
//                   <span style={{ color: C.muted }}>Email:</span>
//                   <br />
//                   {contact.email}
//                 </div>
//               </div>

//               {/* Map */}
//               {contact.latitude && contact.longitude && (
//                 <div className="mt-5">
//                   <a
//                     href={`https://www.google.com/maps?q=${contact.latitude},${contact.longitude}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 text-sm"
//                     style={{
//                       color: C.primary,
//                       fontFamily: "var(--font-body)",
//                     }}
//                   >
//                     <ExternalLink size={14} />
//                     View on Map
//                   </a>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <ContactDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} existing={contact} />
//     </div>
//   )
// }


import React, { useState } from "react"
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
} from "lucide-react"
import {
  useGetSupplierUserDetailsQuery,
  useGetContactDetailsQuery,
  useDeleteContactDetailsMutation,
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
  const { data: userRes, isLoading, error, refetch } = useGetSupplierUserDetailsQuery()
  const { data: contactRes, isLoading: contactLoading } = useGetContactDetailsQuery()
  const [deleteContactDetails, { isLoading: deleting }] = useDeleteContactDetailsMutation()

  const [modalOpen, setModalOpen] = useState(false)

  const u = userRes?.data || {}
  const contact = contactRes?.data || null

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

      <ContactDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} existing={contact} />
    </div>
  )
}

