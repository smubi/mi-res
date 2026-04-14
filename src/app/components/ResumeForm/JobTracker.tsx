"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { addJob, deleteJob, updateJobStatus, selectJobs, type Job } from "lib/redux/jobSlice";
import { selectSnapshots } from "lib/redux/snapshotSlice";
import { 
  BriefcaseIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ClockIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";
import { cx } from "lib/cx";

const STATUS_COLORS: Record<Job["status"], string> = {
  Wishlist: "bg-gray-100 text-gray-600",
  Applied: "bg-sky-100 text-sky-700",
  Interviewing: "bg-purple-100 text-purple-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export const JobTracker = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const snapshots = useAppSelector(selectSnapshots);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({ company: "", title: "", status: "Wishlist" as Job["status"], snapshotId: "" });

  const handleAdd = () => {
    if (!newJob.company || !newJob.title) return;
    dispatch(addJob(newJob));
    setNewJob({ company: "", title: "", status: "Wishlist", snapshotId: "" });
    setIsAdding(false);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              Job Tracker
            </h1>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            {isAdding ? "Cancel" : <><PlusIcon className="h-3 w-3" /> Add Job</>}
          </button>
        </div>

        {isAdding && (
          <div className="space-y-3 rounded-xl border border-sky-100 bg-sky-50/30 p-4">
            <input
              type="text"
              placeholder="Company Name"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Job Title"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-sky-500"
                value={newJob.status}
                onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-sky-500"
                value={newJob.snapshotId}
                onChange={(e) => setNewJob({ ...newJob, snapshotId: e.target.value })}
              >
                <option value="">No Version Linked</option>
                {snapshots.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAdd}
              disabled={!newJob.company || !newJob.title}
              className="w-full rounded-md bg-sky-600 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Save Job
            </button>
          </div>
        )}

        <div className="space-y-3">
          {jobs.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-400 italic">No jobs tracked yet. Start by adding your first application!</p>
          ) : (
            [...jobs].sort((a, b) => b.date - a.date).map((job) => (
              <div key={job.id} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-sky-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{job.company}</span>
                    <span className={cx("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_COLORS[job.status])}>
                      {job.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{job.title}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <ClockIcon className="h-3 w-3" />
                      {new Date(job.date).toLocaleDateString()}
                    </span>
                    {job.snapshotId && (
                      <span className="flex items-center gap-1 text-[10px] text-sky-500 font-medium">
                        <TagIcon className="h-3 w-3" />
                        {snapshots.find(s => s.id === job.snapshotId)?.name || "Version Deleted"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-bold outline-none focus:border-sky-500"
                    value={job.status}
                    onChange={(e) => dispatch(updateJobStatus({ id: job.id, status: e.target.value as any }))}
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => dispatch(deleteJob(job.id))}
                    className="rounded-md p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
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