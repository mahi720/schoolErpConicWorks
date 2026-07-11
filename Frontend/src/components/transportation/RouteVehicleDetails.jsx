import React, { useState } from "react";
import {
  Bus,
  MapPin,
  Users,
  User,
  Clock,
  AlertTriangle,
  ChevronDown,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentAttendanceTransportation from "./StudentAttendanceTransportation";
import StaffAttendanceTransportation from "./StaffAttendanceTransportation";
import TripDetails from "./TripDetails";

const RouteVehicleDetails = () => {
  const [tab, setTab] = useState("pickup");
  const [activeStaff, setActiveStaff] = useState("driver");
  const navigate = useNavigate();

  const pickupPoints = [
    { name: "Sector 1", pickup: "09:40 AM", drop: "05:40 PM" },
    { name: "Sector 2", pickup: "09:42 AM", drop: "05:42 PM" },
    { name: "Sector 3", pickup: "09:43 AM", drop: "05:46 PM" },
    { name: "Sector 4", pickup: "09:46 AM", drop: "05:48 PM" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full">
      <div className="w-full space-y-6">
        {/* Header */}
        <h1 className="text-2xl text-white font-semibold tracking-wide">
          Route Vehicle Report
        </h1>

        {/* <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-6 h-[calc(100vh-150px)] w-full"> */}
        <div className="grid grid-cols-[35%_minmax(0,65%)] gap-6 h-[calc(100vh-150px)] w-full">
          {/* Left Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-fit">
            {/* Blue Header */}
            <div className="bg-blue-600 p-5">
              <div className="flex justify-between items-start">
                <Bus className="text-white" size={30} />
                <div className="text-right">
                  <p className="text-blue-200 text-[10px] font-medium tracking-wider">
                    ROUTE SHIFT
                  </p>
                  <h2 className="text-white font-bold text-sm">
                    Morning Shift
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-blue-200 text-[10px] font-medium tracking-wider">
                  ROUTE NAME
                </p>
                <h1 className="text-xl text-white font-bold">
                  Bhuj - madhapar
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Bus Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-[10px] font-medium tracking-wider">
                    BUS NUMBER
                  </p>
                  <h3 className="text-white font-bold text-lg">VH02</h3>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-[10px] font-medium tracking-wider">
                    TOTAL CAPACITY
                  </p>
                  <h3 className="text-white font-bold text-lg">40 seats</h3>
                </div>
              </div>

              {/* Operational Schedules */}
              <div>
                <p className="text-gray-400 text-[10px] font-medium tracking-wider mb-3">
                  OPERATIONAL SCHEDULES
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-[10px]">PICKUP START</p>
                    <h3 className="text-cyan-400 font-bold">08:26 AM</h3>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-[10px]">PICKUP END</p>
                    <h3 className="text-cyan-400 font-bold">09:49 AM</h3>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-[10px]">DROP START</p>
                    <h3 className="text-cyan-400 font-bold">02:26 PM</h3>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-[10px]">DROP END</p>
                    <h3 className="text-cyan-400 font-bold">05:49 PM</h3>
                  </div>
                </div>
              </div>

              {/* Assigned Staff */}
              <div>
                <p className="text-gray-400 text-[10px] font-medium tracking-wider mb-3">
                  ASSIGNED STAFF
                </p>

                {/* Staff Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setActiveStaff("driver")}
                    className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-medium transition ${
                      activeStaff === "driver"
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    Driver
                  </button>
                  <button
                    onClick={() => setActiveStaff("helper")}
                    className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-medium transition ${
                      activeStaff === "helper"
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    Helper
                  </button>
                </div>

                {/* Driver */}
                {activeStaff === "driver" && (
                  <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Rajesh Gandhi</h3>
                      <p className="text-gray-400 text-sm">9876543210</p>
                    </div>
                    <span className="text-cyan-400 text-xs font-medium bg-cyan-400/10 px-3 py-1 rounded-full">
                      DRIVER
                    </span>
                  </div>
                )}

                {/* Helper */}
                {activeStaff === "helper" && (
                  <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Suresh Kumar</h3>
                      <p className="text-gray-400 text-sm">9876501234</p>
                    </div>
                    <span className="text-cyan-400 text-xs font-medium bg-cyan-400/10 px-3 py-1 rounded-full">
                      HELPER
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 min-w-0 bg-gray-800 rounded-xl border border-gray-700 p-5 h-full flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
              <Tab
                active={tab === "pickup"}
                click={() => setTab("pickup")}
                icon={<MapPin size={15} />}
                text="Pickup points"
              />

              <Tab
                active={tab === "student"}
                click={() => setTab("student")}
                icon={<Users size={15} />}
                text="Student attendance"
              />
              <Tab
                active={tab === "staff"}
                click={() => setTab("staff")}
                icon={<User size={15} />}
                text="Staff attendance"
              />
              <Tab
                active={tab === "trip"}
                click={() => setTab("trip")}
                icon={<Clock size={15} />}
                text="Trip details"
              />
            </div>

            {/* Pickup Points Content */}
            {tab === "pickup" && (
              <div className="mt-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold">
                    Pickup point sequence
                  </h2>
                  <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                    4 Stops total
                  </span>
                </div>

                <div className="space-y-4 border-l-2 border-gray-700 pl-5 ml-2">
                  {pickupPoints.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[27px] mr-2 top-5 w-3.5 h-3.5 bg-gray-800 border-2 border-cyan-500 rounded-full"></span>

                      <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-white font-medium">
                              {item.name}
                            </h3>
                            <p className="text-gray-400 text-[10px] font-medium tracking-wide">
                              SEQUENCE STOP #{index + 1}
                            </p>
                          </div>
                          <div className="flex gap-8">
                            <div>
                              <p className="text-gray-400 text-[10px] font-medium">
                                PICKUP
                              </p>
                              <h4 className="text-cyan-400 font-bold">
                                {item.pickup}
                              </h4>
                            </div>
                            <div>
                              <p className="text-gray-400 text-[10px] font-medium">
                                DROP
                              </p>
                              <h4 className="text-cyan-400 font-bold">
                                {item.drop}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Tabs Placeholder */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {tab !== "pickup" && (
                <div className="mt-5 text-center text-gray-500">
                  {/* <p className="text-sm">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} content goes here
                </p> */}
                </div>
              )}
              {tab === "student" && <StudentAttendanceTransportation />}
              {tab === "staff" && <StaffAttendanceTransportation />}
              {tab === "trip" && <TripDetails />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Tab = ({ icon, text, active, click }) => (
  <button
    onClick={click}
    className={`px-4 py-1.5 rounded-full flex cursor-pointer items-center gap-2 text-sm transition ${
      active
        ? "bg-cyan-600 text-white"
        : "bg-gray-700 text-gray-400 hover:bg-gray-600"
    }`}
  >
    {icon}
    {text}
  </button>
);

export default RouteVehicleDetails;
