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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
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
              />
              <div className="mt-6 text-center">
                <button
                  onClick={goTranslatorOpen}
                  className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
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
}: {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, username: string) => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [username, setUsername] = useState("");
  const [agree, setAgree] = useState(false);

  const loginDisabled = pwd.length < 8 || !email;
  const signupDisabled = pwd.length < 8 || !email || !username || !agree;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto mt-10 max-w-md rounded-2xl bg-gray-800/50 backdrop-blur border border-gray-700 p-6 shadow-2xl"
    >
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "login"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "border border-gray-600 text-gray-300 hover:bg-white/10"
          }`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "signup"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "border border-gray-600 text-gray-300 hover:bg-white/10"
          }`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-3">
        {tab === "signup" && (
          <div>
            <label className="text-sm text-gray-300 font-medium">Username</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a handle"
              required
            />
          </div>
        )}

        <div>
          <label className="text-sm text-gray-300 font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 font-medium">Password (min 8 chars)</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900/50 text-white p-2 focus:border-purple-500 outline-none transition-colors"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>

        {tab === "signup" && (
          <>
            <div className="text-xs text-gray-300">
              By creating an account, you agree to our{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300">
                Terms of Service
              </a>
              .
            </div>
            <label className="mt-2 flex items-start gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded"
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
            className={`mt-2 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              loginDisabled
                ? "cursor-not-allowed opacity-50 bg-gray-700 text-gray-400"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            Log In
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: signupDisabled ? 1 : 0.98 }}
            disabled={signupDisabled}
            onClick={() => onRegister(email, pwd, username)}
            className={`mt-2 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              signupDisabled
                ? "cursor-not-allowed opacity-50 bg-gray-700 text-gray-400"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            Create Account
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
