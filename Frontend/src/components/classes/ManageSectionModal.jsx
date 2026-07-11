import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useSectionStore } from "../../store/master/section/sectionStore";

export default function ManageSectionModal({ isOpen, onClose, board }) {
  const [sectionTitle, setSectionTitle] = useState("");
  const [editSection, setEditSection] = useState(null);

  const {
    sections,
    loading,
    submitLoading,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  } = useSectionStore();

  useEffect(() => {
    if (isOpen && board) {
      fetchSections({ board });
    }
  }, [isOpen, board, fetchSections]);

  const handleSubmit = async () => {
    if (!sectionTitle.trim() || !board) return;

    const payload = {
      sectionTitle: sectionTitle.trim(),
      board,
    };

    let success = false;

    if (editSection) {
      success = await updateSection(editSection.slug, payload);
    } else {
      success = await createSection(payload);
    }

    if (success) {
      setSectionTitle("");
      setEditSection(null);
    }
  };

  const handleEdit = (item) => {
    setEditSection(item);
    setSectionTitle(item.sectionTitle || "");
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${item.sectionTitle}?`,
    );

    if (!confirmDelete) return;

    await deleteSection(item.slug);
  };

  const handleClose = () => {
    setSectionTitle("");
    setEditSection(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Sections"
      width="max-w-3xl"
    >
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="Enter Section Title"
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
        />

        <button
          onClick={handleSubmit}
          disabled={submitLoading || !sectionTitle.trim() || !board}
          className="px-5 bg-blue-600 rounded-xl cursor-pointer text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          {editSection ? "Update Section" : "Create Section"}
        </button>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-300 w-20">Sno.</th>
              <th className="text-left p-4 text-gray-300">Section</th>
              <th className="text-center p-4 text-gray-300 w-32">Action</th>
            </tr>
          </thead>
        </table>

        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-400">
                    Loading sections...
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-400">
                    No sections found
                  </td>
                </tr>
              ) : (
                sections.map((item, index) => (
                  <tr key={item.slug} className="border-t border-gray-800">
                    <td className="p-4 text-white w-20">{index + 1}</td>
                    <td className="p-4 text-white">{item.sectionTitle}</td>

                    <td className="p-4 w-32">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
