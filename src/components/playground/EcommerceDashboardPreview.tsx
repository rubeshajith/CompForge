"use client";

import { useEffect, type CSSProperties } from "react";
import type { EcommerceDashboardConfig } from "@/lib/ecommerceDashboardConfig";

interface EcommerceDashboardPreviewProps {
  config: EcommerceDashboardConfig;
}

const navItems = [
  ["payments", "FinTech"],
  ["monitor_heart", "HealthTech"],
  ["shopping_cart", "E-commerce"],
  ["security", "Cybersecurity"],
  ["local_shipping", "Logistics"],
  ["campaign", "Marketing"],
  ["analytics", "SaaS"],
  ["bolt", "Energy"],
];

const products = [
  {
    name: "AeroPulse Running Shoes",
    category: "Footwear / Athletics",
    sku: "AP-2024-RED",
    price: "$189.00",
    sold: "1,204 units",
    stock: "85%",
    stockValue: "85%",
    trend: "+18%",
    trendIcon: "trending_up",
    color: "success",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrXnVvNeNkTJL96YgKRP6HhVEc-L8krk7NFTpg73D17NHGY7i181U53bXHRJ4LPj4egotEU32ytW1ZNM68e_CvIynlFX-ZabTWUCgsWs5ANE4pKmzyrbEWe5SQEM8yWBnOdhUMaseO0nblzj1a7_-nq5fhz0JyF_WEE7BF9As0SNalA9WJMDQ80vjW3gWIrbFlvr85wrWJXcW9uCxV8N_X1DxOUDoqNd69HtdbKvz78A03dBh60gerMGElP4h-BeKP78n31bTJCZnO",
  },
  {
    name: "Zenith Pro Headphones",
    category: "Electronics / Audio",
    sku: "ZP-H1-BLK",
    price: "$299.00",
    sold: "842 units",
    stock: "Critical",
    stockValue: "15%",
    trend: "Stable",
    trendIcon: "trending_flat",
    color: "warning",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApjQEbPugqIRCPe2iXBw5-cPhVU-EuOggHSIJevnssmdD5SA6T0d7UrNG_xiefgHUvmR8eWcEYKq_Rpi7IDanH7F5eVQwUV0seAk89L7OoMzq5mi6HLBjWXPj8PLj_6T6ezHdK0jjHjRK3H2JeThR7uFKCg5jj57GLKZPRtydmq1LWKFhm-MhRjYCcgw5ksJ45mjT6_V5qYPkpm3a-Hwmvtm4z_hJrOHmnuNmIaLksCpU7vQmuLEkIlA7KqCJ5wlAw4aaWB98X_tUg",
  },
  {
    name: "Chronos Minimal Watch",
    category: "Accessories / Jewelry",
    sku: "CH-MIN-01",
    price: "$145.00",
    sold: "620 units",
    stock: "45%",
    stockValue: "45%",
    trend: "+5%",
    trendIcon: "trending_up",
    color: "success",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0OTJ87XqtOw8MPELgzxBzQLgLoZUdn9hM4VcIcxntti2Qomx9dRjIo9Sizjb33iDBaDdQW72CgBqEXDK1eDZw8_7S08eKcQM1OU-2OhEMPn27JZ37Q_8sapFT8uHILUG2GsKadvSjw7V8g3k6dJ5Eye2B9tdx4_BLWvFGGDLjzhy1ZzEKuoKUZ0-SD0BRWSCn7H1WOvaszvOztjl-DiwLvhwkbYGyT44-zx6ftcu5z9qXI3C8zbbCG_R2lAGJQV7ucFnt057K_Mkc",
  },
];

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB98Iz7kIHnzrgHkihvQzyGgUprUoAWxTNf2yRnXZlEoQCAmrH3FKM_SsZvomXDuFA6GyUD_f9NdmKVwbnmF6IILPGyPZOZKzs1eHlqCztEpCUQ-EnWI9ALOtQDVooCL2-AlkhP8Ci3vmpapLWYEOhYqgBD7saLZC8zX3R_qpBkj1dxmFM1tC3o5dBxA4GcMI1YCL67wu5AIZgmahgorNPWJ3kh_dXZS__3rwDRLhx9X3Ff3ved_o19JW54qrwehpYHxfq3gNP2pLcj";

const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBS3ZQbRAdvrwA6DfJ-RUQJ3aCkKlwUkKn4rtzgk_7qMyPF4B-Klma9MrW6zLIkKYzO8ktvviOs3eOLy6ee4ze6R7ySjOvQfPIMqPTq1cCRlGUt617SNvgV7oFCX3j2zTQQe-9mU-L6woCqThHiTCq498AQhtyxfDiudenTJXT26gUmRziXVZtatsAwfMdIZTgBbd2TM-Dc8rYtkZz3mecxdH63DICC0XVzKOMyA7hGXUDWk2wmdFlUGqAr4v_DQeCyN3dNPLNecoqQ";

function icon(name: string, style?: CSSProperties) {
  return (
    <span
      aria-hidden="true"
      className="material-symbols-outlined"
      style={style}
    >
      {name}
    </span>
  );
}

export function EcommerceDashboardPreview({
  config,
}: EcommerceDashboardPreviewProps) {
  const cssVars = {
    "--ed-bg": config.backgroundColor,
    "--ed-surface": config.surfaceColor,
    "--ed-muted": config.surfaceMuted,
    "--ed-raised": config.surfaceRaised,
    "--ed-card": config.cardColor,
    "--ed-border": config.borderColor,
    "--ed-text": config.textColor,
    "--ed-muted-text": config.mutedTextColor,
    "--ed-faint": config.faintTextColor,
    "--ed-accent": config.accentColor,
    "--ed-accent-soft": config.accentSoft,
    "--ed-success": config.successColor,
    "--ed-warning": config.warningColor,
    "--ed-danger": config.dangerColor,
    "--ed-tertiary": config.tertiaryColor,
  } as CSSProperties;

  useEffect(() => {
    const el = document.createElement("style");
    el.setAttribute("data-edash", "1");
    el.textContent = previewStyles;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return (
    <div className="edash" style={cssVars}>
      <style>{previewStyles}</style>
      <aside className="edash__sidebar">
        <div className="edash__brand">
          <h1>OmniDash Pro</h1>
          <p>Enterprise Suite</p>
        </div>
        <button className="edash__primary-btn">
          {icon("add")} New Dashboard
        </button>
        <nav className="edash__nav">
          {navItems.map(([itemIcon, label]) => (
            <a
              className={
                label === "E-commerce"
                  ? "edash__nav-item is-active"
                  : "edash__nav-item"
              }
              href="#"
              key={label}
            >
              {icon(itemIcon)}
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="edash__sidebar-footer">
          <a className="edash__nav-item" href="#">
            {icon("settings")}
            <span>Settings</span>
          </a>
          <a className="edash__nav-item" href="#">
            {icon("help")}
            <span>Support</span>
          </a>
        </div>
      </aside>

      <header className="edash__topbar">
        <label className="edash__search">
          {icon("search")}
          <input placeholder="Search analytics, orders, or stock..." />
        </label>
        <div className="edash__top-actions">
          <button>
            {icon("notifications")}
            <i />
          </button>
          <button>{icon("apps")}</button>
          <div className="edash__profile">
            <div>
              <strong>Alex Chen</strong>
              <span>Store Admin</span>
            </div>
            <img alt="Alex Chen" className="edash__avatar" src={profileImage} />
          </div>
        </div>
      </header>

      <main className="edash__main">
        <div className="edash__page-head">
          <div>
            <p>Overview</p>
            <h2>E-commerce Insights</h2>
          </div>
          <div className="edash__range">
            <div>
              <button className="is-selected">7 Days</button>
              <button>30 Days</button>
              <button>1 Year</button>
            </div>
            <button className="edash__outline-btn">
              {icon("calendar_today")} Custom Range
            </button>
          </div>
        </div>

        <section className="edash__metrics">
          <MetricCard
            iconName="payments"
            label="Daily Gross Revenue"
            value="$48,290"
            change="+12.5%"
            tone="accent"
            progress="75%"
          />
          <MetricCard
            iconName="conversion_path"
            label="Conversion Rate"
            value="4.82%"
            change="+2.1%"
            tone="success"
            note="Global average: 2.3%"
          />
          <MetricCard
            iconName="shopping_cart_checkout"
            label="Abandoned Carts"
            value="1,402"
            change="-4.2%"
            tone="danger"
            progress="65%"
          />
          <div className="edash__metric edash__metric--alert">
            <div className="edash__metric-top">
              <div className="edash__metric-icon">{icon("inventory_2")}</div>
              <span className="edash__badge">Urgent</span>
            </div>
            <div>
              <p>Low Stock Alerts</p>
              <h3>14</h3>
              <button className="edash__link-btn">
                Review Inventory {icon("arrow_forward")}
              </button>
            </div>
          </div>
        </section>

        <section className="edash__middle">
          <div className="edash__card edash__chart-card">
            <div className="edash__card-head">
              <h4>Sales Trend Analysis</h4>
              <div className="edash__legend">
                <span>
                  <i />
                  This Week
                </span>
                <span>
                  <i />
                  Last Week
                </span>
              </div>
            </div>
            <div className="edash__chart">
              <svg
                viewBox="0 0 800 300"
                role="img"
                aria-label="Sales trend chart"
              >
                <path
                  d="M0,250 Q100,240 200,270 T400,220 T600,245 T800,230"
                  fill="none"
                  stroke="var(--ed-border)"
                  strokeDasharray="8,4"
                  strokeWidth="2"
                />
                <path
                  d="M0,200 Q100,180 200,140 T400,100 T600,150 T800,80"
                  fill="none"
                  stroke="var(--ed-accent)"
                  strokeWidth="3"
                />
                <circle cx="400" cy="100" fill="var(--ed-accent)" r="6" />
              </svg>
              <div className="edash__tooltip">
                <p>Wednesday Peak</p>
                <strong>$12,403.00</strong>
                <span>{icon("trending_up")} +14.2% vs LW</span>
              </div>
              <div className="edash__axis">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          <div className="edash__card edash__map-card">
            <div className="edash__card-head">
              <h4>Global Reach</h4>
              {icon("public")}
            </div>
            <div className="edash__map">
              <img alt="" className="edash__map-image" src={mapImage} />
              <div className="edash__map-grid" />
              <div className="edash__hotspot edash__hotspot--one" />
              <div className="edash__hotspot edash__hotspot--two" />
              <div className="edash__hotspot edash__hotspot--three" />
            </div>
            <div className="edash__regions">
              <p>
                <span>USA</span>
                <strong>$124,000</strong>
              </p>
              <p>
                <span>Germany</span>
                <strong>$82,300</strong>
              </p>
              <p>
                <span>Japan</span>
                <strong>$54,100</strong>
              </p>
            </div>
          </div>
        </section>

        <section className="edash__table-card">
          <div className="edash__table-head">
            <h4>Top Selling Products</h4>
            <button>View All Inventory</button>
          </div>
          <div className="edash__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product Info</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Stock Level</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.sku}>
                    <td>
                      <div className="edash__product">
                        <img
                          alt=""
                          className="edash__thumb"
                          src={product.image}
                        />
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.sku}</td>
                    <td>
                      <strong>{product.price}</strong>
                    </td>
                    <td>{product.sold}</td>
                    <td>
                      <div className="edash__stock">
                        <div>
                          <i
                            style={{
                              width: product.stockValue,
                              background:
                                product.color === "warning"
                                  ? "var(--ed-warning)"
                                  : "var(--ed-success)",
                            }}
                          />
                        </div>
                        <strong
                          style={{
                            color:
                              product.color === "warning"
                                ? "var(--ed-warning)"
                                : "var(--ed-success)",
                          }}
                        >
                          {product.stock}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <span className="edash__trend">
                        {icon(product.trendIcon)} {product.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <button className="edash__fab">{icon("chat_bubble")}</button>
      <div className="edash__toast">
        {icon("check_circle")}
        <strong>New Sale! +$249.00 from New York, US</strong>
      </div>
    </div>
  );
}

function MetricCard({
  iconName,
  label,
  value,
  change,
  tone,
  progress,
  note,
}: {
  iconName: string;
  label: string;
  value: string;
  change: string;
  tone: "accent" | "success" | "danger";
  progress?: string;
  note?: string;
}) {
  const toneColor =
    tone === "success"
      ? "var(--ed-success)"
      : tone === "danger"
        ? "var(--ed-danger)"
        : "var(--ed-accent)";

  return (
    <div className="edash__metric">
      <div className="edash__metric-top">
        <div className="edash__metric-icon" style={{ color: toneColor }}>
          {icon(iconName)}
        </div>
        <span className="edash__change" style={{ color: toneColor }}>
          {icon(change.startsWith("-") ? "trending_down" : "trending_up")}{" "}
          {change}
        </span>
      </div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
        {progress ? (
          <div className="edash__progress">
            <i style={{ width: progress, background: toneColor }} />
          </div>
        ) : null}
        {note ? <small>{note}</small> : null}
      </div>
    </div>
  );
}

const previewStyles = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
.edash,.edash *{box-sizing:border-box}.edash{position:relative;width:min(1180px,100%);height:760px;overflow:visible;background:var(--ed-bg);color:var(--ed-text);font-family:Inter,sans-serif;border:1px solid var(--ed-border);border-radius:16px;box-shadow:0 30px 90px rgba(0,0,0,.45)}.edash .material-symbols-outlined{font-family:"Material Symbols Outlined";font-weight:400;font-style:normal;font-size:22px;line-height:1;font-feature-settings:"liga"}.edash button{font:inherit}.edash__sidebar{position:absolute;left:0;top:0;width:250px;min-height:100%;padding:24px;border-right:1px solid var(--ed-border);background:var(--ed-surface);z-index:2}.edash__brand h1{margin:0;font-size:22px;line-height:1.2}.edash__brand p,.edash__page-head p,.edash__metric p{margin:4px 0 0;color:var(--ed-muted-text);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.edash__primary-btn{width:100%;margin:28px 0 18px;border:0;border-radius:12px;background:var(--ed-accent);color:#07111f;padding:10px 12px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px}.edash__nav{display:grid;gap:6px}.edash__nav-item{display:flex;align-items:center;gap:12px;border-radius:10px;padding:11px 12px;color:var(--ed-muted-text);text-decoration:none;font-weight:600}.edash__nav-item:hover,.edash__nav-item.is-active{background:var(--ed-raised);color:var(--ed-text)}.edash__nav-item.is-active{color:var(--ed-accent);box-shadow:inset -2px 0 var(--ed-accent)}.edash__sidebar-footer{position:absolute;left:24px;right:24px;bottom:20px;padding-top:16px;border-top:1px solid var(--ed-border)}.edash__topbar{position:absolute;left:250px;right:0;top:0;height:64px;background:color-mix(in srgb,var(--ed-surface) 86%,transparent);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:1}.edash__search{position:relative;width:min(440px,45%);display:block}.edash__search span{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ed-muted-text)}.edash__search input{width:100%;height:40px;border:0;border-radius:10px;background:var(--ed-bg);color:var(--ed-text);padding:0 12px 0 42px;outline:0}.edash__top-actions{display:flex;align-items:center;gap:20px}.edash__top-actions button{position:relative;border:0;background:transparent;color:var(--ed-muted-text);padding:0}.edash__top-actions i{position:absolute;width:8px;height:8px;border-radius:50%;right:0;top:0;background:var(--ed-success);border:2px solid var(--ed-surface)}.edash__profile{display:flex;align-items:center;gap:12px;padding-left:20px;border-left:1px solid var(--ed-border)}.edash__profile div:first-child{text-align:right}.edash__profile strong{display:block;font-size:12px}.edash__profile span{font-size:10px;color:var(--ed-muted-text);text-transform:uppercase;letter-spacing:.08em}.edash__avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--ed-accent),var(--ed-tertiary));color:#050505;font-weight:900}.edash__main{margin-left:250px;padding:88px 24px 28px;min-width:850px}.edash__page-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px}.edash__page-head h2{margin:0;font-size:32px;line-height:1.2}.edash__range{display:flex;gap:16px}.edash__range>div{display:flex;background:var(--ed-muted);padding:4px;border-radius:10px}.edash__range button,.edash__outline-btn{border:0;border-radius:8px;background:transparent;color:var(--ed-muted-text);padding:8px 14px;font-weight:700}.edash__range .is-selected,.edash__outline-btn{background:var(--ed-raised);color:var(--ed-text)}.edash__outline-btn{border:1px solid var(--ed-border);display:flex;align-items:center;gap:8px}.edash__metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-bottom:24px}.edash__metric,.edash__card,.edash__table-card{background:var(--ed-card);border:1px solid var(--ed-border);border-radius:14px;backdrop-filter:blur(20px);box-shadow:0 18px 50px rgba(0,0,0,.25)}.edash__metric{min-height:210px;padding:24px;display:flex;flex-direction:column;justify-content:space-between}.edash__metric:hover,.edash__card:hover,.edash__table-card:hover{border-color:color-mix(in srgb,var(--ed-accent) 35%,var(--ed-border))}.edash__metric-top{display:flex;align-items:flex-start;justify-content:space-between}.edash__metric-icon{width:48px;height:48px;border-radius:10px;background:color-mix(in srgb,currentColor 13%,transparent);display:grid;place-items:center;color:var(--ed-accent)}.edash__metric-icon span{font-size:32px}.edash__change{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:900}.edash__metric h3{font-size:44px;line-height:1;margin:8px 0 0}.edash__progress{height:4px;background:var(--ed-raised);border-radius:99px;overflow:hidden;margin-top:18px}.edash__progress i{display:block;height:100%}.edash__metric small{display:block;margin-top:8px;color:var(--ed-muted-text);font-size:11px;font-style:italic}.edash__metric--alert{background:linear-gradient(135deg,var(--ed-card),color-mix(in srgb,var(--ed-warning) 12%,var(--ed-card)))}.edash__badge{background:var(--ed-warning);color:#080808;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:1000;text-transform:uppercase}.edash__link-btn{border:0;background:transparent;color:var(--ed-warning);font-weight:900;padding:14px 0 0;display:flex;align-items:center;gap:4px}.edash__middle{display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px}.edash__card{padding:24px}.edash__card-head,.edash__table-head{display:flex;align-items:center;justify-content:space-between}.edash__card-head h4,.edash__table-head h4{margin:0;font-size:20px}.edash__legend{display:flex;gap:18px}.edash__legend span{display:flex;align-items:center;gap:8px;color:var(--ed-muted-text);font-size:13px}.edash__legend i{width:11px;height:11px;border-radius:50%;background:var(--ed-accent)}.edash__legend span+span i{background:var(--ed-border)}.edash__chart{height:320px;position:relative;margin-top:16px}.edash__chart svg{position:absolute;inset:0;width:100%;height:260px}.edash__tooltip{position:absolute;top:44px;left:45%;background:var(--ed-card);border:1px solid color-mix(in srgb,var(--ed-accent) 45%,var(--ed-border));border-radius:10px;padding:12px;box-shadow:0 18px 40px rgba(0,0,0,.35)}.edash__tooltip p{margin:0;color:var(--ed-muted-text);font-size:10px;font-weight:900;text-transform:uppercase}.edash__tooltip strong{display:block;color:var(--ed-accent);font-size:18px}.edash__tooltip span{display:flex;align-items:center;gap:4px;color:var(--ed-success);font-size:10px;font-weight:800}.edash__axis{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;border-top:1px solid var(--ed-border);padding-top:14px;color:var(--ed-muted-text);font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.edash__map{position:relative;height:240px;margin-top:16px;border:1px solid var(--ed-border);border-radius:10px;overflow:hidden;background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--ed-accent) 35%,transparent),transparent 12%),radial-gradient(circle at 60% 45%,color-mix(in srgb,var(--ed-success) 28%,transparent),transparent 10%),linear-gradient(135deg,var(--ed-bg),var(--ed-muted))}.edash__map-grid{position:absolute;inset:0;opacity:.28;background-image:linear-gradient(var(--ed-border) 1px,transparent 1px),linear-gradient(90deg,var(--ed-border) 1px,transparent 1px);background-size:24px 24px}.edash__hotspot{position:absolute;border-radius:50%;background:var(--ed-accent);box-shadow:0 0 0 8px color-mix(in srgb,var(--ed-accent) 18%,transparent),0 0 28px var(--ed-accent)}.edash__hotspot--one{width:15px;height:15px;left:25%;top:28%}.edash__hotspot--two{width:12px;height:12px;left:52%;top:38%;background:var(--ed-success)}.edash__hotspot--three{width:20px;height:20px;right:24%;bottom:32%;opacity:.75}.edash__regions{display:grid;gap:10px;margin-top:16px}.edash__regions p{display:flex;justify-content:space-between;margin:0;font-size:14px}.edash__regions span{color:var(--ed-muted-text)}.edash__table-card{overflow:hidden}.edash__table-head{padding:18px 24px;border-bottom:1px solid var(--ed-border)}.edash__table-head button{border:0;background:transparent;color:var(--ed-accent);font-weight:900}.edash__table-wrap{overflow:auto}.edash table{width:100%;border-collapse:collapse;min-width:820px}.edash th{background:var(--ed-muted);color:var(--ed-muted-text);font-size:11px;text-transform:uppercase;letter-spacing:.1em;text-align:left;padding:14px 24px;border-bottom:1px solid var(--ed-border)}.edash td{padding:16px 24px;border-bottom:1px solid var(--ed-border);color:var(--ed-muted-text);font-size:14px}.edash tr:hover td{background:color-mix(in srgb,var(--ed-raised) 55%,transparent)}.edash__product{display:flex;align-items:center;gap:12px}.edash__thumb{width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,var(--ed-accent),var(--ed-warning));box-shadow:inset 0 0 20px rgba(0,0,0,.35)}.edash__product strong{display:block;color:var(--ed-text)}.edash__product span{display:block;color:var(--ed-muted-text);font-size:10px}.edash__stock{display:flex;align-items:center;gap:12px}.edash__stock>div{width:90px;height:6px;background:var(--ed-raised);border-radius:99px;overflow:hidden}.edash__stock i{display:block;height:100%}.edash__trend{display:flex;align-items:center;gap:4px;color:var(--ed-success);font-weight:900}.edash__fab{position:absolute;right:24px;bottom:24px;width:56px;height:56px;border:0;border-radius:50%;display:grid;place-items:center;background:var(--ed-accent);color:#050505;box-shadow:0 0 24px color-mix(in srgb,var(--ed-accent) 35%,transparent)}.edash__fab span{font-size:30px}.edash__toast{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);background:var(--ed-card);border:1px solid color-mix(in srgb,var(--ed-success) 40%,var(--ed-border));border-radius:999px;padding:12px 24px;display:flex;align-items:center;gap:12px;box-shadow:0 20px 50px rgba(0,0,0,.4);font-size:14px}.edash__toast span{color:var(--ed-success)}.edash__avatar{object-fit:cover;border:1px solid var(--ed-border);background:var(--ed-raised)}.edash__map-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42;mix-blend-mode:luminosity}.edash__thumb{object-fit:cover;background:var(--ed-raised);box-shadow:none}@media (max-width:920px){.edash{height:780px}.edash__sidebar{width:76px;padding:16px 10px}.edash__brand h1,.edash__brand p,.edash__nav-item span,.edash__sidebar-footer,.edash__primary-btn{display:none}.edash__nav-item{justify-content:center}.edash__topbar{left:76px}.edash__main{margin-left:76px;min-width:720px}.edash__metrics{grid-template-columns:repeat(2,1fr)}.edash__middle{grid-template-columns:1fr}.edash__toast{display:none}}
`;
