import React, { useState } from "react";
import CreateFeesCard from "../../../components/fees/CreateFeesCard";
import CompulsoryFeesCard from "../../../components/fees/CompulsoryFeesCard";
import FeesInstallmentCard from "../../../components/fees/FeesInstallmentCard";
import ManageFeesTable from "../../../components/fees/ManageFeesTable";
import OtherFeesCard from "../../../components/fees/OtherFeesCard";

export default function ManageFees() {
  const [feesData, setFeesData] = useState([]);

  const [showCreateFees, setShowCreateFees] = useState(false);

  const [classes] = useState([
    "Nursery",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Fees</h1>

        {/* Toggle */}

        <div className="flex items-center gap-4">
          <span className="text-gray-300 font-medium text-xl">Create Fees</span>

          <button
            onClick={() => setShowCreateFees(!showCreateFees)}
            className={`relative w-14 h-8 rounded-full transition cursor-pointer
            ${showCreateFees ? "bg-blue-600" : "bg-gray-700"}`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all
              ${showCreateFees ? "left-7" : "left-1"}`}
            />
          </button>
        </div>
      </div>

      {/* Show only when ON */}

      {showCreateFees && (
        <>
          <CreateFeesCard classes={classes} />

          <CompulsoryFeesCard />

          <FeesInstallmentCard />

          <OtherFeesCard />
        </>
      )}

      {/* Always visible */}

      <ManageFeesTable feesData={feesData} />
    </div>
  );
}
