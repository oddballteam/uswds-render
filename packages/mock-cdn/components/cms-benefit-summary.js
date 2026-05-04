class CmsBenefitSummary extends HTMLElement {
  static observedAttributes = [
    "program", "total-entitlement", "used", "remaining",
    "expiration-date", "school", "enrollment-status",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _render() {
    const program = this.getAttribute("program");
    const total = this.getAttribute("total-entitlement");
    const used = this.getAttribute("used");
    const remaining = this.getAttribute("remaining");
    const expDate = this.getAttribute("expiration-date");
    const school = this.getAttribute("school");
    const enrollment = this.getAttribute("enrollment-status");

    const row = (label, value) =>
      `<div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:.87rem;color:#71767a">${label}</span>
        <span style="font-size:.87rem;font-weight:700">${this._esc(value)}</span>
      </div>`;

    this.innerHTML = `
      <div style="border:1px solid #dfe1e2;border-radius:4px;padding:16px">
        ${program ? `<p style="margin:0 0 12px;font-weight:700;font-size:1rem">${this._esc(program)}</p>` : ""}
        <hr style="border:0;border-top:1px solid #dfe1e2;margin:0 0 12px">
        ${total ? row("Total entitlement", total) : ""}
        ${used ? row("Used", used) : ""}
        ${remaining ? row("Remaining", remaining) : ""}
        ${expDate ? `<p style="margin:8px 0 0;font-size:.87rem;color:#71767a">Expires: ${this._esc(expDate)}</p>` : ""}
        ${school || enrollment ? `<hr style="border:0;border-top:1px solid #dfe1e2;margin:12px 0">` : ""}
        ${school ? `<p style="margin:0 0 2px;font-size:.93rem;font-weight:700">${this._esc(school)}</p>` : ""}
        ${enrollment ? `<p style="margin:0;font-size:.87rem;color:#71767a">${this._esc(enrollment)}</p>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-benefit-summary")) {
  customElements.define("cms-benefit-summary", CmsBenefitSummary);
}
