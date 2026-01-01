# Screen Protector Categorization System

## Category Taxonomy

### Main Types (Material & Protection)

#### 1. **Tempered Glass** 
- **Material:** 9H hardness tempered glass
- **Protection:** Scratch/impact resistant, shatter-proof
- **Thickness:** 0.25mm - 0.4mm
- **Clarity:** Crystal clear
- **Brands:** Spigen GlasTR, amFilm, ESR, Whitestone Dome
- **Price Range:** $8-50
- **Use Case:** Best overall protection and feel

#### 2. **Film** (TPU/Hydrogel)
- **Material:** Thermoplastic polyurethane or hydrogel
- **Protection:** Scratch resistant, self-healing
- **Thickness:** 0.1mm - 0.2mm (ultra-thin)
- **Clarity:** High clarity, flexible
- **Brands:** IQ Shield, Skinomi, ArmorSuit
- **Price Range:** $5-20
- **Use Case:** Case-friendly, edge-to-edge coverage

#### 3. **Privacy**
- **Material:** Tempered glass or film with privacy filter
- **Protection:** Scratch resistant + privacy (28-30° viewing angle)
- **Clarity:** Slight dimming, blackout from sides
- **Brands:** ZAGG InvisibleShield Privacy, Belkin
- **Price Range:** $15-40
- **Use Case:** Public use, confidentiality

#### 4. **Anti-Glare/Matte**
- **Material:** Tempered glass or film with matte coating
- **Protection:** Scratch resistant + glare reduction
- **Clarity:** Matte finish, reduced reflections
- **Brands:** amFilm Matte, Tech Armor Matte
- **Price Range:** $8-25
- **Use Case:** Outdoor use, reduce fingerprints

### Sub-Types (Features)

- **Full Coverage:** Edge-to-edge, covers entire front including curves
- **Easy Install:** Alignment tool/tray included
- **Self-Healing:** TPU film that repairs minor scratches
- **Anti-Fingerprint:** Oleophobic coating
- **Blue Light Filter:** Reduces eye strain
- **Camera Lens Protector:** Separate lens protection included

## Search Criteria by Category

### Tempered Glass
**Keywords:** "tempered glass screen protector", "9H hardness", "GlasTR", "shatter proof"
**Brands:** Spigen, amFilm, ESR, Whitestone Dome, ZAGG Glass Elite
**Features:** Installation kit, case-friendly, ultra-clear

### Film (TPU/Hydrogel)
**Keywords:** "TPU film", "hydrogel protector", "self-healing film", "wet install"
**Brands:** IQ Shield, Skinomi, ArmorSuit, MaxShield
**Features:** Edge-to-edge, case-compatible, self-healing

### Privacy
**Keywords:** "privacy screen protector", "anti-spy", "viewing angle filter"
**Brands:** ZAGG InvisibleShield Privacy, Belkin ScreenForce Privacy, 3M
**Features:** 2-way/4-way privacy, tempered glass or film

### Anti-Glare/Matte
**Keywords:** "matte screen protector", "anti-glare", "anti-reflective"
**Brands:** Tech Armor Matte, amFilm Matte, Spigen NeoFlex
**Features:** Reduced glare, anti-fingerprint, smooth touch

## Data Structure

```json
{
  "category": "tempered-glass",
  "count": 5,
  "products": [
    {
      "product_brand": "Spigen",
      "product_model": "GlasTR EZ Fit",
      "price": "$12.99",
      "materials": "9H tempered glass, oleophobic coating",
      "features": "Easy installation tray, case-friendly, 2-pack",
      "compatibility": "iPhone 16 Pro Max",
      "url": "https://amazon.com/..."
    }
  ]
}
```

## File Path Structure

```
data/
└── {brand}/{series}/{variant}/
    ├── cases/           # Already implemented
    └── screen-protectors/
        ├── tempered-glass.json
        ├── film.json
        ├── privacy.json
        └── anti-glare.json
```

## N8N Workflow Design

### Workflow 1: ARC Screen Protectors - Tempered Glass
**Webhook:** `/webhook/arc-screen-tempered`
**Prompt Focus:**
- 9H hardness tempered glass
- Installation kits/alignment tools
- Case-friendly designs
- Top brands: Spigen GlasTR, amFilm, ESR, Whitestone

### Workflow 2: ARC Screen Protectors - Film
**Webhook:** `/webhook/arc-screen-film`
**Prompt Focus:**
- TPU/hydrogel self-healing films
- Edge-to-edge coverage
- Wet application
- Top brands: IQ Shield, Skinomi, ArmorSuit

### Workflow 3: ARC Screen Protectors - Privacy
**Webhook:** `/webhook/arc-screen-privacy`
**Prompt Focus:**
- Privacy filters (2-way/4-way)
- Tempered glass or film options
- Viewing angle specifications
- Top brands: ZAGG Privacy, Belkin ScreenForce, 3M

### Workflow 4: ARC Screen Protectors - Anti-Glare
**Webhook:** `/webhook/arc-screen-antiglare`
**Prompt Focus:**
- Matte finish protectors
- Anti-reflective coating
- Reduced fingerprints
- Top brands: Tech Armor, amFilm Matte

## Implementation Priority

1. **Phase 1:** Create 4 n8n workflows (tempered/film/privacy/anti-glare)
2. **Phase 2:** Test workflows with iPhone 16 Pro Max
3. **Phase 3:** Create batch research script
4. **Phase 4:** Run overnight batch for all 45 phones
5. **Phase 5:** Update site to display screen protectors

## Expected Output

**Per phone:** 15-20 screen protectors (4 categories)
**Total (45 phones):** ~675-900 screen protectors
**Combined with cases:** 1,350-2,025 total products

This doubles the catalog size!
