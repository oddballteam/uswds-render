class CmsMedicareFactPanel extends HTMLElement {
  static observedAttributes = ["heading", "facts"];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _parseFacts(raw) {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return raw.split("|").map(s => s.trim()).filter(Boolean);
  }

  _render() {
    const heading = this.getAttribute("heading");
    const facts   = this._parseFacts(this.getAttribute("facts"));

    const factsHtml = facts.length
      ? `<ul style="margin:12px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0">
          ${facts.map((f, i) => `
            <li style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;${i < facts.length - 1 ? "border-bottom:1px solid #E8EFF8;" : ""}">
              <span style="flex-shrink:0;width:20px;height:20px;background:#003570;color:white;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;margin-top:1px">${i + 1}</span>
              <span style="font-size:.9rem;color:#212121;line-height:1.5">${this._esc(f)}</span>
            </li>`).join("")}
         </ul>`
      : "";

    this.innerHTML = `
      <div style="border:1px solid #BEC0C2;border-radius:4px;border-left:4px solid #00A68A;padding:16px;font-family:system-ui,-apple-system,sans-serif;background:#F9FDFC">
        <p style="margin:0 0 2px;font-size:.75rem;font-weight:700;color:#00A68A;text-transform:uppercase;letter-spacing:.06em">Key Points</p>
        ${heading ? `<p style="margin:0;font-size:1rem;font-weight:700;color:#003570">${this._esc(heading)}</p>` : ""}
        ${factsHtml}
      </div>`;
  }
}

if (!customElements.get("cms-medicare-fact-panel")) {
  customElements.define("cms-medicare-fact-panel", CmsMedicareFactPanel);
}
