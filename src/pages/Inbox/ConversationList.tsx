import type { ConversationResponse, LeadResponse } from "../../api/types";
import { formatShortDate, truncate } from "../../util/format";
import "./ConversationList.css";

type Props = {
  conversations: ConversationResponse[];
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

export function ConversationList({
  conversations,
  leadsById,
  selectedId,
  onSelect,
}: Props) {
  if (conversations.length === 0) {
    return (
      <div className="conversation-list conversation-list-empty">
        <p>No conversations yet.</p>
        <p className="conversation-list-hint">
          When Meta or Instagram messages arrive via webhooks, they will show up
          here.
        </p>
      </div>
    );
  }

  return (
    <ul className="conversation-list" role="listbox" aria-label="Conversations">
      {conversations.map((c) => {
        const lead = leadsById[c.leadId];
        const active = c.id === selectedId;
        return (
          <li key={c.id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              className={`conversation-item${active ? " conversation-item-active" : ""}`}
              onClick={() => onSelect(c.id)}
            >
              <span className="conversation-item-platform">{c.platform}</span>
              <span className="conversation-item-name">{leadLabel(lead)}</span>
              <span className="conversation-item-meta">
                {truncate(c.externalThreadId, 28)}
              </span>
              <span className="conversation-item-time">
                {formatShortDate(c.updatedAt)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
