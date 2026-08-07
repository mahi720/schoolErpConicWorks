import React, { useEffect, useState } from "react";
import {
  Search,
  Upload,
  Download,
  Plus,
  Edit,
  BanknoteArrowUp,
  Trash2,
  RefreshCcw,
  Loader2,
  KeyRound,
  ShieldCheck,
  ShieldOff,
  ArrowLeftRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import LoginStatusModal from "../../../components/HRM/Employee/LoginStatus";
import ConfirmModal from "../../../components/HRM/Employee/DRF";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";
import EmployeeLoginAccountModal from "../../../components/HRM/Employee/EmployeeLoginAccountModal";
import EmployeeImportModal from "../../../components/HRM/Employee/EmployeeImportModal";
import EmployeeTransferModal from "../../../components/HRM/Employee/EmployeeTransferModal";

const getLoginStatusCode = (loginStatus) => {
  switch (loginStatus) {
    case "FLEXIBLE":
      return "F";

    case "NO_BOUNDATION":
      return "B";

    case "DEFAULT":
    default:
      return "D";
  }
};

const getNatureLabel = (value) => {
  if (!value) {
    return "-";
  }

  const labels = {
    PERMANENT: "Permanent",
    CONTRACTUAL: "Contractual",
    ADHOC: "Adhoc",
    TEMPORARY: "Temporary",
    PART_TIME: "Part Time",
    PROBATION: "Probation",
    GUEST_FACULTY: "Guest Faculty",
    DAILY_WAGES: "Daily Wages",
  };

  return labels[value] || value;
};

export default function Employees() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [loginModal, setLoginModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loginAccountModal, setLoginAccountModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);

  const {
    employees,
    loading,
    submitLoading,

    fetchEmployees,
    deleteEmployee,
    restoreEmployee,
    updateEmployee,
  } = useEmployeeStore();

  const updateLoginAccess = useEmployeeStore(
    (state) => state.updateLoginAccess,
  );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees({
        search: search.trim() || undefined,
      });
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search, fetchEmployees]);

  const handleOpenLoginModal = (employee) => {
    if (!employee.isActive) {
      return;
    }

    setSelectedEmployee(employee);
    setLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenDrfModal = (employee) => {
    if (!employee.isActive) {
      return;
    }

    setSelectedEmployee(employee);
    setConfirmModal(true);
  };

  const handleCloseDrfModal = () => {
    setConfirmModal(false);
    setSelectedEmployee(null);
  };

  const handleDrfUpdate = async () => {
    if (!selectedEmployee) {
      return;
    }

    const success = await updateEmployee(selectedEmployee.slug, {
      isDrfApplicable: !selectedEmployee.isDrfApplicable,
    });

    if (success) {
      handleCloseDrfModal();
    }
  };

  const handleOpenLoginAccount = (employee) => {
    setSelectedEmployee(employee);
    setLoginAccountModal(true);
  };

  const handleLoginAccess = async (employee) => {
    if (!employee?.loginAccount) {
      return;
    }

    await updateLoginAccess(employee.slug, !employee.loginAccount.isActive);
  };

  const handleDelete = async (employee) => {
    if (!employee?.slug) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteEmployee(employee.slug);
  };

  const handleRestore = async (employee) => {
    if (!employee?.slug) {
      return;
    }

    await restoreEmployee(employee.slug);
  };

  const handleEdit = (employee) => {
    navigate(`/hrm/employees/edit/${employee.slug}`);
  };

  const handleOpenTransferModal = (employee) => {
    if (!employee?.isActive) {
      return;
    }

    setSelectedEmployee(employee);

    setTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModal(false);

    setSelectedEmployee(null);
  };

  const handleSalaryStructure = (employee) => {
    navigate("/hrm/employees/salary-structure", {
      state: {
        employee,
      },
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
        <h2 className="text-xl text-white font-semibold">Employees</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white w-80 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setImportModal(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <Upload size={17} />
            Import Excel
          </button>

          <button
            type="button"
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <Download size={17} />
            Export
          </button>

          <button
            type="button"
            onClick={() => navigate("/hrm/employees/add-employee-form")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <Plus size={17} />
            Add New Employee
          </button>
        </div>
      </div>

      <div className="overflow-auto custom-scrollbar max-h-[70vh]">
        <table className="w-full min-w-[1450px]">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              {[
                "Sno.",
                // "E Sn.",
                "Emp Id",
                "Name/Code",
                "Department",
                "Designation",
                "Nature of Appointment",
                "Phone Number",
                "Email",
                "LS",
                "DRF",
                "Login Account",
                "Status",
                "Action",
              ].map((head) => (
                <th
                  key={head}
                  className="p-3 text-left text-gray-300 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="p-10">
                  <div className="flex justify-center items-center gap-2 text-gray-400">
                    <Loader2 size={20} className="animate-spin" />
                    Loading employees...
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={13} className="p-10 text-center text-gray-400">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((item, index) => {
                const loginCode = getLoginStatusCode(
                  item?.loginSetting?.loginStatus,
                );

                const departmentName =
                  item?.department?.name ||
                  item?.department?.departmentName ||
                  "-";

                const designationName =
                  item?.designation?.name ||
                  item?.designation?.designationName ||
                  "-";

                return (
                  <tr
                    key={item.slug}
                    className={`border-b border-gray-800 ${
                      item.isActive
                        ? "hover:bg-gray-800/50"
                        : "bg-red-950/10 opacity-70"
                    }`}
                  >
                    <td className="p-3 text-gray-300">{index + 1}</td>

                    {/* <td className="p-3 text-indigo-400 whitespace-nowrap">
                      {item.employeeSerial ?? "-"}
                    </td> */}

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {item.employeeId || "-"}
                    </td>

                    <td className="p-3 text-indigo-400 whitespace-nowrap">
                      <div className="font-medium">{item.fullName || "-"}</div>

                      {item.employeeCode && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.employeeCode}
                        </div>
                      )}
                    </td>

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {departmentName}
                    </td>

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {designationName}
                    </td>

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {getNatureLabel(item.natureOfAppointment)}
                    </td>

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {item.phoneNumber || "-"}
                    </td>

                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {item.email || "-"}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        disabled={!item.isActive}
                        onClick={() => handleOpenLoginModal(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white min-w-9 px-3 py-1 cursor-pointer"
                        title={item?.loginSetting?.loginStatus || "DEFAULT"}
                      >
                        {loginCode}
                      </button>
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        disabled={!item.isActive}
                        onClick={() => handleOpenDrfModal(item)}
                        className={`text-white px-3 py-1 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                          item.isDrfApplicable
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {item.isDrfApplicable ? "Yes" : "No"}
                      </button>
                    </td>

                    <td className="p-3">
                      {!item.loginAccount ? (
                        <button
                          type="button"
                          onClick={() => handleOpenLoginAccount(item)}
                          disabled={!item.isActive}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                          <KeyRound size={15} />
                          Create Login
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLoginAccess(item)}
                          disabled={!item.isActive}
                          className={`text-white px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.loginAccount.isActive
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {item.loginAccount.isActive ? (
                            <>
                              <ShieldCheck size={15} />
                              Login Active
                            </>
                          ) : (
                            <>
                              <ShieldOff size={15} />
                              Login Disabled
                            </>
                          )}
                        </button>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap ${
                          item.isTransferred
                            ? "bg-orange-700 text-orange-100"
                            : item.isActive
                              ? "bg-green-700 text-green-100"
                              : "bg-red-700 text-red-100"
                        }`}
                      >
                        {item.isTransferred
                          ? "Transferred"
                          : item.isActive
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        {item.isActive ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="text-white bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer p-2"
                              title="Edit Employee"
                            >
                              <Edit size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={submitLoading}
                              className="text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 p-2 rounded-lg cursor-pointer"
                              title="Delete Employee"
                            >
                              <Trash2 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSalaryStructure(item)}
                              className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer"
                              title="Salary Structure"
                            >
                              <BanknoteArrowUp size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenTransferModal(item)}
                              className="text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer p-2"
                              title="Transfer Employee"
                            >
                              <ArrowLeftRight size={17} />
                            </button>
                          </>
                        ) : item.isTransferred ? (
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-medium whitespace-nowrap">
                            <ArrowLeftRight size={15} />
                            Transferred
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(item)}
                            disabled={submitLoading}
                            className="text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg cursor-pointer"
                            title="Restore Employee"
                          >
                            <RefreshCcw size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <LoginStatusModal
        open={loginModal}
        close={handleCloseLoginModal}
        employee={selectedEmployee}
      />

      <ConfirmModal
        open={confirmModal}
        close={handleCloseDrfModal}
        employee={selectedEmployee}
        onConfirm={handleDrfUpdate}
        loading={submitLoading}
      />

      <EmployeeLoginAccountModal
        open={loginAccountModal}
        close={() => {
          setLoginAccountModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      <EmployeeImportModal
        open={importModal}
        close={() => setImportModal(false)}
      />

      <EmployeeTransferModal
        open={transferModal}
        close={handleCloseTransferModal}
        employee={selectedEmployee}
      />
    </div>
  );
}
