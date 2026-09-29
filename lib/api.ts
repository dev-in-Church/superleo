// Server-side API client used by Next.js route handlers.
// Proxies to the Express backend when BACKEND_URL is set and reachable,
// otherwise the caller falls back to mock data so the preview stays clickable.

const BACKEND_URL = process.env.BACKEND_URL

export function isBackendConfigured(): boolean {
  return Boolean(BACKEND_URL)
}

interface ProxyOptions {
  method?: string
  body?: unknown
  // milliseconds
  timeout?: number
}

export async function backendFetch<T>(
  path: string,
  options: ProxyOptions = {},
): Promise<T> {
  if (!BACKEND_URL) {
    throw new BackendUnavailableError("BACKEND_URL is not configured")
  }

  const { method = "GET", body, timeout = 5000 } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    })
    if (!res.ok) {
      throw new BackendUnavailableError(`Backend responded ${res.status}`)
    }
    return (await res.json()) as T
  } catch (err) {
    if (err instanceof BackendUnavailableError) throw err
    throw new BackendUnavailableError(
      err instanceof Error ? err.message : "Backend request failed",
    )
  } finally {
    clearTimeout(timer)
  }
}

export class BackendUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "BackendUnavailableError"
  }
}
