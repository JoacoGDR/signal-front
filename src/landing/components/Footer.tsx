import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="footer-divider" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">⚡</span>
            BoxLead
          </div>
          <p className="footer-copyright">
            © {year} BoxLead. Todos los derechos reservados.
          </p>
        </div>
        <nav className="footer-links">
          <Link to="/privacy-policy" className="footer-link">
            Política de privacidad
          </Link>
          <Link to="/terms-of-service" className="footer-link">
            Términos de servicio
          </Link>
          <Link to="/data-deletion" className="footer-link">
            Eliminación de datos
          </Link>
          <Link to="/login" className="footer-link">
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </footer>
  );
}
