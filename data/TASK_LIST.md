# Accessories Guides - Master Reference

## Quick Status Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Complete |
| 🔄 | In Progress |
| 📝 | Prompt Ready (needs research) |
| ⏳ | Not Started |

---

## All Phones Status

### Google
| Device | Prompt | Research | BBCode | Published | XDA Link |
|--------|--------|----------|--------|-----------|----------|
| **Pixel 10 Pro XL** | ✅ | ✅ | ✅ | ⏳ | - |
| Pixel 10 Pro Fold | ✅ | 📝 | ⏳ | ⏳ | - |
| Pixel 10 | ✅ | 📝 | ⏳ | ⏳ | - |
| Pixel 9 Pro XL | ✅ | 📝 | ⏳ | ⏳ | - |

### Samsung
| Device | Prompt | Research | BBCode | Published | XDA Link |
|--------|--------|----------|--------|-----------|----------|
| Galaxy S25 Ultra | ✅ | 📝 | ⏳ | ⏳ | - |
| Galaxy Z Fold 6 | ✅ | 📝 | ⏳ | ⏳ | - |
| Galaxy S24 Ultra | - | ✅ | ✅ | ✅ | [Link](https://xdaforums.com/t/accessories-guide.4652503/) |

### OnePlus
| Device | Prompt | Research | BBCode | Published | XDA Link |
|--------|--------|----------|--------|-----------|----------|
| OnePlus 13 | ✅ | 📝 | ⏳ | ⏳ | - |
| OnePlus 12 | ✅ | 📝 | ⏳ | ⏳ | - |

### Nothing
| Device | Prompt | Research | BBCode | Published | XDA Link |
|--------|--------|----------|--------|-----------|----------|
| Phone 3 | ✅ | 📝 | ⏳ | ⏳ | - |
| Phone 2a | ✅ | 📝 | ⏳ | ⏳ | - |

### Motorola
| Device | Prompt | Research | BBCode | Published | XDA Link |
|--------|--------|----------|--------|-----------|----------|
| Edge 50 Ultra | ✅ | 📝 | ⏳ | ⏳ | - |

---

## Workflow Steps

### Step 1: Research
1. Open prompt file: `research-prompts/[Brand]/[Device].txt`
2. Copy entire contents
3. Paste to LLM (Gemini, ChatGPT, Perplexity)
4. Paste results back into same file (overwrite prompt)

### Step 2: BBCode Conversion
1. Notify agent when research is complete
2. Agent extracts data and creates BBCode files
3. Files saved to: `[Brand]/[Device]/output/`

### Step 3: Publish
1. Create new thread on XDA Forums
2. Copy each `post-XX-*.bbcode` file as a reply
3. Update XDA Link in this reference

---

## Folder Structure
```
Accessories Guides/
├── TASK_LIST.md              # This reference file
├── research-prompts/         # Prompts organized by brand
│   ├── Google/
│   │   ├── Pixel 10.txt
│   │   ├── Pixel 10 Pro Fold.txt
│   │   ├── Pixel 10 Pro XL.txt
│   │   └── Pixel 9 Pro XL.txt
│   ├── Samsung/
│   │   ├── Galaxy S25 Ultra.txt
│   │   └── Galaxy Z Fold 6.txt
│   ├── OnePlus/
│   │   ├── OnePlus 13.txt
│   │   └── OnePlus 12.txt
│   ├── Nothing/
│   │   ├── Phone 3.txt
│   │   └── Phone 2a.txt
│   └── Motorola/
│       └── Edge 50 Ultra.txt
├── Google/                   # Completed guides
│   ├── Pixel 10 Pro XL/
│   │   └── output/*.bbcode
│   ├── Pixel 10 Pro Fold/
│   └── Pixel 10/
├── Samsung/
├── OnePlus/
├── Nothing/
└── Motorola/
```

---

## Device-Specific Notes

| Device | Special Requirements |
|--------|---------------------|
| Pixel 10 Pro XL | Pixelsnap/Qi2 25W wireless |
| Pixel 10 Pro Fold | Inner screen = FILM ONLY, hinge protection |
| Galaxy S25 Ultra | S Pen access required |
| Galaxy Z Fold 6 | Inner screen = FILM ONLY, S Pen Fold compatible |
| OnePlus 13/12 | Alert Slider cutout, SUPERVOOC/AIRVOOC |
| Nothing Phone 3/2a | Clear cases for Glyph visibility |
| Moto Edge 50 Ultra | 125W TurboPower |

---

Last Updated: December 21, 2025
