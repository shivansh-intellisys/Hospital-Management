// ✅ FILE: types/Patient.ts

export type VisitHistoryEntry = {
  id: string;
  date: string;
  time: string;
  doctor?: string;
  notes?: string;
  symptoms?: string;
  medicines?: string;
  advice?: string;
  reports?: string[];
  prescription?: string;
   department: string;
   status: string;
};

export type Patient = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
  status?: "pending" | "completed";
  gender?: string;
  age?: string;
  bloodGroup?: string;
  email?: string;
  note?: string;
  
   department: string;  // ✅ Used in add-patient & booking
  doctor: string;      // ✅ Used in add-patient & booking
  
  visitHistory: VisitHistoryEntry[]; // ✅ Always initialized (not optional)
};
