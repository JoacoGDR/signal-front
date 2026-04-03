import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { IntegrationsMarquee } from "./components/IntegrationsMarquee";
import { ProductOverview } from "./components/ProductOverview";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { BenefitsSection } from "./components/BenefitsSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import "./LandingPage.css";

export function LandingPage() {
  return (
    <div className="landing">
      <Header />
      <HeroSection />
      <IntegrationsMarquee />
      <ProductOverview />
      <FeaturesGrid />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
