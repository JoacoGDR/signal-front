import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../../api/client";
import type { AccountConnectionResponse, PlatformType } from "../../api/types";
import { redirectUriFor } from "../../util/oauth";
import "./OAuthCallback.css";

const ALLOWED: PlatformType[] = ["META", "INSTAGRAM", "WHATSAPP", "MELI"];

function isPlatform(p: string | undefined): p is PlatformType {
  return p !== undefined && (ALLOWED as string[]).includes(p);
}

export function OAuthCallback() {
  const { platform: platformParam } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthDesc = searchParams.get("error_description");

  const blockingError = useMemo(() => {
    if (!isPlatform(platformParam)) {
      return "Invalid or unsupported platform in callback URL.";
    }
    if (oauthError) {
      return (
        oauthDesc?.replace(/\+/g, " ") ||
        oauthError ||
        "Authorization was denied or failed."
      );
    }
    if (!code) {
      return "Missing authorization code. Try connecting again.";
    }
    return null;
  }, [platformParam, oauthError, oauthDesc, code]);

  const [status, setStatus] = useState<"working" | "ok" | "err">("working");
  const [message, setMessage] = useState("Completing connection…");
  const [results, setResults] = useState<AccountConnectionResponse[] | null>(
    null,
  );

  const platform = platformParam as PlatformType;

  useEffect(() => {
    if (blockingError || !code) {
      return;
    }

    const redirectUri = redirectUriFor(platform);
    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    void (async () => {
      try {
        const list = await api.post<AccountConnectionResponse[]>(
          `/oauth/${platform}/callback`,
          { code, redirectUri },
        );
        if (cancelled) return;
        setResults(list);
        setStatus("ok");
        setMessage(
          list.length === 0
            ? "Connected, but no accounts were returned. Check app permissions."
            : `Successfully linked ${list.length} account(s).`,
        );
        redirectTimer = setTimeout(() => {
          navigate("/connections", { replace: true });
        }, 2000);
      } catch (e) {
        if (cancelled) return;
        setStatus("err");
        setMessage(
          e instanceof ApiError ? e.message : "Could not complete link.",
        );
      }
    })();

    return () => {
      cancelled = true;
      if (redirectTimer !== undefined) clearTimeout(redirectTimer);
    };
  }, [blockingError, code, platform, navigate]);

  if (blockingError) {
    return (
      <div className="oauth-callback-page">
        <div className="oauth-callback-card">
          <h1>Could not connect</h1>
          <p className="oauth-callback-msg oauth-callback-err">
            {blockingError}
          </p>
          <button
            type="button"
            className="oauth-callback-back"
            onClick={() => navigate("/connections")}
          >
            Back to connections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-card">
        <h1>Connecting account</h1>
        <p
          className={
            status === "err"
              ? "oauth-callback-msg oauth-callback-err"
              : status === "ok"
                ? "oauth-callback-msg oauth-callback-ok"
                : "oauth-callback-msg"
          }
        >
          {message}
        </p>
        {status === "working" ? (
          <div className="oauth-callback-spinner" />
        ) : null}
        {results && results.length > 0 ? (
          <ul className="oauth-callback-list">
            {results.map((r) => (
              <li key={r.id}>
                {r.platform} — {r.displayName ?? r.externalAccountId}
              </li>
            ))}
          </ul>
        ) : null}
        {status === "err" ? (
          <button
            type="button"
            className="oauth-callback-back"
            onClick={() => navigate("/connections")}
          >
            Back to connections
          </button>
        ) : null}
      </div>
    </div>
  );
}
