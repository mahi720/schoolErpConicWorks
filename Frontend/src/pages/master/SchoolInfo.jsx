import React, { useEffect, useState } from "react";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Globe2,
  GraduationCap,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  School,
  Users,
} from "lucide-react";

import SchoolInfoModal from "../../components/schoolInfo/SchoolInfoModal";

import { useSchoolStore } from "../../store/master/school/schoolStore";

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />

        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>

      <p className="break-words text-sm font-medium text-gray-900 dark:text-white">
        {value || "-"}
      </p>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function SchoolInformation() {
  const [showModal, setShowModal] = useState(false);

  const { schoolData, loading, fetchMySchool } = useSchoolStore();

  useEffect(() => {
    fetchMySchool();
  }, [fetchMySchool]);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const logoUrl = schoolData?.logo
    ? schoolData.logo.startsWith("http")
      ? schoolData.logo
      : `${backendUrl}${schoolData.logo}`
    : null;

  if (loading && !schoolData) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
        <School className="mb-3 h-12 w-12 text-gray-400" />

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          School information not found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          School data could not be loaded.
        </p>

        <button
          type="button"
          onClick={fetchMySchool}
          className="mt-4 cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            School Information
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your school profile and configuration
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit Information
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={schoolData.schoolName}
                className="h-full w-full object-contain p-2"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {schoolData.schoolName}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  schoolData.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {schoolData.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              School Code:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {schoolData.schoolCode}
              </span>
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                {schoolData.plan} Plan
              </span>

              {schoolData.affiliationNumber && (
                <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                  Affiliation: {schoolData.affiliationNumber}
                </span>
              )}

              {schoolData.registrationNumber && (
                <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                  Registration: {schoolData.registrationNumber}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <CircleUserRound className="h-5 w-5 text-blue-500" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={CircleUserRound}
            label="Contact Person"
            value={schoolData.contactPersonName}
          />

          <InfoItem
            icon={Phone}
            label="Contact Number"
            value={schoolData.contactNumber}
          />

          <InfoItem
            icon={Mail}
            label="Contact Email"
            value={schoolData.contactEmail}
          />

          <InfoItem icon={Globe2} label="Website" value={schoolData.website} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <MapPin className="h-5 w-5 text-blue-500" />
          Address Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={MapPin}
            label="Address Line 1"
            value={schoolData.addressLine1}
          />

          <InfoItem
            icon={MapPin}
            label="Address Line 2"
            value={schoolData.addressLine2}
          />

          <InfoItem icon={Building2} label="City" value={schoolData.city} />

          <InfoItem
            icon={Building2}
            label="District"
            value={schoolData.district}
          />

          <InfoItem icon={MapPin} label="State" value={schoolData.state} />

          <InfoItem icon={Globe2} label="Country" value={schoolData.country} />

          <InfoItem icon={MapPin} label="PIN Code" value={schoolData.pinCode} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          Academic Configuration
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={GraduationCap}
            label="Lecture Count"
            value={schoolData.lectureCount}
          />

          <InfoItem
            icon={School}
            label="Classrooms"
            value={schoolData.classrooms}
          />

          <InfoItem
            icon={CheckCircle2}
            label="Teaching Saturday"
            value={schoolData.teachingSaturday ? "Yes" : "No"}
          />

          <InfoItem
            icon={Users}
            label="Maximum Students"
            value={schoolData.maxStudents}
          />

          <InfoItem
            icon={Users}
            label="Maximum Users"
            value={schoolData.maxUsers}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          Plan Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={GraduationCap}
            label="Current Plan"
            value={schoolData.plan}
          />

          <InfoItem
            icon={CalendarDays}
            label="Plan Start Date"
            value={formatDate(schoolData.planStartDate)}
          />

          <InfoItem
            icon={CalendarDays}
            label="Plan End Date"
            value={formatDate(schoolData.planEndDate)}
          />
        </div>
      </div>

      <SchoolInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        schoolData={schoolData}
      />
    </div>
  );
}
