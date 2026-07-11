import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";
import { useSectionStore } from "../../store/master/section/sectionStore";
import { useClassMappingStore } from "../../store/master/classMapping/classMappingStore";

export default function MapSectionModal({
  isOpen,
  onClose,
  board,
  session,
  classData,
  onSaved,
}) {
  const [selectedSections, setSelectedSections] = useState([]);

  const { sections, loading, fetchSections } = useSectionStore();

  const { mappings, submitLoading, fetchMappings, saveMapping } =
    useClassMappingStore();

  useEffect(() => {
    if (isOpen && board && session) {
      fetchSections({ board });
      fetchMappings({ board, session });
    }
  }, [isOpen, board, session, fetchSections, fetchMappings]);

  useEffect(() => {
    if (!isOpen || !classData) return;

    const currentMapping = mappings.find(
      (item) => item.classTitle === classData.classTitle,
    );

    setSelectedSections(currentMapping?.sectionSlugs || []);
  }, [isOpen, mappings, classData]);

  const handleSelect = (sectionSlug) => {
    setSelectedSections((prev) =>
      prev.includes(sectionSlug)
        ? prev.filter((item) => item !== sectionSlug)
        : [...prev, sectionSlug],
    );
  };

  const handleSave = async () => {
    if (!board || !session || !classData) return;

    const selectedSectionNames = sections
      .filter((section) => selectedSections.includes(section.slug))
      .map((section) => section.sectionTitle);

    const success = await saveMapping({
      board,
      session,
      classTitle: classData.classTitle,
      sections: selectedSectionNames,
    });

    if (success) {
      await onSaved?.();
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && classData) {
      setSelectedSections(classData.sectionSlugs || []);
    }
  }, [isOpen, classData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Map Sections - ${classData?.classTitle || ""}`}
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl">
          {loading ? (
            <div className="flex justify-center items-center p-6 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading sections...
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center p-6 text-gray-400">
              No sections found
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.slug}
                className="flex items-center gap-4 p-4 border-b border-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedSections.includes(section.slug)}
                  onChange={() => handleSelect(section.slug)}
                  className="w-5 h-5 cursor-pointer"
                />

                <span className="text-white">{section.sectionTitle}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitLoading}
            className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={submitLoading || !classData}
            className="px-4 py-2 bg-purple-600 rounded-xl text-white cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}
            Save Mapping
          </button>
        </div>
      </div>
    </Modal>
  );
}
