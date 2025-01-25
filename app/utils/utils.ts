import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { ToastOptions, ToastPosition } from 'react-toastify';
import { Entry, ID } from "./types";

export async function addEntry(id: number, cost: number, date: Date | null, entryIDs: string[], quantity: number) {
  const entriesRef = collection(db, "IDs");
  const entriesSnapshot = await getDoc(doc(entriesRef, id.toString()));
  const stringDate = date?.toLocaleDateString();
  const newEntries = Array.from({ length: quantity }, (_, i) => {
    const entryID = entryIDs[i];
    return {
      entryID: entryID,
      id: id,
      cost: cost,
      date: stringDate,
      timestamp: Date.now()
    };
  });

  if (entriesSnapshot.exists()) {
    const existingData = entriesSnapshot.data();
    const updatedID = {
      id: existingData.id,
      timestamp: Date.now(),
      cost: existingData.cost,
      timesEntered: existingData.timesEntered + 1,
      date: existingData.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
      entries: [...existingData.entries, ...newEntries]
    };
    updateDoc(entriesSnapshot.ref, updatedID);
  }
}

export async function getIDs(): Promise<ID[]> {
  const entriesRef = collection(db, "IDs"); // Reference to the collection
  const q = query(entriesRef, orderBy("timesEntered", "desc")); // Replace "field_name" with the field to order by
  const querySnapshot = await getDocs(q); // Execute the query


  const entries = querySnapshot.docs.map((doc) => ({
    id: doc.data().id,
    cost: doc.data().cost,
    timesEntered: doc.data().timesEntered,
    date: doc.data().date.toDate(), // Assuming the date is stored as a Firestore timestamp
    entries: doc.data().entries
  }));

  return entries as ID[];
}
export const toastConfig: ToastOptions = {
  position: 'top-right' as ToastPosition,
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
};

export async function AddID(id: number, cost: number, date: Date | null, entryID: string) {
  const newDate = date || new Date();
  const IDsRef = collection(db, "IDs");
  const IDsSnapshot = await getDocs(IDsRef);
  const IDExists = IDsSnapshot.docs.find((doc) => doc.data().id === id);
  if (!IDExists) {
    const newID: ID = { id, cost, date: newDate, entries: [{ entryID: entryID, id, cost, date: newDate.toLocaleDateString() }], timesEntered: 1 };
    setDoc(doc(IDsRef, id.toString()), newID);
  }
}



export async function deleteEntry(id: number, entryID: string) {
  const entriesRef = collection(db, "IDs");
  const entriesSnapshot = await getDoc(doc(entriesRef, id.toString()));
  const entriesArray = entriesSnapshot.data()?.entries;
  if (entriesArray) {
    const newEntriesArray = entriesArray.filter((entry: Entry) => entry.entryID !== entryID);
    updateDoc(entriesSnapshot.ref, { entries: newEntriesArray });
  }
}

