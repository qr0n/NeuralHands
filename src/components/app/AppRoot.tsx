"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AppHeader from "@/components/nav/AppHeader";
import BottomNav from "./BottomNav";
import OnboardingWizard from "./OnboardingWizard";
import { AppState, MainView } from "./types";

import HomePage from "@/components/pages/HomePage";
import TranslatorPage from "@/components/pages/TranslatorPage";
import DashboardPage from "@/components/pages/DashboardPage";
import SettingsPage from "@/components/pages/SettingsPage";
import AboutPage from "@/components/pages/AboutPage";
import TutorialPage from "@/components/pages/TutorialPage";
import FAQPage from "@/components/pages/FAQPage";
import ContactSupportPage from "@/components/pages/ContactSupportPage";
import PrivacyPage from "@/components/pages/PrivacyPage";
import TermsPage from "@/components/pages/TermsPage";

import { apiLogin, apiRegister } from "@/lib/api";

export default function AppRoot() {
  const [appState, setAppState] = useState<AppState>("auth");
  const [currentView, setCurrentView] = useState<MainView>("home");
  const [user, setUser] = useState<{ id: string; email: string; username?: string } | null>(null);
  const [guestMode, setGuestMode] = useState<boolean>(false);

  // ---- Auth ----
  async function handleLogin(email: string, password: string) {
    const u = await apiLogin({ email, password });
    setUser({ id: u.id, email: u.email });
    setGuestMode(false);
    setAppState(u.isNew ? "onboarding" : "main");
  }

  async function handleRegister(email: string, password: string, username: string) {
    const u = await apiRegister({ email, password });
    setUser({ id: u.id, email: u.email, username });
    setGuestMode(false);
    setAppState("onboarding");
  }

  // ---- Routing helpers ----
  function goTranslatorOpen() {
    setGuestMode(true); // public translator
    setCurrentView("translator");
    setAppState("main");
  }
  function goHome() {
    setGuestMode(false);
    setAppState("main");
    setCurrentView("home");
  }
  function goAuth() {
    setGuestMode(false);
    setAppState("auth");
    setCurrentView("home");
  }

  const finishToDashboard = () => {
    setGuestMode(false);
    setAppState("main");
    setCurrentView("dashboard");
  };
  const finishToTranslator = () => {
    setGuestMode(false);
    setAppState("main");
    setCurrentView("translator");
  };

  const headerHome =
    appState === "main" ? goHome : undefined; // ✅ only clickable inside app

  return (
    <div className="min-h-screen text-black transition-colors dark:text-white">
      <AppHeader onGoTranslator={goTranslatorOpen} onGoDashboard={headerHome} />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6">
        <AnimatePresence mode="wait">
          {appState === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AuthPanel
                onLogin={handleLogin}
                onRegister={handleRegister}
                openPrivacy={() => {
                  setAppState("main");
                  setCurrentView("privacy");
                  setGuestMode(true); // no bottom nav
                }}
                openTerms={() => {
                  setAppState("main");
                  setCurrentView("terms");
                  setGuestMode(true);
                }}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={goTranslatorOpen}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-white/40 dark:hover:bg-white/10"
                >
                  Try the Translator Without Signing Up
                </button>
              </div>
            </motion.div>
          )}

          {appState === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <OnboardingWizard
                onFinishToDashboard={finishToDashboard}
                onFinishToTranslator={finishToTranslator}
              />
            </motion.div>
          )}

          {appState === "main" && (
            <motion.div
              key={`main-${currentView}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MainRouter
                view={currentView}
                setView={setCurrentView}
                userId={user?.id || "guest"}
                guestMode={guestMode}
                onGoAuth={goAuth}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {appState === "main" && !guestMode && (
        <BottomNav current={currentView} setCurrent={setCurrentView} />
      )}
    </div>
  );
}

/* ----------------------------- MAIN ROUTER ----------------------------- */

function MainRouter({
  view,
  setView,
  userId,
  guestMode,
  onGoAuth,
}: {
  view: MainView;
  setView: (v: MainView) => void;
  userId: string;
  guestMode: boolean;
  onGoAuth: () => void;
}) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    window.scrollTo({ top: 0 });
  }, [view]);

  const backToSettings = () => setView("settings");

  switch (view) {
    case "home":
      return <HomePage />;
    case "translator":
      return <TranslatorPage guestMode={guestMode} onGoAuth={onGoAuth} />;
    case "dashboard":
      return <DashboardPage userId={userId} />;
    case "settings":
      return <SettingsPage userId={userId} go={(v) => setView(v)} />;
    case "about":
      return <AboutPage />;
    case "tutorial":
      return <TutorialPage back={() => backToSettings()} />;
    case "faq":
      return <FAQPage goContact={() => setView("contact")} back={() => backToSettings()} />;
    case "contact":
      return <ContactSupportPage back={() => backToSettings()} />;
    case "privacy":
      return <PrivacyPage back={onGoAuth} />; // shown from auth or settings
    case "terms":
      return <TermsPage back={onGoAuth} />;
    default:
      return <div>Not Found</div>;
  }
}

/* ----------------------------- AUTH PANEL ----------------------------- */

function AuthPanel({
  onLogin,
  onRegister,
  openPrivacy,
  openTerms,
}: {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, username: string) => void;
  openPrivacy: () => void;
  openTerms: () => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [agree, setAgree] = useState(false);

  const loginDisabled = pwd.length < 8 || !email;
  const signupDisabled = pwd.length < 8 || !email || !username || !agree;

  const baseBtn =
    "rounded-lg px-3 py-1.5 text-sm transition-colors";
  const activeBtn =
    "bg-[var(--primary-700)] text-white";
  const inactiveBtn =
    "border text-[var(--primary-700)] hover:bg-white/40 dark:text-white/90 dark:hover:bg-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto mt-10 max-w-md rounded-2xl border bg-white/80 p-6 shadow backdrop-blur dark:bg-black/50"
    >
      {/* Tabs: visible and readable in light & dark */}
      <div className="mb-4 flex gap-2">
        <button
          className={`${baseBtn} ${tab === "login" ? activeBtn : inactiveBtn}`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className={`${baseBtn} ${tab === "signup" ? activeBtn : inactiveBtn}`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-3">
        {tab === "signup" && (
          <div>
            <label className="text-xs">Username</label>
            <input
              className="mt-1 w-full rounded-lg border bg-transparent p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a handle"
              required
            />
          </div>
        )}

        <div>
          <label className="text-xs">Email</label>
          <input
            className="mt-1 w-full rounded-lg border bg-transparent p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs">Password (min 8 chars)</label>
          <input
            className="mt-1 w-full rounded-lg border bg-transparent p-2"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {tab === "signup" && (
          <>
            <div className="text-[12px] text-gray-700 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <button onClick={openPrivacy} className="underline underline-offset-2">
                Privacy Policy
              </button>{" "}
              and{" "}
              <button onClick={openTerms} className="underline underline-offset-2">
                Terms of Service
              </button>
              .
            </div>
            <label className="mt-2 flex items-start gap-2 text-[12px]">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>I have read and agree to the Privacy Policy and Terms of Service.</span>
            </label>
          </>
        )}

        {tab === "login" ? (
          <motion.button
            whileTap={{ scale: loginDisabled ? 1 : 0.98 }}
            disabled={loginDisabled}
            onClick={() => onLogin(email, pwd)}
            className={`mt-2 w-full rounded-lg px-4 py-2 text-sm ${
              loginDisabled
                ? "cursor-not-allowed opacity-50"
                : "bg-[var(--primary-700)] text-white hover:opacity-95"
            }`}
          >
            Log In
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: signupDisabled ? 1 : 0.98 }}
            disabled={signupDisabled}
            onClick={() => onRegister(email, pwd, username)}
            className={`mt-2 w-full rounded-lg px-4 py-2 text-sm ${
              signupDisabled
                ? "cursor-not-allowed opacity-50"
                : "bg-[var(--primary-700)] text-white hover:opacity-95"
            }`}
          >
            Create Account
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
