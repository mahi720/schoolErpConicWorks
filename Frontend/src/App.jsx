import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";

// Master pages
import Sessions from "./pages/master/Sessions";
import Board from "./pages/master/Board";
import Classes from "./pages/master/Classes";
import Teachers from "./pages/master/Teachers";
import Subjects from "./pages/master/Subjects";
import Remarks from "./pages/master/Remarks";
import SchoolInfo from "./pages/master/SchoolInfo";

// Academic pages
import Students from "./pages/academic/Students";
// import Attendance from "./pages/academic/Attendance";
import Certificates from "./pages/academic/Certificates";

// Exam pages
import Timetable from "./pages/exam/Timetable";
import Marks from "./pages/exam/Marks";
import Reports from "./pages/exam/Reports";
import Assignments from "./pages/exam/Assignments";

// Library pages
import Books from "./pages/library/Books";
import Issues from "./pages/library/Issues";
import Members from "./pages/library/Members";
import Categories from "./pages/library/Categories";

import NotFound from "./pages/NotFound";
import PaymentInfo from "./pages/master/PaymentInfo";
import FeesType from "./pages/master/Fees/FeeTypes";
import ManageFees from "./pages/master/Fees/ManangeFees";
import StudentFees from "./pages/master/Fees/StudentFees";
import PayCompulsoryFees from "./pages/master/Fees/PayCompulsoryFees";
import OtherFees from "./pages/master/Fees/OtherFees";
import PayOtherFees from "./pages/master/Fees/PayOtherFees";
import TransactionLogs from "./pages/master/Fees/TransactionLogs";
import AllStudents from "./pages/academic/AllStudents";
import StudentProfile from "./pages/academic/StudentProfile";
import InactiveStudents from "./pages/academic/InactiveStudent";
import StreamSectionManager from "./pages/academic/StreamSectionManager";
import RollNumberManager from "./pages/academic/RollNumberManager";
import AcademicCalendar from "./pages/academic/AcademicCalender";
import StudentLeaveApplications from "./pages/academic/StudentLeaveApplications";
import Promotion from "./pages/academic/Promotion";
import AttendanceManager from "./pages/academic/AttendanceManager";
import AttendanceReport from "./components/academics/LockAttendanceModal/AttendanceReport";
import DailyAttendanceReport from "./components/academics/LockAttendanceModal/DailyAttendanceReport";
import WeeklyPlan from "./pages/academic/WeeklyPlan";
import StudentHealthManagement from "./pages/academic/StudentHealthManagement";
import ExamType from "./pages/exam/OfflineExam/ExamType";
import TermExam from "./pages/exam/OfflineExam/TermExam";
import ManageExamTimeTable from "./pages/exam/OfflineExam/ManageExamTimeTable";
import PeriodicTest from "./pages/exam/OfflineExam/PeriodicTest";
import ManagePeriodicTestExamTimeTable from "./pages/exam/OfflineExam/ManagePeriodicTestTimeTable";
// import UnitMarkSubmission from "./pages/exam/OfflineExam/UnitMarkSubmission";
// import TermMarkSubmission from "./pages/exam/OfflineExam/TermMarkSubmission";
import TopicWiseMarkSubmission from "./pages/exam/MarkSubmission/TopicWiseMarkSubmission";
import CoScholasticMarkSubmission from "./pages/exam/MarkSubmission/CoScholasticMarkSubmission";
import TermMarkSubmission from "./pages/exam/MarkSubmission/TermMarkSubmission";
import UnitMarkSubmission from "./pages/exam/MarkSubmission/UnitMarkSubmission";
import Settings from "./pages/HRM/Settings/Settings";
import PaybandStructure from "./pages/HRM/PaybandStructure";
import Employee from "./pages/HRM/Employees/Employee";
import AddEmployee from "./pages/HRM/Employees/AddEmployeeForm";
import SalaryStructure from "./pages/HRM/Employees/SalaryStructure";
import AttendanceManagement from "./pages/HRM/AttendanceManagement/AttendanceManagement";
import EmployeesSalary from "./pages/HRM/Salaries/EmployeesSalary";
import SalaryDetails from "./pages/HRM/Salaries/SalaryDetails";
import EventCalendar from "./pages/HRM/Event/EventCalendar";
import Holiday from "./pages/HRM/Holiday/Holiday";
import Hiring from "./pages/HRM/Hiring/Hiring";
import Applications from "./components/HRM/HIring/Applications";
import StudentList from "./pages/library/StudentList";
import StudentDetail from "./pages/library/StudentDetail";
import AllIssues from "./components/library/AllIssues";
import LibrarySettings from "./pages/library/LibrarySettings";
import BookRack from "./pages/library/BookRacks";
import BookPublisher from "./pages/library/BookPublisher";
import BookAuthors from "./pages/library/Authors";
import BookCategory from "./pages/library/BookCategory";
import PastIssues from "./pages/library/PastIssues";
import InactiveBooks from "./pages/library/InactiveBooks";
import BookList from "./pages/library/BookList";
import BookDetails from "./pages/library/BookDetails";
import Employees from "./pages/library/Employees";
import AllIssuesBookListEmployee from "./components/library/Employees/AllIssuesBookLIstEmployee";
import EmployeeDetail from "./pages/library/Employees/EmployeesDetails";
import Category from "./pages/Inventory/Category";
import SubCategory from "./pages/Inventory/SubCategory";
import Brand from "./pages/Inventory/Brand";
import Products from "./pages/Inventory/Product/ProductList";
import ProductDetails from "./pages/Inventory/Product/ProductDetails";
import ProductIssue from "./pages/Inventory/Product/ProductIssue";
import IssuedItemsList from "./pages/Inventory/Product/IssuedItemsList";
import DamagedItemsList from "./pages/Inventory/Product/DamagedItemsList";
import IssueReturnLogs from "./pages/Inventory/Product/IssueReturnLogs";
import Vendor from "./pages/Inventory/Vendor";
import ManageVehicles from "./pages/TransportationModule/ManageVehicles";
import ManagePickupPoints from "./pages/TransportationModule/ManagePickupPoints";
import ManageTransportationFees from "./pages/TransportationModule/ManageTransportationFees";
import ManageRoutes from "./pages/TransportationModule/ManageRoutes";
import ChangeRouteOrder from "./pages/TransportationModule/ChangeRouteOrder";
import ManageDriverHelper from "./pages/TransportationModule/ManageDriverHelper";
import ManageRouteVehicles from "./pages/TransportationModule/ManageRouteVehicles";
import RouteVehicleDetails from "./components/transportation/RouteVehicleDetails";
import StudentAttendanceTransportation from "./components/transportation/StudentAttendanceTransportation";
import Login from "./pages/Auth/LoginAuth";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import AuthInitializer from "./components/authInitializer/AuthInitializer";
// import OnlineAdmissionModal from "./components/academics/studentAdmissionApplication/OnlineAdmissionModal";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Toaster
            toastOptions={{
              style: {
                border: "1px solid #713200",
                padding: "16px",
                color: "#713200",
                background: "#FFFAEE",
                borderRadius: "12px",
                fontWeight: "500",
              },
              iconTheme: {
                primary: "#713200",
                secondary: "#FFFAEE",
              },
            }}
            position="top-right"
          />
          <AuthInitializer>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        {/* Master Routes */}
                        <Route path="/master/sessions" element={<Sessions />} />
                        <Route path="/master/board" element={<Board />} />
                        <Route path="/master/classes" element={<Classes />} />
                        <Route path="/master/teachers" element={<Teachers />} />
                        <Route path="/master/subjects" element={<Subjects />} />
                        {/* <Route path="/master/fees" element={<Fees />} /> */}
                        <Route path="/master/remarks" element={<Remarks />} />
                        <Route
                          path="/master/school-info"
                          element={<SchoolInfo />}
                        />
                        <Route
                          path="/master/payment-info"
                          element={<PaymentInfo />}
                        />
                        <Route
                          path="/master/fees/fees-type"
                          element={<FeesType />}
                        />

                        {/* Academic Routes */}
                        <Route
                          path="/academic/student-admission-application"
                          element={<Students />}
                        />
                        <Route
                          path="/academic/all-students"
                          element={<AllStudents />}
                        />
                        <Route
                          path="/academic/student-profile/:id"
                          element={<StudentProfile />}
                        />
                        <Route
                          path="/academic/stream-section-manager"
                          element={<StreamSectionManager />}
                        />
                        <Route
                          path="/academic/Inactive-students"
                          element={<InactiveStudents />}
                        />
                        <Route
                          path="/academic/roll-number-manager"
                          element={<RollNumberManager />}
                        />
                        <Route
                          path="/academic/attendance"
                          element={<AttendanceManager />}
                        />
                        <Route
                          path="/academic/attendance/attendance-report"
                          element={<AttendanceReport />}
                        />
                        <Route
                          path="/academic/attendance/daily-attendance-report"
                          element={<DailyAttendanceReport />}
                        />
                        <Route
                          path="/academic/academic-calendar"
                          element={<AcademicCalendar />}
                        />
                        <Route
                          path="/academic/leave-application"
                          element={<StudentLeaveApplications />}
                        />
                        <Route
                          path="/academic/promotion"
                          element={<Promotion />}
                        />
                        <Route
                          path="/academic/weekly-plan"
                          element={<WeeklyPlan />}
                        />
                        <Route
                          path="/academic/student-health-management"
                          element={<StudentHealthManagement />}
                        />
                        <Route
                          path="/academic/certificates"
                          element={<Certificates />}
                        />

                        {/* Exam Routes */}
                        <Route
                          path="/exam/assignments"
                          element={<Assignments />}
                        />
                        <Route
                          path="/exam/offline-exam/exam-type"
                          element={<ExamType />}
                        />
                        <Route
                          path="/exam/offline-exam/term-exam"
                          element={<TermExam />}
                        />
                        <Route
                          path="/exam/offline-exam/term-exam/exam-info"
                          element={<ManageExamTimeTable />}
                        />
                        <Route
                          path="/exam/offline-exam/periodic-test"
                          element={<PeriodicTest />}
                        />
                        <Route
                          path="/exam/offline-exam/periodic-test/exam-info"
                          element={<ManagePeriodicTestExamTimeTable />}
                        />
                        <Route
                          path="/exam/mark-submission/unit-test"
                          element={<UnitMarkSubmission />}
                        />
                        <Route
                          path="/exam/mark-submission/term-exam"
                          element={<TermMarkSubmission />}
                        />
                        <Route
                          path="/exam/mark-submission/topic-wise"
                          element={<TopicWiseMarkSubmission />}
                        />
                        <Route
                          path="/exam/mark-submission/co-scholastic"
                          element={<CoScholasticMarkSubmission />}
                        />
                        {/* <Route path="/exam/timetable" element={<Timetable />} />
                        <Route path="/exam/marks" element={<Marks />} />
                        <Route path="/exam/reports" element={<Reports />} /> */}

                        {/* HRM Routes */}
                        <Route path="/hrm/dashboard" element={<Dashboard />} />
                        <Route path="/hrm/employees" element={<Employee />} />
                        <Route
                          path="/hrm/employees/add-employee-form"
                          element={<AddEmployee />}
                        />
                        <Route
                          path="/hrm/employees/salary-structure"
                          element={<SalaryStructure />}
                        />
                        <Route
                          path="/hrm/attendance-management"
                          element={<AttendanceManagement />}
                        />
                        <Route
                          path="/hrm/salary-management"
                          element={<EmployeesSalary />}
                        />
                        <Route
                          path="/hrm/salary-management/salary-details"
                          element={<SalaryDetails />}
                        />
                        <Route path="/hrm/event" element={<EventCalendar />} />
                        <Route path="/hrm/holidays" element={<Holiday />} />
                        <Route path="/hrm/hiring" element={<Hiring />} />
                        <Route
                          path="/hrm/hiring/applications"
                          element={<Applications />}
                        />
                        <Route path="/hrm/settings" element={<Settings />} />
                        <Route
                          path="/hrm/settings/payband-structure"
                          element={<PaybandStructure />}
                        />

                        {/* Library Routes */}
                        <Route
                          path="/library/dashboard"
                          element={<Dashboard />}
                        />
                        <Route
                          path="/library/studentList"
                          element={<StudentList />}
                        />
                        <Route
                          path="/library/employeeList"
                          element={<Employees />}
                        />
                        <Route
                          path="/library/employeeList/all-issues"
                          element={<AllIssuesBookListEmployee />}
                        />
                        <Route
                          path="/library/employeeList/employee-detail"
                          element={<EmployeeDetail />}
                        />
                        <Route
                          path="/library/studentList/student-detail"
                          element={<StudentDetail />}
                        />
                        <Route
                          path="/library/student-detail/all-issues"
                          element={<AllIssues />}
                        />
                        <Route path="/library/books" element={<Books />} />
                        <Route
                          path="/library/past/issues"
                          element={<PastIssues />}
                        />
                        <Route path="/library/members" element={<Members />} />
                        <Route
                          path="/library/categories"
                          element={<BookCategory />}
                        />
                        <Route
                          path="/library/book-racks"
                          element={<BookRack />}
                        />
                        <Route
                          path="/library/book-author"
                          element={<BookAuthors />}
                        />
                        <Route
                          path="/library/book-publisher"
                          element={<BookPublisher />}
                        />
                        <Route
                          path="/library/books/books-list"
                          element={<BookList />}
                        />
                        <Route
                          path="/library/books/inactive-books"
                          element={<InactiveBooks />}
                        />
                        <Route
                          path="/library/books/book-details"
                          element={<BookDetails />}
                        />
                        <Route
                          path="/library/settings"
                          element={<LibrarySettings />}
                        />

                        {/* Inventory Routes */}
                        <Route
                          path="/inventory/category"
                          element={<Category />}
                        />
                        <Route
                          path="/inventory/sub-category"
                          element={<SubCategory />}
                        />
                        <Route path="/inventory/brand" element={<Brand />} />
                        <Route
                          path="/inventory/products/product-list"
                          element={<Products />}
                        />
                        <Route
                          path="/inventory/products/product-list/product-details"
                          element={<ProductDetails />}
                        />
                        <Route
                          path="/inventory/products/product-list/item-issue"
                          element={<ProductIssue />}
                        />
                        <Route
                          path="/inventory/products/issued-items"
                          element={<IssuedItemsList />}
                        />
                        <Route
                          path="/inventory/products/damaged-items"
                          element={<DamagedItemsList />}
                        />
                        <Route
                          path="/inventory/products/issue-return-logs"
                          element={<IssueReturnLogs />}
                        />
                        <Route path="/inventory/vendor" element={<Vendor />} />

                        {/* Transportation Modules */}
                        <Route
                          path="/transportation/vehicles"
                          element={<ManageVehicles />}
                        />
                        <Route
                          path="/transportation/pickup-points"
                          element={<ManagePickupPoints />}
                        />
                        <Route
                          path="/transportation/pickup-points/manageTransportationFees"
                          element={<ManageTransportationFees />}
                        />
                        <Route
                          path="/transportation/routes"
                          element={<ManageRoutes />}
                        />
                        <Route
                          path="/transportation/routes/change-order"
                          element={<ChangeRouteOrder />}
                        />
                        <Route
                          path="/transportation/driver-helper"
                          element={<ManageDriverHelper />}
                        />
                        <Route
                          path="/transportation/route-vehicles"
                          element={<ManageRouteVehicles />}
                        />
                        <Route
                          path="/transportation/route-vehicles/details"
                          element={<RouteVehicleDetails />}
                        />
                        <Route
                          path="/transportation/student-attendance-transportation"
                          element={<StudentAttendanceTransportation />}
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthInitializer>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
