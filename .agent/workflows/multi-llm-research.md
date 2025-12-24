---
description: Multi-LLM accessory research workflow (Gemini + Sonar)
---

# Multi-LLM Accessory Research Workflow

**Optimized for maximum product discovery with minimal effort**

---

## Quick Reference

**Optimal Run Count:**
- **Gemini 3.0 Pro (Thinking Mode):** 4 runs in same chat
- **Sonar (Perplexity):** 3 runs in same chat
- **Total:** 7 LLM queries per device

**Expected Output:**
- 30-40+ unique products per flagship device
- 15-20 products for niche/newer devices
- Better retailer link coverage than single-LLM approach

---

## File Structure for Each Device

For each new device, create this exact structure:

```
data/researched/[Device-Name]/
├── [Device-Name]-Prompt.txt           # The VERIFIED prompt
├── Gemini-4Run-Export.md              # Full Gemini chat (4 runs)
└── Sonar-3Run-Export.md               # Full Sonar chat (3 runs)
```

**Example for Samsung Galaxy S25 Ultra:**
```
data/researched/Samsung-S25-Ultra/
├── Galaxy-S25-Ultra-VERIFIED.txt      # Prompt used
├── Gemini-4Run-Export.md              # Gemini results (Runs 1-4)
└── Sonar-3Run-Export.md               # Sonar results (Runs 1-3)
```

---

## Step-by-Step Workflow

### **Step 1: Create Prompt File**

1. Copy template from `data/research-prompts/TEMPLATE-VERIFIED.txt`
2. Customize for device:
   - Update device name everywhere
   - Update release date
   - Add critical features (S Pen, foldable, Qi2, etc.)
   - Adjust category priorities
3. Save as: `data/research-prompts/[Brand]/[Device]-VERIFIED.txt`

### **Step 2: Run Gemini 3.0 Pro (4 Runs)**

// turbo
1. Open Perplexity Pro → Switch to **Gemini 3.0 Pro (Thinking Mode)**
2. Paste the prompt
3. Wait for response
4. **In the same chat**, paste prompt again (Run 2)
5. **In the same chat**, paste prompt again (Run 3)
6. **In the same chat**, paste prompt again (Run 4)
7. Export entire conversation as Markdown
8. Save as: `data/researched/[Device-Name]/Gemini-4Run-Export.md`

**Why 4 runs:**
- Run 1: Baseline (8-12 products)
- Run 2: Variations (10-15 products)
- Run 3: More variety (8-12 products)
- Run 4: **Peak discovery** (12-16 products, often finds Amazon ASINs)
- Runs 5+: Diminishing returns

### **Step 3: Run Sonar (3 Runs)**

// turbo
1. Open Perplexity Pro → Switch to **Sonar** model
2. Paste the **same prompt**
3. Wait for response
4. **In the same chat**, paste prompt again (Run 2)
5. **In the same chat**, paste prompt again (Run 3)
6. Export entire conversation as Markdown
7. Save as: `data/researched/[Device-Name]/Sonar-3Run-Export.md`

**Why 3 runs:**
- Run 1: Massive haul (15-25 products, excellent retailer links)
- Run 2: Different variants (10-20 products)
- Run 3: **Last squeeze** (8-15 products, may start repeating)
- Run 4+: Either collapses (5 products) or refuses

### **Step 4: Parse \& Merge Results**

// turbo
1. Use `parse-llm-exports.py` (to be created) to extract products
2. Deduplicate by brand + model name
3. Merge into: `data/researched/[Device-Name].json`
4. Run: `python3 build/scripts/build-guide.py data/researched/[Device-Name].json`

---

## LLM Comparison Summary

| Metric | Gemini 3.0 Pro | Sonar |
|--------|----------------|-------|
| Avg products/run | 11-13 | 15-20 |
| Total unique products | 20-25 | 25-35 |
| **Amazon ASINs** | ✅ **Excellent** | ❌ Rare |
| Official site links | Good | **Excellent** |
| Retailer diversity | Low | **High** (Target, Walmart, Best Buy) |
| MSRP accuracy | 100% | 95% |
| Budget options | Limited | **Excellent** ($15-25 tier) |
| Run-to-run variety | **High** | Medium |
| Plateau point | Run 6-7 | **Run 3-4** |

**Complementary strengths:**
- **Gemini:** Breadth, variety, Amazon links, consistent MSRP
- **Sonar:** Depth, retailer presence, official exclusives, budget tier

---

## Automation Potential

**Current effort:** ~15-20 min per device (manual paste + export)
**Automated effort:** ~3-5 min per device

**Automation steps:**
1. Use Perplexity API (if available) to run 4 Gemini + 3 Sonar queries
2. Parse markdown responses → extract products
3. Deduplicate + merge → JSON
4. Auto-generate BBCode + HTML guides
5. **Estimated time savings:** 75% reduction

---

## When to Adjust Run Count

**Increase Gemini to 5-6 runs if:**
- Flagship device with heavy ecosystem (Samsung, Apple)
- Device has unique features (S Pen, foldable, etc.)
- Initial runs show high variety (12+ products each)

**Stop Sonar at 2 runs if:**
- Run 2 shows >70% duplicates of Run 1
- Device is very new (< 3 months old)
- Niche brand with limited retail presence

**Stop Gemini at 3 runs if:**
- Run 3 shows >80% duplicates of Runs 1-2
- Device is discontinued or very old
- Budget/niche device with limited accessory market

---

## Quality Checks

Before merging data, verify:

✅ All S Pen references are accurate (cutout vs holder vs interference)
✅ Magnetic cases clearly state Qi2/MagSafe compatibility
✅ Amazon links use `/dp/[ASIN]` format (not search URLs)
✅ MSRP is from official/retailer page (not reseller markup)
✅ Drop ratings are manufacturer claims (not guessed)
✅ Device model is exact match (not S25+ when researching S25 Ultra)

---

## Troubleshooting

**Gemini stops at Run 2-3:**
- Try switching to fresh chat and starting over
- Model may have hit context limit (rare)

**Sonar refuses to provide data:**
- This happened at Run 6-7 for S25 Ultra
- Stop immediately, use data from Runs 1-3

**Both LLMs produce <5 products:**
- Device may be too new (< 1 month)
- Check if device name is spelled correctly
- Try adding "accessories" or "cases" to prompt

**Many "Not available" URLs:**
- Normal for very new devices
- Amazon availability lags 2-4 weeks after launch
- Focus on official manufacturer links

---

## Next Steps After Research

1. ✅ Merge data into master JSON
2. ✅ Build BBCode + HTML guides
3. ✅ Update `Flagship-Phones-List.md` status
4. ⏭️ Move to next priority device
5. 📊 Track research metrics (time, products found, plateau point)

---

**Last Updated:** 2025-12-23
**Workflow Version:** 1.0 (Gemini 4 + Sonar 3)
