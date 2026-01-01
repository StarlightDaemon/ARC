# ARC - Accessories Recommendation Catalog

> Comprehensive phone case catalog for 41 flagship phones with verified Amazon links

A professionally formatted catalog featuring 1,553 case products across 7 brands. Browse by device, filter by protection level, and find the perfect case.

---

## ⚠️ Repository Notice

**This repository contains:**
- ✅ **Website Files** - Production-ready phone case catalog (public use)
- ⚠️ **Automation removed** - Scripts and tooling excluded from public repo

**What's here:** The live website for browsing phone cases  
**What's not:** The internal automation tools used to build it  

This is a **catalog website**, not a development tool.

---

## 🎯 Live Catalog

### Phone Coverage (41 Devices)

**Apple (9 phones)**  
iPhone 16, 16 Plus, 16 Pro, 16 Pro Max  
iPhone 15, 15 Plus, 15 Pro, 15 Pro Max

**Samsung (10 phones)**  
Galaxy S24, S24+, S24 Ultra  
Galaxy S25, S25+, S25 Ultra  
Galaxy Z Fold 6, Z Fold 7  
Galaxy Z Flip 6, Z Flip 7

**Google (8 phones)**  
Pixel 9, 9 Pro, 9 Pro XL, 9 Pro Fold  
Pixel 10, 10 Pro, 10 Pro XL, 10 Pro Fold

**OnePlus (5 phones)** | **Nothing (3 phones)** | **Motorola (3 phones)** | **Xiaomi (3 phones)**

### Case Categories

- 🏗️ **Hardened** - Military-grade protection (MIL-STD-810)
- 🛡️ **Rugged** - Heavy-duty with extra features
- 📱 **Basic** - Slim everyday protection
- 🔲 **Clear** - Transparent minimal design

### Data Quality

- **1,553 products** with verified Amazon URLs
- Professional formatting (IP68, MIL-STD-810G, TPU, etc.)
- Detailed materials and features
- Bullet-point specifications

---

## 🚀 View the Catalog

```bash
# Clone and view locally
git clone https://github.com/StarlightDaemon/ARC.git
cd ARC
python3 -m http.server 8080

# Open http://localhost:8080
```

**Or deploy to:**
- GitHub Pages
- Netlify
- Vercel
- Any static host

---

## 📁 Structure

```
ARC/
├── index.html           # Homepage (device catalog)
├── phones/              # Phone detail pages (41 pages)
│   ├── apple/
│   ├── samsung/
│   ├── google/
│   └── ...
├── data/                # Product data (JSON)
│   ├── config.json      # Category definitions
│   ├── index.json       # Auto-generated index
│   └── {brand}/{phone}/cases/
│       ├── hardened.json
│       ├── rugged.json
│       ├── basic.json
│       └── clear.json
└── public/
    ├── css/             # Stylesheets
    └── js/              # Frontend JavaScript
```

---

## 🎨 Features

**Dynamic Loading**
- Config-driven (no hardcoded categories)
- Dynamic phone names in titles
- Category-based filtering
- Responsive design

**Professional Formatting**
- Features as bullet points with checkmarks
- Proper technical term capitalization
- Material labels
- Clean product cards

**Zero Dependencies**
- Pure HTML/CSS/JavaScript
- Fast loading
- Works offline

---

## 📊 Statistics

- **7 brands** covered
- **41 phones** with complete data
- **1,553 products** validated
- **0 critical errors** in data
- **155 data files** (4 categories × ~40 phones)

---

## 📝 License

MIT License - Fork and use as you wish

---

## 🔗 Links

- **Repository:** https://github.com/StarlightDaemon/ARC  
- **Maintained by:** [StarlightDaemon](https://github.com/StarlightDaemon)

---

## ⚠️ Disclaimer

This catalog provides research and Amazon links for convenience. Always verify product compatibility with your specific device before purchasing. No affiliate relationships exist.
