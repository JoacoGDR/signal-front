import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  WhatsAppIcon,
  InstagramIcon,
  MessengerIcon,
} from "../icons/PlatformIcons";
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
              <WhatsAppIcon width={22} height={22} />
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
              <InstagramIcon width={22} height={22} />
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
              <MessengerIcon width={22} height={22} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
