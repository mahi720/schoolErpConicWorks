import React, { useState } from "react";
import { X } from "lucide-react";
import SearchDropdown from "../common/SearchDropdown";

const AddBookModal = ({ close, editData }) => {
  const existingBooks = ["12345", "98765"];
  const [error, setError] = useState("");
  const [accession, setAccession] = useState(editData?.accession || "");
  const [showForm, setShowForm] = useState(editData ? true : false);

  const [form, setForm] = useState({
    title: editData?.title || "",
    category: editData?.category || "",
    publisher: editData?.publisher || "",
    author: editData?.author || "",
    subject: editData?.subject || "",
    year: editData?.year || "",
    price: editData?.price || "",
    key: editData?.key || "",
    edition: editData?.edition || "",
    pages: editData?.pages || "",
    callNumber: editData?.callNumber || "",
    source: editData?.source || "",
    description: editData?.description || "",
    image: "",
  });

  const checkBook = () => {
    if (existingBooks.includes(accession)) {
      setError("Book Accession Number Already Exists");
      setShowForm(false);
    } else {
      setError("");
      setShowForm(true);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveBook = () => {
    console.log({
      accession,
      ...form,
    });

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[90%] max-h-[90vh] overflow-auto custom-scrollbar">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {editData ? "Edit Book" : "Add New Book"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          />
        </div>

        <div className="p-6">
          {/* accession */}

          {!editData && (
            <div className="flex gap-5 items-end">
              <div className="w-96">
                <label className="text-gray-300">
                  Book Accession Number
                  <span className="text-red-500">*</span>
                </label>

                <input
                  value={accession}
                  onChange={(e) => setAccession(e.target.value)}
                  placeholder="Book Accession Number"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                />
              </div>

              <button
                onClick={checkBook}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg text-white cursor-pointer"
              >
                Go
              </button>
            </div>
          )}

          {error && <p className="text-red-500 mt-3">{error}</p>}

          {showForm && (
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <label className="text-gray-300">
                  Book Title <span className="text-red-500"> *</span>
                </label>

                <input
                  name="title"
                  onChange={handleChange}
                  placeholder="write here..."
                  value={form.title}
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                />
              </div>

              <div>
                <SearchDropdown
                  name="category"
                  onChange={handleChange}
                  value={form.category}
                  label="Category"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  options={["Test Publisher", "Arihant", "NCERT"]}
                />
              </div>

              <div>
                <SearchDropdown
                  name="publisher"
                  onChange={handleChange}
                  value={form.publisher}
                  label="Publisher"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  options={["Test Publisher", "Arihant", "NCERT"]}
                />
              </div>

              <div>
                <SearchDropdown
                  name="author"
                  onChange={handleChange}
                  value={form.author}
                  label="Author"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  options={["Test Publisher", "Arihant", "NCERT"]}
                />
              </div>

              <div>
                <SearchDropdown
                  name="subjects"
                  onChange={handleChange}
                  value={form.subject}
                  label="Subjects"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  options={["Test Publisher", "Arihant", "NCERT"]}
                />
              </div>

              <Input
                label="Publishing Year"
                name="year"
                value={form.year}
                change={handleChange}
              />

              <Input
                label="Price"
                value={form.price}
                name="price"
                change={handleChange}
              />

              <Input
                label="Key for Searching"
                name="key"
                value={form.key}
                change={handleChange}
              />

              <Input
                label="Edition"
                value={form.edition}
                name="edition"
                change={handleChange}
              />

              <Input
                label="Number of Pages"
                name="pages"
                value={form.pages}
                change={handleChange}
              />

              <div>
                <SearchDropdown
                  name="cellNumber"
                  onChange={handleChange}
                  value={form.cellNumber}
                  label="Cell Number"
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  options={["Test Publisher", "Arihant", "NCERT"]}
                />
              </div>

              {!editData && (
                <div>
                  <label className="text-gray-300">Book Image</label>

                  <input
                    type="file"
                    className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                  />
                </div>
              )}

              <div>
                <label className="text-gray-300">Source</label>

                <select className="mt-2 bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full">
                  <option>Select Source</option>
                  <option>From Writer</option>
                  <option>Donate</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-gray-300">Description</label>

                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="write here..."
                  value={form.description}
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          {showForm && (
            <button
              onClick={saveBook}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg text-white cursor-pointer"
            >
              {editData ? "Update" : "Save"}
            </button>
          )}

          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, change }) => {
  return (
    <div>
      <label className="text-gray-300">{label}</label>

      <input
        name={name}
        value={value}
        onChange={change}
        placeholder="write here..."
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
      />
    </div>
  );
};

export default AddBookModal;
