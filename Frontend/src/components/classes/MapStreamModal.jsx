import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";
import { useStreamStore } from "../../store/master/stream/streamStore";
import { useClassMappingStore } from "../../store/master/classMapping/classMappingStore";

export default function MapStreamModal({
  isOpen,
  onClose,
  board,
  session,
  classData,
  onSaved,
}) {
  const [selectedStreams, setSelectedStreams] = useState([]);

  const { streams, loading, fetchStreams } = useStreamStore();

  const { mappings, submitLoading, fetchMappings, saveMapping } =
    useClassMappingStore();

  useEffect(() => {
    if (isOpen && board && session) {
      fetchStreams({ board });
      fetchMappings({ board, session });
    }
  }, [isOpen, board, session, fetchStreams, fetchMappings]);

  useEffect(() => {
    if (!isOpen || !classData) return;

    const currentMapping = mappings.find(
      (item) => item.classTitle === classData.classTitle,
    );

    setSelectedStreams(currentMapping?.streamSlugs || []);
  }, [isOpen, mappings, classData]);

  const handleSelect = (streamSlug) => {
    setSelectedStreams((prev) =>
      prev.includes(streamSlug)
        ? prev.filter((item) => item !== streamSlug)
        : [...prev, streamSlug],
    );
  };

  const handleSave = async () => {
    if (!board || !session || !classData) return;

    const selectedStreamNames = streams
      .filter((stream) => selectedStreams.includes(stream.slug))
      .map((stream) => stream.streamTitle);

    const success = await saveMapping({
      board,
      session,
      classTitle: classData.classTitle,
      streams: selectedStreamNames,
    });

    if (success) {
      await onSaved?.();
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && classData) {
      setSelectedStreams(classData.streamSlugs || []);
    }
  }, [isOpen, classData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Map Streams - ${classData?.classTitle || ""}`}
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl">
          {loading ? (
            <div className="flex justify-center items-center p-6 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading streams...
            </div>
          ) : streams.length === 0 ? (
            <div className="text-center p-6 text-gray-400">
              No streams found
            </div>
          ) : (
            streams.map((stream) => (
              <div
                key={stream.slug}
                className="flex items-center gap-4 p-4 border-b border-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedStreams.includes(stream.slug)}
                  onChange={() => handleSelect(stream.slug)}
                  className="w-5 h-5 cursor-pointer"
                />

                <span className="text-white">{stream.streamTitle}</span>
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
            className="px-4 py-2 bg-indigo-600 rounded-xl text-white cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}
            Save Mapping
          </button>
        </div>
      </div>
    </Modal>
  );
}
