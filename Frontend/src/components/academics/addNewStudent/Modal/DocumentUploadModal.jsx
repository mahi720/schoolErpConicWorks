import React, { useState } from "react";
import Modal from "../../../common/Modal";

export default function DocumentUploadModal({ isOpen, onClose, setDocuments }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSave = () => {
    if (!title || !file) return;

    setDocuments((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        file: file.name,
      },
    ]);

    setTitle("");
    setFile(null);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Document"
      width="max-w-lg"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Document Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            placeholder="Enter Title"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Upload File</label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border cursor-pointer border-gray-700 rounded-xl text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 cursor-pointer rounded-xl text-white"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
