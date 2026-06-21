import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import IssueCardModal from "../../components/library/IssueCardModal";
// import IssueBookModal from "../../components/library/IssueBookModal";
// import ReturnBookModal from "../../components/library/ReturnBookModal";
// import ReissueBookModal from "../../components/library/ReissueBookModal";
// import DamagedModal from "../../components/library/DamagedModal";
// import LostBookModal from "../../components/library/LostBookModal";
import IssueCardModalEmployee from "../../../components/library/Employees/IssueCardModalEmployee";
import IssueBookModalEmployee from "../../../components/library/Employees/IssueBookModalEmployee";
import ReturnBookModalEmployee from "../../../components/library/Employees/ReturnBookModalEmployee";
import DamagedModalEmployee from "../../../components/library/Employees/DamagedModalEmployee";
import ReissueBookModalEmployee from "../../../components/library/Employees/ReissueBookModalEmployee";
import LostBookModalEmployee from "../../../components/library/Employees/LostBookModalEmployee";
import ViewBookModalEmployee from "../../../components/library/Employees/ViewBookModalEmployee";

export default function EmployeeDetail() {
  const navigate = useNavigate();
  const [cardOpen, setCardOpen] = useState(false);
  const [issueBook, setIssueBook] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [reissuBookModal, setReissuBookModal] = useState(false);
  const [damgedBookModal, setDamgedBookModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const [topper, setTopper] = useState("No");

  const books = [
    {
      id: 1,
      bookId: "12345",
      title: "Test Title 1",
      cardId: "975",
      issue: "11-06-2026",
      returnBefore: "18-06-2026",
      returned: "Not Returned",
      fine: "₹ 0",
      status: "Issued",
    },
    {
      id: 2,
      bookId: "12345",
      title: "Test Title 1",
      cardId: "975",
      issue: "04-05-2026",
      returnBefore: "11-05-2026",
      returned: "11-06-2026",
      fine: "₹ 0",
      status: "Returned",
    },
  ];

  const handleView = (book) => {
    setViewData(book);
    setViewModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Student Detail */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-5">
          Employee Detail
        </h1>

        <div className="grid grid-cols-3 gap-10">
          {/* left */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Employee Id :</b> 728362
            </p>

            <p>
              <b>Designation :</b> TGT
            </p>
          </div>

          {/* middle */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Name :</b> K.A.SINDHU
            </p>

            <p>
              <b>Issued Books :</b> 2
            </p>
          </div>

          {/* right */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Department :</b> TEACHING
            </p>

            <div className="flex gap-3 mt-5 whitespace-nowrap">
              <button
                onClick={() => navigate("/library/employeeList/all-issues")}
                className="bg-red-500 px-4 py-2 hover:bg-red-600 cursor-pointer rounded-lg text-white"
              >
                Past Issues
              </button>

              <button
                onClick={() => setCardOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer px-4 py-2 rounded-lg text-white"
              >
                Issue Card
              </button>

              <button
                onClick={() => setIssueBook(true)}
                className="bg-green-500 hover:bg-green-600 cursor-pointer px-4 py-2 rounded-lg text-white"
              >
                Issue Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Book List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl text-white mb-5">Book List</h2>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800">
              <tr className="whitespace-nowrap">
                {[
                  "SNo.",
                  "Book Id",
                  "Title",
                  "Card id",
                  "Issued On",
                  "Return On/Before",
                  "Returned On",
                  "Fine",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="p-3 text-left text-gray-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {books.map((item) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-3 text-gray-300">{item.id}.</td>

                  <td className="p-3 text-gray-300">{item.bookId}</td>

                  <td
                    onClick={() => handleView(item)}
                    className="p-3 text-indigo-400 cursor-pointer hover:underline whitespace-nowrap"
                  >
                    {item.title}
                  </td>

                  <td className="p-3 text-gray-300">{item.cardId}</td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {item.issue}
                  </td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {item.returnBefore}
                  </td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {item.returned}
                  </td>

                  <td className="p-3 text-gray-300">{item.fine}</td>

                  <td className="p-3 text-gray-300">{item.status}</td>

                  <td className="p-3">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setReturnModal(true)}
                        className="bg-cyan-500 hover:bg-cyan-600 cursor-pointer px-3 py-1 rounded text-white text-xs"
                      >
                        Return
                      </button>

                      <button
                        onClick={() => setReissuBookModal(true)}
                        className="bg-gray-800 hover:bg-gray-700 cursor-pointer px-3 py-1 rounded text-white text-xs"
                      >
                        Reissue
                      </button>

                      <button
                        onClick={() => setDamgedBookModal(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer px-3 py-1 rounded text-black text-xs"
                      >
                        Damaged
                      </button>

                      <button
                        onClick={() => setLostModal(true)}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded text-white text-xs"
                      >
                        Lost
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <IssueCardModalEmployee
        open={cardOpen}
        close={() => setCardOpen(false)}
      />
      <IssueBookModalEmployee
        open={issueBook}
        close={() => setIssueBook(false)}
      />
      <ReturnBookModalEmployee
        open={returnModal}
        close={() => setReturnModal(false)}
      />
      <DamagedModalEmployee
        open={damgedBookModal}
        close={() => setDamgedBookModal(false)}
      />
      <ReissueBookModalEmployee
        open={reissuBookModal}
        close={() => setReissuBookModal(false)}
      />

      <LostBookModalEmployee
        open={lostModal}
        close={() => setLostModal(false)}
      />

      {viewModal && (
        <ViewBookModalEmployee
          close={() => {
            setViewModal(false);
            setViewData(null);
          }}
          data={viewData}
        />
      )}
    </div>
  );
}
