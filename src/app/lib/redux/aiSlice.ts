import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export interface AIState {
  jobTitle: string;
  jobDescription: string;
  isAnalyzing: boolean;
  coverLetter: string;
}

export const initialAIState: AIState = {
  jobTitle: "",
  jobDescription: "",
  isAnalyzing: false,
  coverLetter: "",
};

export const aiSlice = createSlice({
  name: "ai",
  initialState: initialAIState,
  reducers: {
    setJobTitle: (draft, action: PayloadAction<string>) => {
      draft.jobTitle = action.payload;
    },
    setJobDescription: (draft, action: PayloadAction<string>) => {
      draft.jobDescription = action.payload;
    },
    setIsAnalyzing: (draft, action: PayloadAction<boolean>) => {
      draft.isAnalyzing = action.payload;
    },
    setCoverLetter: (draft, action: PayloadAction<string>) => {
      draft.coverLetter = action.payload;
    },
  },
});

export const { setJobTitle, setJobDescription, setIsAnalyzing, setCoverLetter } = aiSlice.actions;

export const selectJobTitle = (state: RootState) => state.ai.jobTitle;
export const selectJobDescription = (state: RootState) => state.ai.jobDescription;
export const selectIsAnalyzing = (state: RootState) => state.ai.isAnalyzing;
export const selectCoverLetter = (state: RootState) => state.ai.coverLetter;

export default aiSlice.reducer;