import React, { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  Image,
  File,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../../../components/Inventory/Products/AddProductModal";
import IncreaseQuantityModal from "../../../components/Inventory/Products/IncreaseQuantityModal";

const Products = () => {
  const navigate = useNavigate();
  const [productModal, setProductModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [quantityModal, setQuantityModal] = useState(false);
  const products = [
    {
      id: 1,
      name: "Product Test 1",
      code: "CAT001SUBCAT001BR001P001",
      category: "Cat Test 1 (CAT001)",
      subCategory: "Sub Cat Test 1 (CAT001SUBCAT001)",
      brand: "Brand Test 1",
      unit: "piece",
      description: "Product Test 1 Description",
      quantity: "41 (in piece)",
      stock: 34,
    },
    {
      id: 2,
      name: "Computer System (CPU, Monitor, Mouse and Keyboard)",
      code: "CAT006SUBCAT001BR001P001",
      category: "Computer and Accessories (CAT006)",
      subCategory: "Systems (CAT006SUBCAT001)",
      brand: "Lenovo Thinkcentre",
      unit: "piece(Numbers)",
      description: "Intel core I5-2400 CPU, 4GB RAM",
      quantity: "50 (in piece)",
      stock: 48,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-semibold">Products</h1>

        <div className="flex gap-4">
          <select className="bg-gray-800 border cursor-pointer border-gray-700 text-white px-4 py-3 rounded-lg w-52">
            <option>Select Category</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 text-white px-4 py-3 rounded-lg w-52">
            <option>Select Sub Category</option>
          </select>

          <button
            onClick={() => {
              setEditData(null);
              setProductModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
          >
            <Plus size={18} className="mt-1" />
            Add New
          </button>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
            <FileText size={18} className="mt-1" />
            Import
          </button>

          <button className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
            <FileText size={18} className="mt-1" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        {/* Search */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-white">Product List</h2>

          <div className="relative w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search by Name or ID"
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white w-full outline-none"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1800px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Product Name",
                  "Product Code",
                  "Category",
                  "Sub-Category",
                  "Brand",
                  "Unit",
                  "Description",
                  "Quantity Purchased (till now)",
                  "Total Stock",
                  "Action",
                ].map((h) => (
                  <th className="px-5 py-4 text-left text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((item, index) => (
                <tr className="border-t border-gray-800">
                  <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                  <td className="px-5 py-4 text-gray-300">{item.name}</td>

                  <td className="px-5 py-4 text-gray-300">{item.code}</td>

                  <td className="px-5 py-4 text-gray-300">{item.category}</td>

                  <td className="px-5 py-4 text-gray-300">
                    {item.subCategory}
                  </td>

                  <td className="px-5 py-4 text-gray-300">{item.brand}</td>

                  <td className="px-5 py-4 text-gray-300">{item.unit}</td>

                  <td className="px-5 py-4 text-gray-300">
                    {item.description}
                  </td>

                  <td className="px-5 py-4 text-gray-300">{item.quantity}</td>

                  <td className="px-5 py-4 text-gray-300">{item.stock}</td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() =>
                          navigate(
                            "/inventory/products/product-list/product-details",
                          )
                        }
                        title="View Product"
                        className="bg-blue-500 p-2 cursor-pointer hover:bg-blue-600 rounded-lg"
                      >
                        <Eye size={17} className="text-white cursor-pointer" />
                      </button>

                      <button
                        onClick={() => {
                          setEditData({
                            productCode: item.code,
                            category: item.category,
                            subCategory: item.subCategory,
                            brand: item.brand,
                            productName: item.name,
                            unit: item.unit,
                            description: item.description,
                          });

                          setProductModal(true);
                        }}
                        title="Edit Product"
                        className="bg-indigo-500 p-2 cursor-pointer hover:bg-indigo-600 rounded-lg"
                      >
                        <Edit size={17} className="text-white" />
                      </button>

                      <button
                        title="Delete Product"
                        className="bg-red-500 p-2 cursor-pointer hover:bg-red-600 rounded-lg"
                      >
                        <Trash2 size={17} className="text-white" />
                      </button>

                      <button
                        onClick={() => setQuantityModal(true)}
                        title="Update Quantity"
                        className="bg-gray-500 p-2 cursor-pointer hover:bg-gray-600 rounded-lg"
                      >
                        <Plus size={17} className="text-white cursor-pointer" />
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            "/inventory/products/product-list/item-issue",
                          )
                        }
                        title="Issue Product"
                        className="bg-emerald-500 p-2 cursor-pointer hover:bg-emerald-600 rounded-lg"
                      >
                        <File size={17} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {productModal && (
        <AddProductModal
          close={() => {
            setProductModal(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}

      {quantityModal && (
        <IncreaseQuantityModal close={() => setQuantityModal(false)} />
      )}
    </div>
  );
};

export default Products;
