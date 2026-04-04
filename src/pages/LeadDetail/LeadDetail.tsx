import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, ApiError } from "../../api/client";
import type {
  CommentThreadResponse,
  ConversationResponse,
  LeadResponse,
} from "../../api/types";
import { formatShortDate } from "../../util/format";
import "./LeadDetail.css";

export function LeadDetail() {
  const { leadId } = useParams<{ leadId: string }>();
  const [lead, setLead] = useState<LeadResponse | null>(null);
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [commentThreads, setCommentThreads] = useState<
    CommentThreadResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const loadData = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const [l, c, t] = await Promise.all([
        api.get<LeadResponse>(`/leads/${leadId}`),
        api.get<ConversationResponse[]>("/conversations"),
        api.get<CommentThreadResponse[]>("/comments/threads"),
      ]);
      setLead(l);
      setConversations(c.filter((conv) => conv.leadId === leadId));
      setCommentThreads(t.filter((thread) => thread.leadId === leadId));
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load lead details",
      );
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleStartConversation() {
    if (!leadId) return;
    setStarting(true);
    try {
      await api.post<ConversationResponse>("/conversations", { leadId });
      await loadData();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to start conversation",
      );
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-lead-detail">
        <p className="lead-detail-status">Loading lead…</p>
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="page-lead-detail">
        <div className="page-banner page-banner-error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const displayName =
    lead.name?.trim() || lead.email?.trim() || lead.externalLeadId || "Lead";

  return (
    <div className="page-lead-detail">
      <header className="page-header lead-detail-header">
        <Link to="/app/leads" className="lead-detail-back">
          &larr; Back to Leads
        </Link>
        <div className="lead-detail-heading">
          <h1>{displayName}</h1>
          <span className="lead-detail-platform">{lead.platform}</span>
          <span
            className={`lead-detail-badge lead-detail-badge-${lead.status.toLowerCase()}`}
          >
            {lead.status}
          </span>
        </div>
      </header>

      {error ? (
        <div className="page-banner page-banner-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="lead-detail-grid">
        <section className="lead-detail-info panel">
          <h2 className="panel-title">Contact Info</h2>
          <dl className="lead-detail-dl">
            <div className="lead-detail-dl-row">
              <dt>Email</dt>
              <dd>{lead.email?.trim() || "—"}</dd>
            </div>
            <div className="lead-detail-dl-row">
              <dt>Phone</dt>
              <dd>{lead.phone?.trim() || "—"}</dd>
            </div>
            <div className="lead-detail-dl-row">
              <dt>Created</dt>
              <dd>{formatShortDate(lead.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="lead-detail-section panel">
          <div className="lead-detail-section-header">
            <h2 className="panel-title">Conversations</h2>
            <button
              type="button"
              className="lead-detail-action"
              disabled={starting}
              onClick={handleStartConversation}
            >
              {starting ? "Starting…" : "+ New Conversation"}
            </button>
          </div>
          {conversations.length === 0 ? (
            <p className="lead-detail-empty">
              No conversations yet. Start one to message this lead.
            </p>
          ) : (
            <ul className="lead-detail-list">
              {conversations.map((c) => (
                <li key={c.id} className="lead-detail-list-item">
                  <Link to="/app/inbox" className="lead-detail-list-link">
                    <span className="lead-detail-list-platform">
                      {c.platform}
                    </span>
                    <span className="lead-detail-list-label">
                      {c.externalThreadId ?? "DM Conversation"}
                    </span>
                    <span className="lead-detail-list-meta">
                      {c.status} &middot; {formatShortDate(c.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lead-detail-section panel">
          <h2 className="panel-title">Comment Threads</h2>
          {commentThreads.length === 0 ? (
            <p className="lead-detail-empty">
              No comment threads for this lead.
            </p>
          ) : (
            <ul className="lead-detail-list">
              {commentThreads.map((t) => (
                <li key={t.id} className="lead-detail-list-item">
                  <Link to="/app/inbox" className="lead-detail-list-link">
                    <span className="lead-detail-list-platform">
                      {t.platform}
                    </span>
                    <span className="lead-detail-list-label">
                      {t.mediaProductType ?? "Post"} &middot;{" "}
                      {t.externalMediaId}
                    </span>
                    <span className="lead-detail-list-meta">
                      {formatShortDate(t.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
