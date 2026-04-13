import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type { Resume } from "lib/redux/types";

export interface Snapshot {
  id: string;
  name: string;
  timestamp: number;
  resume: Resume;
}

interface SnapshotState {
  snapshots: Snapshot[];
}

export const initialSnapshotState: SnapshotState = {
  snapshots: [],
};

export const snapshotSlice = createSlice({
  name: "snapshots",
  initialState: initialSnapshotState,
  reducers: {
    addSnapshot: (draft, action: PayloadAction<{ name: string; resume: Resume }>) => {
      draft.snapshots.push({
        id: crypto.randomUUID(),
        name: action.payload.name,
        timestamp: Date.now(),
        resume: action.payload.resume,
      });
    },
    deleteSnapshot: (draft, action: PayloadAction<string>) => {
      draft.snapshots = draft.snapshots.filter((s) => s.id !== action.payload);
    },
    setSnapshots: (draft, action: PayloadAction<Snapshot[]>) => {
      draft.snapshots = action.payload;
    },
  },
});

export const { addSnapshot, deleteSnapshot, setSnapshots } = snapshotSlice.actions;

export const selectSnapshots = (state: RootState) => state.snapshots.snapshots;

export default snapshotSlice.reducer;