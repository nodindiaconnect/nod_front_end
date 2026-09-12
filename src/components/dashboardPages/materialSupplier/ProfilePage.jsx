import { useState, useEffect } from "react";
import {
  useGetSupplierProfileQuery,
  useUpdateSupplierProfileMutation,
} from "./dashboard/materialapislice";
import BankDetailsSection from "../../profile/BankDetailsSection";
import "../../../theme.css";

const inputClass =
  "w-full min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 font-[var(--font-body)] disabled:cursor-not-allowed disabled:opacity-80 disabled:text-[var(--text)]";
const labelClass = "text-xs font-medium text-[var(--muted)]";
const cardClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 sm:p-6";

const emptyForm = {
  name: "",
  phone: "",
  countryCode: "+91",
  country: "India",
  state: "",
  city: "",
  address: "",
  shopName: "",
  pincode: "",
  mapAddress: "",
  whatsappNumber: "",
  callNumber: "",
  businessEmail: "",
};

export default function SupplierProfilePage() {
  const { data: profileRes, isLoading, isError, error: fetchError, refetch } =
    useGetSupplierProfileQuery();
  const [updateProfile, { isLoading: saving }] =
    useUpdateSupplierProfileMutation();

  const [status, setStatus] = useState({ type: "muted", message: "" });
  const [form, setForm] = useState(emptyForm);
  const [savedForm, setSavedForm] = useState(emptyForm);
  const [account, setAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!profileRes) return;
    const data = profileRes.data || profileRes.result || profileRes;
    setAccount({
      name: data.name,
      email: data.email,
      totalProducts: data.totalProducts ?? 0,
    });
    const hydrated = {
      name: data.name || "",
      phone: data.phone || "",
      countryCode: data.countryCode || "+91",
      country: data.country || "India",
      state: data.state || "",
      city: data.city || "",
      address: data.address || "",
      shopName: data.shopName || data.name || "",
      pincode: data.pincode || "",
      mapAddress: data.mapAddress || "",
      whatsappNumber: data.whatsappNumber || data.phone || "",
      callNumber: data.callNumber || data.phone || "",
      businessEmail: data.businessEmail || data.email || "",
    };
    setForm(hydrated);
    setSavedForm(hydrated);
  }, [profileRes]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "muted", message: "" });

    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Name is required." });
      return;
    }
    if (!form.shopName.trim()) {
      setStatus({ type: "error", message: "Business / Shop name is required." });
      return;
    }

    try {
      await updateProfile(form).unwrap();
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      setDirty(false);
      setSavedForm(form);
      setIsEditing(false);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.data?.message || err?.message || "Failed to update profile.",
      });
    }
  };

  const cancelEdit = () => {
    setForm(savedForm);
    setDirty(false);
    setIsEditing(false);
    setStatus({ type: "muted", message: "" });
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-pulse space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="h-6 w-1/3 rounded bg-[var(--background-secondary)]" />
          <div className="h-20 rounded bg-[var(--background-secondary)]" />
          <div className="h-40 rounded bg-[var(--background-secondary)]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-[var(--danger)] bg-[var(--surface)] p-6 text-center shadow-lg">
          <h2 className="text-lg font-bold text-[var(--heading)]">Unable to load profile</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {fetchError?.data?.message || "Please try again in a moment."}
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[var(--gold)] px-4 py-2 text-xs font-semibold uppercase text-black transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[var(--background)] font-[var(--font-body)]">
      <form onSubmit={handleSubmit} className="flex h-full min-0 flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {/* TOP HEADER */}
            <div className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Material Supplier Profile
                </span>
                <h1 className="mt-1 text-2xl font-bold text-[var(--heading)]">
                  {form.shopName || form.name || "Business Profile"}
                </h1>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {account?.email} • {account?.totalProducts || 0} Products in catalog
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (isEditing ? cancelEdit() : setIsEditing(true))}
                  disabled={isEditing && saving}
                  className="rounded-lg border border-[var(--gold)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--gold)] transition hover:bg-[var(--gold)]/10"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* STATUS ALERT */}
            {status.message && (
              <div
                className={`rounded-xl border px-4 py-3 text-xs font-medium ${
                  status.type === "error"
                    ? "border-[var(--danger)] bg-[var(--danger)]/10 text-[var(--danger)]"
                    : "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* BUSINESS DETAILS */}
            <div className={cardClass}>
              <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                Business & Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className={labelClass}>
                    Contact Person Name <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    disabled={!isEditing}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="shopName" className={labelClass}>
                    Shop / Company Name <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    id="shopName"
                    type="text"
                    value={form.shopName}
                    disabled={!isEditing}
                    onChange={(e) => updateField("shopName", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Apex Hardware & Tiles"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="businessEmail" className={labelClass}>
                    Business Email
                  </label>
                  <input
                    id="businessEmail"
                    type="email"
                    value={form.businessEmail}
                    disabled={!isEditing}
                    onChange={(e) => updateField("businessEmail", e.target.value)}
                    className={inputClass}
                    placeholder="sales@apexsupplies.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="whatsappNumber" className={labelClass}>
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsappNumber"
                    type="text"
                    value={form.whatsappNumber}
                    disabled={!isEditing}
                    onChange={(e) => updateField("whatsappNumber", e.target.value)}
                    className={inputClass}
                    placeholder="9876543210"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="callNumber" className={labelClass}>
                    Call / Support Number
                  </label>
                  <input
                    id="callNumber"
                    type="text"
                    value={form.callNumber}
                    disabled={!isEditing}
                    onChange={(e) => updateField("callNumber", e.target.value)}
                    className={inputClass}
                    placeholder="9876543210"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className={labelClass}>
                    Account Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={form.phone}
                    disabled={!isEditing}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* LOCATION & STORE ADDRESS */}
            <div className={cardClass}>
              <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                Store Location & Address
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Store / Warehouse Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    disabled={!isEditing}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={inputClass}
                    placeholder="Shop #12, Building Material Market"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    disabled={!isEditing}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClass}
                    placeholder="Hyderabad"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className={labelClass}>
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={form.state}
                    disabled={!isEditing}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={inputClass}
                    placeholder="Telangana"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pincode" className={labelClass}>
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    value={form.pincode}
                    disabled={!isEditing}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    className={inputClass}
                    placeholder="500081"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    disabled={!isEditing}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={inputClass}
                    placeholder="India"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="mapAddress" className={labelClass}>
                    Map / Landmark Details
                  </label>
                  <input
                    id="mapAddress"
                    type="text"
                    value={form.mapAddress}
                    disabled={!isEditing}
                    onChange={(e) => updateField("mapAddress", e.target.value)}
                    className={inputClass}
                    placeholder="Near City Center Flyover"
                  />
                </div>
              </div>
            </div>

            <BankDetailsSection />
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        {isEditing && (
          <div className="flex w-full shrink-0 justify-center border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 sm:px-8">
            <div className="flex w-full max-w-6xl min-w-0 items-center justify-between">
              <p className="text-xs font-medium text-[var(--muted)]">
                {dirty ? "Unsaved changes" : "No changes made"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase text-[var(--text)] transition hover:opacity-80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--gold)] px-5 py-2 text-xs font-semibold uppercase text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[var(--background)] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 text-2xl text-[var(--gold)]">
              ✓
            </div>
            <h2 className="text-xl font-bold text-[var(--heading)]">Profile Updated!</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your business details have been saved successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
