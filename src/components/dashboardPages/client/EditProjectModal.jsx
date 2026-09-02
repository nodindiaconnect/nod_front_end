import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { useUpdateProjectMutation } from "./Dashboard/overpageApiSlice";
import { uploadFiles } from "../../../../superBase";
import { toast } from "react-toastify";


const SCOPES = [
  { id: "FULL_PROJECT", label: "Full Project (All Disciplines)", desc: "Requires Architect, Contractor, and Interior Designer across 3 execution phases." },
  { id: "ARCHITECTURE_ONLY", label: "Architecture / Planning Only", desc: "Structural blueprints, floor plans, and municipal permits." },
  { id: "CONSTRUCTION_ONLY", label: "Construction / Civil Execution Only", desc: "Civil contractor, MEP, framing, and site execution." },
  { id: "DESIGN_ONLY", label: "Interior Design & Fitouts Only", desc: "Space planning, 3D renders, materials, and modular woodwork." },
];

const CATEGORIES = ["RESIDENTIAL", "COMMERCIAL", "OFFICE", "VILLA", "APARTMENT"];
const PROPERTY_STATUSES = ["NEW_CONSTRUCTION", "RENOVATION", "REMODELING"];
const PRIORITIES = ["NORMAL", "URGENT", "FLEXIBLE"];
const DESIGN_STYLES = ["MODERN", "MINIMALIST", "LUXURY", "CONTEMPORARY", "TRADITIONAL", "SCANDINAVIAN"];
const SPACE_REQUIREMENTS = ["MODULAR_KITCHEN", "WARDROBES", "FALSE_CEILING", "TV_UNIT", "LIGHTING", "FURNITURE"];

const SCOPE_TO_SERVICES = {
  FULL_PROJECT: ["ARCHITECT", "INTERIOR_DESIGNER", "CONTRACTOR"],
  ARCHITECTURE_ONLY: ["ARCHITECT"],
  CONSTRUCTION_ONLY: ["CONTRACTOR"],
  DESIGN_ONLY: ["INTERIOR_DESIGNER"],
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditProjectModal({ project, isOpen, onClose, onUpdated }) {
  const [updateProject, { isLoading: isSaving }] = useUpdateProjectMutation();
  const [activeTab, setActiveTab] = useState("basic");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("FULL_PROJECT");
  const [category, setCategory] = useState("RESIDENTIAL");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
  const [numberOfBathrooms, setNumberOfBathrooms] = useState("");
  const [propertyStatus, setPropertyStatus] = useState("NEW_CONSTRUCTION");
  const [designStyle, setDesignStyle] = useState([]);
  const [spaceRequirements, setSpaceRequirements] = useState([]);
  const [colorPreferences, setColorPreferences] = useState("");
  const [siteVisitRequired, setSiteVisitRequired] = useState(true);
  const [preferredWorkingHours, setPreferredWorkingHours] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Pre-fill existing data
  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setScope(project.scope || "FULL_PROJECT");
      setCategory(project.category || "RESIDENTIAL");
      setDescription(project.description || "");
      setBudgetMin(project.budgetMin != null ? String(project.budgetMin) : "");
      setBudgetMax(project.budgetMax != null ? String(project.budgetMax) : "");
      setStartDate(project.startDate ? project.startDate.substring(0, 10) : "");
      setCompletionDate(project.completionDate ? project.completionDate.substring(0, 10) : "");
      setPriority(project.priority || "NORMAL");
      setAddress(project.address || "");
      setCity(project.city || "");
      setState(project.state || "");
      setPincode(project.pincode || "");
      setPropertySize(project.propertySize != null ? String(project.propertySize) : "");
      setNumberOfFloors(project.numberOfFloors != null ? String(project.numberOfFloors) : "");
      setNumberOfBedrooms(project.numberOfBedrooms != null ? String(project.numberOfBedrooms) : "");
      setNumberOfBathrooms(project.numberOfBathrooms != null ? String(project.numberOfBathrooms) : "");
      setPropertyStatus(project.propertyStatus || "NEW_CONSTRUCTION");
      setDesignStyle(Array.isArray(project.designStyle) ? project.designStyle : []);
      setSpaceRequirements(Array.isArray(project.spaceRequirements) ? project.spaceRequirements : []);
      setColorPreferences(project.colorPreferences || "");
      setSiteVisitRequired(project.siteVisitRequired ?? true);
      setPreferredWorkingHours(project.preferredWorkingHours || "");
      setAdditionalNotes(project.additionalNotes || "");
      setErrorMsg("");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const toggleArrayItem = (setter, array, item) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city.trim() || !budgetMin || !budgetMax) {
      setErrorMsg("Please fill out all required fields marked with *");
      return;
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      setErrorMsg("Minimum budget cannot exceed maximum budget.");
      return;
    }

    const today = getTodayDateString();
    const originalStartDate = project.startDate ? project.startDate.substring(0, 10) : "";
    if (startDate && startDate !== originalStartDate && startDate < today) {
      setErrorMsg("Target start date cannot be in the past.");
      return;
    }
    if (completionDate && completionDate < (startDate || today)) {
      setErrorMsg("Target completion date cannot be earlier than start date or in the past.");
      return;
    }

    try {
      setErrorMsg("");
      await updateProject({
        projectId: project.id,
        title: title.trim(),
        scope,
        servicesRequired: SCOPE_TO_SERVICES[scope] || project.servicesRequired || ["ARCHITECT", "INTERIOR_DESIGNER", "CONTRACTOR"],
        category,
        description: description.trim(),
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        startDate: startDate || null,
        completionDate: completionDate || null,
        priority,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        propertySize: Number(propertySize) || 1200,
        numberOfFloors: numberOfFloors ? Number(numberOfFloors) : null,
        numberOfBedrooms: numberOfBedrooms ? Number(numberOfBedrooms) : null,
        numberOfBathrooms: numberOfBathrooms ? Number(numberOfBathrooms) : null,
        propertyStatus,
        designStyle,
        spaceRequirements,
        colorPreferences: colorPreferences.trim(),
        siteVisitRequired,
        preferredWorkingHours: preferredWorkingHours.trim(),
        additionalNotes: additionalNotes.trim(),
      }).unwrap();

      toast.success("Project updated successfully!");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("Update project error:", err);
      setErrorMsg(err?.data?.message || err?.message || "Failed to update project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 border border-[var(--border)] shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
                Edit Project Specifications
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
                {project.status || "ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Update scope, timeline, budget range, and physical property requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--background-secondary)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--border)] gap-6 text-xs font-bold">
          {[
            { id: "basic", label: "1. Scope & Concept" },
            { id: "budget", label: "2. Budget & Timeline" },
            { id: "property", label: "3. Location & Specs" },
            { id: "preferences", label: "4. Styling & Notes" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 -mb-px border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-[var(--primary)] text-[var(--primary)] font-bold"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--heading)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* TAB 1: BASIC & SCOPE */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[var(--text)] mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 text-[var(--heading)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1.5">Project Scope</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCOPES.map((sc) => (
                    <label
                      key={sc.id}
                      onClick={() => setScope(sc.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        scope === sc.id
                          ? "bg-[var(--primary)]/5 border-[var(--primary)] text-[var(--heading)] ring-1 ring-[var(--primary)]/20"
                          : "bg-[var(--background-secondary)]/50 border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{sc.label}</span>
                        <input
                          type="radio"
                          name="scope"
                          checked={scope === sc.id}
                          onChange={() => setScope(sc.id)}
                          className="accent-[var(--primary)]"
                        />
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-1 leading-snug">{sc.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] bg-white text-[var(--heading)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Property Status</label>
                  <select
                    value={propertyStatus}
                    onChange={(e) => setPropertyStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] bg-white text-[var(--heading)]"
                  >
                    {PROPERTY_STATUSES.map((ps) => (
                      <option key={ps} value={ps}>
                        {ps.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] resize-none leading-relaxed text-[var(--heading)]"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: BUDGET & TIMELINE */}
          {activeTab === "budget" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">
                    Min Budget (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">
                    Max Budget (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Target Start Date</label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] bg-white text-[var(--heading)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    min={startDate || getTodayDateString()}
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] bg-white text-[var(--heading)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Priority Level</label>
                <div className="flex gap-4">
                  {PRIORITIES.map((p) => (
                    <label key={p} className="flex items-center gap-2 font-medium cursor-pointer text-[var(--heading)]">
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        className="accent-[var(--primary)]"
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION & SPECS */}
          {activeTab === "property" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Full Site Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Size (sq.ft)</label>
                  <input
                    type="number"
                    value={propertySize}
                    onChange={(e) => setPropertySize(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Floors</label>
                  <input
                    type="number"
                    value={numberOfFloors}
                    onChange={(e) => setNumberOfFloors(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={numberOfBedrooms}
                    onChange={(e) => setNumberOfBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={numberOfBathrooms}
                    onChange={(e) => setNumberOfBathrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREFERENCES & STYLING */}
          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[var(--text)] mb-2">Design Style Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {DESIGN_STYLES.map((style) => {
                    const selected = designStyle.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleArrayItem(setDesignStyle, designStyle, style)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          selected
                            ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                            : "bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--background-secondary)]"
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-2">Space Elements Required</label>
                <div className="flex flex-wrap gap-2">
                  {SPACE_REQUIREMENTS.map((space) => {
                    const selected = spaceRequirements.includes(space);
                    return (
                      <button
                        key={space}
                        type="button"
                        onClick={() => toggleArrayItem(setSpaceRequirements, spaceRequirements, space)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          selected
                            ? "bg-[var(--gold)]/20 text-[var(--heading)] border-[var(--gold)] font-bold shadow-xs"
                            : "bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--background-secondary)]"
                        }`}
                      >
                        {space.replace("_", " ")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Color Palette Preferences</label>
                  <input
                    type="text"
                    placeholder="e.g. Warm earthy tones, beige and oak accents"
                    value={colorPreferences}
                    onChange={(e) => setColorPreferences(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Preferred Working Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon-Sat 9 AM - 6 PM"
                    value={preferredWorkingHours}
                    onChange={(e) => setPreferredWorkingHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] text-[var(--heading)]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 font-medium cursor-pointer text-[var(--heading)]">
                  <input
                    type="checkbox"
                    checked={siteVisitRequired}
                    onChange={(e) => setSiteVisitRequired(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--primary)]"
                  />
                  <span>Physical Site Inspection is mandatory prior to final quotation</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Special Instructions & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Any structural constraints, delivery elevator limitations, or specific contractor rules..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] resize-none leading-relaxed text-[var(--heading)]"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--heading)] font-semibold hover:bg-[var(--background-secondary)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
