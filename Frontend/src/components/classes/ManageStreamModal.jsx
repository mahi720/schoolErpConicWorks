import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Pencil, Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useStreamStore } from "../../store/master/stream/streamStore";

export default function ManageStreamModal({ isOpen, onClose, board }) {
  const [streamTitle, setStreamTitle] = useState("");
  const [editStream, setEditStream] = useState(null);

  const {
    streams,
    loading,
    submitLoading,
    fetchStreams,
    createStream,
    updateStream,
    deleteStream,
    restoreStream,
  } = useStreamStore();

  useEffect(() => {
    if (isOpen && board) {
      fetchStreams({ board });
    }
  }, [isOpen, board, fetchStreams]);

  const handleSubmit = async () => {
    if (!streamTitle.trim() || !board) return;

    const payload = {
      streamTitle: streamTitle.trim(),
      board,
    };

    let success = false;

    if (editStream) {
      success = await updateStream(editStream.slug, payload);
    } else {
      success = await createStream(payload);
    }

    if (success) {
      setStreamTitle("");
      setEditStream(null);
    }
  };

  const handleEdit = (item) => {
    setEditStream(item);
    setStreamTitle(item.streamTitle || "");
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${item.streamTitle}?`,
    );

    if (!confirmDelete) return;

    await deleteStream(item.slug);
  };

  const handleRestore = async (item) => {
    const confirmRestore = window.confirm(
      `Are you sure you want to restore ${item.streamTitle}?`,
    );

    if (!confirmRestore) return;

    await restoreStream(item.slug);
  };

  const handleClose = () => {
    setStreamTitle("");
    setEditStream(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Streams"
      width="max-w-3xl"
    >
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={streamTitle}
          onChange={(e) => setStreamTitle(e.target.value)}
          placeholder="Enter Stream Title"
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
        />

        <button
          onClick={handleSubmit}
          disabled={submitLoading || !streamTitle.trim() || !board}
          className="px-5 bg-blue-600 rounded-xl cursor-pointer text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          {editStream ? "Update Stream" : "Create Stream"}
        </button>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-300 w-20">Sno.</th>
              <th className="text-left p-4 text-gray-300">Stream</th>
              <th className="text-center p-4 text-gray-300 w-40">Action</th>
            </tr>
          </thead>
        </table>

        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-400">
                    Loading streams...
                  </td>
                </tr>
              ) : streams.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-400">
                    No streams found
                  </td>
                </tr>
              ) : (
                streams.map((item, index) => {
                  const isInactive =
                    item.isActive === false || item.status === "inactive";

                  return (
                    <tr key={item.slug} className="border-t border-gray-800">
                      <td className="p-4 text-white w-20">{index + 1}</td>

                      <td className="p-4 text-white">
                        {item.streamTitle}
                        {isInactive && (
                          <span className="ml-2 text-xs text-red-400">
                            (inactive)
                          </span>
                        )}
                      </td>

                      <td className="p-4 w-40">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={isInactive}
                            className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil size={16} />
                          </button>

                          {isInactive ? (
                            <button
                              onClick={() => handleRestore(item)}
                              className="p-2 rounded-lg bg-emerald-500/20 cursor-pointer text-emerald-400"
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400"
                              title="Delete"
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
    </Modal>
  );
}
