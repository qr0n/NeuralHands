const BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE");
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${txt}`);
  }
  return res.json() as Promise<T>;
}
