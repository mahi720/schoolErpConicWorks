import React, { createContext, useContext, useState } from "react";
import { mockData } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState("admin"); // admin, teacher, student
  const [students, setStudents] = useState(mockData.students);
  const [teachers, setTeachers] = useState(mockData.teachers);
  const [classes, setClasses] = useState(mockData.classes);
  const [exams, setExams] = useState(mockData.exams);
  const [books, setBooks] = useState(mockData.books);
  const [attendance, setAttendance] = useState(mockData.attendance);
  const [fees, setFees] = useState(mockData.fees);
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Mathematics",
      type: "Scholastic",
      order: 1,
      status: "Active",
    },
    {
      id: 2,
      name: "English",
      type: "Scholastic",
      order: 2,
      status: "Active",
    },
  ]);
  const [selectedBoard, setSelectedBoard] = useState("CBSE");
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedClass, setSelectedClass] = useState("All Subject");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addNotification = (message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 10));
  };

  const value = {
    // UI State
    sidebarOpen,
    toggleSidebar,
    userRole,
    setUserRole,
    setSidebarOpen,

    // Data
    students,
    setStudents,
    teachers,
    setTeachers,
    classes,
    setClasses,
    exams,
    setExams,
    books,
    setBooks,
    attendance,
    setAttendance,
    fees,
    setFees,
    notifications,
    setNotifications,
    addNotification,

    setSidebarWidth,
    sidebarWidth,

    subjects,
    setSubjects,

    selectedBoard,
    setSelectedBoard,

    selectedYear,
    setSelectedYear,

    selectedClass,
    setSelectedClass,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
