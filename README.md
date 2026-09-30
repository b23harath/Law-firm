# Law Firm Website — Sample Legal Advocacy Platform

A high-end, responsive law firm website featuring modern editorial design aesthetics, scroll animations, an interactive consultation booking calendar, practice area explorer modals, and dual theme support (Editorial Cream & Midnight Velvet Chambers).

---

## 🏛️ Features

- **Hero Section**: Editorial design with centerpiece Lady Justice marble/bronze statue, watermark typography, credibility markers, and animated stats strip.
- **Meet Your Attorney**: Personal story, senior-level strategy manifesto, core commitments, and professional credentials dossier modal.
- **Practice Areas**: 4 core practice cards (Commercial & Business Advisory, Dispute Resolution & Civil Litigation, Property & Real Estate Law, Personal Counsel & Strategic Advisory) with interactive case scope modals.
- **Track Record & Trust Indicators**: Animated metric counters, client highlight testimonials, and institutional bar council recognitions.
- **3-Step Transparent Process**: Step-by-step engagement timeline.
- **Interactive Appointment Booking & Chambers**:
  - Live interactive date picker and time slot selector.
  - Consultation format selector (Chambers Meeting, Encrypted Video, Direct Phone).
  - Booking confirmation modal with dynamic reference code (`LAW-2026-XXXX`) and **.ics calendar invite download**.
  - Direct Chambers contact card and regulatory disclaimer.
- **Dual Luxury Themes**:
  - 📜 **Editorial Cream & Gold** (Default)
  - 🌙 **Midnight Velvet Chambers** (Dark Mode)
- **Scroll Animations & Progress**:
  - IntersectionObserver reveal animations (`fade-up`, `scale`, numeric counter animations).
  - Real-time gold scroll progress bar at the top of the viewport.

---

## 📁 Project Structure

```
├── index.html                  # Semantic HTML5 markup & modals
├── README.md                   # Project documentation
└── assets/
    ├── css/
    │   └── styles.css          # Design system, CSS variables & animations
    ├── js/
    │   └── main.js             # Scroll animations, calendar & modal engine
    └── images/
        ├── lady_justice.jpg    # Centerpiece Lady Justice statue
        ├── attorney_portrait.jpg # Senior counsel portrait
        ├── courtroom_chambers.jpg # Chambers consultation hall
        ├── client_avatar.jpg   # Verified client testimonial headshot
        └── legal_brief.jpg     # Legal brief documents & fountain pen
```

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or serve locally using Python:

```bash
# Start a local web server
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📜 License
MIT License.
