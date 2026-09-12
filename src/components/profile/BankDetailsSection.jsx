import { useState, useEffect } from "react";
import {
  useGetBankDetailsQuery,
  useSaveBankDetailsMutation,
} from "../../ApiSliceComponent/bankApiSlice";
import {
  Building2,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import "../../theme.css";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function BankDetailsSection({ className = "" }) {
  const { data, isLoading, isError, refetch } = useGetBankDetailsQuery();
  const [saveBankDetails, { isLoading: isSaving }] = useSaveBankDetailsMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccNo, setShowAccNo] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountType: "SAVINGS",
  });

  const isConfigured = data?.data?.isConfigured;
  const bankDetails = data?.data?.bankDetails;

  const handleOpenModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      accountHolderName: bankDetails?.accountHolderName || "",
      bankName: bankDetails?.bankName || "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: bankDetails?.ifscCode || "",
      accountType: bankDetails?.accountType || "SAVINGS",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (field, value) => {
    setErrorMessage("");
    let formatted = value;
    if (field === "ifscCode") {
      formatted = value.toUpperCase().trim();
    } else if (field === "accountNumber" || field === "confirmAccountNumber") {
      formatted = value.replace(/\D/g, ""); // digits only
    }
    setFormData((prev) => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const holderName = formData.accountHolderName.trim();
    const bank = formData.bankName.trim();
    const accNo = formData.accountNumber.trim();
    const confirmAccNo = formData.confirmAccountNumber.trim();
    const ifsc = formData.ifscCode.trim().toUpperCase();

    if (!holderName || holderName.length < 2) {
      return setErrorMessage("Please enter a valid Account Holder Name (minimum 2 characters).");
    }
    if (!/^[a-zA-Z\s\.\']+$/.test(holderName)) {
      return setErrorMessage("Account Holder Name should contain only letters, spaces, and periods.");
    }
    if (!bank || bank.length < 2) {
      return setErrorMessage("Please enter your Bank Name.");
    }
    if (!accNo || accNo.length < 9 || accNo.length > 18) {
      return setErrorMessage("Account Number must be between 9 and 18 digits.");
    }
    if (accNo !== confirmAccNo) {
      return setErrorMessage("Account numbers do not match. Please verify.");
    }
    if (!IFSC_REGEX.test(ifsc)) {
      return setErrorMessage("Invalid IFSC code format. Example: HDFC0001234, SBIN0004567.");
    }

    try {
      const response = await saveBankDetails({
        accountHolderName: holderName,
        bankName: bank,
        accountNumber: accNo,
        ifscCode: ifsc,
        accountType: formData.accountType,
      }).unwrap();

      setSuccessMessage("Bank details saved securely!");
      setIsModalOpen(false);
      refetch();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.error || "Failed to save bank details. Please check and try again."
      );
    }
  };

  return (
    <div className={`bank-details-section w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-[var(--font-heading)] text-base sm:text-lg font-bold text-[var(--heading)]">
                Bank Details &amp; Payouts
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold)] border border-[var(--gold)]/20">
                <Lock className="h-2.5 w-2.5" /> 256-bit Encrypted
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Securely link your account for direct project milestones, client payouts, or refunds.
            </p>
          </div>
        </div>

        <div>
          {isConfigured ? (
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Update Details
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 text-xs font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Bank Details
            </button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30 px-3.5 py-2.5 text-xs font-medium text-[var(--success)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Content */}
      <div className="mt-5">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/3 rounded bg-[var(--background-secondary)]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="h-16 rounded-xl bg-[var(--background-secondary)]" />
              <div className="h-16 rounded-xl bg-[var(--background-secondary)]" />
              <div className="h-16 rounded-xl bg-[var(--background-secondary)]" />
            </div>
          </div>
        ) : isConfigured && bankDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Bank Name */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Bank Name
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)] truncate">
                  {bankDetails.bankName}
                </p>
              </div>

              {/* Account Holder Name */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Account Holder
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)] truncate">
                  {bankDetails.accountHolderName}
                </p>
              </div>

              {/* Masked Account Number */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> Account Number (Masked)
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold tracking-widest text-[var(--text)]">
                    {bankDetails.maskedAccountNumber || `•••• •••• •••• ${bankDetails.last4}`}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[var(--success)] bg-[var(--success)]/10 px-1.5 py-0.5 rounded">
                    Protected
                  </span>
                </div>
              </div>

              {/* IFSC Code */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  IFSC Code
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[var(--text)]">
                  {bankDetails.ifscCode}
                </p>
              </div>

              {/* Account Type */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Account Type
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)] capitalize">
                  {bankDetails.accountType ? `${bankDetails.accountType.toLowerCase()} account` : "Savings account"}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Payout Status
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Active &amp; Ready
                  </p>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)] animate-pulse" />
              </div>
            </div>

            <p className="text-[11px] text-[var(--muted)] flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[var(--gold)]" /> Full account numbers are never displayed on screen to protect against unauthorized viewing.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-secondary)]/50 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
              <CreditCard className="h-6 w-6" />
            </div>
            <h4 className="mt-3 font-[var(--font-heading)] text-sm font-bold text-[var(--heading)]">
              No bank account linked yet
            </h4>
            <p className="mt-1 max-w-sm text-xs text-[var(--muted)]">
              Link your bank account to receive disbursements, earnings, and security escrow releases smoothly.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 text-xs font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Bank Account
            </button>
          </div>
        )}
      </div>

      {/* Add / Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-modal-title"
            className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold)]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 id="bank-modal-title" className="font-[var(--font-heading)] text-base font-bold text-[var(--heading)]">
                    {isConfigured ? "Update Bank Details" : "Add Bank Account"}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)]">
                    Details are securely encrypted and verified.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--text)] transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error in modal */}
            {errorMessage && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/30 p-3 text-xs text-[var(--danger)]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Account Holder Name <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="As per bank records"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  required
                />
              </div>

              {/* Bank Name & Account Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Bank Name <span className="text-[var(--danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, SBI"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Account Type <span className="text-[var(--danger)]">*</span>
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange("accountType", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  >
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CURRENT">Current Account</option>
                  </select>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--text)]">
                    Account Number <span className="text-[var(--danger)]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAccNo((prev) => !prev)}
                    className="text-[10px] text-[var(--muted)] hover:text-[var(--gold)] flex items-center gap-1"
                  >
                    {showAccNo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showAccNo ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showAccNo ? "text" : "password"}
                  placeholder="9 to 18 digits"
                  maxLength={18}
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full font-mono rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  required
                  autoComplete="off"
                />
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Confirm Account Number <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type={showAccNo ? "text" : "password"}
                  placeholder="Re-enter your account number"
                  maxLength={18}
                  value={formData.confirmAccountNumber}
                  onChange={(e) => handleInputChange("confirmAccountNumber", e.target.value)}
                  className="w-full font-mono rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  required
                  autoComplete="off"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  IFSC Code <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                  className="w-full font-mono uppercase rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--gold)]"
                  required
                />
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  11-character code printed on your chequebook or passbook.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)] mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--background-secondary)] transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-[var(--gold)] px-5 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : isConfigured ? "Update Details" : "Save Bank Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
