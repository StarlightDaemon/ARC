# ARC - Accessories Recommendation Catalog

> Comprehensive phone accessory guides for XDA Forums, featuring detailed BBCode-formatted posts for cases, screen protectors, chargers, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎯 Overview

ARC (Accessories Recommendation Catalog) is a website and content management system for creating and publishing detailed phone accessory guides on XDA Forums. The project provides:

- **Static Website**: Browse guides by brand and device with one-click BBCode copying
- **Research System**: Structured prompts for gathering accessory information via LLMs
- **BBCode Generation**: Automated conversion from research data to XDA-formatted posts
- **Multi-Device Support**: Covers Google, Samsung, OnePlus, Nothing, and Motorola devices

## 📋 Features

- ✅ Copy-to-clipboard BBCode for instant forum posting
- ✅ Organized by brand and device model
- ✅ Categorized accessories (Cases, Screen Protectors, Chargers, etc.)
- ✅ Device-specific requirements (S Pen access, Glyph visibility, etc.)
- ✅ Automated YAML-to-BBCode template processing

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/StarlightDaemon/ARC.git
cd ARC

# Install dependencies
npm install

# Serve locally (if using a dev server)
npx serve .
```

Visit `http://localhost:3000` to view the website locally.

## 📁 Project Structure

```
ARC/
├── index.html              # Main landing page
├── css/                    # Stylesheets
│   ├── style.css          # Main website styles
│   └── guide.css          # Guide page styles
├── js/                     # JavaScript
│   ├── main.js            # Main site logic
│   ├── guide.js           # Guide page functionality
│   └── yaml-guide.js      # YAML processing
├── google/                 # Google device pages
├── samsung/                # Samsung device pages
├── oneplus/                # OnePlus device pages
├── nothing/                # Nothing device pages
├── motorola/               # Motorola device pages
├── _data/                  # Research data & BBCode output
│   ├── TASK_LIST.md       # Project task tracking
│   ├── devices/           # Device data structures
│   ├── researched/        # Completed research files
│   └── [Brand]/           # Brand-specific data
│       └── [Device]/
│           ├── source/    # Source markdown files
│           └── output/    # Generated BBCode files
├── templates/              # Handlebars templates
├── scripts/                # Build/generation scripts
└── assets/                 # Images and media
```

## 🔄 Workflow

### 1. Research Phase

1. Navigate to `_data/[Brand]/[Device]/`
2. Use the research prompt template from `_data/research-prompt-template.md`
3. Run the prompt through an LLM (Gemini, ChatGPT, Perplexity)
4. Save results to `_data/researched/[Device].md`

### 2. BBCode Generation

The project uses Handlebars templates to convert research data into BBCode:

```bash
# Generate BBCode from YAML data
node scripts/generate-bbcode.js
```

Output files are saved to `_data/[Brand]/[Device]/output/`

### 3. Publishing

1. Browse to the device guide page on the website
2. Click "Copy BBCode" for each section
3. Create a new thread on XDA Forums
4. Paste each BBCode section as a reply
5. Update `_data/TASK_LIST.md` with the XDA link

## 📊 Current Status

| Brand | Devices | Published | In Progress |
|-------|---------|-----------|-------------|
| Google | 4 | 0 | 1 (Pixel 10 Pro XL ready) |
| Samsung | 3 | 1 (S24 Ultra) | 1 (S25 Ultra research done) |
| OnePlus | 2 | 0 | 2 (prompts ready) |
| Nothing | 2 | 0 | 2 (prompts ready) |
| Motorola | 1 | 0 | 1 (prompt ready) |

See [`_data/TASK_LIST.md`](_data/TASK_LIST.md) for detailed progress tracking.

## 🛠️ Development

### Adding a New Device

1. Create device directory: `_data/[Brand]/[Device Name]/`
2. Copy research prompt template
3. Conduct research and save to `_data/researched/`
4. Create source markdown files in `source/`
5. Run BBCode generation
6. Create device page in `[brand]/[device-name].html`

### Template System

The project uses Handlebars for templating:

- `templates/post-template.hbs` - BBCode post template
- Device data stored in YAML format
- Automated generation via `scripts/generate-bbcode.js`

## 📝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-device`)
3. Commit your changes (`git commit -m 'Add Pixel 11 guide'`)
4. Push to the branch (`git push origin feature/new-device`)
5. Open a Pull Request

### Guidelines

- Follow existing file structure conventions
- Include research sources where applicable
- Test BBCode output on XDA Forums sandbox
- Update `TASK_LIST.md` with progress

## 🔗 Links

- **Website**: [GitHub Pages](https://starlightdaemon.github.io/ARC/)
- **XDA Profile**: [@graycatgrayhat](https://xdaforums.com/m/graycatgrayhat.12893039/)
- **Published Guides**: See [Task List](_data/TASK_LIST.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- XDA Forums community for feedback and support
- LLM providers (Gemini, ChatGPT, Perplexity) for research assistance
- Accessory manufacturers and retailers for product information

---

**Maintained by [@graycatgrayhat](https://github.com/StarlightDaemon)** • Last updated: December 2025
