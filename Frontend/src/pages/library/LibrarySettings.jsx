import React, { useEffect, useState } from "react";

export default function LibrarySettings() {
  const [settings, setSettings] = useState({
    bookLimit: "2",
    topperLimit: "1",
    lateFine: "0",
    returnDays: "8",
  });

  // old saved data get

  useEffect(() => {
    const saved = localStorage.getItem("librarySettings");

    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    localStorage.setItem("librarySettings", JSON.stringify(settings));

    alert("Settings Updated");
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      {/* title */}

      <h2 className="text-xl font-semibold text-white">Library Settings</h2>

      <hr className="border-gray-800" />

      {/* fields */}

      <div className="grid grid-cols-3 gap-6">
        {/* Book Limit */}

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Book Limit Per User
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            name="bookLimit"
            value={settings.bookLimit}
            onChange={handleChange}
            className="bg-gray-800 custom-scrollbar border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Topper */}

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Book Limit Per User (Topper)
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            name="topperLimit"
            value={settings.topperLimit}
            onChange={handleChange}
            className="bg-gray-800 border custom-scrollbar border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Late Fine */}

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Per Day Late Fine
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            name="lateFine"
            value={settings.lateFine}
            onChange={handleChange}
            className="bg-gray-800 border custom-scrollbar border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Return Days */}

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Book Return Day Limit
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            name="returnDays"
            value={settings.returnDays}
            onChange={handleChange}
            className="bg-gray-800 border custom-scrollbar border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        {/* Button */}

        <div className="flex items-end">
          <button
            onClick={handleUpdate}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
