import React, { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Download,
  AlertCircle,
  FolderKanban,
  ArrowUpRight,
  Filter,
  Layers,
  Sparkles,
  Building,

  CreditCard,
  Lock,
} from "lucide-react";
import {
  useGetMyWalletQuery,
  useRequestWithdrawalMutation,
} from "../../../ApiSliceComponent/biddingApiSlice";
import { toast } from "react-toastify";

export default function EarningsWorkspace({ roleTitle = "Professional" }) {
  const { data: walletRes, isLoading, refetch } = useGetMyWalletQuery();
  const [requestWithdrawal, { isLoading: isWithdrawing }] = useRequestWithdrawalMutation();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const walletData = walletRes?.data || {};
  const availableBalance = Number(walletData.totalAvailableBalance || 0);
  const pendingWithdrawals = Number(walletData.pendingWithdrawalAmount || 0);
  const totalWithdrawn = Number(walletData.totalWithdrawnAmount || 0);
  const totalEarnedLifetime = Number(walletData.totalEarnedLifetime || 0);

  const withdrawalsList = walletData.withdrawals || [];
  const payoutsList = walletData.escrowPayouts || [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleExecuteWithdrawal = async (e) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid withdrawal amount greater than zero");
      return;
    }

    if (amountNum > availableBalance) {
      toast.error(`Insufficient wallet balance. Available: ${formatCurrency(availableBalance)}`);
      return;
    }

    if (!bankAccount.trim() || !ifscCode.trim()) {
      toast.error("Please enter your Bank Account Number and IFSC Code");
      return;
    }

    try {
      await requestWithdrawal({
        amount: amountNum,
        bankAccount: bankAccount.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        accountHolder: accountHolder.trim(),
        idempotencyKey: `withdr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      }).unwrap();

      toast.success(`Withdrawal request of ${formatCurrency(amountNum)} submitted successfully!`);
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setBankAccount("");
      setIfscCode("");
      setAccountHolder("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process withdrawal");
    }
  };

  return (
    <div className="space-y-6 text-xs text-[var(--text)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
              {roleTitle} Personal Wallet & Payouts
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
              Private Personal Wallet
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            Track approved project escrow releases transferred directly into your personal balance and manage bank withdrawals.
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={availableBalance <= 0}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <IndianRupee size={15} /> Request Bank Withdrawal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Wallet Balance */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Available for Withdrawal</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[var(--primary)]">
            {formatCurrency(availableBalance)}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} /> Ready for instant bank transfer
          </p>
        </div>

        {/* Pending Withdrawals */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Withdrawal In-Processing</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/15 text-[var(--heading)] flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800">
            {formatCurrency(pendingWithdrawals)}
          </div>
          <p className="text-[11px] text-[var(--muted)] font-semibold">
            Bank NEFT / IMPS clearance
          </p>
        </div>

        {/* Total Withdrawn to Bank */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Total Withdrawn to Bank</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[var(--heading)]">
            {formatCurrency(totalWithdrawn)}
          </div>
          <p className="text-[11px] text-[var(--muted)] font-semibold">
            100% Cleared bank settlements
          </p>
        </div>

        {/* Total Lifetime Escrow Releases */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Total Lifetime Earned</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] text-[var(--heading)] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[var(--heading)]">
            {formatCurrency(totalEarnedLifetime)}
          </div>
          <p className="text-[11px] text-[var(--muted)] font-semibold">
            From verified project deliverables
          </p>
        </div>
      </div>

      {/* Dual Tables: Escrow Releases Received & Bank Withdrawals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Escrow Milestone Releases */}
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)] flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--gold)]" /> Project Milestone Releases Credited
            </h4>
          </div>
          {payoutsList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted)]">No project milestone payouts credited yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {payoutsList.map((p) => (
                    <tr key={p.id} className="hover:bg-[var(--background-secondary)]/20">
                      <td className="py-2.5 px-3 text-[var(--muted)]">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 font-bold text-[var(--heading)]">{p.escrow?.project?.title || "Project"}</td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">+{formatCurrency(p.amount)}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          RELEASED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 2: Bank Withdrawal Requests */}
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)] flex items-center gap-2">
              <CreditCard size={14} className="text-[var(--primary)]" /> Bank Account Withdrawals
            </h4>
          </div>
          {withdrawalsList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted)]">No withdrawal requests submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Bank Details</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {withdrawalsList.map((w) => (
                    <tr key={w.id} className="hover:bg-[var(--background-secondary)]/20">
                      <td className="py-2.5 px-3 text-[var(--muted)]">{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 font-extrabold text-[var(--heading)]">{formatCurrency(w.amount)}</td>
                      <td className="py-2.5 px-3 text-[var(--text)] font-mono text-[11px]">
                        {w.bankAccount ? `A/C: ••••${w.bankAccount.slice(-4)} (${w.ifscCode})` : "Direct Transfer"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            w.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : w.status === "FAILED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Request Direct Bank Withdrawal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[var(--border)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <IndianRupee size={18} className="text-[var(--primary)]" />
                <h4 className="text-sm font-bold text-[var(--heading)]">Request Bank Payout</h4>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-[var(--background-secondary)] text-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)] flex justify-between items-center text-xs">
              <span className="text-[var(--muted)]">Available Wallet Balance:</span>
              <span className="font-extrabold text-[var(--primary)] text-sm">{formatCurrency(availableBalance)}</span>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-3">
              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Withdrawal Amount (₹) *</label>
                <input
                  type="number"
                  placeholder={`Max ${availableBalance}`}
                  max={availableBalance}
                  min={1}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  placeholder="Full name as per bank records"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  placeholder="Enter bank account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">IFSC Code *</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-xs uppercase outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--heading)] font-semibold hover:bg-[var(--background-secondary)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) > availableBalance}
                  className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
