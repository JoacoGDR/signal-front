import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import "./BenefitsSection.css";

type Benefit = {
  metric: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  glowColor: string;
};

const benefits: Benefit[] = [
  {
    metric: 90,
    suffix: "%",
    label: "Menos tiempo de respuesta",
    description:
      "La IA responde en segundos lo que a tu equipo le toma horas. Cada lead recibe atención inmediata.",
    color: "var(--landing-accent)",
    glowColor: "rgba(129, 140, 248, 0.12)",
  },
  {
    metric: 3,
    suffix: "x",
    label: "Más conversiones",
    description:
      "Ningún lead se pierde entre aplicaciones. Cada mensaje, cada comentario, cada formulario llega a un solo lugar.",
    color: "var(--landing-success)",
    glowColor: "rgba(52, 211, 153, 0.12)",
  },
  {
    metric: 100,
    suffix: "%",
    label: "Equipo alineado",
    description:
      "Un lugar para todo el equipo de ventas. Historial compartido, asignación automática y visibilidad total.",
    color: "var(--landing-warning)",
    glowColor: "rgba(251, 191, 36, 0.12)",
  },
];

function AnimatedCounter({
  target,
  suffix,
  color,
}: {
  target: number;
  suffix: string;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1] as const,
      });
      return controls.stop;
    }
  }, [isInView, count, target]);

  return (
    <div className="benefit-metric" ref={ref} style={{ color }}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function BenefitsSection() {
  return (
    <section id="benefits" className="benefits-section landing-section">
      <div className="landing-container">
        <motion.div
          className="benefits-header"
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <span className="landing-section-label">Beneficios</span>
          <h2 className="landing-section-title">
            Resultados que{" "}
            <span className="landing-gradient-text">hablan por sí solos</span>
          </h2>
          <p className="landing-section-subtitle" style={{ margin: "0 auto" }}>
            Equipos que centralizan su gestión de leads multiplican sus
            conversiones.
          </p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, i) => (
            <motion.div
              className="benefit-card"
              key={benefit.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              style={
                { "--benefit-glow": benefit.glowColor } as React.CSSProperties
              }
            >
              <AnimatedCounter
                target={benefit.metric}
                suffix={benefit.suffix}
                color={benefit.color}
              />
              <div className="benefit-metric-label">{benefit.label}</div>
              <p className="benefit-desc">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
