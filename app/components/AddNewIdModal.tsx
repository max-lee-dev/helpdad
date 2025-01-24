import React, { useState } from 'react';
import { addEntry, updateEntry } from "@/app/utils/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddNewIdModalProps {
  newId: number;
  setNewId: React.Dispatch<React.SetStateAction<number>>;
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  idsList: number[];
  setSelectedId: React.Dispatch<React.SetStateAction<number>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewIdModal: React.FC<AddNewIdModalProps> = ({ newId, setNewId, setIds, idsList, setSelectedId, setShowModal }) => {
  const [newCost, setNewCost] = useState(0);
  const [newDate, setNewDate] = useState<Date | null>(new Date());

  const handleAddNewId = async () => {
    if (newId && newCost) {
      try {
        if (!idsList.includes(newId)) {
          await addEntry(newId, newCost, newDate);
          setIds([...idsList, newId]);
        } else {
          // update this entry
          await updateEntry(newId, newCost, newDate);
        }

        setSelectedId(newId);
        setShowModal(false);
      } catch (error) {
        alert("Failed to add entry to the database");
      }
    } else {
      alert("ID is invalid or amount is missing");
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded-md shadow-md z-60">
        <h2 className="text-xl font-bold mb-4">Add/Update ID</h2>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-2">ID</label>
          <input
            type="text"
            value={newId}
            onChange={(e) => setNewId(parseInt(e.target.value))}
            placeholder="Enter new ID"
            className="p-2 text-black border border-gray-300 rounded-md mb-4 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-2">Amount</label>
          <input
            type="text"
            value={newCost}
            onChange={(e) => setNewCost(parseInt(e.target.value))}
            placeholder="Enter amount"
            className="p-2 text-black border border-gray-300 rounded-md mb-4 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-2">Date</label>
          <DatePicker
            selected={newDate}
            dateFormat="MM/dd"
            onChange={(date: Date | null) => setNewDate(date)}
            className="p-2 text-black border border-gray-300 rounded-md mb-4 w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNewId}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div >
  );
};

export default AddNewIdModal;
