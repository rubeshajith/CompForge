// ─────────────────────────────────────────────────────────────────────────────
// generateEmailTemplateCode.ts
// Generates production-ready HTML email strings with fully inline CSS.
// Output is safe for all major email clients (Gmail, Outlook, Apple Mail).
// ─────────────────────────────────────────────────────────────────────────────

import { EmailTemplateConfig } from "./emailTemplateConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function btn(
  label: string,
  href: string,
  accentColor: string,
  accentTextColor: string,
  fontFamily: string,
) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td style="background:${accentColor};border-radius:8px;text-align:center;">
      <a href="${href}" target="_blank"
        style="display:inline-block;padding:14px 32px;font-family:${fontFamily};font-size:15px;font-weight:600;color:${accentTextColor};text-decoration:none;letter-spacing:0.3px;"
      >${label}</a>
    </td>
  </tr>
</table>`;
}

function divider(color: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="height:1px;background:${color};line-height:1px;font-size:1px;">&nbsp;</td></tr>
</table>`;
}

function headerBlock(config: EmailTemplateConfig, subtitle: string) {
  return `<!-- HEADER -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
  style="background:${config.headerBackground};border-radius:${config.cardBorderRadius}px ${config.cardBorderRadius}px 0 0;border-bottom:1px solid ${config.dividerColor};">
  <tr>
    <td style="padding:28px 40px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <span style="font-family:${config.fontFamily};font-size:22px;font-weight:700;color:${config.logoTextColor};letter-spacing:-0.5px;">CompForge</span>
          </td>
          <td style="text-align:right;">
            <span style="font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">${subtitle}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

function footerBlock(config: EmailTemplateConfig) {
  return `<!-- FOOTER -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
  style="background:${config.footerBackground};border-radius:0 0 ${config.cardBorderRadius}px ${config.cardBorderRadius}px;border-top:1px solid ${config.dividerColor};">
  <tr>
    <td style="padding:28px 40px;text-align:center;">
      <p style="margin:0 0 8px;font-family:${config.fontFamily};font-size:13px;color:${config.footerTextColor};line-height:1.6;">
        © ${new Date().getFullYear()} CompForge · All rights reserved
      </p>
      <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};line-height:1.6;">
        You received this email because you have an account with us.
        <a href="#" style="color:${config.accentColor};text-decoration:none;">Unsubscribe</a>
      </p>
    </td>
  </tr>
</table>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 1 — Order Summary
// ─────────────────────────────────────────────────────────────────────────────

function generateOrderSummaryHTML(config: EmailTemplateConfig): string {
  const products = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      sku: "SKU-WH-1000XM",
      qty: 1,
      price: "$279.00",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&crop=center",
    },
    {
      name: "USB-C Charging Cable (2m)",
      sku: "SKU-USBC-2M",
      qty: 2,
      price: "$24.00",
      img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&crop=center",
    },
    {
      name: "Portable Power Bank 20,000 mAh",
      sku: "SKU-PB-20K",
      qty: 1,
      price: "$59.00",
      img: "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?w=120&h=120&fit=crop&crop=center",
    },
  ];

  const productRows = products
    .map(
      (p, i) => `
<tr style="background:${i % 2 === 0 ? config.tableRowBackground : config.tableAltRowBackground};">
  <td style="padding:16px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:56px;vertical-align:middle;">
          <img src="${p.img}" alt="${p.name}" width="52" height="52" style="display:block;width:52px;height:52px;border-radius:8px;object-fit:cover;border:1px solid ${config.dividerColor};" />
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <p style="margin:0 0 2px;font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.headingTextColor};">${p.name}</p>
          <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">${p.sku} · Qty: ${p.qty}</p>
        </td>
        <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
          <span style="font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.bodyTextColor};">${p.price}</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`,
    )
    .join("\n");

  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order Confirmation — CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Order Confirmation")}

        <!-- HERO MESSAGE -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;">
              <div style="width:56px;height:56px;background:${config.accentColor}22;border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:26px;">✓</div>
              <h1 style="margin:0 0 10px;font-family:${config.fontFamily};font-size:24px;font-weight:700;color:${config.headingTextColor};letter-spacing:-0.5px;">Order Confirmed!</h1>
              <p style="margin:0;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.6;">
                Hey Alex, your order has been placed successfully.<br/>
                We'll send you a shipping confirmation once it's on the way.
              </p>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- ORDER META -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:20px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;">
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:11px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Order Number</p>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.accentColor};">#CF-20240531-8821</p>
                  </td>
                  <td style="width:50%;text-align:right;">
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:11px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Order Date</p>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.bodyTextColor};">May 31, 2024</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- PRODUCT LIST HEADER -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:20px 40px 12px;">
              <p style="margin:0;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Items Ordered</p>
            </td>
          </tr>
        </table>

        <!-- PRODUCT ROWS -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${productRows}
        </table>

        ${divider(config.dividerColor)}

        <!-- TOTALS -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:20px 40px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:8px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Subtotal</td>
                  <td style="padding-bottom:8px;text-align:right;font-family:${config.fontFamily};font-size:13px;color:${config.bodyTextColor};">$362.00</td>
                </tr>
                <tr>
                  <td style="padding-bottom:8px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Shipping</td>
                  <td style="padding-bottom:8px;text-align:right;font-family:${config.fontFamily};font-size:13px;color:${config.bodyTextColor};">$8.99</td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Tax (8%)</td>
                  <td style="padding-bottom:12px;text-align:right;font-family:${config.fontFamily};font-size:13px;color:${config.bodyTextColor};">$29.03</td>
                </tr>
                <tr>
                  <td style="border-top:1px solid ${config.dividerColor};padding-top:12px;font-family:${config.fontFamily};font-size:15px;font-weight:700;color:${config.headingTextColor};">Total</td>
                  <td style="border-top:1px solid ${config.dividerColor};padding-top:12px;text-align:right;font-family:${config.fontFamily};font-size:15px;font-weight:700;color:${config.accentColor};">$400.02</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              ${btn("View Order Details", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 2 — Review Request (Star Rating)
// ─────────────────────────────────────────────────────────────────────────────

function generateReviewRequestHTML(config: EmailTemplateConfig): string {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < 4; // show 4/5 pre-filled as suggestion
    return `<a href="#" style="text-decoration:none;margin:0 3px;font-size:32px;color:${filled ? config.starFilledColor : config.starEmptyColor};" title="${i + 1} star">★</a>`;
  }).join("");

  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>How did we do? — CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Feedback Request")}

        <!-- HERO -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:20px;">💬</div>
              <h1 style="margin:0 0 12px;font-family:${config.fontFamily};font-size:24px;font-weight:700;color:${config.headingTextColor};letter-spacing:-0.5px;">How was your experience?</h1>
              <p style="margin:0;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.7;max-width:440px;margin-left:auto;margin-right:auto;">
                Your order <strong style="color:${config.accentColor};">#CF-20240531-8821</strong> was delivered on <strong style="color:${config.headingTextColor};">May 28, 2024</strong>.
                We'd love to hear what you think — it only takes 30 seconds.
              </p>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- PRODUCT BEING REVIEWED -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:72px;vertical-align:middle;">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=140&h=140&fit=crop&crop=center" alt="Wireless Noise-Cancelling Headphones" width="68" height="68" style="display:block;width:68px;height:68px;border-radius:10px;object-fit:cover;border:1px solid ${config.dividerColor};" />
                  </td>
                  <td style="padding-left:20px;vertical-align:middle;">
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:11px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">You purchased</p>
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:16px;font-weight:600;color:${config.headingTextColor};">Wireless Noise-Cancelling Headphones</p>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">SKU-WH-1000XM · Delivered May 28</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- STAR RATING -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0 0 16px;font-family:${config.fontFamily};font-size:13px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Tap to rate</p>
              <div style="margin-bottom:28px;">
                ${stars}
              </div>
              <p style="margin:0 0 24px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">or leave a written review</p>
              ${btn("Write a Review", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- TRUST NOTE -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="padding:0 20px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">🔒</div>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">Private &amp; secure</p>
                  </td>
                  <td style="padding:0 20px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">⚡</div>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">Takes 30 seconds</p>
                  </td>
                  <td style="padding:0 20px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">🎁</div>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">10% off next order</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 3 — Order Shipped / Tracking
// ─────────────────────────────────────────────────────────────────────────────

function generateOrderShippedHTML(config: EmailTemplateConfig): string {
  const steps = [
    {
      label: "Order Placed",
      date: "May 31",
      done: true,
      icon: "✓",
    },
    {
      label: "Processing",
      date: "Jun 1",
      done: true,
      icon: "✓",
    },
    {
      label: "Shipped",
      date: "Jun 2",
      done: true,
      icon: "✓",
    },
    {
      label: "Out for Delivery",
      date: "Jun 4",
      done: false,
      icon: "◎",
    },
    {
      label: "Delivered",
      date: "Jun 4",
      done: false,
      icon: "○",
    },
  ];

  const stepRows = steps
    .map((s, i) => {
      const isLast = i === steps.length - 1;
      const dotColor = s.done ? config.accentColor : config.dividerColor;
      const dotTextColor = s.done
        ? config.accentTextColor
        : config.mutedTextColor;
      const lineColor = s.done ? config.accentColor : config.dividerColor;

      return `<tr>
  <td style="width:32px;text-align:center;vertical-align:top;padding:0 16px 0 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="32">
      <tr>
        <td style="text-align:center;">
          <div style="width:28px;height:28px;background:${dotColor};border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:${dotTextColor};margin:0 auto;">${s.icon}</div>
        </td>
      </tr>
      ${!isLast ? `<tr><td style="text-align:center;"><div style="width:2px;height:36px;background:${lineColor};margin:4px auto;border-radius:2px;"></div></td></tr>` : ""}
    </table>
  </td>
  <td style="padding:4px 0 ${!isLast ? "32px" : "0"} 0;vertical-align:top;">
    <p style="margin:0 0 2px;font-family:${config.fontFamily};font-size:14px;font-weight:${s.done ? 600 : 400};color:${s.done ? config.headingTextColor : config.mutedTextColor};">${s.label}</p>
    <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">${s.date}</p>
  </td>
</tr>`;
    })
    .join("\n");

  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Your Order is on the Way — CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Shipment Update")}

        <!-- HERO -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;">
              <div style="font-size:48px;margin-bottom:18px;">📦</div>
              <h1 style="margin:0 0 10px;font-family:${config.fontFamily};font-size:24px;font-weight:700;color:${config.headingTextColor};letter-spacing:-0.5px;">Your order is on the way!</h1>
              <p style="margin:0;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.6;">
                Great news, Alex — your package has been picked up<br/>by the carrier and is heading your way.
              </p>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- TRACKING INFO -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;padding-right:16px;">
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:11px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Tracking Number</p>
                    <p style="margin:0;font-family:${config.fontFamily};font-size:14px;font-weight:700;color:${config.accentColor};font-feature-settings:'tnum';letter-spacing:0.5px;">1Z-4F7-A2B-9X301</p>
                  </td>
                  <td style="width:50%;text-align:right;">
                    <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:11px;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Est. Delivery</p>
                    <span style="display:inline-block;background:${config.trackingBadgeBackground};color:${config.trackingBadgeTextColor};font-family:${config.fontFamily};font-size:13px;font-weight:600;padding:4px 12px;border-radius:20px;">Jun 4, 2024</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- TRACKING PROGRESS -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:28px 40px;">
              <p style="margin:0 0 20px;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Delivery Progress</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${stepRows}
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- SHIPPED ITEM SUMMARY -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:20px 40px 16px;">
              <p style="margin:0 0 14px;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">In this Shipment</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr style="background:${config.tableRowBackground};border-radius:8px;">
                  <td style="padding:14px 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="width:44px;vertical-align:middle;">
                          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center" alt="Wireless Noise-Cancelling Headphones" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:6px;object-fit:cover;border:1px solid ${config.dividerColor};" />
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0 0 2px;font-family:${config.fontFamily};font-size:13px;font-weight:600;color:${config.headingTextColor};">Wireless Noise-Cancelling Headphones</p>
                          <p style="margin:0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">Qty: 1 · SKU-WH-1000XM</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:16px 40px 36px;text-align:center;">
              ${btn("Track Live on Map", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 4 — Welcome / Onboarding
// ─────────────────────────────────────────────────────────────────────────────

function generateWelcomeOnboardHTML(config: EmailTemplateConfig): string {
  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  const features = [
    {
      icon: "⚡",
      title: "Instant code generation",
      desc: "Customise any component visually and get production-ready code in one click.",
    },
    {
      icon: "🎨",
      title: "Dark & light presets",
      desc: "Every component ships with a polished dark and light theme out of the box.",
    },
    {
      icon: "📦",
      title: "Drop-in ready",
      desc: "All output is self-contained — no extra dependencies, just copy and paste.",
    },
  ];

  const featureRows = features
    .map(
      (f) => `
<tr>
  <td style="padding:0 0 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:44px;vertical-align:top;">
          <div style="width:40px;height:40px;background:${config.featurePillBackground};border-radius:10px;text-align:center;line-height:40px;font-size:20px;">${f.icon}</div>
        </td>
        <td style="padding-left:16px;vertical-align:top;">
          <p style="margin:0 0 4px;font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.headingTextColor};">${f.title}</p>
          <p style="margin:0;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};line-height:1.6;">${f.desc}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Welcome")}

        <!-- HERO -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
          style="background:${config.headerBackground};border-bottom:1px solid ${config.dividerColor};">
          <tr>
            <td style="padding:48px 40px 44px;text-align:center;">
              <div style="display:inline-block;background:${config.featurePillBackground};border:1px solid ${config.accentColor}44;border-radius:20px;padding:6px 16px;margin-bottom:20px;">
                <span style="font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.featurePillTextColor};letter-spacing:0.8px;text-transform:uppercase;">You're in 🎉</span>
              </div>
              <h1 style="margin:0 0 14px;font-family:${config.fontFamily};font-size:28px;font-weight:700;color:${config.headingTextColor};letter-spacing:-0.8px;line-height:1.2;">
                Welcome to<br/><span style="color:${config.accentColor};">CompForge</span>
              </h1>
              <p style="margin:0;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.7;max-width:420px;margin-left:auto;margin-right:auto;">
                Your account is ready. Start building beautiful, customisable UI components and export clean production code in seconds.
              </p>
            </td>
          </tr>
        </table>

        <!-- FEATURE LIST -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 20px;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">What you can do</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${featureRows}
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0 0 20px;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.6;">
                Ready to build something great?
              </p>
              ${btn("Open the Playground →", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
              <p style="margin:20px 0 0;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">
                Questions? Reply to this email — we read every one.
              </p>
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 5 — Flash Sale / Promo
// ─────────────────────────────────────────────────────────────────────────────

function generateFlashSaleHTML(config: EmailTemplateConfig): string {
  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  const deals = [
    {
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center",
      name: "Wireless Headphones Pro",
      original: "$279",
      sale: "$167",
      off: "40% OFF",
      bg: config.tableRowBackground,
    },
    {
      img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop&crop=center",
      name: "Mechanical Keyboard TKL",
      original: "$149",
      sale: "$104",
      off: "30% OFF",
      bg: config.tableAltRowBackground,
    },
    {
      img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop&crop=center",
      name: "Ergonomic Mouse X1",
      original: "$89",
      sale: "$62",
      off: "30% OFF",
      bg: config.tableRowBackground,
    },
  ];

  const dealRows = deals
    .map(
      (d) => `
<tr style="background:${d.bg};">
  <td style="padding:14px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:44px;vertical-align:middle;">
          <img src="${d.img}" alt="${d.name}" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:8px;object-fit:cover;border:1px solid ${config.dividerColor};" />
        </td>
        <td style="padding-left:14px;vertical-align:middle;">
          <p style="margin:0;font-family:${config.fontFamily};font-size:14px;font-weight:600;color:${config.headingTextColor};">${d.name}</p>
          <p style="margin:2px 0 0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};text-decoration:line-through;">${d.original}</p>
        </td>
        <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
          <span style="display:inline-block;background:${config.saleBadgeBackground};color:${config.saleBadgeTextColor};font-family:${config.fontFamily};font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:0.3px;margin-bottom:4px;">${d.off}</span><br/>
          <span style="font-family:${config.fontFamily};font-size:16px;font-weight:700;color:${config.accentColor};">${d.sale}</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Flash Sale — CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Flash Sale")}

        <!-- HERO BANNER -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
          style="background:${config.headerBackground};border-bottom:1px solid ${config.dividerColor};">
          <tr>
            <td style="padding:40px 40px 36px;text-align:center;">
              <div style="display:inline-block;background:${config.saleBadgeBackground};border:1px solid ${config.saleBadgeTextColor}44;border-radius:4px;padding:5px 14px;margin-bottom:18px;">
                <span style="font-family:${config.fontFamily};font-size:11px;font-weight:800;color:${config.saleBadgeTextColor};letter-spacing:2px;text-transform:uppercase;">⚡ 24-HOUR SALE</span>
              </div>
              <h1 style="margin:0 0 10px;font-family:${config.fontFamily};font-size:32px;font-weight:800;color:${config.headingTextColor};letter-spacing:-1px;line-height:1.1;">
                Up to <span style="color:${config.accentColor};">40% off</span><br/>selected gear
              </h1>
              <p style="margin:0 0 6px;font-family:${config.fontFamily};font-size:14px;color:${config.mutedTextColor};">
                Sale ends in
              </p>
              <!-- Countdown tiles -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 0;">
                <tr>
                  <td style="padding:0 4px;text-align:center;">
                    <div style="background:${config.tableRowBackground};border:1px solid ${config.dividerColor};border-radius:6px;padding:8px 14px;">
                      <span style="font-family:${config.fontFamily};font-size:22px;font-weight:700;color:${config.accentColor};display:block;line-height:1;">11</span>
                      <span style="font-family:${config.fontFamily};font-size:10px;color:${config.mutedTextColor};letter-spacing:0.5px;text-transform:uppercase;">hrs</span>
                    </div>
                  </td>
                  <td style="padding:0 2px;font-family:${config.fontFamily};font-size:20px;font-weight:700;color:${config.mutedTextColor};vertical-align:middle;">:</td>
                  <td style="padding:0 4px;text-align:center;">
                    <div style="background:${config.tableRowBackground};border:1px solid ${config.dividerColor};border-radius:6px;padding:8px 14px;">
                      <span style="font-family:${config.fontFamily};font-size:22px;font-weight:700;color:${config.accentColor};display:block;line-height:1;">34</span>
                      <span style="font-family:${config.fontFamily};font-size:10px;color:${config.mutedTextColor};letter-spacing:0.5px;text-transform:uppercase;">min</span>
                    </div>
                  </td>
                  <td style="padding:0 2px;font-family:${config.fontFamily};font-size:20px;font-weight:700;color:${config.mutedTextColor};vertical-align:middle;">:</td>
                  <td style="padding:0 4px;text-align:center;">
                    <div style="background:${config.tableRowBackground};border:1px solid ${config.dividerColor};border-radius:6px;padding:8px 14px;">
                      <span style="font-family:${config.fontFamily};font-size:22px;font-weight:700;color:${config.accentColor};display:block;line-height:1;">08</span>
                      <span style="font-family:${config.fontFamily};font-size:10px;color:${config.mutedTextColor};letter-spacing:0.5px;text-transform:uppercase;">sec</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- COUPON BLOCK -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:28px 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="background:${config.couponBlockBackground};border:1px dashed ${config.couponBorderColor};border-radius:8px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 2px;font-family:${config.fontFamily};font-size:11px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Your exclusive code</p>
                          <p style="margin:0;font-family:${config.fontFamily};font-size:22px;font-weight:800;color:${config.couponTextColor};letter-spacing:3px;">FORGE40</p>
                        </td>
                        <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
                          <span style="font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">Extra 10% on top →</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- DEALS -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:4px 0 0;">
              <p style="margin:0 0 10px;padding:0 40px;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Today's deals</p>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${dealRows}
        </table>

        ${divider(config.dividerColor)}

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              ${btn("Shop the Sale Now →", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
              <p style="margin:16px 0 0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">
                Free shipping on orders over $50 · While stocks last
              </p>
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 6 — Refund Processed
// ─────────────────────────────────────────────────────────────────────────────

function generateRefundProcessedHTML(config: EmailTemplateConfig): string {
  const shadow = config.showShadow
    ? "box-shadow:0 8px 48px rgba(0,0,0,0.6);"
    : "";

  const items = [
    {
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center",
      name: "Wireless Noise-Cancelling Headphones",
      qty: 1,
      amount: "$279.00",
    },
    {
      img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80&h=80&fit=crop&crop=center",
      name: "USB-C Charging Cable (2m)",
      qty: 2,
      amount: "$24.00",
    },
  ];

  const itemRows = items
    .map(
      (item, i) => `
<tr style="background:${i % 2 === 0 ? config.tableRowBackground : config.tableAltRowBackground};">
  <td style="padding:12px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="width:40px;vertical-align:middle;">
          <img src="${item.img}" alt="${item.name}" width="36" height="36" style="display:block;width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid ${config.dividerColor};" />
        </td>
        <td style="padding-left:12px;vertical-align:middle;">
          <p style="margin:0;font-family:${config.fontFamily};font-size:13px;font-weight:500;color:${config.bodyTextColor};">${item.name}</p>
          <p style="margin:2px 0 0;font-family:${config.fontFamily};font-size:12px;color:${config.mutedTextColor};">Qty: ${item.qty}</p>
        </td>
        <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
          <span style="font-family:${config.fontFamily};font-size:13px;font-weight:600;color:${config.bodyTextColor};">${item.amount}</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Refund Processed — CompForge</title>
</head>
<body style="margin:0;padding:40px 20px;background:${config.emailBackground};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:${config.cardWidth}px;margin:0 auto;">
    <tr>
      <td style="background:${config.cardBackground};border-radius:${config.cardBorderRadius}px;border:1px solid ${config.cardBorderColor};${shadow}overflow:hidden;">

        ${headerBlock(config, "Refund Update")}

        <!-- HERO -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:36px 40px 28px;text-align:center;">
              <div style="width:56px;height:56px;background:${config.refundStatusBackground};border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:26px;">↩</div>
              <div style="display:inline-block;background:${config.refundStatusBackground};border-radius:20px;padding:5px 16px;margin-bottom:16px;">
                <span style="font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.refundStatusTextColor};letter-spacing:0.5px;">Refund Approved</span>
              </div>
              <h1 style="margin:0 0 10px;font-family:${config.fontFamily};font-size:24px;font-weight:700;color:${config.headingTextColor};letter-spacing:-0.5px;">Your refund is on the way</h1>
              <p style="margin:0;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.7;max-width:420px;margin-left:auto;margin-right:auto;">
                Hi Alex, we've processed your refund for order <strong style="color:${config.accentColor};">#CF-20240531-8821</strong>. Please allow 5–7 business days depending on your bank.
              </p>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- REFUND SUMMARY CARD -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="background:${config.tableRowBackground};border-radius:10px;border:1px solid ${config.dividerColor};">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom:12px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Refund amount</td>
                        <td style="padding-bottom:12px;text-align:right;font-family:${config.fontFamily};font-size:15px;font-weight:700;color:${config.refundStatusTextColor};">$303.00</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Refund method</td>
                        <td style="padding-bottom:12px;text-align:right;font-family:${config.fontFamily};font-size:13px;color:${config.bodyTextColor};">Visa ···· 4242</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Estimated arrival</td>
                        <td style="padding-bottom:12px;text-align:right;font-family:${config.fontFamily};font-size:13px;color:${config.bodyTextColor};">Jun 5 – Jun 7, 2024</td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid ${config.dividerColor};padding-top:12px;font-family:${config.fontFamily};font-size:13px;color:${config.mutedTextColor};">Reference ID</td>
                        <td style="border-top:1px solid ${config.dividerColor};padding-top:12px;text-align:right;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.accentColor};letter-spacing:0.5px;">RFD-9920-CF</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider(config.dividerColor)}

        <!-- REFUNDED ITEMS -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:16px 40px 8px;">
              <p style="margin:0;font-family:${config.fontFamily};font-size:12px;font-weight:600;color:${config.mutedTextColor};letter-spacing:1px;text-transform:uppercase;">Refunded Items</p>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${itemRows}
        </table>

        ${divider(config.dividerColor)}

        <!-- REASSURANCE + CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding:28px 40px 36px;text-align:center;">
              <p style="margin:0 0 20px;font-family:${config.fontFamily};font-size:15px;color:${config.bodyTextColor};line-height:1.7;max-width:400px;margin-left:auto;margin-right:auto;">
                We're sorry your experience didn't meet expectations. If you have questions about your refund, our support team is here.
              </p>
              ${btn("Contact Support", "#", config.accentColor, config.accentTextColor, config.fontFamily)}
            </td>
          </tr>
        </table>

        ${footerBlock(config)}

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public exports
// ─────────────────────────────────────────────────────────────────────────────

export function generateEmailTemplateHTML(config: EmailTemplateConfig): string {
  switch (config.variant) {
    case "orderSummary":
      return generateOrderSummaryHTML(config);
    case "reviewRequest":
      return generateReviewRequestHTML(config);
    case "orderShipped":
      return generateOrderShippedHTML(config);
    case "welcomeOnboard":
      return generateWelcomeOnboardHTML(config);
    case "flashSale":
      return generateFlashSaleHTML(config);
    case "refundProcessed":
      return generateRefundProcessedHTML(config);
    default:
      return generateOrderSummaryHTML(config);
  }
}
