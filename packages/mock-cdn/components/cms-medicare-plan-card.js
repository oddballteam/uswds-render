class CmsMedicarePlanCard extends HTMLElement {
  static observedAttributes = [
    "plan-name", "plan-type", "monthly-premium", "star-rating",
    "max-out-of-pocket", "benefits", "pharmacy-note",
    "details-href", "details-label",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _starsHtml(raw) {
    if (!raw) return "";
    const num = parseFloat(raw);
    if (isNaN(num)) return `<span style="color:#5C5C5C;font-size:.87rem">${this._esc(raw)}</span>`;
    const full = Math.floor(num);
    const half = num - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const stars = "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
    return `<span style="color:#FFB900;letter-spacing:1px;font-size:1rem">${stars}</span> <span style="color:#5C5C5C;font-size:.87rem">${this._esc(raw)}</span>`;
  }

  _render() {
    const name     = this.getAttribute("plan-name");
    const type     = this.getAttribute("plan-type");
    const premium  = this.getAttribute("monthly-premium");
    const stars    = this.getAttribute("star-rating");
    const moop     = this.getAttribute("max-out-of-pocket");
    const benefits = this.getAttribute("benefits");
    const pharmacy = this.getAttribute("pharmacy-note");
    const href     = this.getAttribute("details-href");
    const label    = this.getAttribute("details-label") || "View plan details";

    this.innerHTML = `
      <div style="border:1px solid #BEC0C2;border-radius:4px;border-top:4px solid #003570;padding:16px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;font-family:system-ui,-apple-system,sans-serif">
        ${type ? `<span style="display:inline-block;background:#E8F1FB;color:#003570;font-size:.75rem;font-weight:700;padding:2px 8px;border-radius:2px;align-self:flex-start;letter-spacing:.03em">${this._esc(type)}</span>` : ""}
        ${name ? `<p style="margin:0;font-weight:700;font-size:1rem;color:#212121;line-height:1.3">${this._esc(name)}</p>` : ""}
        ${premium ? `<p style="margin:0;font-size:1.25rem;font-weight:700;color:#003570;line-height:1">${this._esc(premium)}</p>` : ""}
        ${stars ? `<p style="margin:0">${this._starsHtml(stars)}</p>` : ""}
        ${moop ? `<p style="margin:0;font-size:.87rem;color:#5C5C5C">Max out-of-pocket: <strong style="color:#212121">${this._esc(moop)}</strong></p>` : ""}
        <hr style="border:0;border-top:1px solid #EDEDED;margin:2px 0">
        ${benefits ? `<p style="margin:0;font-size:.87rem;color:#212121;flex:1;line-height:1.5">${this._esc(benefits)}</p>` : ""}
        ${pharmacy ? `<p style="margin:0;font-size:.8rem;color:#5C5C5C;font-style:italic">${this._esc(pharmacy)}</p>` : ""}
        ${href ? `<a href="${this._esc(href)}" style="margin-top:auto;padding-top:8px;color:#1A6ECF;text-decoration:underline;font-size:.87rem;font-weight:600">${this._esc(label)} →</a>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-medicare-plan-card")) {
  customElements.define("cms-medicare-plan-card", CmsMedicarePlanCard);
}
