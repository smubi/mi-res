# AI Rules & Tech Stack

## Tech Stack
- **Framework**: Next.js 13 (App Router) for robust routing and server-side capabilities.
- **Language**: TypeScript for static typing and maintainable code.
- **State Management**: Redux Toolkit (RTK) to handle complex, nested resume data and application settings.
- **Styling**: Tailwind CSS for utility-first, responsive design.
- **PDF Generation**: `@react-pdf/renderer` for high-quality, ATS-friendly PDF exports.
- **PDF Parsing**: `pdfjs-dist` for extracting text and structure from uploaded resumes.
- **Icons**: `lucide-react` (preferred for new features) and `@heroicons/react` (existing).
- **UI Components**: shadcn/ui (Radix UI) for accessible, pre-built interface elements.

## Library Usage Rules

### 1. State Management
- **Rule**: All resume data (Profile, Work Experience, Education, etc.) and global settings must be managed via Redux.
- **Location**: Slices are located in `src/app/lib/redux/`.
- **Usage**: Use `useAppSelector` and `useAppDispatch` hooks for interacting with the store.

### 2. PDF Rendering
- **Rule**: Use `@react-pdf/renderer` primitives (`Document`, `Page`, `View`, `Text`) exclusively for the resume preview and export.
- **Units**: Use `pt` (points) for PDF styling to ensure print consistency, as defined in `src/app/components/Resume/ResumePDF/styles.ts`.

### 3. UI Components & Icons
- **Rule**: For new UI elements, prioritize **shadcn/ui** components.
- **Icons**: Use **Lucide React** for any new icons. Existing icons using Heroicons should be maintained unless a full refactor is requested.

### 4. Styling
- **Rule**: Use **Tailwind CSS** utility classes for all web-based UI. 
- **Responsive Design**: Always ensure components are mobile-friendly using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).

### 5. Navigation
- **Rule**: Use `next/navigation` for routing. Use the `Link` component for client-side navigation and `usePathname` or `useRouter` for programmatic access.

### 6. File Structure
- **Pages**: `src/app/` (Next.js App Router).
- **Components**: `src/app/components/`.
- **Logic/Utils**: `src/app/lib/`.