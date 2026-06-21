import React, { useRef, useState } from "react";
import { X } from "lucide-react";

const BookImageModal = ({ close, data, showChangeButton = true }) => {
  const fileRef = useRef(null);

  const [image, setImage] = useState(
    data?.image || "https://via.placeholder.com/300",
  );

  const changeImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[70%]">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Book Image</h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* body */}

        <div
          className={`p-8 flex min-h-[350px] ${showChangeButton ? "gap-20" : "justify-center"}`}
        >
          <div>
            <img
              src={image}
              className="w-80 h-72 object-cover bg-black rounded-lg"
            />
          </div>

          {showChangeButton && (
            <div>
              <button
                onClick={() => fileRef.current.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg cursor-pointer"
              >
                Change Image
              </button>

              <input
                ref={fileRef}
                onChange={changeImage}
                type="file"
                accept="image/*"
                hidden
              />
            </div>
          )}
        </div>

        {/* footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookImageModal;
