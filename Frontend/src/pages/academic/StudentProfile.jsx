import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Download, Pencil } from "lucide-react";
import PersonalInfoModal from "../../components/academics/addNewStudent/Modal/PersonalInfoModal";
import ParentInfoModal from "../../components/academics/addNewStudent/Modal/ParentInfoModal";
import AdmissionInfoModal from "../../components/academics/addNewStudent/Modal/AdmissionInfoModal";
import DocumentUploadModal from "../../components/academics/addNewStudent/Modal/DocumentUploadModal";
import FeeConcessionModal from "../../components/academics/addNewStudent/Modal/FeeConcessionModal";

export default function StudentProfile() {
  const [openSection, setOpenSection] = useState("");
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Account");
  const [openExam, setOpenExam] = useState(null);
  const [showConcessionModal, setShowConcessionModal] = useState(false);

  const student = {
    admissionNo: "1118",
    rollNo: "NA",
    name: "PRATYUSHA TANDI",
    photo: "https://i.pravatar.cc/200",
  };

  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Aadhar Card",
      file: "aadhar.pdf",
    },
    {
      id: 1,
      title: "Aadhar Card",
      file: "aadhar.pdf",
    },
    {
      id: 1,
      title: "Aadhar Card",
      file: "aadhar.pdf",
    },
    {
      id: 1,
      title: "Aadhar Card",
      file: "aadhar.pdf",
    },
  ]);

  const sections = [
    {
      key: "personal",
      title: "Personal Information",
    },
    {
      key: "parent",
      title: "Parent Information",
    },
    {
      key: "admission",
      title: "Admission Information",
    },
    {
      key: "health",
      title: "Health Information",
    },
    {
      key: "documents",
      title: "Documents",
    },
    {
      key: "certificates",
      title: "Certificates",
    },
  ];

  const certificates = [
    {
      name: "Transfer Certificate",
      status: "Issued",
    },
    {
      name: "Character Certificate",
      status: "Not Issued",
    },
    {
      name: "Migration Certificate",
      status: "Not Issued",
    },
  ];

  const exams = [
    {
      id: 1,
      name: "Test",
      date: "10/03/2024 - 31/03/2024",
      subjects: [
        {
          subject: "English",
          type: "Scholastic",
          total: 100,
          min: 35,
          obtained: 80,
        },
        {
          subject: "Maths",
          type: "Scholastic",
          total: 100,
          min: 35,
          obtained: 90,
        },
      ],
    },
    {
      id: 2,
      name: "Final Exam",
      date: "01/04/2024 - 30/04/2024",
      subjects: [
        {
          subject: "Science",
          type: "Scholastic",
          total: 100,
          min: 35,
          obtained: 75,
        },
      ],
    },
  ];

  const libraryBooks = [
    {
      id: 1,
      bookId: "BK001",
      title: "Mathematics",
      cardId: "LIB1001",
      issuedOn: "10-01-2026",
      returnDate: "20-01-2026",
      returnedOn: "18-01-2026",
      fine: 0,
    },
    {
      id: 2,
      bookId: "BK002",
      title: "Science",
      cardId: "LIB1001",
      issuedOn: "15-02-2026",
      returnDate: "25-02-2026",
      returnedOn: "-",
      fine: 50,
    },
  ];

  const attendanceData = [
    {
      month: "Apr-2024",
      holiday: 0,
      sunday: 4,
      attendance: 0,
      present: 0,
      leave: 0,
      avg: "NA%",
    },
    {
      month: "May-2024",
      holiday: 0,
      sunday: 4,
      attendance: 0,
      present: 0,
      leave: 0,
      avg: "NA%",
    },
    {
      month: "Jun-2024",
      holiday: 0,
      sunday: 5,
      attendance: 0,
      present: 0,
      leave: 0,
      avg: "NA%",
    },
  ];

  const eventsData = [
    {
      id: 1,
      name: "Annual Day",
      category: "Annual",
      subCategory: "Day",
      date: "02-05-2026 to 03-05-2026",
      venue: "School",
      level: "2",
      position: "First",
    },
    {
      id: 2,
      name: "Cricket Tournament",
      category: "Annual",
      subCategory: "Day",
      date: "02-05-2026 to 03-05-2026",
      venue: "School",
      level: "2",
      position: "First",
    },
    {
      id: 3,
      name: "Dance Competition",
      category: "Annual",
      subCategory: "Day",
      date: "04-05-2026 to 08-05-2026",
      venue: "School",
      level: "2",
      position: "Third",
    },
  ];

  const counsellingData = [
    {
      id: 1,
      reason: "Misbehavior in class",
      intervention:
        "Behavior Reinforcement, commonly part of intrinsic coaching methodologies",
      date: "19-06-2025",
      submittedBy: "AARTI DESHPANDE",
    },
    {
      id: 2,
      reason: "Misbehavior in class",
      intervention:
        "Behavior Reinforcement, commonly part of intrinsic coaching methodologies",
      date: "19-06-2025",
      submittedBy: "AARTI DESHPANDE",
    },
  ];

  const medicalRecords = [
    {
      id: 1,
      complaint: "Stomach pain",
      treatment: "Student took rest",
      date: "30-05-2025",
      submittedBy: "SUGUNA C",
    },
    {
      id: 2,
      complaint: "Wound on hand, elbow",
      treatment: "Dressing done",
      date: "10-02-2025",
      submittedBy: "SUGUNA C",
    },
  ];

  const diaryData = [
    {
      id: 1,
      type: "Positive",
      title: "Achievement",
      description: "Exceptional creativity in art project — keep it up!",
      date: "02-11-2025",
      subject: "Dance - Practical",
      category: "Outstanding Performance",
      teacher: "Tony Patel",
    },

    {
      id: 2,
      type: "Positive",
      title: "Appreciation",
      description:
        "Excellent behavior and discipline shown during lab session.",
      date: "02-11-2025",
      subject: "Hindi - Theory",
      category: "Good Behavior",
      teacher: "Tony Patel",
    },

    {
      id: 3,
      type: "Negative",
      title: "Late Submission",
      description: "Assignment submitted after deadline.",
      date: "01-11-2025",
      subject: "English - Theory",
      category: "Discipline",
      teacher: "Tony Patel",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Student Profile</h1>

        <Link to="/academic/all-students" className="text-blue-400">
          Back to All Students
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}

        <div className="col-span-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex gap-4">
              <img
                src={student.photo}
                alt=""
                className="w-20 h-20 rounded-full"
              />

              <div>
                <span className="bg-indigo-600 px-1 py-1 rounded text-xs font-normal text-white">
                  Admission Number :{student.admissionNo}
                </span>

                <h1 className="text-xl text-white mt-2">{student.name}</h1>

                <div className="flex items-center gap-2">
                  <span className="mt-2 border gap-2 border-red-500 text-red-400 rounded-md inline-block px-2 py-1 text-sm font-normal">
                    IV
                  </span>
                  <div className="mt-2 border border-indigo-500 text-indigo-400 rounded-lg inline-block px-2 py-1 text-sm font-normal">
                    Roll Number : {student.rollNo}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {sections.map((item) => (
                <div
                  key={item.key}
                  className="border border-gray-800 rounded-xl"
                >
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() =>
                        setOpenSection(openSection === item.key ? "" : item.key)
                      }
                      className="flex items-center gap-2 text-white"
                    >
                      {item.title}

                      {openSection === item.key ? (
                        <ChevronUp size={18} className="cursor-pointer" />
                      ) : (
                        <ChevronDown size={18} className="cursor-pointer" />
                      )}
                    </button>

                    {["personal", "parent", "admission"].includes(item.key) && (
                      <button
                        onClick={() => {
                          if (item.key === "personal") {
                            setShowPersonalModal(true);
                          }

                          if (item.key === "parent") {
                            setShowParentModal(true);
                          }

                          if (item.key === "admission") {
                            setShowAdmissionModal(true);
                          }
                        }}
                        className="p-2 rounded-lg text-blue-400 border border-blue-400 cursor-pointer"
                      >
                        <Pencil size={14} className="text-white" />
                      </button>
                    )}
                  </div>

                  {openSection === item.key && item.key === "personal" && (
                    <div className="border-t border-gray-800 p-2">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 font-normal text-sm">
                              Aadhar Number :
                            </td>

                            <td className="p-2 text-white text-sm">
                              828009599441
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 font-normal text-sm">
                              Date of Birth :
                            </td>

                            <td className="p-2 text-white text-sm">
                              22/08/2019
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 font-normal text-sm">
                              Category :
                            </td>

                            <td className="p-2 text-sm font-normal text-white">
                              General
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-3 text-gray-400 font-normal text-sm">
                              Religion :
                            </td>

                            <td className="p-3 text-white font-normal text-sm">
                              Hindu
                            </td>
                          </tr>

                          <tr>
                            <td className="p-3 text-gray-400 font-medium font-normal text-sm">
                              Address :
                            </td>

                            <td className="p-3 text-white font-normal text-sm">
                              BKD-13 OUT HOUSE ST.35 SECTOR-09
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {openSection === item.key && item.key === "parent" && (
                    <div className="border-t border-gray-800 p-2">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Father's Name :
                            </td>

                            <td className="p-2 text-white text-sm">
                              RADHESHYAM TANDI
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Mother's Name :
                            </td>

                            <td className="p-2 text-white text-sm">
                              MADNABATI TANDI
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Phone :
                            </td>

                            <td className="p-2 text-white text-sm">
                              9770855427
                            </td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Email :
                            </td>

                            <td className="p-2 text-white text-sm">
                              demo@gmail.com
                            </td>
                          </tr>

                          <tr>
                            <td className="p-2 text-gray-400 text-sm">
                              Parent From HAL :
                            </td>

                            <td className="p-2 text-white text-sm">NHAL</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {openSection === item.key && item.key === "admission" && (
                    <div className="border-t border-gray-800 p-2">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Admission No :
                            </td>

                            <td className="p-2 text-white text-sm">1118</td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Academic Year :
                            </td>

                            <td className="p-2 text-white text-sm">2026-27</td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Board :
                            </td>

                            <td className="p-2 text-white text-sm">CBSE</td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Class :
                            </td>

                            <td className="p-2 text-white text-sm">IV</td>
                          </tr>

                          <tr>
                            <td className="p-2 text-gray-400 text-sm">
                              Roll Number :
                            </td>

                            <td className="p-2 text-white text-sm">NA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {openSection === item.key && item.key === "health" && (
                    <div className="border-t border-gray-800 p-2">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Blood Group :
                            </td>
                            <td className="p-2 text-white text-sm">O+</td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Height :
                            </td>
                            <td className="p-2 text-white text-sm">NA CM</td>
                          </tr>

                          <tr className="border-b border-gray-800">
                            <td className="p-2 text-gray-400 text-sm">
                              Weight :
                            </td>
                            <td className="p-2 text-white text-sm">NA KG</td>
                          </tr>

                          <tr>
                            <td className="p-2 text-gray-400 text-sm">
                              BMI Score :
                            </td>
                            <td className="p-2 text-white text-sm">NA</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-6 border-t border-gray-800 pt-4">
                        <h3 className="text-white text-sm mb-4">
                          Vaccination Report
                          <span className="text-gray-500 text-xs ml-1">
                            If Any
                          </span>
                        </h3>

                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="p-2 text-left text-gray-400 text-sm">
                                Title
                              </th>
                              <th className="p-2 text-left text-gray-400 text-sm">
                                Date
                              </th>
                              <th className="p-2 text-left text-gray-400 text-sm">
                                File
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {/* Vaccination data yaha map kar sakta hai */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {openSection === item.key && item.key === "certificates" && (
                    <div className="border-t border-gray-800 p-3">
                      <table className="w-full border border-gray-800">
                        <tbody>
                          {certificates.map((cert, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-800 last:border-b-0"
                            >
                              <td className="p-3 text-gray-300 font-medium">
                                {cert.name}
                              </td>

                              <td className="p-3 text-gray-400">
                                {cert.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {openSection === item.key && item.key === "documents" && (
                    <div className="border-t border-gray-800 p-4">
                      <button
                        onClick={() => setShowDocumentModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-normal cursor-pointer"
                      >
                        + Add New Documents
                      </button>

                      <div className="mt-4 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="p-3 text-left text-gray-300">
                                Title
                              </th>

                              <th className="p-3 text-left text-gray-300">
                                File
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {documents.map((doc) => (
                              <tr
                                key={doc.id}
                                className="border-t border-gray-800"
                              >
                                <td className="p-3 text-white">
                                  {doc.title} :{" "}
                                </td>

                                <td className="p-3">
                                  <a href="#" className="text-blue-400">
                                    {doc.file}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="col-span-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            {/* Tabs */}
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-8 border-b border-gray-800 pb-4 whitespace-nowrap min-w-max">
                {[
                  "Account",
                  "Academic",
                  "Library",
                  "Attendance",
                  "Events",
                  "Counselling",
                  "Medical Record",
                  "Diary",
                  "Transportation",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 cursor-pointer transition-all flex-shrink-0
          ${
            activeTab === tab
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }
        `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === "Account" && (
              <>
                <div className="flex justify-between items-center mt-6">
                  <h2 className="text-2xl text-white">
                    Concession : No Concession
                  </h2>

                  <button
                    onClick={() => setShowConcessionModal(true)}
                    className="px-3 py-3 rounded-lg bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white"
                  >
                    <Pencil size={14} />
                  </button>
                </div>

                {/* Cards */}

                <div className="grid grid-cols-3 gap-5 mt-6">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-gray-300 text-sm font-normal">
                      TOTAL FEE
                    </p>

                    <h3 className="text-2xl text-blue-400 mt-3">₹0</h3>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-gray-300 text-sm font-normal">
                      FEE PAID
                    </p>

                    <h3 className="text-2xl text-green-400 mt-3">₹0</h3>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-gray-300 text-sm font-normal">FEE DUE</p>

                    <h3 className="text-2xl text-red-400 mt-3">₹0</h3>
                  </div>
                </div>

                {/* Transaction Table */}

                <div className="mt-10">
                  <h2 className="text-2xl text-white mb-5">All Transactions</h2>

                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="p-4 text-left text-gray-300">Sn.</th>

                          <th className="p-4 text-left text-gray-300">
                            Receipt No
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Receipt Date
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Amount
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Payment Mode
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Remark
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="p-4 text-white">1.</td>

                          <td className="p-4 text-white">RC001</td>

                          <td className="p-4 text-white whitespace-nowrap">
                            01-06-2026
                          </td>

                          <td className="p-4 text-white">₹5000</td>

                          <td className="p-4 text-white">Cash</td>

                          <td className="p-4 text-white">
                            {" "}
                            Transaction Successful
                          </td>

                          <td className="p-4">
                            <button className="px-3 py-2 cursor-pointer bg-blue-600 rounded-lg text-white">
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {activeTab === "Academic" && (
              <div className="mt-6 space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      onClick={() =>
                        setOpenExam(openExam === exam.id ? null : exam.id)
                      }
                      className="flex items-center justify-between p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <h1 className="text-white text-md font-medium">
                          {exam.name}
                        </h1>

                        <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-md text-sm">
                          {exam.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                          %
                        </button>

                        {openExam === exam.id ? (
                          <ChevronUp className="text-white" size={18} />
                        ) : (
                          <ChevronDown className="text-white" size={18} />
                        )}
                      </div>
                    </div>

                    {/* Table */}
                    {openExam === exam.id && (
                      <div className="border-t border-gray-800 p-4">
                        <div className="overflow-x-auto custom-scrollbar">
                          <table className="w-full">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="p-3 text-left text-gray-300">
                                  SN.
                                </th>

                                <th className="p-3 text-left text-gray-300">
                                  Subject Name
                                </th>

                                <th className="p-3 text-left text-gray-300">
                                  Subject Type
                                </th>

                                <th className="p-3 text-left text-gray-300">
                                  Total Marks
                                </th>

                                <th className="p-3 text-left text-gray-300">
                                  Min Marks
                                </th>

                                <th className="p-3 text-left text-gray-300">
                                  Obtained Marks
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {exam.subjects.map((subject, index) => (
                                <tr
                                  key={index}
                                  className="border-t border-gray-800"
                                >
                                  <td className="p-3 text-white text-sm font-normal">
                                    {index + 1}.
                                  </td>

                                  <td className="p-3 text-white">
                                    {subject.subject}
                                  </td>

                                  <td className="p-3 text-white">
                                    {subject.type}
                                  </td>

                                  <td className="p-3 text-white">
                                    {subject.total}
                                  </td>

                                  <td className="p-3 text-white">
                                    {subject.min}
                                  </td>

                                  <td className="p-3 text-green-400 font-medium">
                                    {subject.obtained}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Library" && (
              <div className="mt-6 space-y-6">
                {/* Fine Card */}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5">
                  <h3 className="text-white text-xl font-semibold">
                    Total Fine : ₹
                    {libraryBooks.reduce((total, item) => total + item.fine, 0)}
                  </h3>
                </div>

                {/* Table */}

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden custom-scrollbar">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="p-4 text-left text-gray-300">SN.</th>

                          <th className="p-4 text-left text-gray-300">
                            Book Id
                          </th>

                          <th className="p-4 text-left text-gray-300">Title</th>

                          <th className="p-4 text-left text-gray-300">
                            Card Id
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Issued On
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Return On/Before
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Returned On
                          </th>

                          <th className="p-4 text-left text-gray-300">Fine</th>
                        </tr>
                      </thead>

                      <tbody>
                        {libraryBooks.length > 0 ? (
                          libraryBooks.map((book, index) => (
                            <tr
                              key={book.id}
                              className="border-t border-gray-800"
                            >
                              <td className="p-4 text-white">{index + 1}.</td>

                              <td className="p-4 text-white">{book.bookId}</td>

                              <td className="p-4 text-white">{book.title}</td>

                              <td className="p-4 text-white">{book.cardId}</td>

                              <td className="p-4 text-white whitespace-nowrap">
                                {book.issuedOn}
                              </td>

                              <td className="p-4 text-white whitespace-nowrap">
                                {book.returnDate}
                              </td>

                              <td className="p-4 text-white whitespace-nowrap">
                                {book.returnedOn}
                              </td>

                              <td className="p-4">
                                <span
                                  className={`font-medium ${
                                    book.fine > 0
                                      ? "text-red-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  ₹{book.fine}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="p-8 text-center text-gray-400"
                            >
                              No Library Records Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Attendance" && (
              <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-4 text-left text-gray-300">Month</th>
                        <th className="p-4 text-center text-gray-300">
                          Holiday
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Sunday
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Total Attendance
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Total Present
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Total Leave
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Avg Attendance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceData.map((item, index) => (
                        <tr key={index} className="border-t border-gray-800">
                          <td className="p-4 text-white font-medium whitespace-nowrap">
                            {item.month}
                          </td>

                          <td className="p-4 text-center text-blue-400">
                            {item.holiday}
                          </td>

                          <td className="p-4 text-center text-red-400">
                            {item.sunday}
                          </td>

                          <td className="p-4 text-center text-white">
                            {item.attendance}
                          </td>

                          <td className="p-4 text-center text-green-400">
                            {item.present}
                          </td>

                          <td className="p-4 text-center text-yellow-400">
                            {item.leave}
                          </td>

                          <td className="p-4 text-center">
                            <span className="px-3 py-1 bg-indigo-600 rounded-md text-white text-sm">
                              {item.avg}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "Events" && (
              <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-4 text-left text-gray-300">SN.</th>
                        <th className="p-4 text-left text-gray-300">
                          Event Name
                        </th>
                        <th className="p-4 text-left text-gray-300">
                          Category
                        </th>
                        <th className="p-4 text-left text-gray-300">
                          Sub Category
                        </th>
                        <th className="p-4 text-left text-gray-300">Date</th>
                        <th className="p-4 text-left text-gray-300">Venue</th>
                        <th className="p-4 text-left text-gray-300">Level</th>
                        <th className="p-4 text-left text-gray-300">
                          Position
                        </th>
                        <th className="p-4 text-center text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {eventsData.map((event, index) => (
                        <tr key={event.id} className="border-t border-gray-800">
                          <td className="p-4 text-white">{index + 1}.</td>

                          <td className="p-4 text-white">{event.name}</td>

                          <td className="p-4 text-white">{event.category}</td>

                          <td className="p-4 text-white">
                            {event.subCategory}
                          </td>

                          <td className="p-4 text-white whitespace-nowrap">
                            {" "}
                            <div>{event.date.split(" to ")[0]} to</div>
                            <div>{event.date.split(" to ")[1]}</div>
                          </td>

                          <td className="p-4 text-white">{event.venue}</td>

                          <td className="p-4 text-white">{event.level}</td>

                          <td className="p-4">
                            <span className="text-green-400 font-medium">
                              {event.position}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "Counselling" && (
              <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-4 text-left text-gray-300">SN.</th>

                        <th className="p-4 text-left text-gray-300">
                          Referral Reason
                        </th>

                        <th className="p-4 text-left text-gray-300">
                          Intervention
                        </th>

                        <th className="p-4 text-left text-gray-300">Date</th>

                        <th className="p-4 text-left text-gray-300">
                          Submitted By
                        </th>

                        <th className="p-4 text-center text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {counsellingData.map((item, index) => (
                        <tr key={item.id} className="border-t border-gray-800">
                          <td className="p-4 text-white">{index + 1}.</td>

                          <td className="p-4 text-white">{item.reason}</td>

                          <td className="p-4 text-white max-w-md">
                            {item.intervention}
                          </td>

                          <td className="p-4 text-white whitespace-nowrap">
                            {item.date}
                          </td>

                          <td className="p-4 text-white">{item.submittedBy}</td>

                          <td className="p-4 text-center">
                            <button className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400 hover:bg-blue-500/30">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "Medical Record" && (
              <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-4 text-left text-gray-300">SN.</th>

                        <th className="p-4 text-left text-gray-300">
                          Complaint
                        </th>

                        <th className="p-4 text-left text-gray-300">
                          Treatment
                        </th>

                        <th className="p-4 text-left text-gray-300">Date</th>

                        <th className="p-4 text-left text-gray-300">
                          Submitted By
                        </th>

                        <th className="p-4 text-center text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {medicalRecords.map((item, index) => (
                        <tr key={item.id} className="border-t border-gray-800">
                          <td className="p-4 text-white">{index + 1}.</td>

                          <td className="p-4 text-white">{item.complaint}</td>

                          <td className="p-4 text-white">{item.treatment}</td>

                          <td className="p-4 text-white whitespace-nowrap">
                            {item.date}
                          </td>

                          <td className="p-4 text-white">{item.submittedBy}</td>

                          <td className="p-4 text-center">
                            <button className="p-2 rounded-lg cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "Diary" && (
              <div className="space-y-6 mt-6">
                {/* Top Summary */}

                {/* <div className="flex flex-wrap items-center justify-between gap-4"> */}
                <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
                      <span className="text-sm text-white">
                        Total: {diaryData.length}
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-sm text-green-400">
                        Positive:{" "}
                        {
                          diaryData.filter((item) => item.type === "Positive")
                            .length
                        }
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="text-sm text-red-400">
                        Negative:{" "}
                        {
                          diaryData.filter((item) => item.type === "Negative")
                            .length
                        }
                      </span>
                    </div>
                  </div>

                  {/* Filters */}

                  <div className="flex items-center gap-2 ml-auto">
                    <select className="w-36 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer">
                      <option>All Types</option>
                      <option>Positive</option>
                      <option>Negative</option>
                    </select>

                    <select className="w-36 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer">
                      <option>All Months</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                    </select>

                    {/* <input
                      type="date"
                      className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white cursor-pointer"
                    /> */}
                  </div>
                </div>

                {/* Diary Cards */}

                {diaryData.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-900 border rounded-2xl p-6
                          ${
                            item.type === "Positive"
                              ? "border-green-500/30"
                              : "border-red-500/30"
                          }`}
                  >
                    <div className="flex justify-between gap-5">
                      {/* Left */}

                      <div className="space-y-4">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                                ${
                                  item.type === "Positive"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                        >
                          {item.type}
                        </span>

                        <p className="text-gray-400">{item.date}</p>
                      </div>

                      {/* Right */}

                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h1 className="text-xl font-bold text-white">
                              {item.title}
                            </h1>

                            <p className="text-gray-300 mt-2 font-normal text-md">
                              {item.description}
                            </p>
                          </div>

                          <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm whitespace-nowrap">
                            {item.subject}
                          </span>
                        </div>

                        <div className="border-t border-gray-800 mt-6 pt-5 flex justify-between items-center">
                          <span className="uppercase text-gray-400 font-medium text-md">
                            Category: {item.category}
                          </span>

                          <span className="text-gray-400">
                            Added By :
                            <span className="text-white font-semibold ml-2">
                              {item.teacher}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <PersonalInfoModal
        isOpen={showPersonalModal}
        onClose={() => setShowPersonalModal(false)}
      />
      <ParentInfoModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
      />

      <AdmissionInfoModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
      />

      <DocumentUploadModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        setDocuments={setDocuments}
      />

      <FeeConcessionModal
        isOpen={showConcessionModal}
        onClose={() => setShowConcessionModal(false)}
      />
    </div>
  );
}
