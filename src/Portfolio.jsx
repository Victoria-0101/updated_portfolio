import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Github, Linkedin, Twitter, Copy, Check, ExternalLink,
  ChevronRight, Sparkles, Shield, Layers, Brain, Zap,
  Globe, Terminal, ArrowUpRight, Code2, Database, Cpu,
  Mail, MessageCircle, Send
} from "lucide-react";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      font-family: 'Syne', sans-serif;
      background: #080809;
      color: #d4d4d8;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::selection { background: rgba(34,211,238,0.2); color: #fff; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #080809; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.3); }

    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes live-pulse {
      0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34,211,238,0.5); }
      50% { transform: scale(1.2); opacity: 0.9; box-shadow: 0 0 0 5px rgba(34,211,238,0); }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(34,211,238,0.15), 0 0 40px rgba(34,211,238,0.05); }
      50% { box-shadow: 0 0 30px rgba(34,211,238,0.3), 0 0 60px rgba(34,211,238,0.1); }
    }
    @keyframes float-orb-1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -40px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.97); }
    }
    @keyframes float-orb-2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      40% { transform: translate(-40px, 30px) scale(1.03); }
      70% { transform: translate(20px, -20px) scale(0.98); }
    }
    @keyframes grid-drift {
      0% { background-position: 0 0; }
      100% { background-position: 40px 40px; }
    }
    @keyframes slide-up-fade {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .cursor-blink { animation: cursor-blink 1s step-end infinite; }
    .glow-pulse-anim { animation: glow-pulse 3s ease-in-out infinite; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .nav-link {
      position: relative;
      font-size: 13px;
      font-weight: 500;
      color: #71717a;
      cursor: pointer;
      padding: 6px 0;
      transition: color 0.2s;
      background: none;
      border: none;
      font-family: 'Syne', sans-serif;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #22d3ee;
      transition: width 0.25s ease;
    }
    .nav-link:hover { color: #fff; }
    .nav-link:hover::after { width: 100%; }

    .bento-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 28px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s, background 0.3s, transform 0.3s;
    }
    .bento-card:hover {
      border-color: rgba(34,211,238,0.2);
      background: rgba(34,211,238,0.02);
      transform: translateY(-2px);
    }
    .bento-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34,211,238,0.04), transparent 40%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .bento-card:hover::before { opacity: 1; }

    .project-card {
      background: rgba(255,255,255,0.015);
      border-radius: 20px;
      overflow: hidden;
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s;
      cursor: default;
    }

    .tag-pill {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
      font-family: 'JetBrains Mono', monospace;
    }

    .social-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.02);
      color: #a1a1aa;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .social-btn:hover {
      border-color: rgba(34,211,238,0.25);
      background: rgba(34,211,238,0.05);
      color: #fff;
      transform: translateX(3px);
    }

    .terminal-line { line-height: 1.7; white-space: pre-wrap; word-break: break-all; }

    @media (max-width: 768px) {
      .bento-grid { grid-template-columns: 1fr !important; }
      .bento-large { grid-column: span 1 !important; }
      .projects-grid { grid-template-columns: 1fr !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
      .hero-title { font-size: clamp(38px, 10vw, 72px) !important; }
      .nav-links { display: none !important; }
    }
  `}</style>
);

/* ══════════════════════════════════════════════
   BACKGROUND
══════════════════════════════════════════════ */
const Background = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {/* Dot grid */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.06) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
      animation: "grid-drift 20s linear infinite",
      opacity: 0.5,
    }} />
    {/* Orb 1 */}
    <div style={{
      position: "absolute", top: "-15%", left: "-5%",
      width: "55vw", height: "55vw", maxWidth: "700px", maxHeight: "700px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(34,211,238,0.055) 0%, transparent 65%)",
      filter: "blur(60px)",
      animation: "float-orb-1 18s ease-in-out infinite",
    }} />
    {/* Orb 2 */}
    <div style={{
      position: "absolute", bottom: "-20%", right: "-10%",
      width: "60vw", height: "60vw", maxWidth: "800px", maxHeight: "800px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
      filter: "blur(80px)",
      animation: "float-orb-2 22s ease-in-out infinite",
    }} />
    {/* Center glow */}
    <div style={{
      position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
      width: "40vw", height: "40vw", maxWidth: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(34,211,238,0.025) 0%, transparent 70%)",
      filter: "blur(40px)",
    }} />
  </div>
);

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const Reveal = ({ children, delay = 0, y = 20, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════ */
const SectionLabel = ({ number, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
    <span className="mono" style={{ fontSize: "11px", color: "#22d3ee", letterSpacing: "0.1em" }}>
      {number}
    </span>
    <div style={{ height: "1px", width: "32px", background: "rgba(34,211,238,0.4)" }} />
    <span className="mono" style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.12em" }}>
      {text}
    </span>
  </div>
);

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
const Toast = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="toast"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{
          position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, display: "flex", alignItems: "center", gap: "9px",
          padding: "11px 20px", borderRadius: "100px",
          background: "rgba(9,9,11,0.95)",
          border: "1px solid rgba(34,211,238,0.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.1)",
          backdropFilter: "blur(20px)",
          whiteSpace: "nowrap",
        }}
      >
        <Check size={13} color="#22d3ee" />
        <span className="mono" style={{ fontSize: "12px", color: "#22d3ee" }}>
          odunmorayovictoria@gmail.com — copied to clipboard
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
const Nav = ({ onCopyEmail }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
        width: "min(820px, calc(100% - 32px))",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        borderRadius: "16px",
        border: `1px solid ${scrolled ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.06)"}`,
        background: scrolled ? "rgba(8,8,9,0.88)" : "rgba(8,8,9,0.5)",
        backdropFilter: "blur(24px)",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.4s ease",
        gap: "16px",
      }}
    >
      {/* Logo */}
      <span style={{ fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "-0.03em", color: "#fff" }}>
        Victoria <span style={{ background: "linear-gradient(120deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Ojo</span>
      </span>

      {/* Links */}
      <nav className="nav-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {[["Home", "hero"], ["Work", "work"], ["Stack", "stack"], ["Contact", "contact"]].map(([label, id]) => (
          <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
        ))}
      </nav>

      {/* CTA */}
      <button
        onClick={onCopyEmail}
        style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "8px 16px", borderRadius: "10px",
          border: "1px solid rgba(34,211,238,0.25)",
          background: "rgba(34,211,238,0.06)",
          color: "#22d3ee", fontSize: "12px", fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s",
          fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,238,0.12)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,0.06)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; }}
      >
        <Copy size={11} /> Copy Email
      </button>
    </motion.header>
  );
};

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
const ROLES = ["Fullstack Developer.", "Prompt Engineer.", "AI Orchestrator.", "Vibe Architect."];

const Hero = ({ onCopyEmail }) => {
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } },
    item: { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } },
  };

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px 80px", position: "relative", zIndex: 1, textAlign: "center" }}>
      <motion.div variants={stagger.container} initial="hidden" animate="show" style={{ maxWidth: "800px", width: "100%" }}>

        {/* Name */}
        <motion.p variants={stagger.item} className="mono" style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "#52525b", letterSpacing: "0.18em", marginBottom: "16px", textTransform: "uppercase" }}>
          Victoria Ojo
        </motion.p>

        {/* Status badge */}
        <motion.div variants={stagger.item} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.05)", marginBottom: "32px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px #22d3ee", display: "block", animation: "cursor-blink 2s ease-in-out infinite" }} />
          <span className="mono" style={{ fontSize: "11px", color: "#22d3ee", letterSpacing: "0.08em" }}>OPEN TO PROJECTS</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={stagger.item}
          className="hero-title"
          style={{ fontSize: "clamp(44px, 9vw, 86px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", marginBottom: "18px" }}
        >
          Engineering the Vibe.
          <br />
          <span style={{ background: "linear-gradient(120deg, #22d3ee 20%, #a78bfa 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Orchestrating AI.
          </span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div variants={stagger.item} className="mono" style={{ fontSize: "clamp(12px, 2vw, 15px)", color: "#22d3ee", marginBottom: "22px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <span style={{ color: "#3f3f46" }}>&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {ROLES[roleIdx]}
            </motion.span>
          </AnimatePresence>
          <span className="cursor-blink" style={{ display: "inline-block", width: "2px", height: "16px", background: "#22d3ee", borderRadius: "1px" }} />
        </motion.div>

        {/* Subheadline */}
        <motion.p variants={stagger.item} style={{ fontSize: "clamp(15px, 2.2vw, 18px)", color: "#71717a", maxWidth: "560px", margin: "0 auto 44px", lineHeight: 1.7 }}>
          I am a Fullstack Developer and Prompt Engineer bridging the gap between{" "}
          <span style={{ color: "#a1a1aa" }}>complex logic</span> and{" "}
          <span style={{ color: "#a1a1aa" }}>seamless user experiences</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={stagger.item} style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Primary */}
          <button
            onClick={() => scrollTo("work")}
            className="glow-pulse-anim"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "12px",
              border: "1px solid rgba(34,211,238,0.4)",
              background: "linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(167,139,250,0.06) 100%)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(167,139,250,0.12) 100%)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(167,139,250,0.06) 100%)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; }}
          >
            View Projects <ArrowUpRight size={15} />
          </button>

          {/* Secondary */}
          <button
            onClick={onCopyEmail}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#a1a1aa", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            <Copy size={14} /> Copy Email
          </button>
        </motion.div>

        {/* Metrics row */}
        <motion.div variants={stagger.item} style={{ marginTop: "72px", display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          {[["24+", "Projects Shipped"], ["8+", "AI Integrations"], ["4+", "Years Building"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{val}</div>
              <div className="mono" style={{ fontSize: "11px", color: "#52525b", marginTop: "3px", letterSpacing: "0.06em" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
      >
        <span className="mono" style={{ fontSize: "10px", color: "#3f3f46", letterSpacing: "0.15em" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, rgba(34,211,238,0.5), transparent)" }}
        />
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   BENTO GRID — STACK
══════════════════════════════════════════════ */
const MockTerminal = () => {
  const lines = [
    { t: "cmd",  v: "$ claude --mode expert \\" },
    { t: "arg",  v: "  --chain-of-thought on \\" },
    { t: "arg",  v: "  --output json --tokens 4096" },
    { t: "ok",   v: "✓ Initialized. Context window: 200k" },
    { t: "cmd",  v: "$ orchestrate --agents parallel" },
    { t: "proc", v: "⠿ Agent-1: research  [████████░░] 80%" },
    { t: "proc", v: "⠿ Agent-2: synthesis [██████░░░░] 60%" },
    { t: "ok",   v: "→ Streaming response..." },
  ];
  const colors = { cmd: "#22d3ee", arg: "#a78bfa", ok: "#4ade80", proc: "#fbbf24" };

  return (
    <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginTop: "20px" }}>
      {/* title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c, opacity: 0.85 }} />)}
        <span className="mono" style={{ fontSize: "10px", color: "#52525b", marginLeft: "8px" }}>prompt-engine — bash — 80×24</span>
      </div>
      {/* body */}
      <div style={{ padding: "14px 16px" }}>
        {lines.map((l, i) => (
          <div key={i} className="mono terminal-line" style={{ fontSize: "11.5px", color: colors[l.t] }}>
            {l.v}
          </div>
        ))}
        <div className="mono" style={{ fontSize: "11.5px", color: "#22d3ee", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          <span>$</span>
          <span className="cursor-blink" style={{ display: "inline-block", width: "7px", height: "13px", background: "#22d3ee", borderRadius: "1px", verticalAlign: "middle" }} />
        </div>
      </div>
    </div>
  );
};

const TechTag = ({ label, color }) => (
  <span className="tag-pill" style={{ background: `${color}12`, border: `1px solid ${color}28`, color }}>
    {label}
  </span>
);

const Stack = () => {
  const cardData = [
    {
      size: "large", // spans 2 cols
      icon: <Brain size={18} color="#22d3ee" />,
      iconBg: "rgba(34,211,238,0.1)", iconBorder: "rgba(34,211,238,0.2)",
      title: "Prompt Engineering & AI",
      desc: "Chain-of-thought, RAG pipelines, multi-agent orchestration, structured outputs.",
      extra: <MockTerminal />,
      accentColor: "#22d3ee",
    },
    {
      icon: <Layers size={18} color="#a78bfa" />,
      iconBg: "rgba(167,139,250,0.1)", iconBorder: "rgba(167,139,250,0.2)",
      title: "Fullstack Architecture",
      desc: "End-to-end systems: scalable APIs, real-time data, and polished UIs.",
      tags: [["React","#22d3ee"], ["Next.js","#a78bfa"], ["Node.js","#4ade80"], ["Supabase","#4ade80"], ["PostgreSQL","#fbbf24"]],
      accentColor: "#a78bfa",
    },
    {
      icon: <Sparkles size={18} color="#fbbf24" />,
      iconBg: "rgba(251,191,36,0.1)", iconBorder: "rgba(251,191,36,0.2)",
      title: "UI/UX & Vibe Coding",
      desc: "Pixel-perfect interfaces. Delightful motion. Aesthetic precision.",
      tags: [["Tailwind","#22d3ee"], ["Framer Motion","#a78bfa"], ["Figma","#f9a8d4"], ["Shadcn","#71717a"]],
      accentColor: "#fbbf24",
    },
    {
      icon: <Zap size={18} color="#4ade80" />,
      iconBg: "rgba(74,222,128,0.1)", iconBorder: "rgba(74,222,128,0.2)",
      title: "Performance & DevOps",
      desc: "Edge-first deployments, CI/CD pipelines, obsessive Core Web Vitals.",
      tags: [["Vercel","#22d3ee"], ["Docker","#60a5fa"], ["GitHub Actions","#a78bfa"]],
      accentColor: "#4ade80",
    },
    {
      stat: "24+", statLabel: "Projects Shipped", accentColor: "#22d3ee",
    },
    {
      stat: "8+", statLabel: "LLM APIs Used", accentColor: "#a78bfa",
    },
  ];

  return (
    <section id="stack" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number="02" text="CAPABILITIES" />
          <h2 style={{ fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", marginBottom: "48px" }}>
            Vibe & Stack.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="bento-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}
          >
            {/* Large card */}
            <div
              className="bento-card bento-large"
              style={{ gridColumn: "span 2" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: cardData[0].iconBg, border: `1px solid ${cardData[0].iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cardData[0].icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>{cardData[0].title}</h3>
              </div>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6 }}>{cardData[0].desc}</p>
              {cardData[0].extra}
              <div style={{ position: "absolute", top: 0, right: 0, width: "180px", height: "180px", background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
            </div>

            {/* Stat cards */}
            {[cardData[4], cardData[5]].map((c, i) => (
              <div key={i} className="bento-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px" }}>
                <div style={{ fontSize: "48px", fontWeight: 800, letterSpacing: "-0.04em", color: c.accentColor, lineHeight: 1 }}>{c.stat}</div>
                <div className="mono" style={{ fontSize: "11px", color: "#52525b", marginTop: "6px", textAlign: "center" }}>{c.statLabel}</div>
              </div>
            ))}

            {/* Regular cards */}
            {cardData.slice(1, 4).map((c, i) => (
              <div key={i} className="bento-card">
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: c.iconBg, border: `1px solid ${c.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{c.title}</h3>
                <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.6, marginBottom: "14px" }}>{c.desc}</p>
                {c.tags && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {c.tags.map(([label, color]) => <TechTag key={label} label={label} color={color} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   PROJECT CARDS — FEATURED WORK
══════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: "RemiCasual",
    tagline: "Bespoke Fashion E-Commerce.",
    description: "A high-performance digital storefront and admin dashboard built for a luxury tailoring brand. Features AI-driven SEO, a bespoke product configurator, and real-time inventory management.",
    url: "https://remicasual.vercel.app",
    tags: [["Next.js","#f9a8d4"],["Supabase","#4ade80"],["Tailwind","#22d3ee"],["AI SEO","#a78bfa"]],
    accent: "#f9a8d4",
    typeLabel: "FASHION / E-COMMERCE",
    statusLabel: "LIVE",
    icon: <Sparkles size={22} />,
    headerBg: "linear-gradient(135deg, rgba(249,168,212,0.06) 0%, rgba(167,139,250,0.04) 100%)",
    headerPattern: "rgba(249,168,212,0.05)",
    border: "rgba(249,168,212,0.1)",
    borderHover: "rgba(249,168,212,0.3)",
    shadowHover: "0 24px 64px rgba(249,168,212,0.08), 0 0 0 1px rgba(249,168,212,0.2)",
  },
  {
    title: "CephasPay",
    tagline: "Modern FinTech Gateway.",
    description: "A secure, scalable web application engineered for seamless financial transactions. Real-time ledger, multi-currency support, fraud-detection scoring, and bank-grade encryption end-to-end.",
    url: "https://cephaspay.vercel.app/",
    tags: [["React","#22d3ee"],["Node.js","#4ade80"],["PostgreSQL","#fbbf24"],["Security","#60a5fa"]],
    accent: "#22d3ee",
    typeLabel: "FINTECH / PAYMENTS",
    statusLabel: "LIVE",
    icon: <Shield size={22} />,
    headerBg: "linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(96,165,250,0.04) 100%)",
    headerPattern: "rgba(34,211,238,0.04)",
    border: "rgba(34,211,238,0.1)",
    borderHover: "rgba(34,211,238,0.3)",
    shadowHover: "0 24px 64px rgba(34,211,238,0.08), 0 0 0 1px rgba(34,211,238,0.2)",
  },
];

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="project-card"
      style={{
        border: `1px solid ${hovered ? project.borderHover : project.border}`,
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered ? project.shadowHover : "none",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Card header visual */}
      <div style={{ height: "160px", background: project.headerBg, borderBottom: `1px solid ${project.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${project.headerPattern} 1px, transparent 1px), linear-gradient(90deg, ${project.headerPattern} 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${project.accent}14`, border: `1px solid ${project.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", color: project.accent }}>
            {project.icon}
          </div>
          <span className="mono" style={{ fontSize: "10px", color: project.accent, letterSpacing: "0.12em" }}>{project.typeLabel}</span>
        </div>
        {/* corner glow */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `radial-gradient(circle at top right, ${project.accent}12, transparent 60%)` }} />
      </div>

      {/* Body */}
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em" }}>{project.title}</h3>
            <p style={{ fontSize: "13px", fontWeight: 600, color: project.accent, marginTop: "2px" }}>{project.tagline}</p>
          </div>
          <span className="mono" style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "100px", background: `${project.accent}15`, color: project.accent, border: `1px solid ${project.accent}30`, whiteSpace: "nowrap" }}>
            ● {project.statusLabel}
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#71717a", lineHeight: 1.65, flex: 1 }}>{project.description}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {project.tags.map(([label, color]) => <TechTag key={label} label={label} color={color} />)}
        </div>

        {/* CTA */}
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "11px 20px", borderRadius: "10px",
            border: `1px solid ${project.accent}30`,
            background: `${project.accent}08`,
            color: project.accent, fontSize: "13px", fontWeight: 700,
            textDecoration: "none", transition: "all 0.2s",
            fontFamily: "'Syne', sans-serif",
            width: "fit-content", marginTop: "4px",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${project.accent}18`; e.currentTarget.style.borderColor = `${project.accent}55`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${project.accent}08`; e.currentTarget.style.borderColor = `${project.accent}30`; }}
        >
          Visit Live Site <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
};

const Work = () => (
  <section id="work" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
      <Reveal>
        <SectionLabel number="03" text="FEATURED WORK" />
        <h2 style={{ fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", marginBottom: "48px" }}>
          The Proof.
        </h2>
      </Reveal>
      <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════ */
const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mjgazrwe", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#e4e4e7", fontSize: "13px", outline: "none",
    fontFamily: "'Syne', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <div style={{ padding: "20px", background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}>
      <span className="mono" style={{ fontSize: "11px", color: "#52525b", display: "block", marginBottom: "14px", letterSpacing: "0.1em" }}>// SEND A MESSAGE</span>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Name */}
        <input
          name="name" value={form.name} onChange={handleChange}
          placeholder="Your name"
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.background = "rgba(34,211,238,0.04)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />
        {/* Email */}
        <input
          name="email" value={form.email} onChange={handleChange}
          placeholder="Your email" type="email"
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.background = "rgba(34,211,238,0.04)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />
        {/* Message */}
        <textarea
          name="message" value={form.message} onChange={handleChange}
          placeholder="Tell me about your project..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }}
          onFocus={e => { e.target.style.borderColor = "rgba(34,211,238,0.4)"; e.target.style.background = "rgba(34,211,238,0.04)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={status === "sending" || status === "sent"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "11px 20px", borderRadius: "10px",
            border: status === "sent" ? "1px solid rgba(74,222,128,0.4)" : status === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(34,211,238,0.35)",
            background: status === "sent" ? "rgba(74,222,128,0.08)" : status === "error" ? "rgba(248,113,113,0.08)" : "rgba(34,211,238,0.08)",
            color: status === "sent" ? "#4ade80" : status === "error" ? "#f87171" : "#22d3ee",
            fontSize: "13px", fontWeight: 700, cursor: status === "sending" || status === "sent" ? "default" : "pointer",
            transition: "all 0.2s", fontFamily: "'Syne', sans-serif",
            opacity: status === "sending" ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (status === "idle") { e.currentTarget.style.background = "rgba(34,211,238,0.16)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.6)"; } }}
          onMouseLeave={e => { if (status === "idle") { e.currentTarget.style.background = "rgba(34,211,238,0.08)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)"; } }}
        >
          {status === "sent"
            ? <><Check size={14} /> Message Sent!</>
            : status === "sending"
            ? "Sending..."
            : status === "error"
            ? "Failed — Try Again"
            : <><Send size={14} /> Send Message</>
          }
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
══════════════════════════════════════════════ */
const CMDS = {
  help: [
    "  Available commands:",
    "  ─────────────────────────────────────────",
    "  email     → Get my email address",
    "  socials   → View all social links",
    "  stack     → My full tech stack",
    "  hire      → How to start a project",
    "  clear     → Clear terminal",
    "  ─────────────────────────────────────────",
  ],
  email: [
    "  📬  odunmorayovictoria@gmail.com",
    "  Copy it — let's talk.",
  ],
  socials: [
    "  🔗  GitHub   →  github.com/devportfolio",
    "  🔗  LinkedIn →  linkedin.com/in/devportfolio",
    "  🔗  Twitter  →  @vibecoder",
  ],
  stack: [
    "  ⚡  Frontend  →  React, Next.js, Tailwind, Framer Motion",
    "  ⚡  Backend   →  Node.js, Supabase, Prisma, tRPC",
    "  ⚡  AI/ML     →  OpenAI, Anthropic Claude, LangChain",
    "  ⚡  DevOps    →  Vercel, Docker, GitHub Actions",
  ],
  hire: [
    "  🚀  Starting a project:",
    "  1. Email me with your vision",
    "  2. I'll respond within 24h",
    "  3. We scope + ship together",
    "  → odunmorayovictoria@gmail.com",
  ],
};

const Contact = () => {
  const [lines, setLines] = useState([
    { type: "system", text: "Portfolio Terminal  v3.0.0  —  Type `help` to begin." },
    { type: "system", text: "──────────────────────────────────────────────────────────" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const withInput = [...lines, { type: "input", text: `> ${raw}` }];
    if (cmd === "clear") {
      setLines([{ type: "system", text: "Terminal cleared. Type `help`." }]);
    } else if (CMDS[cmd]) {
      setLines([...withInput, ...CMDS[cmd].map(t => ({ type: "output", text: t }))]);
    } else if (cmd === "") {
      setLines(withInput);
    } else {
      setLines([...withInput, { type: "error", text: `  bash: ${cmd}: command not found. Try \`help\`.` }]);
    }
    if (raw.trim()) setHistory(h => [raw, ...h.slice(0, 29)]);
    setHistIdx(-1);
    setInput("");
  };

  const onKeyDown = e => {
    if (e.key === "Enter") { run(input); return; }
    if (e.key === "ArrowUp") { const i = Math.min(histIdx + 1, history.length - 1); setHistIdx(i); setInput(history[i] || ""); }
    if (e.key === "ArrowDown") { const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? "" : history[i]); }
  };

  const lineColor = { system: "#3f3f46", input: "#22d3ee", output: "#a1a1aa", error: "#f87171" };

  return (
    <section id="contact" style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <Reveal>
          <SectionLabel number="04" text="CONTACT" />
          <h2 style={{ fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", marginBottom: "48px" }}>
            Initiate a Prompt.
          </h2>
        </Reveal>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", alignItems: "start" }}>
          {/* Terminal */}
          <Reveal delay={0.1}>
            <div
              style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(34,211,238,0.12)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 60px rgba(34,211,238,0.04), inset 0 1px 0 rgba(255,255,255,0.04)", cursor: "text" }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Title bar */}
              <div style={{ display: "flex", alignItems: "center", padding: "11px 16px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: "8px" }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />)}
                <span className="mono" style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#3f3f46" }}>
                  portfolio — bash — 80×24
                </span>
                <Terminal size={11} color="#3f3f46" />
              </div>

              {/* Output area */}
              <div style={{ padding: "16px", minHeight: "300px", maxHeight: "380px", overflowY: "auto" }}>
                {lines.map((l, i) => (
                  <div key={i} className="mono terminal-line" style={{ fontSize: "12px", color: lineColor[l.type] || "#a1a1aa" }}>
                    {l.text}
                  </div>
                ))}
                {/* Prompt row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <span className="mono" style={{ fontSize: "12px", color: "#22d3ee" }}>&gt;</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="mono"
                    style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e4e4e7", fontSize: "12px", caretColor: "#22d3ee", fontFamily: "inherit" }}
                    placeholder="type a command..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <div ref={bottomRef} />
              </div>
            </div>
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={0.18}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Status */}
              <div style={{ padding: "20px", background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.1)", borderRadius: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px #22d3ee", display: "inline-block", animation: "live-pulse 2s ease-in-out infinite" }} />
                  <span className="mono" style={{ fontSize: "11px", color: "#22d3ee", letterSpacing: "0.08em" }}>AVAILABLE NOW</span>
                </div>
                <p style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.65 }}>
                  Open to freelance projects, full-time roles, and AI consulting.
                  Response time: <span style={{ color: "#a1a1aa" }}>&lt; 24h</span>.
                </p>
              </div>

              {/* Quick action buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                {/* Email button */}
                <a
                  href="mailto:odunmorayovictoria@gmail.com"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid rgba(34,211,238,0.25)",
                    background: "rgba(34,211,238,0.06)",
                    color: "#22d3ee", fontSize: "13px", fontWeight: 700,
                    textDecoration: "none", transition: "all 0.2s",
                    fontFamily: "'Syne', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,238,0.14)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,0.06)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; }}
                >
                  <Mail size={14} /> Send Email
                </a>

                {/* WhatsApp button */}
                <a
                  href="https://wa.me/2348136910983"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    padding: "12px 16px", borderRadius: "12px",
                    border: "1px solid rgba(37,211,102,0.25)",
                    background: "rgba(37,211,102,0.06)",
                    color: "#25d366", fontSize: "13px", fontWeight: 700,
                    textDecoration: "none", transition: "all 0.2s",
                    fontFamily: "'Syne', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,211,102,0.14)"; e.currentTarget.style.borderColor = "rgba(37,211,102,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,211,102,0.06)"; e.currentTarget.style.borderColor = "rgba(37,211,102,0.25)"; }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>

              {/* Contact Form */}
              <ContactForm />

              {/* Socials */}
              <div style={{ padding: "20px", background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="mono" style={{ fontSize: "11px", color: "#52525b", letterSpacing: "0.1em", marginBottom: "6px" }}>// CONNECT</span>
                {[
                  { icon: <Github size={15} />, label: "GitHub", sub: "github.com/Victoria-0101", color: "#e4e4e7", href: "https://github.com/Victoria-0101" },
                  { icon: <Linkedin size={15} />, label: "LinkedIn", sub: "linkedin.com/in/ojovictoria", color: "#60a5fa", href: "https://www.linkedin.com/in/ojovictoria" },
                ].map(({ icon, label, sub, color, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="social-btn">
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `${color}12`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#e4e4e7", lineHeight: 1.2 }}>{label}</div>
                      <div className="mono" style={{ fontSize: "10px", color: "#52525b", marginTop: "1px" }}>{sub}</div>
                    </div>
                    <ChevronRight size={13} color="#3f3f46" />
                  </a>
                ))}
              </div>

              {/* Email display */}
              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}>
                <span className="mono" style={{ fontSize: "11px", color: "#52525b", display: "block", marginBottom: "6px", letterSpacing: "0.1em" }}>// EMAIL</span>
                <span className="mono" style={{ fontSize: "13px", color: "#22d3ee" }}>odunmorayovictoria@gmail.com</span>
              </div>

            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
const Footer = () => (
  <footer style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: "1060px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
      <span className="mono" style={{ fontSize: "11px", color: "#27272a" }}>
        © 2025 Victoria Ojo — Built with precision & vibes.
      </span>
      <span className="mono" style={{ fontSize: "11px", color: "#27272a" }}>
        Powered by caffeine &amp; LLMs.
      </span>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function Portfolio() {
  const [toastVisible, setToastVisible] = useState(false);
  const timerRef = useRef(null);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("odunmorayovictoria@gmail.com").catch(() => {});
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 2800);
  }, []);

  return (
    <>
      <GlobalStyles />
      <Background />
      <Nav onCopyEmail={copyEmail} />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero onCopyEmail={copyEmail} />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.1), transparent)", margin: "0 24px" }} />
        <Stack />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", margin: "0 24px" }} />
        <Work />
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.1), transparent)", margin: "0 24px" }} />
        <Contact />
      </main>
      <Footer />
      <Toast visible={toastVisible} />
    </>
  );
}