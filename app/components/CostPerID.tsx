import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CostPerIDProps {
  data: { id: number; totalEntries: number; totalCost: number; averageCost: number; }[];
}

const CostPerID: React.FC<CostPerIDProps> = ({ data }) => {
  // Prepare data for the chart

  return (
    <div className="bg-white p-4  shadow-md h-[400px] md:h-[500px] md:p-6 rounded-lg shadow-md ">
      <h3 className="text-base md:text-lg font-semibold mb-4">Total Cost per ID</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={"90%"}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="totalCost" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CostPerID; 