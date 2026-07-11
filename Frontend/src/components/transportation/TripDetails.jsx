import React, { useRef, useState } from "react";
import { Calendar, Navigation } from "lucide-react";

const TripDetails = () => {
  const [date, setDate] = useState("2026-07-02");
  const dateRef = useRef(null);
  const pickup = [
    {
      stop: "Sector 1",
      sched: "09:40 AM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 2",
      sched: "09:42 AM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 3",
      sched: "09:43 AM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 4",
      sched: "09:46 AM",
      actual: "Pending",
      delay: "—",
    },
  ];

  const drop = [
    {
      stop: "Sector 1",
      sched: "05:40 PM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 2",
      sched: "05:42 PM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 3",
      sched: "05:46 PM",
      actual: "Pending",
      delay: "—",
    },
    {
      stop: "Sector 4",
      sched: "05:48 PM",
      actual: "Pending",
      delay: "—",
    },
  ];

  return (
    <div className="mt-6">
      {/* heading */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl text-white font-semibold">
            Trip performance
          </h2>

          <p className="text-gray-400 text-sm">
            Comparison of scheduled vs actual timings
          </p>
        </div>

        <div
          onClick={() => dateRef.current.showPicker()}
          className="relative bg-gray-800 border border-gray-700 rounded-lg px-5 py-2 flex items-center gap-3 text-gray-300 cursor-pointer hover:border-cyan-500 transition"
        >
          <Calendar size={17} className="text-cyan-400" />

          <span>{date.split("-").reverse().join("-")}</span>

          <input
            ref={dateRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 min-w-0">
        <TripCard title="PICKUP TRIP" data={pickup} />

        <TripCard title="DROP TRIP" data={drop} />
      </div>
    </div>
  );
};

const TripCard = ({ title, data }) => {
  return (
    <div>
      {/* card heading */}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-700 p-2 rounded-lg">
            <Navigation size={18} className="text-cyan-400" />
          </div>

          <h3 className="text-cyan-400 font-semibold tracking-wide">{title}</h3>
        </div>

        <span className="bg-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full text-xs font-semibold">
          UPCOMING
        </span>
      </div>

      {/* table */}

      <div className="border border-gray-700 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-800">
            <tr>
              {["Stop name", "Sched.", "Actual", "delay"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-4 text-gray-300">{item.stop}</td>

                <td className="px-4 py-4 text-gray-300">{item.sched}</td>

                <td className="px-4 py-4 text-gray-300">{item.actual}</td>

                <td className="px-4 py-4 text-gray-500">{item.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripDetails;
