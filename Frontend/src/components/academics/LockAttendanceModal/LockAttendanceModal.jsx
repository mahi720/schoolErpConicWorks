export default function LockAttendanceModal({ open, close }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[550px] border border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-2xl text-white">Lock Attendance</h2>
        </div>

        <div className="p-5">
          <p className="text-xl text-gray-300">
            Are you sure to lock attendance ?
          </p>

          <p className="text-gray-400 mt-5">
            Please confirm attendance date before locking.
          </p>
        </div>

        <div className="p-5 flex justify-end gap-3">
          <button className="bg-green-500 px-5 py-3 cursor-pointer rounded-xl text-white">
            Lock Attendance
          </button>

          <button
            onClick={close}
            className="bg-yellow-500 px-5 py-3 rounded-xl cursor-pointer text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
