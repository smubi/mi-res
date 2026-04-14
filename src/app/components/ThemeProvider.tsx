"use client";

import { useEffect } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectSettings } from "lib/redux/settingsSlice";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppSelector(selectSettings);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};
