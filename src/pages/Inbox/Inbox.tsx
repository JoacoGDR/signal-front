import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../api/client";
import type { ConversationResponse, LeadResponse } from "../../api/types";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";
import "./Inbox.css";

export function Inbox() {
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    try {
      const [c, l] = await Promise.all([
        api.get<ConversationResponse[]>("/conversations"),
        api.get<LeadResponse[]>("/leads"),
      ]);
      setConversations(c);
      setLeads(l);
    } catch (e) {
      setLoadError(e instanceof ApiError ? e.message : "Failed to load inbox");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load inbox on mount
    void loadData();
  }, [loadData]);

  const leadsById = useMemo(() => {
    const m: Record<string, LeadResponse> = {};
    for (const lead of leads) {
      m[lead.id] = lead;
    }
    return m;
  }, [leads]);

  return (
    <div className="page-inbox">
      <header className="page-header">
        <h1>Inbox</h1>
        <p className="page-header-desc">
          Conversations from connected Meta and Instagram accounts.
        </p>
      </header>
      {loadError ? (
        <div className="page-banner page-banner-error" role="alert">
          {loadError}
        </div>
      ) : null}
      <div className="inbox-panels">
        <aside className="inbox-sidebar panel">
          <h2 className="panel-title">Conversations</h2>
          <ConversationList
            conversations={conversations}
            leadsById={leadsById}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>
        <section className="inbox-main panel">
          <MessageThread
            conversationId={selectedId}
            onSent={() => void loadData()}
          />
        </section>
      </div>
    </div>
  );
}
