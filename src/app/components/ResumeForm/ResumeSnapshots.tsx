"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import { addSnapshot, deleteSnapshot, selectSnapshots } from "lib/redux/snapshotSlice";
import { 
  FolderIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ClockIcon 
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

export const ResumeSnapshots = () => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(selectResume);
  const snapshots = useAppSelector(selectSnapshots);
  const [newName, setNewName] = useState("");

  const handleSave = () => {
    if (!newName.trim()) return;
    dispatch(addSnapshot({ name: newName, resume }));
    setNewName("");
  };

  const handleRestore = (snapshotResume: any) => {
    if (confirm("This will replace your current resume data. Continue?")) {
      dispatch(setResume(snapshotResume));
    }
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">
            Resume Versions
          </h1>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Version name (e.g. Frontend Dev)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="flex items-center gap-1 rounded-md bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
            Save
          </button>
        </div>

        <div className="space-y-2">
          {snapshots.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-400 italic">No saved versions yet.</p>
          ) : (
            snapshots.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:border-sky-200">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{s.name}</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <ClockIcon className="h-3 w-3" />
                    {new Date(s.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRestore(s.resume)}
                    className="rounded-md p-1.5 text-sky-600 hover:bg-sky-100"
                    title="Restore this version"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => dispatch(deleteSnapshot(s.id))}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </BaseForm>
  );
};