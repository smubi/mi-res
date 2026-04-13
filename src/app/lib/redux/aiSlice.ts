import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export interface AIState {
  jobDescription: string;
  isAnalyzing: boolean;
}

const initialState: AIState = {
  jobDescription: "",
  isAnalyzing: false,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setJobDescription: (draft, action: PayloadAction<string>) => {
      draft.jobDescription = action.payload;
    },
    setIsAnalyzing: (draft, action: PayloadAction<boolean>) => {
      draft.isAnalyzing = action.payload;
    },
  },
});

export const { setJobDescription, setIsAnalyzing } = aiSlice.actions;

export const selectJobDescription = (state: RootState) => state.ai.jobDescription;
export const selectIsAnalyzing = (state: RootState) => state.ai.isAnalyzing;

export default aiSlice.reducer;