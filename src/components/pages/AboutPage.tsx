"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: { duration: 0.25, ease: "ease-out" },
  },
};

const card = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: "ease-out" },
  }),
};

export default function AboutPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">ℹ️ About Neural Hands</h1>
        <p className="text-gray-300 text-lg">
          Learn about our mission, our team, and the technology behind the app.
        </p>
      </div>

      {/* Mission */}
      <motion.section
        custom={1}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Our mission</h3>
        <p className="text-sm text-gray-300">
          Neural Hands helps anyone learn and practice American Sign Language (ASL) through
          instant, visual feedback. We believe communication should be inclusive, intuitive,
          and available to everyone—whether you're just starting or sharpening fluency for
          real-world situations.
        </p>
      </motion.section>

      {/* Origin story */}
      <motion.section
        custom={2}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">How the idea began</h3>
        <p className="text-sm text-gray-300">
          Neural Hands started at the <span className="font-medium">Intellibus AI Hackathon (Oct 18–19, 2025)</span>
          {" "}in Kingston, Jamaica. Our team kept hearing the same challenge from learners and
          educators: "I can't get immediate feedback on my signing." We set out to solve that—
          building a tool that recognizes hand shapes and motion, gives guidance in seconds,
          and adapts to your skill level.
        </p>
      </motion.section>

      {/* How it works (expanded) */}
      <motion.section
        custom={3}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">How it works</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>
            <span className="font-medium">1) Hand tracking:</span> Your camera stream is processed to extract
            hand landmarks (e.g., via MediaPipe). We analyze positions, angles, and movement—<em>not</em> your identity.
          </li>
          <li>
            <span className="font-medium">2) Classification:</span> Our models (MobileNet-family / custom layers)
            classify letters, digits, and selected signs; temporal smoothing reduces flicker.
          </li>
          <li>
            <span className="font-medium">3) Feedback & coaching:</span> We compare your pose against target
            exemplars and return practical tips (e.g., "raise index slightly," "rotate palm inwards").
          </li>
          <li>
            <span className="font-medium">4) Personalized path:</span> A quick onboarding test places you on
            a track—Beginner, Intermediate, or Advanced—then adapts lessons as you improve.
          </li>
        </ul>
      </motion.section>

      {/* Who it benefits */}
      <motion.section
        custom={4}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Who it benefits</h3>
        <p className="text-sm text-gray-300">
          Learners building confidence in ASL, teachers who want structured practice with instant
          feedback, and accessibility advocates creating more inclusive schools, workplaces, and
          communities.
        </p>
      </motion.section>

      {/* What makes it different */}
      <motion.section
        custom={5}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">What makes Neural Hands different</h3>
        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Instant coaching:</span> Micro-tips on every attempt, not just right/wrong.
          </li>
          <li>
            <span className="font-medium">Adaptive lessons:</span> Your results drive what comes next.
          </li>
          <li>
            <span className="font-medium">Progress you can trust:</span> Session history, streaks, and goals.
          </li>
          <li>
            <span className="font-medium">Privacy by design:</span> Landmark-level processing; no video stored
            unless you explicitly save it. See our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </li>
        </ul>
      </motion.section>

      {/* Tech stack */}
      <motion.section
        custom={6}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Technology</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>
            <span className="font-medium">Frontend:</span> Next.js (App Router), Tailwind CSS, Framer Motion.
          </li>
          <li>
            <span className="font-medium">APIs & Services:</span> Node.js + Express for app services; Python FastAPI
            for ML inference; MongoDB for storage.
          </li>
          <li>
            <span className="font-medium">ML & CV:</span> MediaPipe hand landmarks, TensorFlow/Keras fine-tunes,
            smoothing and confidence gating.
          </li>
          <li>
            <span className="font-medium">DevOps:</span> CI/CD with GitHub Actions; cloud runtime suitable for
            GPU/CPU inference (e.g., AWS) depending on model size.
          </li>
        </ul>
      </motion.section>

      {/* Team */}
      <motion.section
        custom={7}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Team</h3>
        <p className="text-sm text-gray-300">
          Built by <span className="font-medium">Team Fingers Crossed</span> — Michael Crawford, Vedang Kevlani,
          Shamar Malcolm, and Christian Douglas — a group of engineers and creators who care deeply
          about accessible learning tools.
        </p>
      </motion.section>

      {/* Roadmap */}
      <motion.section
        custom={8}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Roadmap</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <div>
            <span className="font-semibold text-purple-300">Current · v0.2.0</span>
            <ul className="list-disc pl-5 mt-1">
              <li>Onboarding test, personalized tracks, real-time feedback.</li>
              <li>Core translator and practice modules.</li>
              <li>Progress storage and basic recommendations.</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-purple-300">Coming next</span>
            <ul className="list-disc pl-5 mt-1">
              <li>Advanced scenarios (ordering food, travel, meetings).</li>
              <li>Offline mode improvements and lighter models for low-end devices.</li>
              <li>Deeper analytics and coach insights.</li>
              <li>Classroom tools for educators.</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Trust & compliance */}
      <motion.section
        custom={9}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Trust & Privacy</h3>
        <p className="text-sm text-gray-300">
          We follow the principles of Jamaica's Data Protection Act: lawfulness, fairness,
          transparency, purpose limitation, data minimisation, accuracy, storage limitation,
          integrity/confidentiality, and accountability. Visit{" "}
          <Link href="/settings/data" className="underline">Data Management</Link> to export or delete your data,
          manage analytics, and submit corrections. See our{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link> and{" "}
          <Link href="/terms" className="underline">Terms of Service</Link>.
        </p>
      </motion.section>

      {/* Contact / CTA */}
      <motion.section
        custom={10}
        variants={card}
        className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-white mb-3">Get in touch</h3>
        <p className="text-sm text-gray-300">
          Have feedback, want to collaborate, or need support? Email{" "}
          <a className="underline" href="mailto:support@neuralhands.app">support@neuralhands.app</a>.  
          We'd love to hear from you.
        </p>
      </motion.section>
    </motion.div>
  );
}
