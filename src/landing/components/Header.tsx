import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`landing-header${scrolled ? " header-scrolled" : ""}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="landing-header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">⚡</span>
          BoxLead
        </Link>
        <nav className="header-nav">
          <a href="#features" className="header-nav-link">
            Funcionalidades
          </a>
          <a href="#benefits" className="header-nav-link">
            Beneficios
          </a>
          <Link to="/login" className="header-signin">
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
