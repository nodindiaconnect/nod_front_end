import React, { useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Calendar,
  MessageSquare,
  Users,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useGetMyBidsQuery } from "../../../ApiSliceComponent/biddingApiSlice";
import ProjectWorkspace from "../../dashboard/shared/ProjectWorkspace";
import ProjectDetailsModal from "../../../global/Projectdetailsmodal";
import Loader from "../../../global/Loader";

export default function ProfessionalProjectsPage({ roleTitle = "Specialist" }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const { data: bidsData, isLoading, isFetching } = useGetMyBidsQuery({
    status: "ACCEPTED",
    limit: 50,
  });

  const acceptedBids = bidsData?.data?.bids || [];

  if (selectedProjectId) {
    return (
      <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6">
        <ProjectWorkspace
          projectId={selectedProjectId}
          onBack={() => setSelectedProjectId(null)}
        />
      </div>
    );
  }

  return (
    <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6 space-y-6">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-heading"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Active Projects
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-0.5">
          Projects where your quotation was accepted and you are an active {roleTitle.toLowerCase()} team member.
        </p>
      </div>

      {isLoading ? (
        <Loader />
      ) : acceptedBids.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border p-8">
          <Briefcase size={44} className="mx-auto text-muted opacity-30 mb-3" />
          <h3
            className="text-lg font-bold text-heading"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No Active Projects Yet
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1">
            Once a client accepts your quotation, the project will appear here with access to the Project Team, Workspace, and Group Chat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {acceptedBids.map((bid) => {
            const proj = bid.project || {};
            const client = proj.client || {};

            return (
              <div
                key={bid.id}
                className="rounded-lg border border-[var(--success)]/40 bg-white shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--success)] text-white">
                      Hired Member
                    </span>
                    <span className="text-xs text-muted">
                      {proj.category}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-heading text-lg line-clamp-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {proj.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <MapPin size={13} /> {proj.city}, {proj.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee size={13} /> Your Agreed Quote: ₹
                      {(bid.quotedPrice || bid.amount)?.toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={13} /> Est. Duration: {bid.proposedDuration || "—"}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted">Client:</span>
                    <span className="font-bold text-heading">{client.name || "Client"}</span>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-[var(--background-secondary)]/50 flex gap-2">
                  <button
                    onClick={() => setViewingProject(proj)}
                    className="py-2.5 px-3.5 rounded text-xs font-semibold border border-border bg-white text-heading hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Briefcase size={13} /> Specs
                  </button>

                  <button
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="flex-1 py-2.5 px-3 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    style={{ backgroundColor: "var(--primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--primary)")
                    }
                  >
                    <FolderKanban size={14} /> Open Project Workspace
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details / Specifications Modal */}
      {viewingProject && (
        <ProjectDetailsModal
          project={viewingProject}
          onClose={() => setViewingProject(null)}
        />
      )}
    </div>
  );
}
