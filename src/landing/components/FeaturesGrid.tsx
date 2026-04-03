import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import "./FeaturesGrid.css";

type Feature = {
  icon: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  description: string;
  tags: string[];
};

const features: Feature[] = [
  {
    icon: "📥",
    iconBg: "rgba(129, 140, 248, 0.10)",
    iconBorder: "rgba(129, 140, 248, 0.15)",
    title: "Bandeja Omnicanal",
    description:
      "Ve y responde todas las interacciones de WhatsApp, Instagram, Messenger y más en una sola pantalla. Fusión automática de perfiles cuando un cliente te escribe por varios canales.",
    tags: ["Tiempo real", "Fusión de perfiles", "Asignación automática"],
  },
  {
    icon: "🤖",
    iconBg: "rgba(167, 139, 250, 0.10)",
    iconBorder: "rgba(167, 139, 250, 0.15)",
    title: "Respuestas con IA",
    description:
      "Un motor de IA analiza la intención de cada mensaje. Responde FAQs automáticamente, califica leads y genera borradores inteligentes para que tu equipo solo apruebe y envíe.",
    tags: ["Auto-respuestas", "Calificación", "Borradores IA"],
  },
  {
    icon: "📊",
    iconBg: "rgba(52, 211, 153, 0.10)",
    iconBorder: "rgba(52, 211, 153, 0.15)",
    title: "Pipeline & CRM",
    description:
      "Tablero Kanban para mover leads por cada etapa del embudo: Nuevo → Contactado → En Negociación → Cerrado. Historial completo de interacciones por contacto.",
    tags: ["Kanban", "Embudo de ventas", "Historial completo"],
  },
  {
    icon: "📈",
    iconBg: "rgba(251, 191, 36, 0.10)",
    iconBorder: "rgba(251, 191, 36, 0.15)",
    title: "Analíticas & Métricas",
    description:
      "Dashboard con CPA por canal, tiempos de respuesta y tasas de conversión. Cruza datos de inversión en Google Ads con leads ingresados para medir el ROI real.",
    tags: ["CPA", "ROI", "Reportes por agente"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * Feature card with mouse-tracking spotlight effect.
 * The card's internal "glow" follows the cursor position to create
 * a premium, interactive lighting effect on hover.
 */
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightX = useTransform(mouseX, (v) => `${v}px`);
  const spotlightY = useTransform(mouseY, (v) => `${v}px`);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  return (
    <motion.div
      className="feature-card"
      ref={cardRef}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-tracking spotlight */}
      <motion.div
        className="feature-card-spotlight"
        style={{
          left: spotlightX,
          top: spotlightY,
        }}
        aria-hidden="true"
      />
      <div className="feature-card-content">
        <div
          className="feature-icon"
          style={{
            background: feature.iconBg,
            borderColor: feature.iconBorder,
          }}
        >
          {feature.icon}
        </div>
        <h3 className="feature-title">{feature.title}</h3>
        <p className="feature-desc">{feature.description}</p>
        <div className="feature-tags">
          {feature.tags.map((tag) => (
            <span className="feature-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features" className="features-section landing-section">
      {/* Ambient background */}
      <div className="features-ambient" aria-hidden="true" />

      <div className="landing-container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <span className="landing-section-label">Funcionalidades</span>
          <h2 className="landing-section-title">
            Todo lo que necesitás para{" "}
            <span className="landing-gradient-text">cerrar más ventas</span>
          </h2>
          <p className="landing-section-subtitle" style={{ margin: "0 auto" }}>
            Cuatro pilares que transforman tu operación comercial de principio a
            fin.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
