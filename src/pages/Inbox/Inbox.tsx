import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../api/client";
import type {
  CommentThreadResponse,
  ConversationResponse,
  LeadResponse,
} from "../../api/types";
import { CommentThreadDetail } from "./CommentThreadDetail";
import { CommentThreadList } from "./CommentThreadList";
import { ConversationList } from "./ConversationList";
import { InboxTabs, type InboxTab } from "./InboxTabs";
import { MessageThread } from "./MessageThread";
import "./Inbox.css";

export function Inbox() {
  const [tab, setTab] = useState<InboxTab>("messages");
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [commentThreads, setCommentThreads] = useState<
    CommentThreadResponse[]
  >([]);
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    try {
      const [c, l, t] = await Promise.all([
        api.get<ConversationResponse[]>("/conversations"),
        api.get<LeadResponse[]>("/leads"),
        api.get<CommentThreadResponse[]>("/comments/threads"),
      ]);
      setConversations(c);
      setLeads(l);
      setCommentThreads(t);
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
          Conversations and comments from connected accounts.
        </p>
      </header>
      <InboxTabs active={tab} onChange={setTab} />
      {loadError ? (
        <div className="page-banner page-banner-error" role="alert">
          {loadError}
        </div>
      ) : null}
      <div className="inbox-panels">
        {tab === "messages" ? (
          <>
            <aside className="inbox-sidebar panel">
              <h2 className="panel-title">Conversations</h2>
              <ConversationList
                conversations={conversations}
                leadsById={leadsById}
                selectedId={selectedConversationId}
                onSelect={setSelectedConversationId}
              />
            </aside>
            <section className="inbox-main panel">
              <MessageThread
                conversationId={selectedConversationId}
                onSent={() => void loadData()}
              />
            </section>
          </>
        ) : (
          <>
            <aside className="inbox-sidebar panel">
              <h2 className="panel-title">Comment Threads</h2>
              <CommentThreadList
                threads={commentThreads}
                leadsById={leadsById}
                selectedId={selectedThreadId}
                onSelect={setSelectedThreadId}
              />
            </aside>
            <section className="inbox-main panel">
              <CommentThreadDetail threadId={selectedThreadId} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
