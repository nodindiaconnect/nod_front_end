import React from "react";
import ProfessionalProposalsView from "../shared/ProfessionalProposalsView";
import { useGetContractorProjectsQuery } from "./dashboard/contractorApiSlice";

export default function ProposalsPage() {
  return (
    <ProfessionalProposalsView
      roleTitle="Contractor"
      serviceType="CONTRACTOR"
      useGetProjectsQuery={useGetContractorProjectsQuery}
    />
  );
}