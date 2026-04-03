import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./CtaSection.css";

export function CtaSection() {
  return (
    <section className="cta-section landing-section">
      {/* Multiple layered ambient glows */}
      <div className="cta-glow cta-glow-1" aria-hidden="true" />
      <div className="cta-glow cta-glow-2" aria-hidden="true" />

      <div className="landing-container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="landing-section-label">Empezá hoy</span>
          <h2 className="cta-title">
            Tu competencia ya está perdiendo leads.{" "}
            <span className="landing-gradient-text">¿Y vos?</span>
          </h2>
          <p className="cta-subtitle">
            Configurá BoxLead en minutos y empezá a responder más rápido, vender
            más y medir todo.
          </p>
          <div className="cta-actions">
            <Link
              to="/register"
              className="landing-btn landing-btn-primary cta-btn-lg"
            >
              Empezar ahora — es gratis →
            </Link>
          </div>
          <p className="cta-note">
            Sin tarjeta de crédito • Setup en 5 minutos
          </p>
        </motion.div>
      </div>
    </section>
  );
}
