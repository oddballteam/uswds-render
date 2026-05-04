const TYPE_LABEL = {
  health: "VA Health",
  benefits: "VA Benefits",
  cemetery: "National Cemetery",
  vet_center: "Vet Center",
};

class CmsFacilityCard extends HTMLElement {
  static observedAttributes = [
    "facility-name", "facility-type", "address",
    "phone", "distance", "hours", "wait-time",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _render() {
    const name = this.getAttribute("facility-name");
    const type = this.getAttribute("facility-type");
    const address = this.getAttribute("address");
    const phone = this.getAttribute("phone");
    const distance = this.getAttribute("distance");
    const hours = this.getAttribute("hours");
    const waitTime = this.getAttribute("wait-time");

    const typeLabel = TYPE_LABEL[type] ?? type ?? "";

    this.innerHTML = `
      <div style="border:1px solid #dfe1e2;border-radius:4px;padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          ${name ? `<p style="margin:0;font-weight:700;font-size:1rem">${this._esc(name)}</p>` : ""}
          ${distance ? `<span style="font-size:.87rem;color:#71767a;white-space:nowrap;margin-left:8px">${this._esc(distance)}</span>` : ""}
        </div>
        ${typeLabel ? `<span style="background:#e7f2f5;color:#1b4f72;font-size:.78rem;padding:2px 8px;border-radius:2px;display:inline-block;margin-bottom:8px">${this._esc(typeLabel)}</span>` : ""}
        <hr style="border:0;border-top:1px solid #dfe1e2;margin:8px 0">
        ${address ? `<p style="margin:0 0 4px;font-size:.87rem">${this._esc(address)}</p>` : ""}
        ${phone ? `<p style="margin:0 0 4px;font-size:.87rem"><a href="tel:${this._esc(phone)}" style="color:#005ea2;text-decoration:underline">${this._esc(phone)}</a></p>` : ""}
        ${hours ? `<p style="margin:4px 0 0;font-size:.87rem;color:#71767a">${this._esc(hours)}</p>` : ""}
        ${waitTime ? `<p style="margin:6px 0 0;font-size:.87rem;color:#71767a">Wait time: ${this._esc(waitTime)}</p>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-facility-card")) {
  customElements.define("cms-facility-card", CmsFacilityCard);
}
