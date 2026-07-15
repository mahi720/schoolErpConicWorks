import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Library,
  Settings,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Wallet,
  Bus,
  Warehouse,
  FileBarChart,
  PartyPopper,
  HeartPulse,
  HandHelping,
  Folder,
  Megaphone,
  MessageSquare,
  Crown,
  MessageCircle,
  LifeBuoy,
  Contact,
} from "lucide-react";
import {
  useApp,
  // sidebarOpen,
  // setSidebarOpen,
  // setSidebarWidth,
  // sidebarWidth,
} from "../../context/AppContext";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    label: "Master",
    icon: Settings,
    href: "/master",
    submenu: [
      { label: "Sessions Year", href: "/master/sessions" },
      { label: "Board", href: "/master/board" },
      { label: "Classes", href: "/master/classes" },
      { label: "Subjects", href: "/master/subjects" },
      // { label: "Stream", href: "/master/stream" },
      // { label: "Section", href: "/master/section" },
      // { label: "Class Section & Teachers", href: "/master/section-teacher" },
      // { label: "Subjects", href: "/master/subjects" },
      // { label: "Teachers", href: "/master/teachers" },
      {
        label: "Fees",
        href: "/master/fees",
        submenu: [
          { label: "Fees Type", href: "/master/fees/fees-type" },
          { label: "Manage Fees", href: "/master/fees/manage-fees" },
          { label: "Student Fees", href: "/master/fees/student-fees" },
          { label: "Other Fees", href: "/master/fees/other-fees" },
          {
            label: "Fees Transaction Logs",
            href: "/master/fees/fees-transaction-logs",
          },
        ],
      },
      { label: "Remarks", href: "/master/remarks" },
      { label: "School Info", href: "/master/school-info" },
      { label: "Payment Info", href: "/master/payment-info" },
    ],
  },
  {
    label: "Academic",
    icon: BookOpen,
    href: "/academic",
    submenu: [
      {
        label: "Student Admission Application",
        href: "/academic/student-admission-application",
      },
      { label: "All Students", href: "/academic/all-students" },
      { label: "Inactive Students", href: "/academic/inactive-students" },
      {
        label: "Stream & Section Manager",
        href: "/academic/stream-section-manager",
      },
      // { label: "Roll Number Manager", href: "/academic/roll-number-manager" },
      { label: "ID Cards", href: "/academic/id-cards" },
      { label: "Attendance", href: "/academic/attendance" },
      { label: "Academic Calendar", href: "/academic/academic-calendar" },
      { label: "Leave Application", href: "/academic/leave-application" },
      { label: "Student Promotion", href: "/academic/promotion" },
      { label: "Alumni", href: "/academic/alumni" },
      { label: "Certificates", href: "/academic/certificates" },
      {
        label: "Certificates2",
        href: "/academic/certificates2",
        submenu: [
          {
            label: "TC & CC",
            href: "/academic/certificates/tc-cc",
          },
          {
            label: "Other Certificate",
            href: "/academic/certificates/other",
          },
        ],
      },
      {
        label: "Health Management",
        href: "/academic/student-health-management",
      },
      { label: "Weekly Plan", href: "/academic/weekly-plan" },
    ],
  },
  {
    label: "Exam Manager",
    icon: ClipboardList,
    href: "/exam",
    submenu: [
      { label: "Assignments", href: "/exam/assignments" },
      {
        label: "Offline Exam",
        href: "/exam/offline-exam",
        submenu: [
          {
            label: "Exam Type",
            href: "/exam/offline-exam/exam-type",
          },

          { label: "Term Exam", href: "/exam/offline-exam/term-exam" },
          {
            label: "Periodic Test / Unit Test",
            href: "/exam/offline-exam/periodic-test",
          },
        ],
      },
      {
        label: "Online Exam",
        href: "/exam/online-exam",
        submenu: [
          {
            label: "Manage Online Exam",
            href: "/exam/online-exam/manage-online-exam",
          },
          {
            label: "Manage Questions",
            href: "/exam/online-exam/manage-questions",
          },
          {
            label: "Add Bulk Questions",
            href: "/exam/online-exam/add-bulk-questions",
          },
        ],
      },

      {
        label: "Mark Submission",
        href: "/exam/mark-submission",
        submenu: [
          {
            label: "Unit Test / Periodic Test",
            href: "/exam/mark-submission/unit-test",
          },
          {
            label: "Term Exam",
            href: "/exam/mark-submission/term-exam",
          },
          {
            label: "Topic Wise",
            href: "/exam/mark-submission/topic-wise",
          },
          {
            label: "Co-Scholastic/Remark",
            href: "/exam/mark-submission/co-scholastic",
          },
        ],
      },
      { label: "Marksheet", href: "/exam/marksheet" },
      {
        label: "Reports",
        href: "/exam/report",
        submenu: [
          {
            label: "Complete Report 1",
            href: "/exam/report/complete-report-1",
          },
          {
            label: "Complete Report 2",
            href: "/exam/report/complete-report-2",
          },
          {
            label: "Complete Report Exam wise",
            href: "/exam/report/complete-report-exam-wise",
          },
        ],
      },
      // { label: "Marks", href: "/exam/marks" },
      // { label: "Reports", href: "/exam/reports" },
    ],
  },
  {
    label: "HRM",
    icon: Briefcase,
    href: "/hrm",
    submenu: [
      { label: "Dashboard", href: "/hrm/dashboard" },
      { label: "Employees", href: "/hrm/employees" },
      { label: "Attendance", href: "/hrm/attendance-management" },
      { label: "Salary", href: "/hrm/salary-management" },
      { label: "Events", href: "/hrm/event" },
      { label: "Holidays", href: "/hrm/holidays" },
      { label: "Hiring", href: "/hrm/hiring" },
      {
        label: "Leave Management",
        href: "/hrm/leave-management",
        submenu: [
          {
            label: "Staff Leave Application",
            href: "/hrm/leave-management/staff-leave-application",
          },
          {
            label: "Leave Reports",
            href: "/hrm/leave-management/leave-reports",
          },
        ],
      },
      { label: "Settings", href: "/hrm/settings" },
    ],
  },
  {
    label: "Library",
    icon: Library,
    href: "/library",
    submenu: [
      { label: "Dashboard", href: "/library/dashboard" },
      { label: "Students", href: "/library/studentList" },
      { label: "Employees", href: "/library/employeeList" },
      { label: "Books", href: "/library/books" },
      { label: "Past Issues", href: "/library/past/issues" },
      { label: "Categories", href: "/library/categories" },
      { label: "Authors", href: "/library/book-author" },
      { label: "Publishers", href: "/library/book-publisher" },
      { label: "Racks", href: "/library/book-racks" },
      { label: "Settings", href: "/library/settings" },
    ],
  },

  {
    label: "Accounts",
    icon: Wallet,
    href: "/accounts",
    submenu: [
      { label: "Dashboard", href: "/accounts/dashboard" },
      {
        label: "Fees",
        href: "/accounts/fees-collection",
        submenu: [
          {
            label: "Fee Type",
            href: "/accounts/fees-collection/fees-type",
          },
          {
            label: "Fee Concession",
            href: "/accounts/fees-collection/fee-concession",
          },
          {
            label: "Fee Collection",
            href: "/accounts/fees-collection/fee-collection",
          },
          {
            label: "Other Fee Collection",
            href: "/accounts/fees-collection/other-fee-collection",
          },
          {
            label: "Previous dues fee",
            href: "/accounts/fees-collection/previous-due-fees",
          },
          {
            label: "Donation Students",
            href: "/accounts/fees-collection/donation-students",
          },
          // {
          //   label: "Reports",
          //   href: "/accounts/fees-collection/reports",
          //   submenu: [
          //     {
          //       label: "Due Fees Report",
          //       href: "/accounts/fees-collection/reports/due-fees-report",
          //     },
          //     {
          //       label: "Fee Paid Report",
          //       href: "/accounts/fees-collection/reports/fee-paid-report",
          //     },
          //     {
          //       label: "Late Fee Report",
          //       href: "/accounts/fees-collection/reports/late-fee-report",
          //     },
          //     {
          //       label: "TC & Inactive Fee Report",
          //       href: "/accounts/fees-collection/reports/tc-inactive-fee-report",
          //     },
          //     {
          //       label: "Due Fee Report (Other)",
          //       href: "/accounts/fees-collection/reports/due-fee-report-other",
          //     },
          //     {
          //       label: "Payment Logs",
          //       href: "/accounts/fees-collection/reports/payment-logs",
          //     },
          //   ],
          // },
        ],
      },
      {
        label: "Reports",
        href: "/accounts/report",
        submenu: [
          {
            label: "Due Fees Report",
            href: "/accounts/report/due-fees-report",
          },
          {
            label: "Fee Paid Report",
            href: "/accounts/report/fee-paid-report",
          },
          {
            label: "Late Fees Report",
            href: "/accounts/report/late-fees-report",
          },
          {
            label: "TC & Inactive Fee Report",
            href: "/accounts/report/tc-inactive-fee-report",
          },
          {
            label: "Due Fee Report (Other)",
            href: "/accounts/report/due-fee-report-other",
          },
          {
            label: "Payment Logs",
            href: "/accounts/report/payment-logs",
          },
        ],
      },
      {
        label: "Expenses",
        href: "/accounts/expenses",
        submenu: [
          {
            label: "Manage Categories",
            href: "/accounts/expenses/manage-categories",
          },
          {
            label: "Manage Expenses",
            href: "/accounts/expenses/manage-expenses",
          },
        ],
      },
    ],
  },

  {
    label: "Transportation Module",
    icon: Bus,
    href: "/transportation",
    submenu: [
      { label: "Dashboard", href: "/transportation/dashboard" },
      { label: "Vehicles", href: "/transportation/vehicles" },
      {
        label: "Pickup Points",
        href: "/transportation/pickup-points",
      },
      { label: "Routes", href: "/transportation/routes" },
      { label: "Drivers/Helper", href: "/transportation/driver-helper" },
      { label: "Route Vehicles", href: "/transportation/Route-Vehicles" },
      { label: "Allocation", href: "/transportation/allocation" },
      { label: "Expenses", href: "/transportation/expenses" },
      { label: "Transport Reports", href: "/transportation/transport-reports" },
    ],
  },

  {
    label: "Inventory",
    icon: Warehouse,
    href: "/inventory",
    submenu: [
      { label: "Dashboard", href: "/inventory/dashboard" },
      { label: "Categories", href: "/inventory/category" },
      { label: "Sub-Categories", href: "/inventory/sub-category" },
      { label: "Brand", href: "/inventory/brand" },
      {
        label: "Products",
        href: "/inventory/products",
        submenu: [
          { label: "Product List", href: "/inventory/products/product-list" },
          { label: "Issued Items", href: "/inventory/products/issued-items" },
          { label: "Damaged Items", href: "/inventory/products/damaged-items" },
          {
            label: "Product Issue Logs",
            href: "/inventory/products/issue-return-logs",
          },
        ],
      },
      { label: "Vendor", href: "/inventory/vendor" },
      { label: "Orders", href: "/inventory/orders" },
      {
        label: "Purchase",
        href: "/inventory/purchase",
        submenu: [
          {
            label: "Purchase Entry",
            href: "/inventory/purchase/purchase-entry",
          },
          { label: "Purchase Logs", href: "/inventory/purchase/purchase-logs" },
        ],
      },
    ],
  },

  {
    label: "Reports",
    icon: FileBarChart,
    href: "/reports",
    submenu: [
      { label: "Dashboard", href: "/reports/dashboard" },
      { label: "Student Reports", href: "/reports/student-reports" },
      { label: "Teacher Reports", href: "/reports/teacher-reports" },
      { label: "Exam Reports", href: "/reports/exam-reports" },
      { label: "Expense Reports", href: "/reports/expense-reports" },
    ],
  },

  {
    label: "Event Manager",
    icon: PartyPopper,
    href: "/event-manager",
  },

  {
    label: "Medical Records",
    icon: HeartPulse,
    href: "/medical-records",
  },

  {
    label: "Counselling",
    icon: HandHelping,
    href: "/counselling",
  },

  {
    label: "Notice Manager",
    icon: Megaphone,
    href: "/notice-manager",
  },

  {
    label: "SMS Manager",
    icon: MessageSquare,
    href: "/sms-manager",
  },

  {
    label: "File Manager",
    icon: Folder,
    href: "/file-manager",
  },

  {
    label: "Communication & Media",
    icon: MessageCircle,
    href: "/communication-media",
    submenu: [
      { label: "Dashboard", href: "/communication-media/dashboard" },
      {
        label: "Student Diary",
        href: "/communication-media/student-diary",
        submenu: [
          {
            label: "Diary Category",
            href: "/communication-media/student-diary/diary-category",
          },
          {
            label: "Manage Diaries",
            href: "/communication-media/student-diary/manage-diaries",
          },
        ],
      },
      { label: "Notification", href: "/communication-media/notification" },
      { label: "Announcements", href: "/communication-media/announcements" },
      { label: "Gallery", href: "/communication-media/gallery" },
    ],
  },

  {
    label: "Subscription & Plans",
    icon: Crown,
    href: "/subscription-plans",
    submenu: [
      { label: "Subscription", href: "/subscription-plans/subscription" },
      { label: "Plans", href: "/subscription-plans/plans" },
      { label: "Addons", href: "/subscription-plans/addons" },
    ],
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },

  {
    label: "Contact",
    icon: Contact,
    href: "/contact",
  },

  {
    label: "Support",
    icon: LifeBuoy,
    href: "/support",
  },
];

export default function Sidebar() {
  const { sidebarOpen, sidebarWidth, setSidebarWidth } = useApp();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  // const [sidebarWidth, setSidebarWidth] = useState(260);
  // const { sidebarOpen, sidebarWidth, setSidebarWidth } = useApp();
  const [isResizing, setIsResizing] = useState(false);

  const toggleExpand = (href) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;

      if (newWidth >= 220 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-[width] duration-100`}
      style={{
        width: sidebarOpen ? `${sidebarWidth}px` : "80px",
      }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-blue-500 transition-all duration-200"
      />
      <div className="h-full overflow-y-auto custom-scrollbar">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedItems.includes(item.href);
            const isSubmenuActive = item.submenu?.some(
              (sub) => location.pathname === sub.href,
            );

            return (
              <div key={item.href}>
                {hasSubmenu ? (
                  <button
                    onClick={() => sidebarOpen && toggleExpand(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      isActive || isSubmenuActive
                        ? "bg-blue-600 text-white"
                        : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                    }`}
                    title={!sidebarOpen ? item.label : ""}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors block cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                    }`}
                    title={!sidebarOpen ? item.label : ""}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight size={16} />}
                      </>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && sidebarOpen && isExpanded && (
                  <div className="ml-4 space-y-1 mt-1 border-l-2 border-muted">
                    {/* {item.submenu.map((subitem) => {
                      const isSubActive = location.pathname === subitem.href;
                      return (
                        <Link
                          key={subitem.href}
                          to={subitem.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                            isSubActive
                              ? "bg-blue-600/20 text-blue-600"
                              : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                          }`}
                        >
                          <span className="flex-1">{subitem.label}</span>
                          {isSubActive && <ChevronRight size={14} />}
                        </Link>
                      );
                    })} */}

                    {item.submenu.map((subitem) => {
                      const isSubActive = location.pathname === subitem.href;
                      const hasNestedSubmenu =
                        subitem.submenu && subitem.submenu.length > 0;

                      return (
                        <div key={subitem.href}>
                          {hasNestedSubmenu ? (
                            <>
                              <button
                                onClick={() => toggleExpand(subitem.href)}
                                className={`w-full flex cursor-pointer items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                  isSubActive
                                    ? "bg-blue-600/20 text-blue-600"
                                    : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                                }`}
                              >
                                <span className="flex-1 text-left">
                                  {subitem.label}
                                </span>

                                <ChevronDown
                                  size={14}
                                  className={`transition-transform ${
                                    expandedItems.includes(subitem.href)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>

                              {expandedItems.includes(subitem.href) && (
                                <div className="ml-4 mt-1 space-y-1 border-l border-muted">
                                  {subitem.submenu.map((nestedItem) => {
                                    const isNestedActive =
                                      location.pathname === nestedItem.href;

                                    return (
                                      <Link
                                        key={nestedItem.href}
                                        to={nestedItem.href}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                          isNestedActive
                                            ? "bg-blue-600/20 text-blue-600"
                                            : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                                        }`}
                                      >
                                        <span className="flex-1">
                                          {nestedItem.label}
                                        </span>

                                        {isNestedActive && (
                                          <ChevronRight size={14} />
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              to={subitem.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                isSubActive
                                  ? "bg-blue-600/20 text-blue-600"
                                  : "text-black dark:text-white hover:bg-gray-800 dark:bg-gray-700"
                              }`}
                            >
                              <span className="flex-1">{subitem.label}</span>

                              {isSubActive && <ChevronRight size={14} />}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
