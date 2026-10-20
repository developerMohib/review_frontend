"use client";

import { useMemo, useState } from "react";
import { Check, ExternalLink, MoreHorizontal, Search, X } from "lucide-react";
import { demoSubmissions, type Submission, type SubmissionStatus } from "@/lib/demo-data";

type Filter = "All" | SubmissionStatus;

const filters: Filter[] = ["All", "Pending", "Approved", "Needs changes"];

export default function SubmissionTable() {
  const [submissions, setSubmissions] = useState(demoSubmissions);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const visibleSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((submission) => {
      const matchesFilter = filter === "All" || submission.status === filter;
      const matchesSearch =
        !query ||
        submission.name.toLowerCase().includes(query) ||
        submission.project.toLowerCase().includes(query) ||
        submission.id.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, submissions]);

  function updateStatus(id: string, status: SubmissionStatus) {
    setSubmissions((current) =>
      current.map((submission) => (submission.id === id ? { ...submission, status } : submission)),
    );
  }

  return (
    <section className="table-card">
      <div className="table-card-heading">
        <div>
          <h2>Recent submissions</h2>
          <p>Review and manage projects from your community.</p>
        </div>
        <button className="secondary-button table-view-button" type="button" onClick={() => setFilter("All")}>
          View all <ExternalLink size={15} />
        </button>
      </div>
      <div className="table-toolbar">
        <div className="table-tabs" role="tablist" aria-label="Filter submissions">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "table-tab active" : "table-tab"}
              onClick={() => setFilter(item)}
              role="tab"
              aria-selected={filter === item}
              type="button"
            >
              {item}
              {item === "Pending" && <span className="tab-count">8</span>}
            </button>
          ))}
        </div>
        <label className="table-search">
          <Search size={15} />
          <input
            aria-label="Filter submissions"
            placeholder="Filter submissions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="table-scroll">
        <table className="submission-table">
          <thead>
            <tr>
              <th>PROJECT</th>
              <th>SUBMITTED BY</th>
              <th>CATEGORY</th>
              <th>SUBMITTED</th>
              <th>STATUS</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleSubmissions.map((submission) => (
              <SubmissionRow key={submission.id} submission={submission} onUpdate={updateStatus} />
            ))}
          </tbody>
        </table>
        {visibleSubmissions.length === 0 && (
          <div className="empty-table">No submissions match your search.</div>
        )}
      </div>
      <div className="table-footer">
        <span>Showing <strong>{visibleSubmissions.length}</strong> of <strong>{submissions.length}</strong> demo submissions</span>
        <button type="button" className="pagination-button" aria-label="More submissions"><MoreHorizontal size={18} /></button>
      </div>
    </section>
  );
}

function SubmissionRow({
  submission,
  onUpdate,
}: {
  submission: Submission;
  onUpdate: (id: string, status: SubmissionStatus) => void;
}) {
  return (
    <tr>
      <td>
        <div className="project-cell">
          <div className={`project-avatar ${submission.color}`}>{submission.initials}</div>
          <div><strong>{submission.project}</strong><small>{submission.id}</small></div>
        </div>
      </td>
      <td className="submitter-name">{submission.name}</td>
      <td><span className="category-chip">{submission.category}</span></td>
      <td className="submitted-time">{submission.submitted}</td>
      <td><StatusBadge status={submission.status} /></td>
      <td>
        <div className="row-actions">
          {submission.status === "Pending" ? (
            <>
              <button
                type="button"
                className="row-action approve-action"
                aria-label={`Approve ${submission.project}`}
                title="Approve"
                onClick={() => onUpdate(submission.id, "Approved")}
              ><Check size={15} /></button>
              <button
                type="button"
                className="row-action reject-action"
                aria-label={`Request changes for ${submission.project}`}
                title="Request changes"
                onClick={() => onUpdate(submission.id, "Needs changes")}
              ><X size={15} /></button>
            </>
          ) : <button type="button" className="row-action more-action" aria-label={`More actions for ${submission.project}`}><MoreHorizontal size={16} /></button>}
        </div>
      </td>
    </tr>
  );
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return <span className={`status-badge ${status === "Needs changes" ? "status-changes" : `status-${status.toLowerCase()}`}`}><span />{status}</span>;
}
