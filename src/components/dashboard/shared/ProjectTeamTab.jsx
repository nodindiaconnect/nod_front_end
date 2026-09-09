import React from "react";
import {
  Users,
  UserCheck,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Shield,
  Briefcase,
  UserPlus,
  Star,
} from "lucide-react";

const ROLE_LABELS = {
  ARCHITECT: { label: "Architect", color: "var(--primary)" },
  INTERIOR_DESIGNER: { label: "Designer", color: "var(--gold)" },
  CONTRACTOR: { label: "General Contractor", color: "#2563eb" },
};

export default function ProjectTeamTab({
  project = null,
  teamMembers = [],
  isLoading = false,
  onOpenChat,
  onOpenTeamChat,
  onViewBidsForRole,
  onOpenReview,
}) {
  const client = project?.client || {};
  const requiredServices = project?.servicesRequired || [];

  const getAvatarUrl = (u) => {
    if (!u) return null;
    if (typeof u.profileImageUrl === "string" && u.profileImageUrl.trim()) {
      return u.profileImageUrl;
    }
    if (
      typeof u.profile === "string" &&
      (u.profile.startsWith("http") || u.profile.startsWith("/uploads") || u.profile.startsWith("data:"))
    ) {
      return u.profile;
    }
    if (Array.isArray(u.photos) && u.photos.length > 0) {
      const first = u.photos[0];
      return typeof first === "string" ? first : first?.url || null;
    }
    return null;
  };

  const clientAvatar = getAvatarUrl(client);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted">Loading project team members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Top Banner */}
      <div
        className="rounded-lg p-5 sm:p-6 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h3
              className="text-lg sm:text-xl font-bold text-heading"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Project Team & Collaborators
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              {teamMembers.length} of {requiredServices.length} required specialists hired
            </p>
          </div>
        </div>

        {teamMembers.length > 0 && (
          <button
            onClick={onOpenTeamChat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-white font-medium text-xs tracking-wide shadow-sm transition-all whitespace-nowrap"
            style={{ backgroundColor: "var(--primary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            <MessageSquare size={16} /> Open Team Group Chat
          </button>
        )}
      </div>

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Client / Owner Card */}
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/5 text-heading">
                Project Owner (Client)
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                <CheckCircle2 size={13} /> Active
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-border overflow-hidden shrink-0">
                {clientAvatar ? (
                  <img
                    src={clientAvatar}
                    alt={client.name || "Client"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <span className={clientAvatar ? "hidden" : "flex items-center justify-center"}>
                  {client.name ? client.name.charAt(0).toUpperCase() : "C"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-heading text-base">
                  {client.name || "Client"}
                </h4>
                <div className="text-xs text-muted">{client.email || "Owner"}</div>
              </div>
            </div>

            <div className="space-y-2 py-3 border-t border-b border-border text-xs text-muted">
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} /> {client.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={13} /> Created Project:{" "}
                {project?.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => onOpenChat(client.id, client.name)}
              className="flex-1 py-2 px-3 rounded text-xs font-medium border border-border bg-white hover:bg-background-secondary text-heading flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare size={14} /> Message Owner
            </button>
            {onOpenReview && (
              <button
                onClick={() =>
                  onOpenReview({
                    projectId: project?.id,
                    projectTitle: project?.title,
                    projectCategory: project?.category,
                    revieweeId: client.id,
                    revieweeName: client.name || "Owner",
                    revieweeRole: "CLIENT",
                    revieweeProfile: client.profile,
                  })
                }
                className="px-3 py-2 rounded text-xs font-medium border border-[var(--gold)] text-heading bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 transition flex items-center justify-center gap-1"
                title="Review Owner"
              >
                <Star size={13} className="fill-[var(--gold)] text-[var(--gold)]" /> Review
              </button>
            )}
          </div>
        </div>

        {/* Specialists Cards for Each Required Service */}
        {requiredServices.map((serviceType) => {
          const roleConfig = ROLE_LABELS[serviceType] || {
            label: serviceType,
            color: "var(--primary)",
          };
          const member = teamMembers.find((m) => m.role === serviceType && m.status === "ACTIVE");

          if (member) {
            const user = member.user || {};
            const specialistAvatar = getAvatarUrl(user);
            const specProfile = typeof user.profile === "object" ? user.profile : (() => {
              try { return JSON.parse(user.profile) || {}; } catch { return {}; }
            })();
            const specLevel =
              member.specializationLevel ||
              user.specializationLevel ||
              member.designer?.specializationLevel ||
              member.architect?.specializationLevel ||
              specProfile?.specializationLevel ||
              null;

            return (
              <div
                key={member.id || serviceType}
                className="rounded-lg border border-[var(--gold)]/40 bg-white p-5 shadow-sm flex flex-col justify-between ring-1 ring-[var(--gold)]/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: roleConfig.color }}
                      >
                        {roleConfig.label}
                      </span>
                      {specLevel && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef9ee] border border-[#eed7a1] text-[#9c6c2c]">
                          {specLevel}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                      <CheckCircle2 size={13} /> Hired
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-border overflow-hidden shrink-0">
                      {specialistAvatar ? (
                        <img
                          src={specialistAvatar}
                          alt={user.name || "Professional"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className={specialistAvatar ? "hidden" : "flex items-center justify-center"}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "P"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-heading text-base">
                        {user.name || "Professional"}
                      </h4>
                      <div className="text-xs text-muted">
                        {user.city ? `${user.city}, ${user.state || ""}` : roleConfig.label}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 py-3 border-t border-b border-border text-xs text-muted">
                    {user.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={13} /> {user.email}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} /> {user.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={13} /> Joined Team:{" "}
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => onOpenChat(user.id, user.name, member.bidId)}
                    className="flex-1 py-2 px-3 rounded text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition"
                    style={{ backgroundColor: "var(--primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary)")
                    }
                  >
                    <MessageSquare size={14} /> Direct Chat
                  </button>

                  {onOpenReview && (
                    <button
                      onClick={() =>
                        onOpenReview({
                          projectId: project?.id,
                          projectTitle: project?.title,
                          projectCategory: project?.category,
                          revieweeId: user.id,
                          revieweeName: user.name || "Specialist",
                          revieweeRole: member.role,
                          revieweeProfile: user.profile,
                        })
                      }
                      className="px-3 py-2 rounded text-xs font-semibold border border-[var(--gold)] text-heading bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 transition flex items-center justify-center gap-1"
                      title={`Review ${user.name || "Specialist"}`}
                    >
                      <Star size={13} className="fill-amber-400 text-amber-500" /> Review
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // Unfilled / Open Position
          return (
            <div
              key={serviceType}
              className="rounded-lg border border-dashed border-border bg-[var(--background-secondary)]/50 p-5 flex flex-col justify-between text-center"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-muted bg-white border border-border"
                  >
                    {roleConfig.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--warning)] font-medium">
                    <Clock size={13} /> Seeking
                  </span>
                </div>

                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-border text-muted flex items-center justify-center mb-3">
                    <UserPlus size={22} className="opacity-60" />
                  </div>
                  <h4 className="font-semibold text-heading text-sm">
                    Position Not Yet Filled
                  </h4>
                  <p className="text-xs text-muted max-w-xs mt-1">
                    Review and shortlist incoming {roleConfig.label.toLowerCase()} proposals to hire for this position.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onViewBidsForRole(serviceType)}
                  className="w-full py-2 px-3 rounded text-xs font-semibold border border-[var(--primary)] text-[var(--primary)] bg-white hover:bg-[var(--primary)] hover:text-white transition"
                >
                  View {roleConfig.label} Proposals
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
