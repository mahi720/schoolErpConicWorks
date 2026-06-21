import React, { useState } from "react";
import { Search, FileText, ChevronDown } from "lucide-react";

const BookDetails = () => {
  const [exportOpen, setExportOpen] = useState(false);

  const book = {
    bookId: "123456",
    title: "ghjbn jhvbjj jjn",
    accession: "123456",
    category: "Test",
    author: "Auth 1",
    subject: "",
    publisher: "Test",
    year: "2014",
    qty: "1",
    desc: "uj uihj hbhh uhjj",
    price: "₹ 599",
    key: "vbnjbn jhijk kmkok",
    pages: "200",
    call: "100",
    source: "Purchased",
    status: "Lost : 1",
  };

  const data = [
    {
      id: 1,
      bookId: "123456",
      rack: "NA",
      status: "Lost",
      issuedName: "NA",
      type: "NA",
      card: "NA",
      issued: "NA",
      return: "NA",
    },
    {
      id: 1,
      bookId: "123456",
      rack: "NA",
      status: "Lost",
      issuedName: "NA",
      type: "NA",
      card: "NA",
      issued: "NA",
      return: "NA",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Book Details */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Book Details</h1>

        <div className="flex justify-between">
          <div className="grid grid-cols-3 gap-x-20 gap-y-5 flex-1">
            <p className="text-gray-400">
              <b>Book Id :</b> {book.bookId}
            </p>

            <p className="text-gray-400">
              <b>Title :</b> {book.title}
            </p>

            <p className="text-gray-400">
              <b>Accession Number :</b> {book.accession}
            </p>

            <p className="text-gray-400">
              <b>Category :</b> {book.category}
            </p>

            <p className="text-gray-400">
              <b>Authors :</b> {book.author}
            </p>

            <p className="text-gray-400">
              <b>Subject :</b> {book.subject}
            </p>

            <p className="text-gray-400">
              <b>Publisher :</b> {book.publisher}
            </p>

            <p className="text-gray-400">
              <b>Publishing Year :</b> {book.year}
            </p>

            <p className="text-gray-400">
              <b>Quantity :</b> {book.qty}
            </p>

            <p className="text-gray-400">
              <b>Description :</b> {book.desc}
            </p>

            <p className="text-gray-400">
              <b>Price :</b> {book.price}
            </p>

            <p className="text-gray-400">
              <b>Key for Searching :</b> {book.key}
            </p>

            <p className="text-gray-400">
              <b>Number of Pages :</b> {book.pages}
            </p>

            <p className="text-gray-400">
              <b>Call Number :</b> {book.call}
            </p>

            <p className="text-gray-400">
              <b>Source :</b> {book.source}
            </p>

            <p className="text-gray-400 font-bold">
              Book Status : {book.status}
            </p>
          </div>

          {/* Image + barcode */}
          <div className="w-52 flex flex-col items-center">
            <div className="w-48 h-40 bg-black rounded-lg flex items-center justify-center">
              <span className="text-red-500 text-5xl">📕</span>
            </div>

            <div className="mt-3">
              <div className="text-white text-5xl tracking-tighter">
                |||||||||||||||||||
              </div>

              <p className="text-center text-gray-400 mt-1">123456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Book List Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Book List</h2>

        <div className="flex gap-4">
          <select className="bg-gray-800 w-60 cursor-pointer text-white border border-gray-700 px-5 rounded-lg">
            <option>Select Status</option>
            <option>Lost</option>
            <option>Damaged</option>
          </select>

          <div className="flex">
            <input
              placeholder="Book Id"
              className="bg-gray-800 border border-gray-800 px-4 py-3 text-white rounded-l-lg"
            />

            <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-3 rounded-r-lg">
              <Search size={18} />
            </button>
          </div>

          <button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white px-5 rounded-lg">
            Clear Filter
          </button>

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-cyan-600 px-5 py-3 text-white cursor-pointer hover:bg-cyan-700 rounded-lg flex gap-2"
            >
              <FileText size={17} className="mt-1" />
              Export
              <ChevronDown size={17} className="mt-1" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 bg-gray-800 border border-gray-700 rounded-lg w-36 mt-2">
                <p className="p-3 text-white hover:bg-gray-700 cursor-pointer">
                  Excel
                </p>

                <p className="p-3 text-white hover:bg-gray-700 cursor-pointer">
                  PDF
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-auto bg-gray-900 border border-gray-800 rounded-xl">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Book Id",
                "Rack",
                "Status",
                "Issued By Name",
                "Issued By Type",
                "Card Id",
                "Issued On",
                "Return Till",
                "Action",
              ].map((h) => (
                <th className="px-5 py-3 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr className="border-t border-gray-800">
                <td className="px-5 py-3 text-gray-300">{item.id}</td>

                <td className="px-5 py-3 text-gray-300">{item.bookId}</td>

                <td className="px-5 py-3 text-gray-300">{item.rack}</td>

                <td className="px-5 py-3">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg">
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  {item.issuedName}
                </td>

                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  {item.type}
                </td>

                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  {item.card}
                </td>

                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  {item.issued}
                </td>

                <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                  {item.return}
                </td>

                <td className="px-5 py-3 text-gray-300">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookDetails;
