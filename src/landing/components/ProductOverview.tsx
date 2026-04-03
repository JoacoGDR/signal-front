import { motion } from "framer-motion";
import "./ProductOverview.css";

const revealUp = {
  hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealLeft = {
  hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

export function ProductOverview() {
  return (
    <section id="product" className="product-overview landing-section">
      {/* Ambient background glow */}
      <div className="product-ambient" aria-hidden="true" />

      <div className="landing-container">
        <motion.div
          className="landing-container-narrow"
          style={{ textAlign: "center", marginBottom: "56px" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealUp}
        >
          <span className="landing-section-label">
            El problema &amp; la solución
          </span>
          <h2 className="landing-section-title">
            Del caos de mensajes a una{" "}
            <span className="landing-gradient-text">máquina de ventas</span>
          </h2>
        </motion.div>

        <div className="product-grid">
          <motion.div
            className="product-pain"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={revealLeft}
          >
            <div className="product-card-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h3 className="product-pain-title">Sin BoxLead</h3>
            <p className="product-pain-desc">
              Tu equipo vive apagando incendios entre 5 apps distintas.
            </p>
            <ul className="product-pain-list">
              <li>Mensajes perdidos entre WhatsApp, Instagram y Messenger</li>
              <li>Leads que se enfrían sin respuesta durante horas</li>
              <li>Imposible saber el ROI real de cada canal</li>
              <li>Equipo descoordinado, sin historial unificado</li>
            </ul>
          </motion.div>

          <motion.div
            className="product-solution"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={revealRight}
          >
            <div className="product-card-icon product-card-icon-accent">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#icon-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient
                    id="icon-accent"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                  >
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="product-solution-title">Con BoxLead</h3>
            <p className="product-solution-desc">
              Una sola bandeja inteligente que trabaja por tu equipo.
            </p>
            <ul className="product-solution-list">
              <li>Bandeja omnicanal unificada en tiempo real</li>
              <li>
                IA que responde, califica y sugiere respuestas al instante
              </li>
              <li>CPA y ROI por canal calculados automáticamente</li>
              <li>Historial completo por lead, sin importar la plataforma</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
