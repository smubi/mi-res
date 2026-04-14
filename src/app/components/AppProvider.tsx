"use client";

import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ThemeProvider } from "components/ThemeProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
};
