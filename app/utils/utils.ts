import { collection, addDoc, getDocs, query, updateDoc, orderBy, } from "firebase/firestore";
import { ToastPosition, ToastOptions } from 'react-toastify';
import { db } from "@/firebase";

export async function addEntry(id: number, cost: number, date: Date | null) {
  const entriesRef = collection(db, "entries");
  const entriesSnapshot = await getDocs(entriesRef); // this is bad but like its just my dad using it
  let entryExists = false;

  entriesSnapshot.forEach((doc) => {
    if (doc.data().id === id) {
      entryExists = true;
      const newTimesEntered = doc.data().timesEntered + 1;
      updateDoc(doc.ref, { timesEntered: newTimesEntered, cost, date });
    }
  });

  if (!entryExists) {
    addDoc(entriesRef, { id, cost, timesEntered: 1, date });
  }
}



export async function getEntries() {
  const entriesRef = collection(db, "entries"); // Reference to the collection
  const q = query(entriesRef, orderBy("timesEntered", "desc")); // Replace "field_name" with the field to order by
  const querySnapshot = await getDocs(q); // Execute the query


  // Convert the query results to an array of data
  const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return entries;
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

export async function updateEntry(id: number, cost: number, date: Date | null) {
  const entriesRef = collection(db, "entries");
  const entriesSnapshot = await getDocs(entriesRef);
  const entryExists = entriesSnapshot.docs.find((doc) => doc.data().id === id);
  if (entryExists) {
    updateDoc(entryExists.ref, { cost, date });
  }
}
