import React, { useEffect, useMemo, useState } from "react";

import {
  FileSpreadsheet,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

import GenerateWeeklyPlanModal from "../../components/academics/WeeklyPlanModal/GenerateWeeklyPlanModal";

import { useWeeklyPlanStore } from "../../store/academic/weeklyPlan/weeklyPlanStore";

const formatDate = (value) => {
  if (!value) {
    return "NA";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

const getBoardTitle = (plan) => {
  return plan?.board?.title || plan?.board?.name || plan?.boardTitle || "NA";
};

const getClassTitle = (plan) => {
  return (
    plan?.class?.classTitle || plan?.class?.title || plan?.classTitle || "NA"
  );
};

const getSectionTitle = (plan) => {
  return (
    plan?.section?.sectionTitle ||
    plan?.section?.title ||
    plan?.section?.name ||
    plan?.sectionTitle ||
    ""
  );
};

const getCreatedBy = (plan) => {
  return (
    plan?.user?.name || plan?.createdBy?.name || plan?.teacher?.name || "Admin"
  );
};

export default function WeeklyPlan() {
  const [open, setOpen] = useState(false);

  const [dateFilters, setDateFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const [appliedDateFilters, setAppliedDateFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const {
    weeklyPlans,
    selectedWeeklyPlan,

    loading,
    detailLoading,
    submitLoading,

    fetchWeeklyPlans,
    fetchWeeklyPlanBySlug,
    setSelectedWeeklyPlan,
    clearSelectedWeeklyPlan,
    deleteWeeklyPlan,
  } = useWeeklyPlanStore();

  useEffect(() => {
    fetchWeeklyPlans();
  }, [fetchWeeklyPlans]);

  const filteredPlans = useMemo(() => {
    if (!appliedDateFilters.fromDate && !appliedDateFilters.toDate) {
      return weeklyPlans;
    }

    return weeklyPlans.filter((plan) => {
      const planFromDate = plan?.fromDate ? new Date(plan.fromDate) : null;

      const planToDate = plan?.toDate ? new Date(plan.toDate) : null;

      if (planFromDate && Number.isNaN(planFromDate.getTime())) {
        return false;
      }

      if (planToDate && Number.isNaN(planToDate.getTime())) {
        return false;
      }

      if (appliedDateFilters.fromDate) {
        const filterFromDate = new Date(
          `${appliedDateFilters.fromDate}T00:00:00`,
        );

        if (!planFromDate || planFromDate < filterFromDate) {
          return false;
        }
      }

      if (appliedDateFilters.toDate) {
        const filterToDate = new Date(`${appliedDateFilters.toDate}T23:59:59`);

        if (!planToDate || planToDate > filterToDate) {
          return false;
        }
      }

      return true;
    });
  }, [weeklyPlans, appliedDateFilters]);

  const handleOpenCreateModal = () => {
    clearSelectedWeeklyPlan();
    setOpen(true);
  };

  const handleEdit = async (plan) => {
    if (!plan?.slug) {
      return;
    }

    const fetchedPlan = await fetchWeeklyPlanBySlug(plan.slug);

    if (!fetchedPlan) {
      return;
    }

    setSelectedWeeklyPlan(fetchedPlan);
    setOpen(true);
  };

  const handleDelete = async (plan) => {
    if (!plan?.slug) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this weekly plan?",
    );

    if (!confirmed) {
      return;
    }

    await deleteWeeklyPlan(plan.slug);
  };

  const handleSearch = () => {
    setAppliedDateFilters({
      fromDate: dateFilters.fromDate,
      toDate: dateFilters.toDate,
    });
  };

  const handleCloseModal = () => {
    if (submitLoading) {
      return;
    }

    setOpen(false);
    clearSelectedWeeklyPlan();
  };

  const handleModalSuccess = async () => {
    await fetchWeeklyPlans();

    setOpen(false);
    clearSelectedWeeklyPlan();
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">Weekly Plan</h1>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          disabled={submitLoading}
          className="bg-indigo-600 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="mt-1" />
          Generate Weekly Plan
        </button>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center">
        <div className="flex gap-4">
          <input
            type="date"
            value={dateFilters.fromDate}
            onChange={(event) =>
              setDateFilters((previous) => ({
                ...previous,
                fromDate: event.target.value,
              }))
            }
            className="input"
          />

          <input
            type="date"
            value={dateFilters.toDate}
            onChange={(event) =>
              setDateFilters((previous) => ({
                ...previous,
                toDate: event.target.value,
              }))
            }
            className="input"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="bg-yellow-600 px-5 rounded-xl text-white flex items-center cursor-pointer hover:bg-yellow-700 gap-2"
          >
            <Search size={17} />
            Search
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="bg-green-500 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-green-600"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button
            type="button"
            className="bg-red-500 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-red-600"
          >
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 rounded-2xl overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              {[
                "SN.",
                "Start Date",
                "End Date",
                "Periods",
                "Board",
                "Class",
                "Topic",
                "Created By",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-4 text-gray-300 text-left whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading || detailLoading ? (
              <tr>
                <td colSpan={9} className="p-12">
                  <div className="flex items-center justify-center gap-3 text-gray-400">
                    <Loader2 size={22} className="animate-spin" />
                    Loading weekly plans...
                  </div>
                </td>
              </tr>
            ) : filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-gray-400">
                  No weekly plans found
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan, index) => {
                const classTitle = getClassTitle(plan);
                const sectionTitle = getSectionTitle(plan);

                return (
                  <tr key={plan.slug} className="border-t border-gray-800">
                    <td className="p-4 text-white">{index + 1}.</td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {formatDate(plan.fromDate)}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {formatDate(plan.toDate)}
                    </td>

                    <td className="p-4 text-gray-300">
                      {plan.numberOfPeriods ||
                        plan.lessons?.filter(
                          (lesson) => lesson.isActive !== false,
                        ).length ||
                        0}
                    </td>

                    <td className="p-4 text-gray-300">{getBoardTitle(plan)}</td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {sectionTitle
                        ? `${classTitle} [${sectionTitle}]`
                        : classTitle}
                    </td>

                    <td className="p-4 text-gray-300 max-w-[280px] whitespace-normal break-words">
                      {plan.topic || "NA"}
                    </td>

                    <td className="p-4 text-gray-300">{getCreatedBy(plan)}</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(plan)}
                          disabled={submitLoading || detailLoading}
                          className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(plan)}
                          disabled={submitLoading || plan.isActive === false}
                          className="bg-red-500 p-2 rounded-lg text-white cursor-pointer hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <GenerateWeeklyPlanModal
        open={open}
        close={handleCloseModal}
        selectedWeeklyPlan={selectedWeeklyPlan}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
