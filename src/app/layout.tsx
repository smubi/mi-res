import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { AppProvider } from "components/AppProvider";

export const metadata = {
  title: "CareerCraft - AI-Powered Resume Builder & ATS Checker",
  description:
    "CareerCraft is a powerful AI-driven resume builder that helps you create professional, ATS-optimized resumes in minutes. Analyze your resume, match job descriptions, and land more interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <TopNavBar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
