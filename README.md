# ARC - Accessories Recommendation Catalog

A catalog of phone cases for current flagship devices. Browse by device and protection level to find cases that fit your needs.

---

## Supported Devices

### Apple iPhone (9 devices)
- iPhone 16, 16 Plus, 16 Pro, 16 Pro Max
- iPhone 15, 15 Plus, 15 Pro, 15 Pro Max
- iPhone 16 (base model additional listing)

### Samsung Galaxy (10 devices)
- Galaxy S24, S24+, S24 Ultra
- Galaxy S25, S25+, S25 Ultra
- Galaxy Z Fold 6, Z Fold 7
- Galaxy Z Flip 6, Z Flip 7

### Google Pixel (8 devices)
- Pixel 9, 9 Pro, 9 Pro XL, 9 Pro Fold
- Pixel 10, 10 Pro, 10 Pro XL, 10 Pro Fold

### OnePlus (5 devices)
- 12, 12R, 13, 13R, Open

### Nothing (3 devices)
- Phone 2a, 2a Plus, Phone 3

### Motorola (3 devices)
- Edge 50 Pro, Edge 50 Ultra, Razr 50 Ultra

### Xiaomi (3 devices)
- 14 Ultra, 15, 15 Pro

**Total: 41 devices**

---

## Case Categories

Each device has cases organized into four protection levels:

- **🏗️ Hardened** - Maximum protection with military-grade certifications (MIL-STD-810)
- **🛡️ Rugged** - Heavy-duty protection with reinforced corners and raised edges  
- **📱 Basic** - Slim everyday protection that fits easily in pockets
- **🔲 Clear** - Transparent designs that showcase the phone's original look

---

## Using This Catalog

### Browse Locally
```bash
git clone https://github.com/StarlightDaemon/ARC.git
cd ARC
python3 -m http.server 8080
# Open http://localhost:8080
```

### View Online
Visit: https://starlightdaemon.github.io/ARC/

### Features
- **Official Links Only**: Strict policy of using direct manufacturer product pages. No Amazon or affiliate links.
- **Multi-Device Support**: Coverage for major flagships from Apple, Samsung, Google, and more.
- **Modern UI**: Clean, accessible light theme using the StarlightDaemon Design System.
- **Fast Performance**: Uses system fonts and lightweight vanilla CSS/JS.
- **Detailed Specifications**: Compatibility, material info, and drop protection details.

> [!NOTE]
> **Product Links Status** (Updated Jan 2026)  
> We have achieved **70%+ URL quality** across 1,600+ products, targeting 90%+ in the next update:
> - ✅ **Official product pages** (~70%) - Direct deep links to specific cases
> - ⚠️ **Brand collection pages** (~28%) - Fallback to phone-specific collections
> - ❌ **Broken/Empty** (<1%) - Actively being researched
> 
> All Amazon links have been permanently removed in favor of manufacturer authenticity.

---



## Project Structure

```
ARC/
├── index.html          # Homepage with device cards
├── phones/             # Individual device pages (41 total)
├── data/               # Case information (JSON)
│   ├── config.json     # Category definitions
│   └── {brand}/{phone}/cases/
├── public/
│   ├── css/            # Global styles & components
│   └── js/             # Frontend logic & search
└── scripts/            # Python automation for URL verification
```

---

## Technical Details

**Frontend:** Pure HTML/CSS/JavaScript (no framework dependencies)  
**Data Format:** JSON files for easy updates and portability  
**Hosting:** Works on any static host (GitHub Pages, Netlify, Vercel, etc.)  
**Automation:** Custom Python tooling for URL health checks and API-based data enrichment.

---

## About Purchase Links

**Policy Update (Jan 2026):**
This catalog links **exclusively** to official manufacturer websites (e.g., spigen.com, otterbox.com). 
- **No Amazon links**
- **No affiliate tracking**
- **No third-party retailers**

This ensures users get the most accurate product information and support directly from the source.

---

## Contributing

This is a personal catalog project. Feel free to fork and adapt for your own use.

---

## License

MIT License - See LICENSE file for details

---

**Repository:** https://github.com/StarlightDaemon/ARC  
**Maintained by:** [StarlightDaemon](https://github.com/StarlightDaemon)
