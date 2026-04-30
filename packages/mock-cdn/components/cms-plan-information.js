class CmsPlanInformation extends HTMLElement {
  static observedAttributes = [
    "plan-type", "plan-name", "part-a-coverage-date",
    "part-b-coverage-date", "details-href", "details-label",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _render() {
    const planType = this.getAttribute("plan-type");
    const planName = this.getAttribute("plan-name");
    const partA = this.getAttribute("part-a-coverage-date");
    const partB = this.getAttribute("part-b-coverage-date");
    const href = this.getAttribute("details-href");
    const label = this.getAttribute("details-label") || "Coverage details";

    this.innerHTML = `
      <div style="border:1px solid #dfe1e2;border-radius:4px;padding:16px">
        ${planType ? `<p style="margin:0 0 4px;font-size:.87rem;color:#71767a">${this._esc(planType)}</p>` : ""}
        ${planName ? `<p style="margin:0 0 12px;font-weight:700;font-size:1rem;white-space:pre-line">${this._esc(planName)}</p>` : ""}
        <hr style="border:0;border-top:1px solid #dfe1e2;margin:12px 0">
        <p style="margin:0 0 8px;font-size:.87rem;color:#71767a">Coverage start dates</p>
        ${partA ? `<p style="margin:0 0 4px;font-size:.93rem">Part A: <strong>${this._esc(partA)}</strong></p>` : ""}
        ${partB ? `<p style="margin:0 0 12px;font-size:.93rem">Part B: <strong>${this._esc(partB)}</strong></p>` : ""}
        ${href ? `<a href="${this._esc(href)}" style="color:#005ea2;text-decoration:underline">${this._esc(label)}</a>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-plan-information")) {
  customElements.define("cms-plan-information", CmsPlanInformation);
}
