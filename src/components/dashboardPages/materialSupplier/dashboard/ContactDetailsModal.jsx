import React, { useState, useEffect } from "react"
import { X, MapPin, Loader2 } from "lucide-react"
import {
  useCreateContactDetailsMutation,
  useUpdateContactDetailsMutation,
} from "./materialapislice"

const C = {
  primary: "var(--primary)",
  surface: "var(--surface)",
  heading: "var(--heading)",
  text: "var(--text)",
  muted: "var(--muted)",
  border: "var(--border)",
  danger: "var(--danger)",
}

const emptyForm = {
  shopName: "",
  address: "",
  pincode: "",
  state: "",
  city: "",
  country: "India",
  latitude: "",
  longitude: "",
  mapAddress: "",
  whatsappNumber: "",
  callNumber: "",
  email: "",
}

export default function ContactDetailsModal({ open, onClose, existing }) {
  const [form, setForm] = useState(emptyForm)
  const [locating, setLocating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [createContactDetails, { isLoading: creating }] = useCreateContactDetailsMutation()
  const [updateContactDetails, { isLoading: updating }] = useUpdateContactDetailsMutation()

  const isEdit = Boolean(existing?.id)
  const saving = creating || updating

  useEffect(() => {
    if (existing) {
      setForm({
        shopName: existing.shopName || "",
        address: existing.address || "",
        pincode: existing.pincode || "",
        state: existing.state || "",
        city: existing.city || "",
        country: existing.country || "India",
        latitude: existing.latitude ?? "",
        longitude: existing.longitude ?? "",
        mapAddress: existing.mapAddress || "",
        whatsappNumber: existing.whatsappNumber || "",
        callNumber: existing.callNumber || "",
        email: existing.email || "",
      })
    } else {
      setForm(emptyForm)
    }
    setErrorMsg("")
  }, [existing, open])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        setLocating(false)
      },
      (err) => {
        setErrorMsg("Unable to fetch current location: " + err.message)
        setLocating(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    const required = ["shopName", "address", "pincode", "state", "city", "whatsappNumber", "callNumber", "email"]
    const missing = required.filter((k) => !form[k]?.toString().trim())
    if (missing.length) {
      setErrorMsg(`Please fill: ${missing.join(", ")}`)
      return
    }

    const payload = {
      ...form,
      latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
      longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
    }

    try {
      if (isEdit) {
        await updateContactDetails(payload).unwrap()
      } else {
        await createContactDetails(payload).unwrap()
      }
      onClose()
    } catch (err) {
      setErrorMsg(err?.data?.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,15,15,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h2 className="text-base font-semibold" style={{ color: C.heading, fontFamily: "var(--font-heading)" }}>
            {isEdit ? "Update Contact Details" : "Add Contact Details"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-sm hover:opacity-70">
            <X size={18} style={{ color: C.muted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          {errorMsg && (
            <div className="text-xs px-3 py-2 rounded-sm" style={{ background: "color-mix(in srgb, var(--danger) 10%, transparent)", color: C.danger, fontFamily: "var(--font-body)" }}>
              {errorMsg}
            </div>
          )}

          <Field label="Shop / Business Name" name="shopName" value={form.shopName} onChange={handleChange} />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} textarea />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="State" name="state" value={form.state} onChange={handleChange} />
            <Field label="Country" name="country" value={form.country} onChange={handleChange} />
          </div>

          {/* Map / location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase tracking-wide" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                Location (Lat / Lng)
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-sm"
                style={{ color: C.primary, border: `1px solid ${C.primary}` }}
              >
                {locating ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                Use current location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} noLabel />
              <Field label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} noLabel />
            </div>
            <div className="mt-2">
              <Field label="Map Address (optional label)" name="mapAddress" value={form.mapAddress} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="WhatsApp Number" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} />
            <Field label="Call Number" name="callNumber" value={form.callNumber} onChange={handleChange} />
          </div>

          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-sm font-semibold"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-xs px-4 py-2 rounded-sm font-semibold"
              style={{ background: C.primary, color: C.surface }}
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, type = "text", textarea, noLabel }) {
  return (
    <div>
      {!noLabel && (
        <label className="text-[10px] uppercase tracking-wide block mb-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={2}
          placeholder={noLabel ? label : undefined}
          className="w-full text-sm px-3 py-2 rounded-sm outline-none"
          style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: "var(--font-body)" }}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={noLabel ? label : undefined}
          className="w-full text-sm px-3 py-2 rounded-sm outline-none"
          style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: "var(--font-body)" }}
        />
      )}
    </div>
  )
}