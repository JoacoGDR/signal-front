import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../api/client";
import type { LeadResponse, LeadStatus } from "../../api/types";
import { formatShortDate } from "../../util/format";
import "./Leads.css";

const STATUSES: (LeadStatus | "")[] = [
  "",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
  "CLOSED",
];

const STATUS_LABELS: Record<string, string> = {
  "": "All statuses",
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  LOST: "Lost",
  CLOSED: "Closed",
};

export function Leads() {
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      const list = await api.get<LeadResponse[]>(`/leads${q}`);
      setLeads(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page-leads">
      <header className="page-header leads-header">
        <div>
          <h1>Leads</h1>
          <p className="page-header-desc">
            People who messaged or submitted forms on your connected channels.
          </p>
        </div>
        <label className="leads-filter">
          <span className="visually-hidden">Filter by status</span>
          <select
            className="leads-filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus | "")}
          >
            {STATUSES.map((s) => (
              <option key={s || "all"} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error ? (
        <div
          className="page-banner page-banner-error leads-banner"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="leads-status">Loading leads…</p>
      ) : leads.length === 0 ? (
        <div className="leads-empty panel">
          <p>No leads match this filter.</p>
          <p className="leads-empty-hint">
            Webhook events from Meta and Instagram will create leads
            automatically.
          </p>
        </div>
      ) : (
        <div className="leads-table-wrap panel">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="leads-cell-strong">
                    {lead.name?.trim() || "—"}
                  </td>
                  <td>
                    <span className="leads-platform">{lead.platform}</span>
                  </td>
                  <td>
                    <span
                      className={`leads-badge leads-badge-${lead.status.toLowerCase()}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.email?.trim() || "—"}</td>
                  <td>{lead.phone?.trim() || "—"}</td>
                  <td className="leads-cell-muted">
                    {formatShortDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
