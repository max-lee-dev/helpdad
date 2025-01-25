import React from 'react';
import { Entry } from '@/app/utils/types';
import { formatDistanceToNow } from 'date-fns';
import { BiTrash } from 'react-icons/bi';

interface HistoryProps {
  entries: Entry[];
  onDelete: (id: number, entryID: string) => void;
}

const History: React.FC<HistoryProps> = ({ entries, onDelete }) => {
  // Sort entries by timestamp in descending order
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white p-4 w-full rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">History of Entries</h3>
      {sortedEntries.length === 0 ? (
        <p className="text-gray-500">No history available for this item.</p>
      ) : (
        <ul className="space-y-2">
          {sortedEntries.map((entry) => (
            <li key={entry.entryID} className="flex justify-between p-2 border-b">
              <div>
                <p className="font-medium">#{entry.id}: ${entry.cost}</p>
                <p className="text-sm text-gray-500">
                  Added {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={() => onDelete(entry.id, entry.entryID)}
                  className="text-red-500 text-xs hover:text-red-700 mb-3"
                >
                  <BiTrash className="w-3 h-3" />
                </button>
                <div className="text-sm text-gray-500">
                  {entry.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History; 