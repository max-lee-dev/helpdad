"use client"
import "@/app/globals.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { addEntry, deleteEntry, getIDs, toastConfig } from "@/app/utils/utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddNewIdModal from "@/app/components/AddNewIdModal";
import { BiCalendar, BiPlus, BiTrash } from "react-icons/bi";
import { Entry, ID } from "@/app/utils/types";


export default function Input() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1); // New state for quantity
  const [sessionEntries, setSessionEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newId, setNewId] = useState<number>(0);
  const [idsList, setIds] = useState<number[]>([]);
  const [IDInfos, setIDInfos] = useState<ID[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const isValidDate = (date: Date | null) => date instanceof Date && !isNaN(date.getTime());

  useEffect(() => {
    try {
      getIDs().then((e: ID[]) => {
        if (e.length === 0) {
          toast.error("No entries found", toastConfig);
          return;
        }
        const tempList = e.map((doc) => ({
          id: doc.id,
          cost: doc.cost ?? 0,
          timesEntered: doc.timesEntered ?? 0,
          date: doc.date,
          entries: doc.entries.map(entry => ({
            ...entry,
            date: entry.date,
            timestamp: entry.timestamp || Date.now() // Ensure timestamp is set
          })).sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp
        }));
        setIDInfos(tempList);
        setCost(40);
        setIds(tempList.map((doc) => doc.id));
        setSelectedId(tempList[0].id);

        const entries = tempList.map((doc) => doc.entries).flat();
        setSessionEntries(entries);
      });
    } catch (error) {
      console.error("Error getting entries:", error);
    }
  }, []);

  useEffect(() => {
    const selectedEntry = IDInfos.find((entry) => entry.id === selectedId);

    if (selectedEntry) {
      setCost(selectedEntry?.cost || 0);
      setSelectedDate(selectedEntry?.date as Date || new Date());
    }
  }, [selectedId, IDInfos]); // Added IDInfos to dependencies

  const handleSubmit = () => {
    const dateToUse = selectedDate || new Date();

    // Log the date being used
    console.log("Date being used:", dateToUse.toLocaleDateString());

    if (!isValidDate(dateToUse)) {
      toast.error('Invalid date selected.', toastConfig);
      console.error("Invalid date:", dateToUse);
      return;
    }

    const entryIDs = Array.from({ length: quantity }, () => Math.random().toString(36).substr(2, 9));
    addEntry(selectedId, cost, dateToUse, entryIDs, quantity); // add multiple entries based on quantity
    const newEntries = entryIDs.map((entryID) => ({
      id: selectedId,
      cost: cost,
      date: dateToUse.toLocaleDateString(),
      timestamp: Date.now(),
      entryID: entryID
    }));

    // frontend, update the UI to show responsiveness
    const updatedEntries = [...sessionEntries, ...newEntries];
    //

    setSessionEntries(updatedEntries);
    toast.success('Entry added successfully!', toastConfig);
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
                <div className="flex flex-col">
                  <p className="pl-2 py-1 text-xs text-gray-500">ID</p>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(parseInt(e.target.value))}
                    className="pl-1 1w-fit rounded-md text-black">
                    {idsList.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-l border-gray-300 border border-[0.5px] h-10 ml-14 " />
                <button
                  className="mr-3 text-md"
                  onClick={() => setShowModal(true)}
                >
                  <BiPlus />
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

          <div className="flex space-x-1 mt-4 w-40">
            <div className="flex w-1/2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center">
              <div className="pl-2 flex flex-col">
                <p className="py-1 text-xs text-gray-500">Price</p>
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

            <div className="flex w-1/2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center">
              <div className="pl-2 flex flex-col">
                <p className="text-xs py-1 text-gray-500">Quantity</p>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className="w-full rounded-md text-black"
                />
              </div>
            </div>
          </div>

          <div className="flex w-40 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 items-center mt-4">
            <div className="ml-2 flex flex-col">
              <p className="text-xs text-gray-500">Date</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                }}
                dateFormat="MM/dd/yyyy"
                className=" w-full text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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

        <div className="flex text-black flex-col items-center justify-center mt-4">
          {sessionEntries.map((entry) => (
            <div key={entry.id} className="bg-white p-2 rounded-md shadow-md mb-2 w-full text-center">
              <div className="flex flex-row justify-between w-full">
                #{entry.id}: ${entry.cost} - {entry.date}
                <button
                  onClick={() => {
                    deleteEntry(entry.id, entry.entryID);
                    setSessionEntries(sessionEntries.filter((e) => e.entryID !== entry.entryID));
                  }}
                  className="text-black px-1 mx-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <BiTrash className="text-md" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
