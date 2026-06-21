import React, { useState } from "react";
import { Search, FileText, ChevronDown, Eye, Image } from "lucide-react";
import ViewBookModal from "../../components/library/ViewBookModal";
import BookImageModal from "../../components/library/BookImageModal";

const InactiveBooks = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleView = (book) => {
    setViewData(book);
    setViewModal(true);
  };

  const handleImage = (book) => {
    setSelectedBook(book);
    setImageModal(true);
  };

  const books = [
    {
      id: 1,
      bookId: "3214569",
      accession: "32145698",
      title: "Book Test",
      edition: "Editn - 2",
      category: "Programming",
      author: "R D Sharma",
      publisher: "Arihant",
      year: "2022",
      qty: 16,
      available: 11,
      price: "$ 1200",
    },
    {
      id: 1,
      bookId: "3214569",
      accession: "32145698",
      title: "Book Test",
      edition: "Editn - 2",
      category: "Programming",
      author: "R D Sharma",
      publisher: "Arihant",
      year: "2022",
      qty: 16,
      available: 11,
      price: "$ 1200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Inactive Books</h1>

        <div className="flex gap-5">
          {/* Search */}

          <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-2 flex items-center">
              <Search size={18} className="text-gray-400" />
            </div>

            <input
              placeholder="Accession No."
              className="bg-gray-800 px-3 py-2 text-white outline-none"
            />
          </div>

          {/* export */}

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg text-white flex gap-2 cursor-pointer"
            >
              <FileText size={17} className="mt-1" />
              Export
              <ChevronDown size={17} className="mt-1" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg w-40 z-50">
                <p className="px-4 py-3 hover:bg-gray-700 text-white cursor-pointer">
                  Excel
                </p>

                <p className="px-4 py-3 hover:bg-gray-700 text-white cursor-pointer">
                  PDF
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table */}

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
                "Quantity",
                "Available Books",
                "Price",
                "Action",
              ].map((item) => (
                <th
                  key={item}
                  className="p-4 text-left text-gray-300 whitespace-nowrap"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {books.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-gray-300">{item.bookId}</td>

                <td className="p-4 text-gray-300">{item.accession}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.title}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.edition}
                </td>

                <td className="p-4 text-gray-300">{item.category}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.author}
                </td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.publisher}
                </td>

                <td className="p-4 text-gray-300">{item.year}</td>

                <td className="p-4 text-gray-300">{item.qty}</td>

                <td className="p-4 text-gray-300">{item.available}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.price}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleView(item)}
                      className="text-cyan-400 cursor-pointer"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() => handleImage(item)}
                      className="text-yellow-400 cursor-pointer"
                    >
                      <Image size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewModal && (
        <ViewBookModal
          close={() => {
            setViewModal(false);
            setViewData(null);
          }}
          data={viewData}
        />
      )}

      {imageModal && (
        <BookImageModal
          close={() => {
            setImageModal(false);
            setSelectedBook(null);
          }}
          data={selectedBook}
          showChangeButton={false}
        />
      )}
    </div>
  );
};

export default InactiveBooks;
