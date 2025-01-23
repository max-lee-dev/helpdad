"use client"

import { useState } from "react";


export default function Input() {
  const ids = ["1", "2", "3", "4", "5"];
  // then create a new list and have them be dynamically in order based off how many entries there are.
  const [selectedId, setSelectedId] = useState(ids[0]);

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2 bg-white"}>
      <h1 className={"text-6xl font-bold"}></h1>
      <div>
        <div className="flex flex-row items-center justify-center p-4 space-x-2">
          <select className="mt-4 min-w-24 justify-center text-center p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {ids.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}

          </select>
          <input
            type="text"
            placeholder="Enter your data here"
            className="mt-4 p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-4 p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>
        </div>


      </div>
    </div>
  );
}
