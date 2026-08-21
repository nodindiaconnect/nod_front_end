import React from "react";
import ProfessionalProposalsView from "../shared/ProfessionalProposalsView";
import { useGetArchitechProjectsQuery } from "./dashboard/ArchitechDashboardApiSlice";

export default function ProposalsPage() {
  return (
    <ProfessionalProposalsView
      roleTitle="Architect"
      serviceType="ARCHITECT"
      useGetProjectsQuery={useGetArchitechProjectsQuery}
    />
  );
}