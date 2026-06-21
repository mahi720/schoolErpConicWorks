import React, { useState } from "react";
import { Edit, Trash2, Copy } from "lucide-react";
import HiringModal from "../../../components/HRM/HIring/HiringModal";
import VacancyModal from "../../../components/HRM/HIring/VacancyModal";
import { useNavigate } from "react-router-dom";

export default function Hiring() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [vacancyOpen, setVacancyOpen] = useState(false);

  const ads = [
    {
      id: 1,
      title: "New Ads-11/26 (Central and State)-Non Teaching Posts",
      year: "2026-27",
      vacancies: 7,
      startDate: "20-04-2026",
      lastDate: "20-05-2026",
      application: 98,
      info: "By Admin on 30-04-2026",
      status: "Active",
    },
    {
      id: 2,
      title: "New Ads-10/26 (Central and State)-Teaching Posts",
      year: "2026-27",
      vacancies: 6,
      startDate: "15-04-2026",
      lastDate: "15-05-2026",
      application: 183,
      info: "By Admin on 30-04-2026",
      status: "Active",
    },
    {
      id: 3,
      title: "New Ads-09/26 (Central and State)",
      year: "2026-27",
      vacancies: 6,
      startDate: "31-02-2026",
      lastDate: "31-03-2026",
      application: 11,
      info: "By Admin on 11-03-2026",
      status: "Disabled",
    },
    {
      id: 4,
      title: "New Advertisement-06/25 (Central and State)",
      year: "2025-26",
      vacancies: 5,
      startDate: "03-06-2025",
      lastDate: "03-07-2025",
      application: 80,
      info: "By Admin on 11-06-2025",
      status: "Disabled",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Advertisements</h1>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
        >
          Create New Advertisement
        </button>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Ad Title",
                  "Ad Year",
                  "Total Vacancies",
                  "Start Date",
                  "Last Date",
                  "Total Application",
                  "Creation Info",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-gray-300 font-semibold whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ads.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-4 text-gray-300">{item.id}.</td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {item.title}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {item.year}
                  </td>

                  <td
                    onClick={() => setVacancyOpen(true)}
                    className="p-4 text-indigo-400 cursor-pointer hover:underline font-semibold whitespace-nowrap"
                  >
                    {item.vacancies} Vacancies
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {item.startDate}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {item.lastDate}
                  </td>

                  <td
                    onClick={() =>
                      navigate("/hrm/hiring/applications", {
                        state: item,
                      })
                    }
                    className="p-4 cursor-pointer hover:underline text-red-400 font-semibold whitespace-nowrap"
                  >
                    {item.application} Applications
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {item.info}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-white text-sm ${
                        item.status === "Active" ? "bg-green-700" : "bg-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg text-white cursor-pointer">
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => {
                          setEditData(item);
                          setOpen(true);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-700 p-3 rounded-lg text-white cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>

                      <button className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <HiringModal
        open={open}
        close={() => setOpen(false)}
        editData={editData}
        // save={handleSave}
      />

      <VacancyModal open={vacancyOpen} close={() => setVacancyOpen(false)} />
    </div>
  );
}
