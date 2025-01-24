export type Entry = {
  entryID: string;
  id: number;
  cost: number;
  date: Date | string | number;
}

export type ID = {
  id: number;
  cost: number;
  timesEntered: number;
  date: Date | string | number;
  entries: Entry[];
}