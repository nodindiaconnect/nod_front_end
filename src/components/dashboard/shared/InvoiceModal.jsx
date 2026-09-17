import React from "react";
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  Building2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Layers,
} from "lucide-react";

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-auto overflow-hidden flex flex-col border border-border"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold text-heading">
              Official Project Invoice
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              PAID
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || "/api"}/payments/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition shadow-2xs cursor-pointer"
            >
              <Download size={14} /> Download PDF
            </a>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-white border border-border text-heading hover:bg-slate-100 transition shadow-2xs cursor-pointer"
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-heading rounded-md hover:bg-black/5 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-text bg-white print:p-0">
          {/* Header & Company Brand */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                  NOD
                </div>
                <h2 className="text-xl font-bold text-heading tracking-tight font-serif">
                  NIGHT OWL DESIGNERS
                </h2>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Architecture, Interior Design & Construction Ecosystem
              </p>
              <p className="text-[11px] text-muted">
                support@nightowldesigners.com • www.nightowldesigners.com
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block text-[11px] font-bold text-muted uppercase tracking-wider">
                INVOICE NUMBER
              </span>
              <div className="text-base font-bold text-heading font-mono">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-muted flex items-center gap-1 sm:justify-end">
                <Calendar size={13} /> Date:{" "}
                {invoice.paidAt
                  ? new Date(invoice.paidAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Billed To & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                BILLED TO (CLIENT)
              </span>
              <h4 className="font-bold text-heading text-sm">
                {invoice.clientName || "Verified Project Owner"}
              </h4>
              {invoice.clientEmail && (
                <p className="text-muted">{invoice.clientEmail}</p>
              )}
              {invoice.clientPhone && (
                <p className="text-muted">{invoice.clientPhone}</p>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                PROJECT REFERENCE
              </span>
              <h4 className="font-bold text-heading text-sm">
                {invoice.milestoneTitle}
              </h4>
              <p className="text-muted font-mono text-[11px]">
                Project ID: {invoice.projectId}
              </p>
              <p className="text-muted font-mono text-[11px]">
                Txn ID: {invoice.transactionId}
              </p>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-muted uppercase text-[10px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Share %</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-heading">
                      {invoice.milestoneTitle}
                    </div>
                    <div className="text-[11px] text-muted">
                      Milestone {invoice.milestoneSequence} payment towards
                      project execution
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium">
                    {invoice.milestonePercentage}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-heading">
                    {formatCurrency(invoice.milestoneAmount)}
                  </td>
                </tr>

                {invoice.platformFeeAmount > 0 && (
                  <tr className="bg-amber-50/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-heading">
                        Platform Service Fee ({invoice.platformFeeRate}%)
                      </div>
                      <div className="text-[11px] text-muted">
                        Escrow security, dispute protection & project oversight
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      {invoice.platformFeeRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-heading">
                      {formatCurrency(invoice.platformFeeAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="space-y-1 text-muted text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck size={14} /> 100% Escrow Protected Transaction
              </div>
              <div>
                Payment Mode: {invoice.paymentGateway || "ONLINE_GATEWAY"}
              </div>
              <div>Status: Verified & Completed</div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-right">
              <div className="flex justify-between text-xs py-1 border-b border-border/70">
                <span className="text-muted">Total Project Value:</span>
                <span className="font-semibold">
                  {formatCurrency(invoice.totalProjectValue)}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1.5 border-b-2 border-heading font-extrabold text-heading">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700">
                  {formatCurrency(invoice.totalAmountPaid)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted pt-1">
                <span>Remaining Balance Due:</span>
                <span>{formatCurrency(invoice.remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-6 border-t border-dashed border-border text-center text-[10px] text-muted space-y-1">
            <p>
              This is a computer-generated invoice and requires no physical
              signature.
            </p>
            <p>
              © {new Date().getFullYear()} Night Owl Designers Pvt. Ltd. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
