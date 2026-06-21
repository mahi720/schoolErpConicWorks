import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BookList = () => {
  const [exportOpen, setExportOpen] = useState(false);

  const books = [
    {
      id: 1,
      bookId: "123456",
      accession: "123456",
      title: "ghbjn",
      edition: "jhvbjj jn",
      category: "Test",
      author: "Auth",
      publisher: "Test",
      year: "2014",
      status: "Lost",
      price: "₹ 599",
    },

    {
      id: 2,
      bookId: "12345",
      accession: "12345",
      title: "Test Title",
      edition: "1",
      category: "Test",
      author: "Auth2",
      publisher: "Test",
      year: "2000",
      status: "Damaged",
      price: "₹ 200",
    },

    {
      id: 3,
      bookId: "1234",
      accession: "1234",
      title: "test",
      edition: "",
      category: "",
      author: "S Chand",
      publisher: "",
      year: "0",
      status: "Issued",
      price: "₹ 0",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Book List</h1>

        <div className="flex gap-5 items-center">
          <div className="flex">
            <input
              placeholder="Title/Accession No./Key"
              className="w-52 bg-gray-800 border border-gray-700 px-4 py-3 text-white rounded-l-lg outline-none"
            />

            <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-4 rounded-r-lg flex items-center justify-center">
              <Search size={18} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-indigo-600 px-4 py-3 hover:bg-indigo-700 rounded-lg text-white flex gap-2 cursor-pointer"
            >
              <FileText size={17} className="mt-1" />
              Export
              <ChevronDown size={17} className="mt-1" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg w-40 z-50">
                <p className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer">
                  Excel
                </p>

                <p className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer">
                  PDF
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* filters */}

      <div className="flex gap-6 items-end">
        <div className="w-72">
          <label className="text-gray-400">Status</label>

          <select className="mt-2 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-full cursor-pointer">
            <option>Select Status</option>

            <option>Issued</option>

            <option>Lost</option>

            <option>Damaged</option>
          </select>
        </div>

        <div className="w-72">
          <label className="text-gray-400">Academic Year</label>

          <select className="mt-2 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-full cursor-pointer">
            <option>Select Academic Year</option>

            <option>2026-27</option>

            <option>2025-26</option>
          </select>
        </div>

        <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg text-white cursor-pointer">
          Clear Filter
        </button>

        {/* <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
          <Filter size={17} />
          Filter
        </button> */}
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Book Id",
                "Accession No.",
                "Title",
                "Edition",
                "Category",
                "Author",
                "Publisher",
                "Publishing Year",
                "Status",
                "Price",
                "Action",
              ].map((head) => (
                <th
                  key={head}
                  className="p-4 text-left text-gray-300 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-4 text-gray-300">{book.id}.</td>

                <td className="p-4 text-gray-300">{book.bookId}</td>

                <td className="p-4 text-gray-300">{book.accession}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.title}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.edition}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.category}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.author}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.publisher}
                </td>

                <td className="p-4 text-gray-300">{book.year}</td>

                <td className="p-4">
                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg">
                    {book.status}
                  </span>
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {book.price}
                </td>

                <td className="p-4">
                  <button className="text-white p-2 bg-cyan-600 rounded-md hover:bg-cyan-700 cursor-pointer">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    </div>
  );
};

export default BookList;
