const STEPS = [
  "Claim Received",
  "Initial Review",
  "Evidence Gathering",
  "Rating Decision",
  "Notification Sent",
];

class CmsClaimStatusTimeline extends HTMLElement {
  static observedAttributes = [
    "claim-number", "claim-type", "filed-date",
    "current-step-number", "estimated-decision-date",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _render() {
    const claimType = this.getAttribute("claim-type") || "Claim Status";
    const claimNumber = this.getAttribute("claim-number");
    const filedDate = this.getAttribute("filed-date");
    const activeStep = parseInt(this.getAttribute("current-step-number") ?? "1", 10);
    const estDate = this.getAttribute("estimated-decision-date");

    const stepsHtml = STEPS.map((step, i) => {
      const n = i + 1;
      const isCurrent = n === activeStep;
      const isDone = n < activeStep;
      const color = isCurrent ? "#1b4f72" : isDone ? "#71767a" : "#c9c9c9";
      const weight = isCurrent ? "700" : "400";
      const dot = isCurrent ? "●" : isDone ? "✓" : "○";
      return `<li style="display:flex;gap:8px;align-items:baseline;margin-bottom:8px">
        <span style="color:${color};min-width:16px">${dot}</span>
        <span style="color:${color};font-weight:${weight};font-size:.93rem">${this._esc(step)}</span>
      </li>`;
    }).join("");

    this.innerHTML = `
      <div style="border:1px solid #dfe1e2;border-radius:4px;padding:16px">
        <p style="margin:0;font-weight:700;font-size:1rem">${this._esc(claimType)}</p>
        ${claimNumber ? `<p style="margin:4px 0 0;font-size:.87rem;color:#71767a">Claim #${this._esc(claimNumber)}</p>` : ""}
        ${filedDate ? `<p style="margin:2px 0 12px;font-size:.87rem">Filed: ${this._esc(filedDate)}</p>` : ""}
        <ol style="list-style:none;margin:0;padding:0">${stepsHtml}</ol>
        ${estDate ? `<p style="margin:12px 0 0;font-size:.87rem;color:#71767a">Est. decision: ${this._esc(estDate)}</p>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-claim-status-timeline")) {
  customElements.define("cms-claim-status-timeline", CmsClaimStatusTimeline);
}
