import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./HeroSection.css";

const dashboardRows = [
  {
    avatar: "#818cf8",
    line: "70%",
    channel: "#25d366",
    status: "#34d399",
    name: "65%",
  },
  {
    avatar: "#a78bfa",
    line: "55%",
    channel: "#e1306c",
    status: "#fbbf24",
    name: "50%",
  },
  {
    avatar: "#c084fc",
    line: "80%",
    channel: "#0084ff",
    status: "#34d399",
    name: "72%",
  },
  {
    avatar: "#818cf8",
    line: "45%",
    channel: "#0a66c2",
    status: "#818cf8",
    name: "40%",
  },
  {
    avatar: "#f472b6",
    line: "62%",
    channel: "#010101",
    status: "#34d399",
    name: "55%",
  },
];

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Parallax transforms for background orbs */
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);

  return (
    <section className="hero landing-section" ref={sectionRef}>
      {/* Parallax background ambient orbs */}
      <motion.div
        className="hero-orb hero-orb-1"
        style={{ y: orbY1, scale: orbScale }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-orb hero-orb-2"
        style={{ y: orbY2 }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-orb hero-orb-3"
        style={{ y: orbY1 }}
        aria-hidden="true"
      />

      {/* Grid pattern overlay */}
      <div className="hero-grid-pattern" aria-hidden="true" />

      <div className="landing-container">
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <div className="hero-text">
            <motion.div className="hero-badge" variants={fadeUp}>
              <span className="hero-badge-dot" />
              Plataforma en vivo
            </motion.div>
            <motion.h1 className="hero-title" variants={fadeUp}>
              Todos tus leads.{" "}
              <span className="landing-gradient-text">Un solo lugar.</span> Cero
              caos.
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeUp}>
              BoxLead centraliza mensajes de WhatsApp, Instagram, Messenger,
              MercadoLibre y más. Responde con IA, gestiona tu pipeline y mide
              cada peso invertido.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <Link to="/register" className="landing-btn landing-btn-primary">
                Comenzar gratis →
              </Link>
              <a href="#product" className="landing-btn landing-btn-secondary">
                Conoce más
              </a>
            </motion.div>
          </div>

          <motion.div className="hero-visual" variants={fadeUp}>
            <div className="hero-dashboard">
              <div className="dashboard-header">
                <div className="dashboard-dots">
                  <span className="dashboard-dot dashboard-dot-red" />
                  <span className="dashboard-dot dashboard-dot-yellow" />
                  <span className="dashboard-dot dashboard-dot-green" />
                </div>
                <div className="dashboard-tab-bar">
                  <span className="dashboard-tab dashboard-tab-active">
                    Leads
                  </span>
                  <span className="dashboard-tab">Pipeline</span>
                  <span className="dashboard-tab">Analytics</span>
                </div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-content-header">
                  <div className="dashboard-line" style={{ width: "80px" }} />
                  <div className="dashboard-line" style={{ width: "60px" }} />
                  <div className="dashboard-line" style={{ width: "50px" }} />
                  <div className="dashboard-line" style={{ width: "70px" }} />
                </div>
                {dashboardRows.map((row, i) => (
                  <motion.div
                    className="dashboard-row"
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.9 + i * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className="dashboard-avatar"
                      style={{ background: row.avatar }}
                    />
                    <div
                      className="dashboard-name-line"
                      style={{ width: row.name }}
                    />
                    <div
                      className="dashboard-line"
                      style={{ width: row.line, flexShrink: 0 }}
                    />
                    <div className="dashboard-line dashboard-line-filler" />
                    <div
                      className="dashboard-channel-badge"
                      style={{ background: row.channel }}
                    />
                    <div
                      className="dashboard-status"
                      style={{
                        background: `${row.status}15`,
                        border: `1px solid ${row.status}40`,
                        color: row.status,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Channel floating badges */}
            <motion.div
              className="hero-channel-float hero-float-whatsapp"
              initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 1.4,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.002L2 22l5.233-1.237A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
                  fill="#25D366"
                />
                <path
                  d="M17.3 14.3c-.3-.15-1.75-.85-2-.95s-.45-.15-.65.15c-.2.3-.75.95-.9 1.15-.15.2-.35.2-.65.05-.3-.15-1.25-.45-2.35-1.45-.85-.75-1.45-1.7-1.6-2-.15-.3 0-.45.15-.6.1-.1.25-.3.35-.45.1-.15.15-.25.25-.4.1-.2.05-.35 0-.5-.05-.15-.65-1.55-.85-2.1-.25-.55-.45-.5-.45-.5h-.55c-.2 0-.5.05-.75.35s-1 .95-1 2.35 1 2.7 1.15 2.9c.15.2 2 3.05 4.8 4.25.65.3 1.2.45 1.6.6.65.2 1.25.2 1.75.1.55-.1 1.65-.65 1.85-1.3.25-.65.25-1.2.15-1.3-.05-.15-.25-.2-.55-.35z"
                  fill="#fff"
                />
              </svg>
            </motion.div>
            <motion.div
              className="hero-channel-float hero-float-instagram"
              initial={{ opacity: 0, scale: 0.5, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 1.6,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <defs>
                  <linearGradient id="ig-float" x1="3" y1="21" x2="21" y2="3">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="6"
                  fill="url(#ig-float)"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.5"
                  stroke="#fff"
                  strokeWidth="1.8"
                  fill="none"
                />
                <circle cx="17.5" cy="6.5" r="1.4" fill="#fff" />
              </svg>
            </motion.div>
            <motion.div
              className="hero-channel-float hero-float-messenger"
              initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 1.8,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <defs>
                  <linearGradient id="msg-float" x1="3" y1="21" x2="21" y2="3">
                    <stop offset="0%" stopColor="#0099ff" />
                    <stop offset="100%" stopColor="#a033ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2C6.477 2 2 6.15 2 11.25c0 2.9 1.45 5.5 3.75 7.2V22l3.4-1.85c.9.25 1.85.35 2.85.35 5.523 0 10-4.15 10-9.25S17.523 2 12 2z"
                  fill="url(#msg-float)"
                />
                <path
                  d="M7 14l4.25-4.5 2.25 2.25 4-4.5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
