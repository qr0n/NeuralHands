"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Lightweight confirm dialog */
function Confirm({
  title,
  body,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50"
    >
      <div className="w-full max-w-md rounded-xl border border-gray-600 bg-gray-800 text-white shadow-lg">
        <div className="p-5">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-2 text-sm opacity-90">{body}</div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={onCancel} className="bg-transparent border border-gray-600 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              {cancelText}
            </button>
            <button onClick={onConfirm} className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataManagementPage() {
  // UI state
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Consent toggles (pull actual values from your API on mount)
  const [analyticsOptIn, setAnalyticsOptIn] = useState<boolean>(false);
  const [modelOptIn, setModelOptIn] = useState<boolean>(false);

  // Dialogs
  const [confirm, setConfirm] = useState<null | {
    title: string;
    body: React.ReactNode;
    onConfirm: () => void;
  }>(null);

  useEffect(() => {
    // Load current privacy settings
    (async () => {
      try {
        const res = await fetch("/api/user/privacy-settings", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setAnalyticsOptIn(!!json.analyticsOptIn);
          setModelOptIn(!!json.modelOptIn);
        }
      } catch {
        // ignore non-fatal settings load errors
      }
    })();
  }, []);

  const handleExport = async () => {
    setError(null);
    setNotice(null);
    setLoading("export");
    try {
      const res = await fetch("/api/user/export", { method: "POST" });
      if (!res.ok) throw new Error("Export failed");
      // You can return a signed URL or start a file download here.
      setNotice("Your data export is being prepared. You'll receive a download link shortly.");
    } catch (e: any) {
      setError(e?.message || "Unable to start export.");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteActivity = async () => {
    setError(null);
    setNotice(null);
    setLoading("delete-activity");
    try {
      const res = await fetch("/api/user/delete-activity", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete activity failed");
      setNotice("Your activity history was deleted.");
    } catch (e: any) {
      setError(e?.message || "Unable to delete activity.");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setNotice(null);
    setLoading("delete-account");
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete account failed");
      setNotice("Your account deletion has been requested. We'll email confirmation and final steps.");
    } catch (e: any) {
      setError(e?.message || "Unable to delete account.");
    } finally {
      setLoading(null);
    }
  };

  const handleSavePrivacy = async () => {
    setError(null);
    setNotice(null);
    setLoading("save-privacy");
    try {
      const res = await fetch("/api/user/privacy-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analyticsOptIn, modelOptIn }),
      });
      if (!res.ok) throw new Error("Saving privacy settings failed");
      setNotice("Your privacy preferences were saved.");
    } catch (e: any) {
      setError(e?.message || "Unable to save preferences.");
    } finally {
      setLoading(null);
    }
  };

  const handleRectify = async (message: string) => {
    setError(null);
    setNotice(null);
    setLoading("rectify");
    try {
      const res = await fetch("/api/user/rectify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setNotice("Your correction request was submitted. We'll follow up via email.");
    } catch (e: any) {
      setError(e?.message || "Unable to submit request.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="container max-w-4xl py-8 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <h1 className="text-3xl font-semibold">Data Management</h1>
      <p className="opacity-90 mt-1">
        Control your data, privacy preferences, and learn how <strong>Neural Hands</strong> handles and protects
        your information.
      </p>

      {/* Notices */}
      {(notice || error) && (
        <div className={`mt-4 rounded-lg border p-3 ${error ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10"}`}>
          <p className={error ? "text-red-300" : "text-green-300"}>{notice || error}</p>
        </div>
      )}

      {/* What we collect */}
      <section className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700 mt-6">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm opacity-90">
          <li>
            <strong>Account data</strong>: name, email, authentication metadata.
          </li>
          <li>
            <strong>Learning & usage data</strong>: progress, lesson results, feature toggles, device info.
          </li>
          <li>
            <strong>Camera processing</strong>: hand landmarks are processed for recognition. We do{" "}
            <em>not</em> store video unless you explicitly save a session.
          </li>
          <li>
            <strong>Analytics (optional)</strong>: anonymized events to improve reliability and UX.
          </li>
        </ul>
      </section>

      {/* Why & Where */}
      <section className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
          <h3 className="font-semibold">Why we store it</h3>
          <p className="text-sm mt-2 opacity-90">
            To deliver core features (login, lessons, progress), personalize your learning path,
            maintain security, and continuously improve model accuracy and app performance.
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
          <h3 className="font-semibold">Where it's stored</h3>
          <p className="text-sm mt-2 opacity-90">
            Secure cloud infrastructure with encryption in transit and at rest. Limited access is
            granted to authorized team members with strict controls and logging.
          </p>
        </div>
      </section>

      {/* Retention */}
      <section className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700 mt-4">
        <h3 className="font-semibold">How long we keep it</h3>
        <p className="text-sm mt-2 opacity-90">
          Account and progress data are retained while your account is active. Optional analytics and
          logs are kept for limited periods for troubleshooting and product improvement, then deleted
          or aggregated.
        </p>
      </section>

      {/* Your controls */}
      <section className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700 mt-6">
        <h2 className="text-xl font-semibold">Your controls</h2>

        {/* Preferences */}
        <div className="mt-4 grid gap-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              checked={analyticsOptIn}
              onChange={(e) => setAnalyticsOptIn(e.target.checked)}
            />
            <span className="text-sm">
              Allow anonymous analytics to improve reliability and user experience.
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              checked={modelOptIn}
              onChange={(e) => setModelOptIn(e.target.checked)}
            />
            <span className="text-sm">
              Allow de-identified samples to improve recognition models (never sold or public).
            </span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleSavePrivacy}
              disabled={loading === "save-privacy"}
              aria-busy={loading === "save-privacy"}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Preferences
            </button>
            <Link href="/privacy" className="text-sm underline self-center text-purple-300 hover:text-purple-200">
              Read the Privacy Policy
            </Link>
          </div>
        </div>

        {/* Export / Delete */}
        <div className="mt-6 grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              disabled={loading === "export"}
              aria-busy={loading === "export"}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export My Data
            </button>
            <p className="text-xs opacity-80">
              We'll prepare a machine-readable archive of your account and learning data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setConfirm({
                  title: "Delete activity history?",
                  body: (
                    <>
                      This removes your practice logs, lesson attempts, and usage events. Progress
                      summaries may change. This action can't be undone.
                    </>
                  ),
                  onConfirm: () => {
                    setConfirm(null);
                    handleDeleteActivity();
                  },
                })
              }
              disabled={loading === "delete-activity"}
              aria-busy={loading === "delete-activity"}
              className="bg-transparent border border-gray-600 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Activity Only
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setConfirm({
                  title: "Permanently delete account?",
                  body: (
                    <>
                      Your account and all associated data will be scheduled for deletion. This is
                      irreversible and will sign you out on completion.
                    </>
                  ),
                  onConfirm: () => {
                    setConfirm(null);
                    handleDeleteAccount();
                  },
                })
              }
              disabled={loading === "delete-account"}
              aria-busy={loading === "delete-account"}
              className="bg-transparent border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete My Account
            </button>
          </div>
        </div>

        {/* Rectification request */}
        <RectifyBox onSubmit={handleRectify} />
      </section>

      {/* Compliance summary */}
      <section className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700 mt-6">
        <h2 className="text-xl font-semibold">Compliance & your rights (Jamaica Data Protection Act)</h2>
        <ul className="mt-2 list-disc pl-5 text-sm opacity-90 space-y-1">
          <li>
            <strong>Lawfulness, fairness, transparency:</strong> We process only what's necessary for
            clear purposes and explain it in plain language.
          </li>
          <li>
            <strong>Purpose limitation:</strong> We use data only for stated purposes (service delivery,
            security, improvement) unless you consent to more.
          </li>
          <li>
            <strong>Data minimisation:</strong> We collect the least amount needed to operate features.
          </li>
          <li>
            <strong>Accuracy:</strong> You can request corrections to inaccurate information.
          </li>
          <li>
            <strong>Storage limitation:</strong> We keep data no longer than needed, then delete or
            anonymise it.
          </li>
          <li>
            <strong>Integrity & confidentiality:</strong> Encryption, access controls, and audits protect
            your data.
          </li>
          <li>
            <strong>Accountability:</strong> We document processing activities and review our controls.
          </li>
        </ul>

        <p className="text-sm mt-3 opacity-90">
          You have the right to access, correct, delete, or object to certain processing. Use the
          controls above or contact us at{" "}
          <a className="underline text-purple-300 hover:text-purple-200" href="mailto:privacy@neuralhands.app">
            privacy@neuralhands.app
          </a>
          .
        </p>
      </section>

      {/* Links */}
      <div className="mt-6 text-sm">
        <Link href="/privacy" className="underline mr-4 text-purple-300 hover:text-purple-200">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline text-purple-300 hover:text-purple-200">
          Terms of Service
        </Link>
      </div>

      {confirm && (
        <Confirm
          title={confirm.title}
          body={confirm.body}
          onCancel={() => setConfirm(null)}
          onConfirm={confirm.onConfirm}
        />
      )}
    </main>
  );
}

/** Small text box for "Request a correction" */
function RectifyBox({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!value.trim()) return;
    setBusy(true);
    await onSubmit(value.trim());
    setBusy(false);
    setValue("");
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold">Request a correction</h3>
      <p className="text-sm mt-1 opacity-90">
        Tell us what's inaccurate and what it should be. We'll review and update as appropriate.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="e.g., My name is misspelled; please change from 'Micheal' to 'Michael'."
        className="mt-2 w-full rounded-lg border border-gray-600 bg-gray-900/50 p-3 text-sm text-white placeholder:text-gray-400 focus:border-purple-500 outline-none transition-colors"
      />
      <div className="mt-2">
        <button 
          onClick={submit} 
          disabled={busy} 
          aria-busy={busy}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Correction Request
        </button>
      </div>
    </div>
  );
}
