import type { ReactNode } from "react";
import {
  WhatsAppIcon,
  InstagramIcon,
  MessengerIcon,
  MercadoLibreIcon,
  TikTokIcon,
  LinkedInIcon,
  GoogleAdsIcon,
} from "../icons/PlatformIcons";
import "./IntegrationsMarquee.css";

type Platform = {
  name: string;
  icon: ReactNode;
  color: string;
};

const platforms: Platform[] = [
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: <WhatsAppIcon />,
  },
  {
    name: "Instagram",
    color: "#E1306C",
    icon: <InstagramIcon />,
  },
  {
    name: "Messenger",
    color: "#0099FF",
    icon: <MessengerIcon />,
  },
  {
    name: "MercadoLibre",
    color: "#FFE600",
    icon: <MercadoLibreIcon />,
  },
  {
    name: "TikTok",
    color: "#ffffff",
    icon: <TikTokIcon />,
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    icon: <LinkedInIcon />,
  },
  {
    name: "Google Ads",
    color: "#4285F4",
    icon: <GoogleAdsIcon />,
  },
];

function MarqueeGroup() {
  return (
    <div className="marquee-group">
      {platforms.map((p) => (
        <div
          className="marquee-item"
          key={p.name}
          style={{ "--platform-color": p.color } as React.CSSProperties}
        >
          <div className="marquee-icon">{p.icon}</div>
          <span className="marquee-item-label">{p.name}</span>
        </div>
      ))}
    </div>
  );
}

export function IntegrationsMarquee() {
  return (
    <section className="marquee-section">
      <p className="marquee-label">
        Conectado con las plataformas donde están tus clientes
      </p>
      <div className="marquee-track" aria-hidden="true">
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </section>
  );
}
