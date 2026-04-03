import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "../../api/client";
import type { AccountConnectionResponse, PlatformType } from "../../api/types";
import {
  loadFacebookSdk,
  launchWhatsAppSignup,
  type WhatsAppSignupEvent,
} from "../../util/facebook-sdk";
import { formatShortDate } from "../../util/format";
import { redirectUriFor } from "../../util/oauth";
import "./Connections.css";

const REDIRECT_PLATFORMS: PlatformType[] = ["META", "INSTAGRAM"];

const WA_APP_ID = import.meta.env.VITE_WHATSAPP_APP_ID as string | undefined;
const WA_CONFIG_ID = import.meta.env.VITE_WHATSAPP_CONFIG_ID as
  | string
  | undefined;

function platformLabel(p: PlatformType): string {
  switch (p) {
    case "META":
      return "Meta (Pages)";
    case "INSTAGRAM":
      return "Instagram";
    case "WHATSAPP":
      return "WhatsApp";
    default:
      return p;
  }
}

export function Connections() {
  const [connections, setConnections] = useState<AccountConnectionResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [whatsAppBusy, setWhatsAppBusy] = useState(false);

  const signupDataRef = useRef<{
    phone_number_id?: string;
    waba_id?: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list =
        await api.get<AccountConnectionResponse[]>("/oauth/connections");
      setConnections(list);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load connections",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!event.origin.endsWith("facebook.com")) return;
      try {
        const data = JSON.parse(event.data) as WhatsAppSignupEvent;
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event !== "CANCEL") {
          signupDataRef.current = {
            phone_number_id: data.data.phone_number_id,
            waba_id: data.data.waba_id,
          };
        }
      } catch {
        // not a JSON message from Facebook, ignore
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  async function handleConnect(platform: PlatformType) {
    setError(null);
    try {
      const uri = redirectUriFor(platform);
      const res = await api.get<{ url: string }>(
        `/oauth/${platform}/auth-url?redirectUri=${encodeURIComponent(uri)}`,
      );
      window.location.href = res.url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not start OAuth");
    }
  }

  async function handleWhatsAppConnect() {
    if (!WA_APP_ID || !WA_CONFIG_ID) {
      setError("WhatsApp app ID or config ID is not configured");
      return;
    }
    setError(null);
    setWhatsAppBusy(true);
    signupDataRef.current = null;

    try {
      await loadFacebookSdk(WA_APP_ID);
      const code = await launchWhatsAppSignup(WA_CONFIG_ID);

      // The ref is mutated by the 'message' event listener during the await above,
      // so we re-read it here. TypeScript control-flow analysis can't track this.
      const signupData = signupDataRef.current as {
        phone_number_id?: string;
        waba_id?: string;
      } | null;
      const phoneNumberId = signupData?.phone_number_id;
      const wabaId = signupData?.waba_id;

      if (!phoneNumberId || !wabaId) {
        setError(
          "WhatsApp signup completed but asset IDs were not received. Please try again.",
        );
        return;
      }

      await api.post<AccountConnectionResponse[]>("/oauth/WHATSAPP/callback", {
        code,
        redirectUri: "",
        phoneNumberId,
        wabaId,
      });

      await load();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "WhatsApp connection failed",
      );
    } finally {
      setWhatsAppBusy(false);
    }
  }

  async function handleDisconnect(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await api.delete(`/oauth/connections/${id}`);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to disconnect");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page-connections">
      <header className="page-header">
        <h1>Connected accounts</h1>
        <p className="page-header-desc">
          Link Meta Pages, Instagram Business accounts, and WhatsApp Business
          accounts so webhooks and messages route to your workspace.
        </p>
      </header>

      {error ? (
        <div className="page-banner page-banner-error conn-banner" role="alert">
          {error}
        </div>
      ) : null}

      <section className="conn-section panel">
        <h2 className="conn-section-title">Add a channel</h2>
        <p className="conn-section-desc">
          For Meta and Instagram you will be redirected to approve access. For
          WhatsApp, a popup will guide you through the Embedded Signup flow.
        </p>
        <div className="conn-actions">
          {REDIRECT_PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              className="conn-connect-btn"
              onClick={() => void handleConnect(p)}
            >
              Connect {platformLabel(p)}
            </button>
          ))}
          <button
            type="button"
            className="conn-connect-btn"
            disabled={whatsAppBusy}
            onClick={() => void handleWhatsAppConnect()}
          >
            {whatsAppBusy ? "Connecting…" : "Connect WhatsApp"}
          </button>
        </div>
      </section>

      <section className="conn-section panel">
        <h2 className="conn-section-title">Active connections</h2>
        {loading ? (
          <p className="conn-status">Loading…</p>
        ) : connections.length === 0 ? (
          <p className="conn-empty">No accounts linked yet.</p>
        ) : (
          <ul className="conn-list">
            {connections.map((c) => (
              <li key={c.id} className="conn-row">
                <div className="conn-row-main">
                  <span className="conn-platform">
                    {platformLabel(c.platform)}
                  </span>
                  <span className="conn-external" title={c.externalAccountId}>
                    ID {c.externalAccountId}
                  </span>
                  <span className="conn-time">
                    Linked {formatShortDate(c.connectedAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="conn-disconnect"
                  disabled={busyId === c.id}
                  onClick={() => void handleDisconnect(c.id)}
                >
                  {busyId === c.id ? "Removing…" : "Disconnect"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
