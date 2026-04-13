import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer from "lib/redux/settingsSlice";
import aiReducer from "lib/redux/aiSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;