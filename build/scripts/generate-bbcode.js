/**
 * BBCode Generator Script
 * Converts YAML data to BBCode using Handlebars templates
 * 
 * Usage: node scripts/generate-bbcode.js [device-slug]
 * Example: node scripts/generate-bbcode.js pixel-10-pro-xl
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

// Configuration
const CHAR_LIMIT = 20000; // XDA character limit per post
const DEVICES_DIR = path.join(__dirname, '../_data/devices');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../assets/bbcode');

// Get device slug from command line or default
const deviceSlug = process.argv[2] || 'pixel-10-pro-xl';

console.log(`\n🔧 BBCode Generator`);
console.log(`==================`);
console.log(`Device: ${deviceSlug}\n`);

try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
    }

    // 1. Load YAML Data
    const dataPath = path.join(DEVICES_DIR, `${deviceSlug}.yml`);
    if (!fs.existsSync(dataPath)) {
        throw new Error(`Device file not found: ${dataPath}`);
    }
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = yaml.load(rawData);
    console.log(`✅ Loaded data from: ${deviceSlug}.yml`);

    // 2. Load Handlebars Template
    const templatePath = path.join(TEMPLATES_DIR, 'bbcode.hbs');
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
    }
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    console.log(`✅ Loaded template: bbcode.hbs`);

    // 3. Register Custom Helpers
    Handlebars.registerHelper('currentDate', () => {
        return new Date().toISOString().split('T')[0];
    });

    Handlebars.registerHelper('formatPrice', (price) => {
        if (typeof price === 'number') {
            return `$${price.toFixed(2)}`;
        }
        return price || 'N/A';
    });

    Handlebars.registerHelper('checkmark', (value) => {
        return value ? '✅' : '❌';
    });

    // 4. Compile Template
    const template = Handlebars.compile(templateSource);
    const bbcode = template(data);

    // 5. Character Count Warning
    const charCount = bbcode.length;
    console.log(`\n📊 Output Statistics:`);
    console.log(`   Characters: ${charCount.toLocaleString()}`);
    console.log(`   XDA Limit: ${CHAR_LIMIT.toLocaleString()}`);

    if (charCount > CHAR_LIMIT) {
        console.warn(`\n⚠️  WARNING: Output exceeds XDA ${CHAR_LIMIT} character limit!`);
        console.warn(`   Consider splitting into multiple posts.`);
    } else {
        const remaining = CHAR_LIMIT - charCount;
        console.log(`   Remaining: ${remaining.toLocaleString()} characters (${Math.round((charCount / CHAR_LIMIT) * 100)}% used)`);
    }

    // 6. Write Output
    const outputPath = path.join(OUTPUT_DIR, `${deviceSlug}.txt`);
    fs.writeFileSync(outputPath, bbcode);
    console.log(`\n✅ BBCode written to: ${outputPath}`);

    // 7. Also write a copy to the old location for compatibility
    const legacyDir = path.join(__dirname, '../_data/Google/Pixel 10 Pro XL/output');
    if (fs.existsSync(legacyDir)) {
        fs.writeFileSync(path.join(legacyDir, 'generated-full.bbcode'), bbcode);
        console.log(`✅ Legacy copy written to: generated-full.bbcode`);
    }

    console.log(`\n🎉 Generation complete!\n`);

} catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
}
