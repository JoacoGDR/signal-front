import { type FormEvent, useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../api/client";
import type { MessageResponse } from "../../api/types";
import { formatShortDate } from "../../util/format";
import "./MessageThread.css";

type Props = {
  conversationId: string | null;
  onSent?: () => void;
};

export function MessageThread({ conversationId, onSent }: Props) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await api.get<MessageResponse[]>(
        `/conversations/${conversationId}/messages`,
      );
      setMessages(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!conversationId || !draft.trim()) return;
    setSending(true);
    setError(null);
    try {
      await api.post<MessageResponse>(
        `/conversations/${conversationId}/messages`,
        {
          direction: "OUTBOUND",
          content: draft.trim(),
        },
      );
      setDraft("");
      await loadMessages();
      onSent?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  if (!conversationId) {
    return (
      <div className="message-thread message-thread-placeholder">
        <p>Select a conversation to read and reply to messages.</p>
      </div>
    );
  }

  return (
    <div className="message-thread">
      <div className="message-thread-header">
        <h2>Messages</h2>
      </div>
      <div className="message-scroll">
        {loading ? (
          <p className="message-thread-status">Loading messages…</p>
        ) : null}
        {error ? (
          <p className="message-thread-error" role="alert">
            {error}
          </p>
        ) : null}
        <ul className="message-list" aria-live="polite">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`message-bubble message-bubble-${m.direction.toLowerCase()}`}
            >
              <div className="message-bubble-content">
                {m.content?.trim() || (
                  <em className="message-empty">(no text)</em>
                )}
              </div>
              <time className="message-bubble-time" dateTime={m.createdAt}>
                {formatShortDate(m.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      </div>
      <form className="message-compose" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="reply-input">
          Your reply
        </label>
        <textarea
          id="reply-input"
          className="message-compose-input"
          rows={2}
          placeholder="Write a reply…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="message-compose-send"
          disabled={sending || !draft.trim()}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
