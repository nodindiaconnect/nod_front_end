import React from "react";
import ProfessionalProposalsView from "../shared/ProfessionalProposalsView";
import { useGetDesignerProjectsQuery } from "./dashboard/DesignerDashboardApiSlice";

export default function ProposalsPage() {
  return (
    <ProfessionalProposalsView
      roleTitle="Interior Designer"
      serviceType="INTERIOR_DESIGNER"
      useGetProjectsQuery={useGetDesignerProjectsQuery}
    />
  );
}
