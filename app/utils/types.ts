export interface Entry {
  id: number;
  cost: number;
  date: string;
  entryID: string;
  timestamp: number;
}

export interface ID {
  id: number;
  cost: number;
  timesEntered: number;
  date: Date;
  entries: Entry[];
}