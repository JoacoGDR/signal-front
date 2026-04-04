import type { CommentThreadResponse, LeadResponse } from "../../api/types";
import { formatShortDate, truncate } from "../../util/format";
import "./CommentThreadList.css";

type Props = {
  threads: CommentThreadResponse[];
  leadsById: Record<string, LeadResponse>;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function leadLabel(lead: LeadResponse | undefined): string {
  if (!lead) return "Unknown lead";
  return (
    lead.name?.trim() || lead.email?.trim() || lead.externalLeadId || "Lead"
  );
}

export function CommentThreadList({
  threads,
  leadsById,
  selectedId,
  onSelect,
}: Props) {
  if (threads.length === 0) {
    return (
      <div className="comment-thread-list comment-thread-list-empty">
        <p>No comment threads yet.</p>
        <p className="comment-thread-list-hint">
          When leads comment on your Instagram posts, they will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="comment-thread-list"
      role="listbox"
      aria-label="Comment threads"
    >
      {threads.map((t) => {
        const lead = leadsById[t.leadId];
        const active = t.id === selectedId;
        return (
          <li key={t.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              className={`comment-thread-item${active ? " comment-thread-item-active" : ""}`}
              onClick={() => onSelect(t.id)}
            >
              <span className="comment-thread-item-platform">
                {t.platform}
              </span>
              <span className="comment-thread-item-name">
                {leadLabel(lead)}
              </span>
              <span className="comment-thread-item-meta">
                {t.mediaProductType ?? "Post"} &middot;{" "}
                {truncate(t.externalMediaId, 20)}
              </span>
              <span className="comment-thread-item-time">
                {formatShortDate(t.updatedAt)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
