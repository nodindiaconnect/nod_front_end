import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

export default function SettingsWorkspace({ roleTitle = "User" }) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Notification toggles
  const [notifyBids, setNotifyBids] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security credentials updated successfully!");
    }, 600);
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--heading)]" style={{ fontFamily: "var(--font-heading)" }}>
            {roleTitle} Account & Security Settings
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--heading)] font-bold border border-[var(--gold)]/30">
            Active Session
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
          Manage your login credentials, password security, notification channels, and privacy preferences.
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--heading)] flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <ShieldCheck size={18} className="text-[var(--primary)]" />
          Account Identification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
            <span className="text-[var(--muted)] block text-[11px] font-medium uppercase tracking-wider">Full Name</span>
            <span className="font-bold text-[var(--heading)] text-sm mt-0.5 block">{storedUser.name || "DesignConnect User"}</span>
          </div>

          <div className="p-3.5 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
            <span className="text-[var(--muted)] block text-[11px] font-medium uppercase tracking-wider">Registered Email Address</span>
            <span className="font-bold text-[var(--heading)] text-sm mt-0.5 block">{storedUser.email || "user@example.com"}</span>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--heading)] flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Key size={18} className="text-[var(--gold)]" />
            Change Password
          </h3>
          <span className="text-xs text-[var(--muted)]">Min 6 characters</span>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--text)] mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[var(--text)] mb-1">New Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text)] mb-1">Confirm New Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              {isChangingPass ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 bg-white border border-[var(--border)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--heading)] flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <Bell size={18} className="text-[var(--primary)]" />
          Notification Channels & Alerts
        </h3>

        <div className="space-y-3 divide-y divide-[var(--border)] text-xs">
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-[var(--heading)] block">Quotation & Award Notifications</span>
              <span className="text-[var(--muted)]">Receive instant alerts when quotes or proposals are submitted.</span>
            </div>
            <input
              type="checkbox"
              checked={notifyBids}
              onChange={(e) => setNotifyBids(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-[var(--heading)] block">Milestone & Escrow Releases</span>
              <span className="text-[var(--muted)]">Notifications when milestone deliverables or payments change status.</span>
            </div>
            <input
              type="checkbox"
              checked={notifyMilestones}
              onChange={(e) => setNotifyMilestones(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-[var(--heading)] block">Real-time Direct Messages</span>
              <span className="text-[var(--muted)]">Receive email notification for unread project messages.</span>
            </div>
            <input
              type="checkbox"
              checked={notifyChat}
              onChange={(e) => setNotifyChat(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveNotifications}
            className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
