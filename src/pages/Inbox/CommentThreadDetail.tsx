import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../api/client";
import type { CommentResponse } from "../../api/types";
import { formatShortDate } from "../../util/format";
import "./CommentThreadDetail.css";

type Props = {
  threadId: string | null;
};

export function CommentThreadDetail({ threadId }: Props) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!threadId) {
      setComments([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await api.get<CommentResponse[]>(
        `/comments/threads/${threadId}/comments`,
      );
      setComments(list);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load comments",
      );
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  if (!threadId) {
    return (
      <div className="comment-detail comment-detail-placeholder">
        <p>Select a comment thread to view comments.</p>
      </div>
    );
  }

  return (
    <div className="comment-detail">
      <div className="comment-detail-header">
        <h2>Comments</h2>
      </div>
      <div className="comment-detail-scroll">
        {loading ? (
          <p className="comment-detail-status">Loading comments…</p>
        ) : null}
        {error ? (
          <p className="comment-detail-error" role="alert">
            {error}
          </p>
        ) : null}
        <ul className="comment-list" aria-live="polite">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`comment-bubble${c.parentCommentId ? " comment-bubble-reply" : ""}`}
            >
              <div className="comment-bubble-author">
                {c.authorUsername ?? "Unknown"}
              </div>
              <div className="comment-bubble-content">
                {c.text?.trim() || (
                  <em className="comment-empty">(no text)</em>
                )}
              </div>
              <time className="comment-bubble-time" dateTime={c.createdAt}>
                {formatShortDate(c.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
