import React, { useState } from "react";
import {
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  AlertCircle,
  Search,
} from "lucide-react";

const StudentAttendanceTransportation = () => {
  const [activeTab, setActiveTab] = useState("pickup"); // pickup | drop
  const [currentMonth, setCurrentMonth] = useState(7); // August = 7 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  // 10 Students Data
  const students = [
    {
      id: 1,
      name: "Aarav Sharma",
      class: "10-A",
      rollNo: "01",
    },
    { id: 2, name: "Priya Patel", class: "10-A", rollNo: "02" },
    { id: 3, name: "Rohit Singh", class: "10-B", rollNo: "03" },
    { id: 4, name: "Sneha Reddy", class: "10-B", rollNo: "04" },
    { id: 5, name: "Amit Kumar", class: "10-C", rollNo: "05" },
    { id: 6, name: "Neha Jain", class: "10-C", rollNo: "06" },
    { id: 7, name: "Vikram Raj", class: "10-A", rollNo: "07" },
    { id: 8, name: "Kavya Nair", class: "10-B", rollNo: "08" },
    { id: 9, name: "Deepak Gupta", class: "10-C", rollNo: "09" },
    { id: 10, name: "Ananya Reddy", class: "10-A", rollNo: "10" },
  ];

  // Generate attendance data for each student per month
  const generateAttendance = (studentId, month, year) => {
    // Random attendance for demo
    const date = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const attendance = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const random = Math.random();
      if (random < 0.7) attendance[day] = "present";
      else if (random < 0.85) attendance[day] = "absent";
      else if (random < 0.95) attendance[day] = "holiday";
      else attendance[day] = "not-marked";
    }
    return attendance;
  };

  // State for attendance data
  const [attendanceData] = useState(() => {
    const data = {};
    students.forEach((student) => {
      data[student.id] = {
        pickup: generateAttendance(student.id, 7, 2026),
        drop: generateAttendance(student.id, 7, 2026),
      };
    });
    return data;
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDayName = (day, month, year) => {
    return new Date(year, month, day).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "holiday":
        return "bg-yellow-500";
      case "not-marked":
        return "bg-gray-500";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle size={10} className="text-green-400" />;
      case "absent":
        return <XCircle size={10} className="text-red-400" />;
      case "holiday":
        return <MinusCircle size={10} className="text-yellow-400" />;
      case "not-marked":
        return <AlertCircle size={10} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "holiday":
        return "Holiday";
      case "not-marked":
        return "Not marked";
      default:
        return "";
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const gridColumns = {
    gridTemplateColumns: `180px repeat(${daysInMonth}, 28px) 100px`,
  };

  // Calculate stats for a student
  const getStudentStats = (studentId, type) => {
    const data = attendanceData[studentId]?.[type] || {};
    const values = Object.values(data);
    const present = values.filter((v) => v === "present").length;
    const absent = values.filter((v) => v === "absent").length;
    const holiday = values.filter((v) => v === "holiday").length;
    const notMarked = values.filter((v) => v === "not-marked").length;
    return { present, absent, holiday, notMarked };
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-cyan-400" />
          <h2 className="text-white font-semibold">Student Attendance</h2>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-gray-400">Present</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-gray-400">Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="text-gray-400">Holiday</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
            <span className="text-gray-400">Not marked</span>
          </div>
        </div>
      </div>

      {/* Pickup/Drop Tabs */}
      <div className="flex items-center justify-between mt-4 mb-3">
        {/* left side tabs */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("pickup")}
            className={`px-5 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-medium transition ${
              activeTab === "pickup"
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            <MapPin size={16} />
            Pickup
          </button>

          <button
            onClick={() => setActiveTab("drop")}
            className={`px-5 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-medium transition ${
              activeTab === "drop"
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            <Clock size={16} />
            Drop
          </button>
        </div>

        {/* right side month */}

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:text-white cursor-pointer text-gray-500 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {/* <Calendar size={16} className="text-cyan-400" /> */}

            <span className="text-white font-medium">
              {months[currentMonth]} {currentYear}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:text-white cursor-pointer text-gray-500 transition"
          >
            <ChevronRight size={18} />
          </button>

          <div className="relative w-42">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search..."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mt-4 mb-3">
        {/* Legend */}
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1350px] max-h-[450px] overflow-y-auto custom-scrollbar">
          {/* Header Row - Days */}
          <div style={gridColumns} className="grid gap-1 mb-1 items-center">
            <div className="text-gray-400 text-xs font-medium px-2 py-2">
              Student details
            </div>
            {days.map((day) => (
              <div
                key={day}
                className="w-10 flex justify-center text-gray-400 text-[10px] font-medium"
              >
                {day}
              </div>
            ))}
            <div className="text-gray-400 text-xs font-medium px-2 py-2 text-right">
              Status
            </div>
          </div>

          {/* Student Rows */}
          <div className="space-y-1">
            {students.map((student) => {
              const stats = getStudentStats(student.id, activeTab);
              const studentData = attendanceData[student.id]?.[activeTab] || {};

              return (
                <div
                  key={student.id}
                  style={gridColumns}
                  className="grid gap-1 bg-gray-700/30 rounded-lg px-2 py-3 hover:bg-gray-700/50 transition items-center"
                >
                  {/* Student Info */}
                  {/* Student Info */}
                  <div className="flex items-start gap-2 px-2 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <User size={14} className="text-cyan-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium whitespace-normal break-words leading-5">
                        {student.name}
                      </div>

                      <div className="text-gray-500 text-[10px] whitespace-normal break-words">
                        {student.class} • Roll #{student.rollNo}
                      </div>
                    </div>
                  </div>
                  {/* Days - First 7 days */}
                  {days.map((day) => {
                    const status = studentData[day] || "not-marked";

                    return (
                      <div
                        key={day}
                        className="flex items-center justify-center"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${getStatusColor(status)}`}
                        >
                          {getStatusIcon(status)}
                        </div>
                      </div>
                    );
                  })}
                  {/* Stats Summary */}
                  <div className="flex items-center justify-end gap-1.5 px-2">
                    <span className="text-green-400 text-xs font-medium">
                      {stats.present}
                    </span>
                    <span className="text-red-400 text-xs font-medium">
                      {stats.absent}
                    </span>
                    <span className="text-yellow-400 text-xs font-medium">
                      {stats.holiday}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      {stats.notMarked}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
        <div className="text-gray-400 text-sm">
          Showing <span className="text-white">1-10</span> of{" "}
          <span className="text-white">10</span> students
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`w-8 h-8 rounded-lg cursor-pointer text-sm font-medium transition ${
                num === 1
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceTransportation;
