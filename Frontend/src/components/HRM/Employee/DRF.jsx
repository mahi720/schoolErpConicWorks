export default function ConfirmModal({ open, close, value }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[400px] rounded-xl p-6 border border-gray-700">
        <h2 className="text-white text-xl">Are you sure change {value} ?</h2>

        <div className="flex justify-end gap-3 mt-8">
          <button className="bg-green-600 px-5 py-2 rounded-lg text-white cursor-pointer">
            Yes
          </button>

          <button
            onClick={close}
            className="bg-red-500 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
