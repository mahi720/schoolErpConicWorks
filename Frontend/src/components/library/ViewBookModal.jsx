import React from "react";
import { X } from "lucide-react";

const ViewBookModal = ({ close, data }) => {
  const Detail = ({ label, value }) => {
    return (
      <div>
        <p className="text-gray-400 text-sm font-semibold">{label} :</p>

        <p className="text-gray-200 text-lg mt-4">{value || "-"}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[90%] max-h-[90vh] overflow-auto custom-scrollbar">
        {/* header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl text-white">View Detail</h2>

          <X
            onClick={close}
            className="text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        {/* body */}

        <div className="p-8 flex gap-10">
          {/* LEFT DETAILS */}
          <div className="grid grid-cols-3 gap-x-20 gap-y-10 flex-1">
            <Detail label="Book Id" value={data.bookId} />

            <Detail label="Title" value={data.title} />

            <Detail label="Accession Number" value={data.accession} />

            <Detail label="Category" value={data.category} />

            <Detail label="Authors" value={data.author} />

            <Detail label="Subjects" value={data.subject} />

            <Detail label="Publisher" value={data.publisher} />

            <Detail label="Publishing Year" value={data.year} />

            <Detail label="Quantity" value={data.qty} />

            <Detail
              label="Description"
              value={data.description || "hjn uuihj hbhb uhjj"}
            />

            <Detail label="Price" value={data.price} />

            <Detail
              label="Key for Searching"
              value={data.key || "vbnjbn jhijk kmkok"}
            />

            <Detail label="Edition" value={data.edition} />

            <Detail label="Number of Pages" value={data.pages || "200"} />

            <Detail label="Call Number" value={data.callNumber || "100"} />

            <Detail label="Source" value={data.source || "Purchased"} />
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-72">
            <p className="text-gray-400 text-sm font-semibold">Book Image :</p>

            <div className="w-64 h-48 bg-black mt-4 rounded-lg flex items-center justify-center">
              <span className="text-red-500 text-6xl">📕</span>
            </div>
          </div>
        </div>

        {/* footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 text-white rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBookModal;
