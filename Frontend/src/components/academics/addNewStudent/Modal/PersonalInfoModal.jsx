import Modal from "../../../common/Modal";

export default function PersonalInfoModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Information"
      width="max-w-4xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Aadhar Number</label>

          <input className="w-full p-3 rounded-xl bg-gray-800 text-white" />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Date Of Birth</label>

          <input
            type="date"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Category</label>

          <select className="w-full p-3 rounded-xl bg-gray-800 text-white">
            <option>General</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Religion</label>

          <input className="w-full p-3 rounded-xl bg-gray-800 text-white" />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Gender</label>

          <select className="w-full p-3 rounded-xl bg-gray-800 text-white">
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-gray-400 mb-2">Address</label>

          <textarea
            rows={3}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-700 rounded-xl text-white"
        >
          Cancel
        </button>

        <button className="px-4 py-2 bg-blue-600 rounded-xl text-white">
          Save
        </button>
      </div>
    </Modal>
  );
}
