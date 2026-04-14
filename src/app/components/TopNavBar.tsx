"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "components/Logo";
import { cx } from "lib/cx";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings, selectSettings } from "lib/redux/settingsSlice";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(selectSettings);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    dispatch(changeSettings({ field: "theme", value: nextTheme }));
  };

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "sticky top-0 z-50 flex h-[var(--top-nav-bar-height)] items-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-12 transition-colors",
        "dark:border-slate-800 dark:bg-slate-900/80"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-4 text-sm font-semibold"
        >
          {[
            ["/resume-builder", "Resume Builder"],
            ["/resume-parser", "ATS Checker"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className={cx(
                "rounded-full px-4 py-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                pathName === href ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
              )}
              href={href}
            >
              {text}
            </Link>
          ))}
          
          <button
            onClick={toggleTheme}
            className="ml-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
