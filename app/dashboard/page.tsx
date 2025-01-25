"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Entry, ID } from '@/app/utils/types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart,
  Line, PieChart, Pie, Cell
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isWithinInterval } from 'date-fns';
import History from '@/app/components/History';
import CostPerID from '@/app/components/CostPerID';
import Navbar from '../components/Navbar';
import { deleteEntry } from '../utils/utils';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [idStats, setIdStats] = useState<{ id: number; totalEntries: number; totalCost: number; averageCost: number; }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("DB instance:", db); // Debug log
        const idsRef = collection(db, "IDs");
        console.log("Collection reference:", idsRef); // Debug log

        const querySnapshot = await getDocs(idsRef);
        console.log("Query snapshot:", querySnapshot.size); // Debug log

        const ids: ID[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Processing document:", doc.id, data);

          // Ensure entries exist and is an array
          const entries = Array.isArray(data.entries) ? data.entries : [];

          const processedData: ID = {
            id: parseInt(doc.id),
            cost: data.cost || 0,
            timesEntered: data.timesEntered || 0,
            date: data.date?.toDate() || new Date(),
            entries: entries.map((entry: Entry) => ({
              id: entry.id || 0,
              cost: entry.cost || 0,
              date: entry.date || '',
              entryID: entry.entryID || '',
              timestamp: entry.timestamp || Date.now()
            }))
          };

          ids.push(processedData);
        });

        processData(ids, startDate, endDate);
      } catch (error) {
        console.error("Error fetching data:", {
          error,

        });
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const processData = (ids: ID[], start: Date, end: Date) => {
    console.log("Processing data with date range:", { start, end });

    const allEntries = ids.flatMap(id => {
      console.log(`Processing ID ${id.id} with ${id.entries.length} entries`);
      return id.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        console.log(`Entry date: ${entryDate}, In range: ${isWithinInterval(entryDate, { start, end })}`);
        return isWithinInterval(entryDate, { start, end });
      });
    });

    console.log("Filtered entries:", allEntries);
    setFilteredEntries(allEntries);

    const total = allEntries.reduce((sum, entry) => sum + entry.cost, 0);
    console.log("Total cost:", total);
    setTotalCost(total);

    const idStatistics = ids.map(id => {
      const idEntries = id.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return isWithinInterval(entryDate, { start, end });
      });

      return {
        id: id.id,
        totalEntries: idEntries.length,
        totalCost: idEntries.reduce((sum, entry) => sum + entry.cost, 0),
        averageCost: idEntries.length > 0
          ? idEntries.reduce((sum, entry) => sum + entry.cost, 0) / idEntries.length
          : 0
      };
    }).filter(stat => stat.totalEntries > 0);

    console.log("ID Statistics:", idStatistics);
    setIdStats(idStatistics);
  };

  const handleDeleteEntry = (id: number, entryID: string) => {
    deleteEntry(id, entryID);
    setFilteredEntries(filteredEntries.filter(entry => entry.entryID !== entryID));
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar />
      <div className=" p-4 max-w-7xl mx-auto md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-800">Dashboard</h1>

        {/* Date Range Picker */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date || new Date())}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date || new Date())}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-2">Total Cost</h3>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">${totalCost.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-2">Total Entries</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{filteredEntries.length}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-2">Average Cost per Entry</h3>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">
              ${(totalCost / (filteredEntries.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Add the CostPerID component */}
          <CostPerID data={idStats} />
          {/* Bar Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-[400px] md:h-[500px]">
            <h3 className="text-base md:text-lg font-semibold mb-4">Entries per ID</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={idStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEntries" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>


          {/* Line Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-[400px] md:h-[500px] lg:col-span-2">
            <h3 className="text-base md:text-lg font-semibold mb-4">Cost Trend</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={idStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalCost" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-[400px] md:h-[500px] lg:col-span-2">
            <h3 className="text-base md:text-lg font-semibold mb-4">Cost Distribution by ID</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={idStats}
                  dataKey="totalCost"
                  nameKey="id"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  label
                >
                  {idStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add the History component */}
        <History entries={filteredEntries} onDelete={handleDeleteEntry} />


      </div>
    </div>
  );
}
