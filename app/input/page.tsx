"use client"
import "@/app/globals.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaMoneyBill } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { addEntry, getEntries, toastConfig } from "@/app/utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddNewIdModal from "@/app/components/AddNewIdModal";
import { FaPencil } from "react-icons/fa6";
import { BiCalendar, BiPencil } from "react-icons/bi";

interface Entry {
  id: number;
  cost: number;
  timesEntered: number;
  date: Date;
}

interface FirebaseEntry {
  id: string;
  cost?: number;
  timesEntered?: number;
  date?: string;
}

export default function Input() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newId, setNewId] = useState<number>(0);
  const [idsList, setIds] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    getEntries().then((e: FirebaseEntry[]) => {
      const tempList = e.map((doc) => ({
        id: parseInt(doc.id),
        cost: doc.cost ?? 0,
        timesEntered: doc.timesEntered ?? 0,
        date: doc.date ? new Date(doc.date) : new Date()
      }));
      setEntries(tempList);
      setIds(tempList.map((doc) => doc.id));
      setSelectedId(tempList[0].id);
    });
  }, [showModal]);

  useEffect(() => {
    const selectedEntry = entries.find((entry) => entry.id === selectedId);
    setCost(selectedEntry?.cost || 0);
    setSelectedDate(selectedEntry?.date || new Date());
  }, [selectedId]);

  const handleSubmit = () => {
    if (selectedDate) {
      addEntry(selectedId, cost, selectedDate);
      const entryIndex = entries.findIndex(entry => entry.id === selectedId);
      let updatedEntries = [...entries];

      if (entryIndex !== -1) {
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          cost,
          date: selectedDate,
          timesEntered: updatedEntries[entryIndex].timesEntered + 1
        };
      } else {
        updatedEntries.push({ id: selectedId, cost, timesEntered: 1, date: selectedDate });
      }

      setEntries(updatedEntries);
      toast.success('Entry added successfully!', toastConfig);
    } else {
      toast.error('Please select a date.', toastConfig);
    }
  }

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2 bg-white"}>
      <ToastContainer />
      <div className="flex flex-row items-center mb-8">
        <button className="mr-4 text-white hover:text-gray-200">
          <a href="/">Back</a>
        </button>
        <h1 className="text-6xl font-lato text-black drop-shadow-lg font-extrabold">Input</h1>
      </div>

      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-between w-full space-x-4">
              <div className="flex flex-row justify-between w-40 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center mt-4 ">
                <div className="pl-2 flex flex-col">
                  <p className="text-sm text-gray-500">ID:</p>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(parseInt(e.target.value))}
                    className="w-full rounded-md text-black">
                    {idsList.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-l border-gray-300 border border-[0.5px] h-10 ml-6 " />
                <button
                  className="mr-4 text-md"
                  onClick={() => setShowModal(true)}
                >
                  <BiPencil />
                </button>
              </div>
            </div>
            {showModal && (
              <AddNewIdModal
                newId={newId}
                setNewId={setNewId}
                setIds={setIds}
                idsList={idsList}
                setSelectedId={setSelectedId}
                setShowModal={setShowModal}
              />
            )}
          </div>

          <div className="flex w-40 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center mt-4 ">
            <div className="pl-2 flex flex-col">
              <p className="text-sm text-gray-500">Price:</p>
              <input
                type="text"
                value={`$${cost}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/^\$/, '');
                  setCost(Number(value));
                }}
                placeholder="$200"
                className="w-full rounded-md text-black"
              />
            </div>


          </div>
          <div className="flex w-40 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center mt-4">
            <div className="ml-2 flex flex-col">
              <p className="text-sm text-gray-500">Selected Date:</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="MM/dd"
                className="w-full"
              />
            </div>
            <div className="border-l border-gray-300 border border-[0.5px] h-11 mr-3 " />
            <BiCalendar
              className="mr-4 text-2xl text-black-500 cursor-pointer"
              onClick={() => (document.querySelector('.react-datepicker__input-container input') as HTMLInputElement)?.focus()}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 p-2 w-full bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Add
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
        <button
          onClick={getEntries}
          className="p-2 w-full bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Get Entries
        </button>
        <div className="flex text-black flex-col items-center justify-center mt-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white p-2 rounded-md shadow-md mb-2 w-full text-center">
              {entry.id} - ${entry.cost} - {entry.timesEntered} - {entry.date.toLocaleDateString()}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
