import React, { useState } from "react";
import { X } from "lucide-react";

export default function IssueBookModalEmployee({ open, close }) {
  const [search, setSearch] = useState("");
  const [book, setBook] = useState(null);

  const handleSearch = () => {
    setBook({
      bookId: "12345",
      title: "Test Title 1",
      category: "Test",
      authors: "Auth1 | Auth2 |",
      publisher: "Test",
      year: "2000",
      price: "₹ 200",
      key: "Test",
      callNumber: "1234",
      source: "Test Source/123/01-09-2022",
      accession: "12345",
      subject: "",
      description: "Desc Test",
      pages: "256",
      image: null,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center custom-scrollbar items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[1100px]">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">Issue Book</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-6 space-y-8">
          {/* Search */}

          <div>
            <label className="text-gray-300">
              Book Id <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-5 mt-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Book Id / Book Name"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-64"
              />

              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 rounded-lg text-white cursor-pointer"
              >
                Go
              </button>
            </div>
          </div>

          {/* Book Details */}

          {book && (
            <>
              <div className="grid grid-cols-4 gap-y-8 text-gray-300">
                <p>
                  <b>Book Id :</b> {book.bookId}
                </p>

                <p>
                  <b>Title :</b> {book.title}
                </p>

                <p>
                  <b>Accession Number :</b> {book.accession}
                </p>

                <p>
                  <b>Book Image :</b>
                  <br />
                  <span className="text-xl">No Image</span>
                </p>

                <p>
                  <b>Category :</b> {book.category}
                </p>

                <p>
                  <b>Authors :</b> {book.authors}
                </p>

                <p>
                  <b>Subjects :</b> {book.subject}
                </p>

                <p>
                  <b>Publisher :</b> {book.publisher}
                </p>

                <p>
                  <b>Publishing Year :</b> {book.year}
                </p>

                <p>
                  <b>Description :</b> {book.description}
                </p>

                <p>
                  <b>Price :</b> {book.price}
                </p>

                <p>
                  <b>Key for Searching :</b> {book.key}
                </p>

                <p>
                  <b>Number of Pages :</b> {book.pages}
                </p>

                <p>
                  <b>Call Number :</b> {book.callNumber}
                </p>

                <p>
                  <b>Source :</b> {book.source}
                </p>
              </div>

              {/* Issue Section */}

              <div className="flex gap-6 items-end">
                <div className="flex flex-col font-normal text-sm">
                  <label className="text-gray-300">
                    Library Card
                    <span className="text-red-500"> *</span>
                  </label>

                  <select className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-64">
                    <option>976</option>

                    <option>975</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-300 font-normal text-sm">
                    Issue Date
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="date"
                    className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-64"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-300 font-normal text-sm">
                    Return Day Limit
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="number"
                    className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-64"
                  />
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer">
                  Issue
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
