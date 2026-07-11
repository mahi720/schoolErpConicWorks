import React, { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";

import { Loader2, Pencil, RotateCcw, Search, Trash2, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { subjectTopicSchema } from "../../validations/master/createTopicInSubject/subjectTopicSchema";
import { useSubjectTopicStore } from "../../store/master/createTopicInSubject/subjectTopicStore";

const defaultValues = {
  topicTitle: "",
  topicGroup: "",
};

export default function SubjectTopicsModal({ isOpen, onClose, subjectData }) {
  const [search, setSearch] = useState("");
  const [editTopic, setEditTopic] = useState(null);

  const {
    subjectTopics,
    loading,
    submitLoading,
    fetchSubjectTopics,
    createSubjectTopic,
    updateSubjectTopic,
    deleteSubjectTopic,
    restoreSubjectTopic,
    clearSubjectTopics,
  } = useSubjectTopicStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectTopicSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen || !subjectData?.slug) return;

    fetchSubjectTopics({
      addedSubjectToClassSlug: subjectData.slug,
      status: "all",
    });
  }, [isOpen, subjectData?.slug, fetchSubjectTopics]);

  useEffect(() => {
    if (!isOpen) return;

    if (editTopic) {
      reset({
        topicTitle: editTopic.topicTitle || "",
        topicGroup: editTopic.topicGroup || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [isOpen, editTopic, reset]);

  const filteredTopics = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return subjectTopics;
    }

    return subjectTopics.filter((item) => {
      const topicTitle = item.topicTitle?.toLowerCase() || "";
      const topicGroup = item.topicGroup?.toLowerCase() || "";

      return topicTitle.includes(searchText) || topicGroup.includes(searchText);
    });
  }, [subjectTopics, search]);

  const handleClose = () => {
    setSearch("");
    setEditTopic(null);
    reset(defaultValues);
    clearSubjectTopics();
    onClose();
  };

  const handleEdit = (item) => {
    setEditTopic(item);
  };

  const handleCancelEdit = () => {
    setEditTopic(null);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    if (!subjectData?.slug) return;

    let success = false;

    if (editTopic) {
      success = await updateSubjectTopic(editTopic.slug, {
        topicTitle: data.topicTitle.trim(),
        topicGroup: data.topicGroup.trim(),
      });
    } else {
      success = await createSubjectTopic({
        addedSubjectToClassSlug: subjectData.slug,
        topicTitle: data.topicTitle.trim(),
        topicGroup: data.topicGroup.trim(),
      });
    }

    if (success) {
      setEditTopic(null);
      reset(defaultValues);
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.topicTitle}"?`,
    );

    if (!confirmDelete) return;

    await deleteSubjectTopic(item.slug);
  };

  const handleRestore = async (item) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore "${item.topicTitle}"?`,
    );

    if (!confirmRestore) return;

    await restoreSubjectTopic(item.slug);
  };

  const isInactive = (item) => {
    return (
      item.isActive === false ||
      item.status === "inactive" ||
      Boolean(item.deletedAt)
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Subject Topics${
        subjectData?.subjectTitle ? ` - ${subjectData.subjectTitle}` : ""
      }`}
      width="max-w-4xl"
    >
      {!subjectData?.slug ? (
        <div className="py-10 text-center text-gray-400">
          Mapped subject information not found
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 mb-6"
          >
            <div>
              <textarea
                {...register("topicTitle")}
                placeholder="Subject Topic Title"
                rows={3}
                className="w-full p-3 bg-gray-800 rounded-xl text-white resize-none border border-gray-700 outline-none focus:border-blue-500"
              />

              {errors.topicTitle && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.topicTitle.message}
                </p>
              )}
            </div>

            <div>
              <textarea
                {...register("topicGroup")}
                placeholder="Subject Topic Group"
                rows={3}
                className="w-full p-3 bg-gray-800 rounded-xl text-white resize-none border border-gray-700 outline-none focus:border-blue-500"
              />

              {errors.topicGroup && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.topicGroup.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="h-full min-h-[96px] bg-blue-600 hover:bg-blue-700 transition cursor-pointer px-6 rounded-xl text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading && (
                  <Loader2 size={17} className="animate-spin" />
                )}

                {editTopic ? "Update" : "Create"}
              </button>

              {editTopic && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitLoading}
                  className="h-full min-h-[96px] px-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 cursor-pointer disabled:opacity-60"
                  title="Cancel Edit"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-900 overflow-hidden">
              <div className="p-5 flex justify-between items-center gap-4 flex-wrap border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Subject Topic List
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {subjectData?.classTitle || "-"} •{" "}
                    {subjectData?.subjectTitle || "-"}
                    {subjectData?.stream ? ` • ${subjectData.stream}` : ""}
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topic or group"
                    className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div
                className={`overflow-y-auto custom-scrollbar ${
                  filteredTopics.length > 2 ? "max-h-[320px]" : ""
                }`}
              >
                <table className="w-full table-fixed">
                  <thead className="bg-gray-800 text-gray-300 sticky top-0 z-10">
                    <tr>
                      <th className="w-[80px] p-4 text-left">SN.</th>

                      <th className="w-[30%] p-4 text-left">Topic</th>

                      <th className="w-[30%] p-4 text-left">Group</th>

                      <th className="w-[120px] p-4 text-center">Status</th>

                      <th className="w-[150px] p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-10">
                          <div className="flex items-center justify-center text-gray-400">
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Loading topics...
                          </div>
                        </td>
                      </tr>
                    ) : filteredTopics.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center text-gray-400"
                        >
                          No subject topics found
                        </td>
                      </tr>
                    ) : (
                      filteredTopics.map((item, index) => {
                        const inactive = isInactive(item);

                        return (
                          <tr
                            key={item.slug}
                            className="border-t border-gray-800 hover:bg-gray-800/40"
                          >
                            <td className="p-4 text-white">{index + 1}.</td>

                            <td className="p-4 text-white break-words">
                              {item.topicTitle}
                            </td>

                            <td className="p-4 text-white break-words">
                              {item.topicGroup}
                            </td>

                            <td className="p-4 text-center">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                  inactive
                                    ? "bg-red-500/15 border border-red-500/30 text-red-400"
                                    : "bg-green-500/15 border border-green-500/30 text-green-400"
                                }`}
                              >
                                {inactive ? "Inactive" : "Active"}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                {!inactive && (
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    disabled={submitLoading}
                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 cursor-pointer disabled:opacity-50"
                                    title="Edit Topic"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                )}

                                {inactive ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRestore(item)}
                                    disabled={submitLoading}
                                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 cursor-pointer disabled:opacity-50"
                                    title="Restore Topic"
                                  >
                                    <RotateCcw size={16} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    disabled={submitLoading}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer disabled:opacity-50"
                                    title="Delete Topic"
                                  >
                                    <Trash2 size={16} />
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
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
