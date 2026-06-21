import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueCardModal from "../../components/library/IssueCardModal";
import IssueBookModal from "../../components/library/IssueBookModal";
import ReturnBookModal from "../../components/library/ReturnBookModal";
import ReissueBookModal from "../../components/library/ReissueBookModal";
import DamagedModal from "../../components/library/DamagedModal";
import LostBookModal from "../../components/library/LostBookModal";

export default function StudentDetail() {
  const navigate = useNavigate();
  const [cardOpen, setCardOpen] = useState(false);
  const [issueBook, setIssueBook] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [reissuBookModal, setReissuBookModal] = useState(false);
  const [damgedBookModal, setDamgedBookModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);

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

  return (
    <div className="space-y-8">
      {/* Student Detail */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-5">
          Student Detail
        </h1>

        <div className="grid grid-cols-3 gap-10">
          {/* left */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Student Id :</b> 97
            </p>

            <p>
              <b>Class :</b> Nursery
            </p>

            <p>
              <b>Issued Books :</b> 1
            </p>

            <div className="flex items-center gap-4 whitespace-nowrap">
              <span>
                <b>Is Topper :</b>
              </span>

              <select
                value={topper}
                onChange={(e) => setTopper(e.target.value)}
                className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-2 text-white w-40"
              >
                <option>No</option>
                <option>Yes</option>
              </select>

              <button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-5 py-2 rounded-lg text-white">
                Change
              </button>
            </div>
          </div>

          {/* middle */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Name :</b> HPSSDR-2693/20
            </p>

            <p>
              <b>Stream :</b>
            </p>

            <p>
              <b>Total Fine :</b> ₹ 0
            </p>
          </div>

          {/* right */}

          <div className="space-y-4 text-gray-300">
            <p>
              <b>Board :</b> CGBSE
            </p>

            <p>
              <b>Academic Year :</b> 2020-2021
            </p>

            <p>
              <b>Book Limit :</b> 2
            </p>

            <div className="flex gap-3 mt-5 whitespace-nowrap">
              <button
                onClick={() => navigate("/library/student-detail/all-issues")}
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

                  <td className="p-3 text-indigo-400 whitespace-nowrap">
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
      <IssueCardModal open={cardOpen} close={() => setCardOpen(false)} />
      <IssueBookModal open={issueBook} close={() => setIssueBook(false)} />
      <ReturnBookModal open={returnModal} close={() => setReturnModal(false)} />
      <DamagedModal
        open={damgedBookModal}
        close={() => setDamgedBookModal(false)}
      />
      <ReissueBookModal
        open={reissuBookModal}
        close={() => setReissuBookModal(false)}
      />

      <LostBookModal open={lostModal} close={() => setLostModal(false)} />
    </div>
  );
}
