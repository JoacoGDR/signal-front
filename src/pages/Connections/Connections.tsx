import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '../../api/client'
import type { AccountConnectionResponse, PlatformType } from '../../api/types'
import { formatShortDate } from '../../util/format'
import './Connections.css'

const CONNECT_PLATFORMS: PlatformType[] = ['META', 'INSTAGRAM']

function redirectUriFor(platform: PlatformType): string {
  return `${window.location.origin}/oauth/callback/${platform}`
}

export function Connections() {
  const [connections, setConnections] = useState<AccountConnectionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await api.get<AccountConnectionResponse[]>('/oauth/connections')
      setConnections(list)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load connections')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleConnect(platform: PlatformType) {
    setError(null)
    try {
      const uri = redirectUriFor(platform)
      const res = await api.get<{ url: string }>(
        `/oauth/${platform}/auth-url?redirectUri=${encodeURIComponent(uri)}`,
      )
      window.location.href = res.url
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not start OAuth')
    }
  }

  async function handleDisconnect(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await api.delete(`/oauth/connections/${id}`)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to disconnect')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="page-connections">
      <header className="page-header">
        <h1>Connected accounts</h1>
        <p className="page-header-desc">
          Link Meta Pages and Instagram Business accounts so webhooks and messages
          route to your workspace.
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
          You will be redirected to Meta to approve access. Use the same redirect URL
          in your Meta app settings:{' '}
          <code className="conn-code">
            {typeof window !== 'undefined'
              ? `${window.location.origin}/oauth/callback/META`
              : ''}
          </code>{' '}
          (and the Instagram variant with <code className="conn-code">INSTAGRAM</code>{' '}
          if you use a separate flow).
        </p>
        <div className="conn-actions">
          {CONNECT_PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              className="conn-connect-btn"
              onClick={() => void handleConnect(p)}
            >
              Connect {p === 'META' ? 'Meta (Pages)' : 'Instagram'}
            </button>
          ))}
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
                  <span className="conn-platform">{c.platform}</span>
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
                  {busyId === c.id ? 'Removing…' : 'Disconnect'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
