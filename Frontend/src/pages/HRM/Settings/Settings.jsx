import React, { useState } from "react";
import Departments from "./Departments";
import Designations from "./Designations";
import Shift from "./Shift";
import BasicSettings from "./BasicSettings";
import PayBand from "./PayBand";
import AuthorizedPersons from "./AuthorizedPersons";
import EarningType from "./EarningType";
import DeductionType from "./DeductionType";
import IdentityDocs from "./IdentityDocs";
import DegreeDocuments from "./DegreeDocument";
import EmployeeLetterType from "./EmployeeLetterType";
import LeaveType from "./LeaveType";
import LoanInterest from "./LoanInterest";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Departments");

  const tabs = [
    "Departments",
    "Designations",
    "Shift",
    "Basic Settings",
    "Pay Band",
    "Authorized Persons",
    "Earning Types",
    "Deduction Types",
    "Identity Docs",
    "Degree Docs",
    "Employee Letter Type",
    "Leave Type",
    "Loan Interest",
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-900 rounded-xl p-2 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-lg text-sm cursor-pointer ${activeTab === tab ? "bg-white text-gray-900" : "text-gray-400 hover:bg-gray-800"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Departments" && <Departments />}

      {activeTab === "Designations" && <Designations />}

      {activeTab === "Shift" && <Shift />}

      {activeTab === "Basic Settings" && <BasicSettings />}

      {activeTab === "Pay Band" && <PayBand />}

      {activeTab === "Authorized Persons" && <AuthorizedPersons />}

      {activeTab === "Earning Types" && <EarningType />}

      {activeTab === "Deduction Types" && <DeductionType />}

      {activeTab === "Identity Docs" && <IdentityDocs />}
      {activeTab === "Degree Docs" && <DegreeDocuments />}
      {activeTab === "Employee Letter Type" && <EmployeeLetterType />}
      {activeTab === "Leave Type" && <LeaveType />}
      {activeTab === "Loan Interest" && <LoanInterest />}
    </div>
  );
}
