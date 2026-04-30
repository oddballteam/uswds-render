const STATUS_LABEL = { scheduled: "Scheduled", completed: "Completed", cancelled: "Cancelled" };
const TYPE_LABEL = { in_person: "In person", telehealth: "Video visit" };

class CmsAppointmentCard extends HTMLElement {
  static observedAttributes = [
    "provider-name", "facility", "appointment-date", "appointment-time",
    "appointment-type", "department", "status", "notes",
  ];

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _esc(s) {
    return (s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _render() {
    const provider = this.getAttribute("provider-name");
    const facility = this.getAttribute("facility");
    const date = this.getAttribute("appointment-date");
    const time = this.getAttribute("appointment-time");
    const type = this.getAttribute("appointment-type");
    const dept = this.getAttribute("department");
    const status = this.getAttribute("status");
    const notes = this.getAttribute("notes");

    const statusLabel = STATUS_LABEL[status] ?? status ?? "";
    const typeLabel = TYPE_LABEL[type] ?? "";
    const dateTime = [date, time].filter(Boolean).join(" · ");

    this.innerHTML = `
      <div style="border:1px solid #dfe1e2;border-radius:4px;padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          ${provider ? `<p style="margin:0;font-weight:700;font-size:1rem">${this._esc(provider)}</p>` : ""}
          ${statusLabel ? `<span style="background:#e7f2f5;color:#1b4f72;font-size:.78rem;padding:2px 8px;border-radius:2px;white-space:nowrap">${this._esc(statusLabel)}</span>` : ""}
        </div>
        ${facility ? `<p style="margin:0 0 2px;font-size:.93rem">${this._esc(facility)}</p>` : ""}
        ${dept ? `<p style="margin:0 0 8px;font-size:.87rem;color:#71767a">${this._esc(dept)}</p>` : ""}
        <hr style="border:0;border-top:1px solid #dfe1e2;margin:8px 0">
        ${dateTime ? `<p style="margin:0;font-weight:700;font-size:.93rem">${this._esc(dateTime)}</p>` : ""}
        ${typeLabel ? `<p style="margin:2px 0 0;font-size:.87rem;color:#71767a">${this._esc(typeLabel)}</p>` : ""}
        ${notes ? `<p style="margin:8px 0 0;font-size:.87rem;color:#71767a">${this._esc(notes)}</p>` : ""}
      </div>`;
  }
}

if (!customElements.get("cms-appointment-card")) {
  customElements.define("cms-appointment-card", CmsAppointmentCard);
}
