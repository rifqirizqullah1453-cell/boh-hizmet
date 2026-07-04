import { useState } from "react";
import type { CreateOrderInput } from "@boh/contracts";
import "./Home.css";

type ServiceType = CreateOrderInput["serviceType"];

interface ServiceMeta {
  value: ServiceType;
  label: string;
  icon: string;
  bg: string;
  estimate: string;
  workers: number;
  rating: number;
  reviews: number;
}

const SERVICES: ServiceMeta[] = [
  {
    value: "delivery",
    label: "Layanan Kurir",
    icon: "📦",
    bg: "linear-gradient(150deg, #dbeafe, #eff6ff)",
    estimate: "₺30–80",
    workers: 5,
    rating: 4.8,
    reviews: 124,
  },
  {
    value: "shopping",
    label: "Jasa Belanja",
    icon: "🛒",
    bg: "linear-gradient(150deg, #dcfce7, #f0fdf4)",
    estimate: "₺50–150",
    workers: 3,
    rating: 4.7,
    reviews: 89,
  },
  {
    value: "cleaning",
    label: "Jasa Kebersihan",
    icon: "🧹",
    bg: "linear-gradient(150deg, #fef3c7, #fffbeb)",
    estimate: "₺80–200",
    workers: 2,
    rating: 4.9,
    reviews: 45,
  },
  {
    value: "moving",
    label: "Angkut Barang",
    icon: "🚛",
    bg: "linear-gradient(150deg, #f3e8ff, #fdf4ff)",
    estimate: "₺100–300",
    workers: 1,
    rating: 4.6,
    reviews: 23,
  },
];

const CATEGORIES: Array<{ id: ServiceType | "all"; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "delivery", label: "Kurir" },
  { id: "shopping", label: "Belanja" },
  { id: "cleaning", label: "Kebersihan" },
  { id: "moving", label: "Angkut" },
];

interface HomeProps {
  onSelectService: (serviceType: ServiceType) => void;
}

export function Home({ onSelectService }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceType | "all">("all");

  const visibleServices =
    activeCategory === "all" ? SERVICES : SERVICES.filter((s) => s.value === activeCategory);

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header__left">
          <div className="home-header__avatar">P</div>
          <div>
            <p className="home-header__welcome">Selamat Datang 👋</p>
            <p className="home-header__name">Pelanggan BÖH</p>
          </div>
        </div>
        <button type="button" className="home-header__notif" aria-label="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3a6 6 0 0 0-6 6v3.2c0 .5-.18 1-.5 1.4L4 15.5c-.6.7-.1 1.8.8 1.8h14.4c.9 0 1.4-1.1.8-1.8l-1.5-1.9a2 2 0 0 1-.5-1.4V9a6 6 0 0 0-6-6Z"
              stroke="#0F172A"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="home-search">
        <div className="home-search__bar">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#94A3B8" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Cari layanan apa hari ini?</span>
        </div>
        <button type="button" className="home-search__filter" aria-label="Filter">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="home-categories">
        <div className="home-categories__scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`home-categories__chip ${activeCategory === cat.id ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-banner">
        <div className="hero-banner__content">
          <p className="hero-banner__tag">Layanan On-Demand</p>
          <h2 className="hero-banner__title">
            Apa pun butuhnya,
            <br />
            BÖH siap bantu!
          </h2>
          <p className="hero-banner__sub">
            Cepat &amp; terpercaya
            <br />
            di seluruh Bartın
          </p>
          <button type="button" className="hero-banner__cta" onClick={() => onSelectService("delivery")}>
            Pesan Sekarang
          </button>
        </div>
        <div className="hero-banner__deco" aria-hidden>
          🛵
        </div>
      </div>

      <div className="home-section-title">
        <h3>Layanan Kami</h3>
        <span>{visibleServices.length} tersedia</span>
      </div>

      <div className="service-grid">
        {visibleServices.map((s) => (
          <article
            key={s.value}
            className="service-card"
            onClick={() => onSelectService(s.value)}
          >
            <div className="service-card__image-area" style={{ background: s.bg }}>
              <button
                type="button"
                className="service-card__heart"
                aria-label="Favorit"
                onClick={(e) => e.stopPropagation()}
              >
                ♥
              </button>
              <span className="service-card__icon">{s.icon}</span>
              <span className="service-card__price-badge">{s.estimate}</span>
            </div>
            <div className="service-card__content">
              <p className="service-card__availability">{s.workers} pekerja tersedia</p>
              <p className="service-card__rating">
                ⭐ {s.rating.toFixed(1)} ({s.reviews})
              </p>
              <p className="service-card__name">{s.label}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
