export function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function truncate(str: string | null | undefined, max: number): string {
  if (!str) return '—'
  if (str.length <= max) return str
  return `${str.slice(0, max - 1)}…`
}
