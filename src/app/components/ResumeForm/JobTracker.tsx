"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { addJob, deleteJob, updateJobStatus, updateJobNotes, selectJobs, type Job } from "lib/redux/jobSlice";
import { selectSnapshots } from "lib/redux/snapshotSlice";
import { 
  BriefcaseIcon, 
  PlusIcon, 
  TrashIcon, 
  ClockIcon,
  TagIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";
import { cx } from "lib/cx";

const STATUS_COLORS: Record<Job["status"], string> = {
  Wishlist: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Applied: "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
  Interviewing: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  Offer: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export const JobTracker = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const snapshots = useAppSelector(selectSnapshots);
  
  const [isAdding, setIsAdding] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState({ company: "", title: "", status: "Wishlist" as Job["status"], snapshotId: "", notes: "" });

  const handleAdd = () => {
    if (!newJob.company || !newJob.title) return;
    dispatch(addJob(newJob));
    setNewJob({ company: "", title: "", status: "Wishlist", snapshotId: "", notes: "" });
    setIsAdding(false);
  };

  const pipeline = ["Wishlist", "Applied", "Interviewing", "Offer"] as const;

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
              <BriefcaseIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Job Tracker
            </h1>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 rounded-full bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-sky-700 active:scale-95"
          >
            {isAdding ? "Cancel" : <><PlusIcon className="h-3 w-3" /> Add Job</>}
          </button>
        </div>

        {isAdding && (
          <div className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/30 p-5 dark:border-sky-900/20 dark:bg-sky-900/5">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company Name"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              />
              <input
                type="text"
                placeholder="Job Title"
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={newJob.status}
                onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
              >
                {pipeline.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={newJob.snapshotId}
                onChange={(e) => setNewJob({ ...newJob, snapshotId: e.target.value })}
              >
                <option value="">No Version Linked</option>
                {snapshots.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Notes (Interview dates, contacts, etc.)"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white min-h-[80px]"
              value={newJob.notes}
              onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
            />
            <button
              onClick={handleAdd}
              disabled={!newJob.company || !newJob.title}
              className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Save Application
            </button>
          </div>
        )}

        <div className="space-y-6">
          {pipeline.map((status) => {
            const statusJobs = jobs.filter(j => j.status === status);
            if (statusJobs.length === 0) return null;

            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{status}</h3>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                  <span className="text-[10px] font-black text-gray-400">{statusJobs.length}</span>
                </div>
                
                <div className="grid gap-3">
                  {statusJobs.map((job) => (
                    <div key={job.id} className="group flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-sky-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-900/50">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{job.company}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{job.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            {expandedJobId === job.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => dispatch(deleteJob(job.id))}
                            className="rounded-lg p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {expandedJobId === job.id && (
                        <div className="border-t border-gray-50 bg-gray-50/30 p-4 space-y-4 dark:border-gray-800 dark:bg-gray-800/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Update Status</label>
                              <select
                                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                value={job.status}
                                onChange={(e) => dispatch(updateJobStatus({ id: job.id, status: e.target.value as any }))}
                              >
                                {pipeline.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Resume Version</label>
                              <div className="flex items-center gap-1.5 text-xs text-sky-600 font-bold py-1.5 dark:text-sky-400">
                                <TagIcon className="h-3.5 w-3.5" />
                                {job.snapshotId ? (snapshots.find(s => s.id === job.snapshotId)?.name || "Version Deleted") : "None linked"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400">
                                <PencilSquareIcon className="h-3.5 w-3.5" />
                                Notes & Reminders
                              </label>
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <ClockIcon className="h-3 w-3" />
                                Added {new Date(job.date).toLocaleDateString()}
                              </span>
                            </div>
                            <textarea
                              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-600 outline-none focus:border-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 min-h-[100px]"
                              value={job.notes || ""}
                              placeholder="Add interview dates, contact names, or follow-up reminders..."
                              onChange={(e) => dispatch(updateJobNotes({ id: job.id, notes: e.target.value }))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {jobs.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <BriefcaseIcon className="h-8 w-8 text-gray-200 dark:text-gray-700" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">No jobs tracked yet</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Start by adding your first application to track your progress.</p>
            </div>
          )}
        </div>
      </div>
    </BaseForm>
  );
};