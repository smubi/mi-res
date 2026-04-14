import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export interface Job {
  id: string;
  company: string;
  title: string;
  date: number;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Wishlist";
  snapshotId?: string;
  notes?: string;
}

interface JobState {
  jobs: Job[];
}

export const initialJobState: JobState = {
  jobs: [],
};

export const jobSlice = createSlice({
  name: "jobs",
  initialState: initialJobState,
  reducers: {
    addJob: (draft, action: PayloadAction<Omit<Job, "id" | "date">>) => {
      draft.jobs.push({
        id: crypto.randomUUID(),
        date: Date.now(),
        ...action.payload,
      });
    },
    updateJobStatus: (
      draft,
      action: PayloadAction<{ id: string; status: Job["status"] }>
    ) => {
      const job = draft.jobs.find((j) => j.id === action.payload.id);
      if (job) {
        job.status = action.payload.status;
      }
    },
    updateJobNotes: (
      draft,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const job = draft.jobs.find((j) => j.id === action.payload.id);
      if (job) {
        job.notes = action.payload.notes;
      }
    },
    deleteJob: (draft, action: PayloadAction<string>) => {
      draft.jobs = draft.jobs.filter((j) => j.id !== action.payload);
    },
    setJobs: (draft, action: PayloadAction<Job[]>) => {
      draft.jobs = action.payload;
    },
  },
});

export const { addJob, updateJobStatus, updateJobNotes, deleteJob, setJobs } = jobSlice.actions;

export const selectJobs = (state: RootState) => state.jobs.jobs;

export default jobSlice.reducer;