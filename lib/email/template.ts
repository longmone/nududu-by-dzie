export interface EmailRow {
  label: string;
  value: string;
}

export function renderOrderEmailHtml(options: {
  eyebrow: string;
  heading: string;
  intro?: string;
  rows: EmailRow[];
  footerNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const rowsHtml = options.rows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #F0E4D3;color:#6B5A4E;font-size:13px;">${row.label}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #F0E4D3;color:#3A2A22;font-size:13px;font-weight:600;text-align:right;">${row.value}</td>
        </tr>`
    )
    .join("");

  const introHtml = options.intro
    ? `<p style="padding:16px 24px 0;margin:0;color:#3A2A22;font-size:14px;">${options.intro}</p>`
    : "";

  const ctaHtml =
    options.ctaLabel && options.ctaUrl
      ? `<div style="padding:20px 24px 0;">
          <a href="${options.ctaUrl}" style="display:inline-block;background:#C1502E;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:999px;">${options.ctaLabel}</a>
        </div>`
      : "";

  return `
  <div style="background:#FBF3E7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #F0E4D3;">
      <div style="background:#C1502E;padding:20px 24px;">
        <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;">${options.eyebrow}</p>
        <h1 style="margin:4px 0 0;color:#ffffff;font-size:22px;">${options.heading}</h1>
      </div>
      ${introHtml}
      <table style="width:100%;border-collapse:collapse;margin-top:${options.intro ? "12px" : "0"};">
        ${rowsHtml}
      </table>
      ${ctaHtml}
      ${
        options.footerNote
          ? `<p style="padding:16px 24px 24px;margin:0;color:#6B5A4E;font-size:12px;">${options.footerNote}</p>`
          : `<div style="padding-bottom:8px;"></div>`
      }
    </div>
  </div>`;
}

export function renderOrderEmailText(rows: EmailRow[], footerNote?: string) {
  const base = rows.map((row) => `${row.label}: ${row.value}`).join("\n");
  return footerNote ? `${base}\n\n${footerNote}` : base;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
