import React, { useState } from "react";
import { Pencil } from "lucide-react";
import SchoolInfoModal from "../../components/schoolInfo/SchoolInfoModal";

export default function SchoolInfo() {
  const [showModal, setShowModal] = useState(false);

  const [schoolData, setSchoolData] = useState({
    schoolName: "GITF- BHILAI ISPAT VIKAS VIDYALAYA",

    contact: "9179368763",

    email: "admin@bivvk.com",

    contactPerson: "Admin",

    address: "SECTOR 11 KHURSIPAR BHILAI C.G.",

    affiliation: "NA",

    logo: "https://via.placeholder.com/250",
  });

  // Logo upload function
  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setSchoolData((prev) => ({
        ...prev,
        logo: imageUrl,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="bg-gray-800 p-3 rounded-xl">
        <h1 className="text-3xl font-bold text-white">School Info</h1>

        <p className="text-gray-400 mt-1">Manage school information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Card */}

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-xl">Logo</h2>

            {/* Upload logo button */}

            <label className="bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-700">
              <Pencil size={16} className="text-white" />

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-center">
            <img
              src={schoolData.logo}
              alt="School Logo"
              className="w-[280px] h-[280px] object-contain rounded-xl border border-gray-700"
            />
          </div>
        </div>

        {/* Detail Card */}

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-xl">Details</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              <Pencil size={16} className="text-white" />
            </button>
          </div>

          <div className="mt-5 space-y-1">
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">School Name:</span>

              <span className="text-white text-right">
                {schoolData.schoolName}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">Contact:</span>

              <span className="text-white">{schoolData.contact}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">Email:</span>

              <span className="text-white">{schoolData.email}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">
                Contact Person:
              </span>

              <span className="text-white">{schoolData.contactPerson}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">Address:</span>

              <span className="text-white text-right max-w-[300px]">
                {schoolData.address}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">Affiliation:</span>

              <span className="text-white">{schoolData.affiliation}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">School ID:</span>

              <span className="text-white">{schoolData.schoolId}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">
                Lecture Count:
              </span>

              <span className="text-white">{schoolData.lectureCount}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">
                Teaching Saturday:
              </span>

              <span className="text-white">{schoolData.teachingSaturday}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-400">Classrooms:</span>

              <span className="text-white">{schoolData.classrooms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Details only */}

      <SchoolInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        schoolData={schoolData}
        setSchoolData={setSchoolData}
      />
    </div>
  );
}
