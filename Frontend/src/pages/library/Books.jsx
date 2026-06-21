import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  ChevronDown,
  Edit,
  Eye,
  File,
  Grid,
  Trash2,
  Download,
  ArrowRight,
  Upload,
} from "lucide-react";
import SearchDropdown from "../../components/common/SearchDropdown";
import AddBookModal from "../../components/library/AddBookModal";
import ViewBookModal from "../../components/library/ViewBookModal";
import BookImageModal from "../../components/library/BookImageModal";
import ManageRackModal from "../../components/library/ManageRackModal";

const Books = () => {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rackModal, setRackModal] = useState(false);

  const handleImage = (book) => {
    setSelectedBook(book);
    setImageModal(true);
  };

  const handleView = (book) => {
    setViewData(book);
    setViewModal(true);
  };

  const books = [
    {
      id: 1,
      bookId: "12345",
      accession: "123456",
      title: "ghjbjn",
      edition: "jhvbjj jnj",
      category: "Test",
      author: "Auth 1",
      publisher: "Test",
      year: "2014",
      qty: 1,
      available: 0,
      price: "₹ 599",
    },
    {
      id: 2,
      bookId: "12345",
      accession: "12345",
      title: "Test Title",
      edition: "1",
      category: "Test",
      author: "Auth 2",
      publisher: "Test",
      year: "2000",
      qty: 1,
      available: 0,
      price: "₹ 200",
    },
    {
      id: 3,
      bookId: "1234",
      accession: "1234",
      title: "test",
      edition: "",
      category: "",
      author: "R D Sharma",
      publisher: "",
      year: "0",
      qty: 1,
      available: 0,
      price: "₹ 0",
    },
  ];

  const handleEdit = (book) => {
    setEditData(book);
    setOpenModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-semibold">Books</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/library/books/inactive-books")}
            className="bg-red-500 whitespace-nowrap hover:bg-red-600 cursor-pointer text-white px-3 py-2 rounded-lg"
          >
            Inactive Books
          </button>

          <button className="bg-gray-700 whitespace-nowrap hover:bg-gray-800 cursor-pointer text-white px-3 py-2 rounded-lg">
            Generate Barcode
          </button>

          <button
            onClick={() => navigate("/library/books/books-list")}
            className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer whitespace-nowrap text-white px-3 py-2 rounded-lg"
          >
            Book List
          </button>

          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex gap-2"
          >
            <Plus size={18} className="mt-1 font-bold" />
            Add New Book
          </button>

          <div className="flex">
            <input
              placeholder="Title/Accession No./Key"
              className="bg-gray-800 border border-gray-700 px-4 text-white rounded-l-lg"
            />

            <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-3 rounded-r-lg">
              <Search size={18} />
            </button>
          </div>
          <button className="bg-green-600 flex gap-3 hover:bg-green-700 cursor-pointer whitespace-nowrap text-white px-3 py-2 rounded-lg">
            Clear Filter
          </button>
        </div>
      </div>

      {/* FILTER */}

      <div className="grid grid-cols-5 gap-6">
        <SearchDropdown
          label="Category"
          placeholder="Select Category"
          options={["Novel", "Science", "Computer", "Math"]}
        />

        <SearchDropdown
          label="Authors"
          placeholder="Select Author"
          options={["Auth 1", "Auth 2", "R D Sharma", "S Chand"]}
        />

        <SearchDropdown
          label="Subjects"
          placeholder="Select Subject"
          options={["Hindi", "English", "Math", "Physics"]}
        />

        <SearchDropdown
          label="Publisher"
          placeholder="Select Publisher"
          options={["Test Publisher", "Arihant", "NCERT"]}
        />

        <div>
          <label className="text-gray-400">Academic Year</label>

          <select className="bg-gray-800 border cursor-pointer mt-1 border-gray-700 text-white rounded-lg px-4 py-3 w-full">
            <option>Select Academic Year</option>
            <option>2026-27</option>
            <option>2025-26</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1600px] border-spacing-x-4">
          <thead className="bg-gray-800 whitespace-nowrap">
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
              ].map((h) => (
                <th className="px-6 py-4 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {books.map((item) => (
              <tr className="border-t border-gray-800 whitespace-nowrap">
                <td className="px-6 py-4 text-gray-300">{item.id}.</td>

                <td className="px-6 py-4 text-gray-300">{item.bookId}</td>

                <td className="px-6 py-4 text-gray-300">{item.accession}</td>

                <td className="px-6 py-4 text-indigo-400">{item.title}</td>

                <td className="px-6 py-4 text-gray-300">{item.edition}</td>

                <td className="px-6 py-4 text-gray-300">{item.category}</td>

                <td className="px-6 py-4 text-gray-300">{item.author}</td>

                <td className="px-6 py-4 text-gray-300">{item.publisher}</td>

                <td className="px-6 py-4 text-gray-300">{item.year}</td>

                <td className="px-6 py-4 text-gray-300">{item.qty}</td>

                <td className="px-6 py-4 text-gray-300">{item.available}</td>

                <td className="px-6 py-4 text-gray-300">{item.price}</td>

                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <Edit
                      title="Edit Details"
                      onClick={() => handleEdit(item)}
                      size={16}
                      className="text-indigo-400 cursor-pointer"
                    />

                    <Eye
                      title="View Details"
                      onClick={() => handleView(item)}
                      size={16}
                      className="text-cyan-400 cursor-pointer"
                    />

                    <File
                      onClick={() => handleImage(item)}
                      title="Update Image"
                      size={16}
                      className="text-yellow-400 cursor-pointer"
                    />

                    <Grid
                      onClick={() => setRackModal(true)}
                      title="Manage Shelf"
                      size={16}
                      className="text-green-400 cursor-pointer"
                    />

                    <Trash2
                      title="Delete Book"
                      size={16}
                      className="text-red-400 cursor-pointer"
                    />

                    <Download
                      title="Download Book Bar Code"
                      size={16}
                      className="text-gray-300 cursor-pointer"
                    />

                    <ArrowRight
                      title="Associated Books"
                      onClick={() => navigate("/library/books/book-details")}
                      size={16}
                      className="text-indigo-400 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <AddBookModal
          close={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}

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
          close={() => setImageModal(false)}
          data={selectedBook}
        />
      )}

      {rackModal && <ManageRackModal close={() => setRackModal(false)} />}
    </div>
  );
};

export default Books;
