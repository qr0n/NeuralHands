// src/lib/api.ts
// Replace these with real fetch/axios calls to your backend (MongoDB behind REST/GraphQL)

export type Credentials = { email: string; password: string };
export type User = { id: string; email: string; isNew: boolean };

export async function apiLogin(creds: Credentials): Promise<User> {
  // Example: return fetch('/api/login',{method:'POST',body:JSON.stringify(creds)});
  // TEMP mock:
  return new Promise((res) =>
    setTimeout(() => res({ id: "u_1", email: creds.email, isNew: false }), 500)
  );
}

export async function apiRegister(creds: Credentials): Promise<User> {
  // TEMP mock: treat all registrations as new users
  return new Promise((res) =>
    setTimeout(() => res({ id: "u_2", email: creds.email, isNew: true }), 600)
  );
}

export async function apiFetchProgress(userId: string) {
  return { lessonsCompleted: 7, streakDays: 3, accuracy: 0.78, badges: ["Starter", "Week 1"] };
}

export async function apiSaveSettings(userId: string, payload: any) {
  // noop mock
  return { ok: true };
}
