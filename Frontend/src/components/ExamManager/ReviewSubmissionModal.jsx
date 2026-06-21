import React, { useState } from "react";
import {
  X,
  Check,
  XCircle,
  FileText,
  Download,
  Save,
  Link,
} from "lucide-react";

export default function ReviewSubmissionModal({ open, close }) {
  const [status, setStatus] = useState("accept");
  const submissionLink = "";
  //   const submissionLink = "https://example.com/file";

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[80%] max-w-3xl rounded-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Review Submission
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              English - Theory - Descriptive Essay on “A Memorable Day in My
              Life”
            </p>
          </div>

          <X
            onClick={close}
            className="text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
          {/* Student Info */}
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
            {/* <div className="w-12 h-12 rounded-full bg-gray-700"></div> */}

            <div>
              <h3 className="text-white font-semibold text-lg">
                Giovana Castro
              </h3>

              <p className="text-gray-400 text-sm">
                English - Theory | Submitted 07-07-2025 06:11 PM
              </p>
            </div>
          </div>

          {/* File */}
          <div>
            <h4 className="text-gray-400 mb-2 flex gap-2 items-center">
              <FileText size={17} />
              Attached File
            </h4>

            <div className="border border-gray-700 rounded-xl p-3 flex justify-between text-gray-300">
              <span>Receipt-2275-8151.pdf</span>

              <Download size={18} />
            </div>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2 flex gap-2 items-center">
              <Link size={17} />
              Submission Link
            </h4>

            <input
              type="text"
              value={submissionLink || "No link provided"}
              disabled={!submissionLink}
              readOnly
              className={`mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none ${
                submissionLink
                  ? "text-blue-400 cursor-pointer"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Status */}
          <div>
            <h3 className="text-gray-400 mb-3">Submission Status</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStatus("accept")}
                className={`border rounded-xl p-4 flex justify-center gap-2 items-center ${
                  status === "accept"
                    ? "border-green-500 bg-green-500/10 cursor-pointer text-green-400"
                    : "border-gray-700 text-gray-400 cursor-pointer"
                }`}
              >
                <Check />
                Accept
              </button>

              <button
                onClick={() => setStatus("reject")}
                className={`border rounded-xl p-4 flex justify-center gap-2 items-center ${
                  status === "reject"
                    ? "border-red-500 bg-red-500/10 text-red-400 cursor-pointer"
                    : "border-gray-700 text-gray-400 cursor-pointer"
                }`}
              >
                <XCircle />
                Reject
              </button>
            </div>
          </div>

          {/* Marks */}

          <div>
            <label className="text-gray-400">Grade Points</label>

            <input
              disabled={status === "reject"}
              defaultValue="400"
              className={`mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 outline-none ${
                status === "reject"
                  ? "cursor-not-allowed text-gray-600"
                  : "text-white"
              }`}
            />
          </div>

          {/* Feedback */}

          <div>
            <label className="text-gray-400">Internal Feedback</label>

            <textarea
              rows="4"
              defaultValue="Very Very Good Assignment"
              className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none outline-none"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="px-5 py-2 cursor-pointer bg-red-500 rounded-lg hover:bg-red-600 text-white"
          >
            Cancel
          </button>

          <button className="px-5 cursor-pointer py-2 bg-green-500 rounded-lg hover:bg-green-600 text-white flex gap-2 items-center">
            <Save size={18} />
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
