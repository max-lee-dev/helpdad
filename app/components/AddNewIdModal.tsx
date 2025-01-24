import React, { useState } from 'react';
import { AddID } from "@/app/utils/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddNewIdModalProps {
  newId: number;
  setNewId: (id: number) => void;
  setIds: (ids: number[]) => void;
  idsList: number[];
  setSelectedId: (id: number) => void;
  setShowModal: (show: boolean) => void;
}

export default function AddNewIdModal({
  newId,
  setNewId,
  setIds,
  idsList,
  setSelectedId,
  setShowModal,
}: AddNewIdModalProps) {
  const [newCost, setNewCost] = useState<number>(0);
  const [newDate, setNewDate] = useState<Date | null>(new Date());

  const isValidDate = (date: Date | null) => date instanceof Date && !isNaN(date.getTime());

  const handleAddNewId = async () => {
    const dateToUse = new Date || new Date();
    if (!isValidDate(dateToUse)) {
      console.error("Invalid date:", dateToUse);
      return;
    }

    if (newId && newCost) {
      try {
        if (!idsList.includes(newId)) {
          const UID = Math.random().toString(36).substr(2, 9);
          await AddID(newId, newCost, dateToUse, UID);
          setIds([...idsList, newId]);
          setSelectedId(newId); // Select the newly added ID
          // also add an entry

        }
        setShowModal(false);
      } catch (error) {
        console.error("Error adding/updating entry:", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
    >
      <div className="bg-white p-4 rounded-md shadow-md z-60">
        <h2 className="text-xl font-bold mb-4">Add New ID</h2>
        <label className="block text-sm font-medium text-gray-700">New ID</label>
        <input
          type="text"
          value={newId}
          onChange={(e) => setNewId(parseInt(e.target.value))}
          className="p-2 text-black border border-gray-300 rounded-md"
          placeholder="New ID"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">Cost</label>
        <input
          type="number"
          value={newCost}
          onChange={(e) => setNewCost(Number(e.target.value))}
          className="p-2 text-black border border-gray-300 rounded-md mt-1"
          placeholder="Cost"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4">Date</label>
        <DatePicker
          selected={newDate}
          onChange={(date: Date | null) => setNewDate(date)}
          dateFormat="MM/dd/yyyy"
          className="mt-1 p-2 pl-8 w-40 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleAddNewId} className="p-2 bg-black text-white rounded-md">
            Add
          </button>
          <button onClick={() => setShowModal(false)} className="p-2 bg-gray-500 text-white rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
