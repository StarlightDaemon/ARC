#!/usr/bin/env python3
"""
HTML Generator for Accessory Guides
Converts JSON research data to website HTML pages
"""

import json
import sys
from pathlib import Path
from collections import defaultdict

def load_research_data(json_path):
    """Load and validate JSON research data"""
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
        print(f"✓ Loaded data for {data['device']['brand']} {data['device']['model']}")
        print(f"✓ Found {len(data['products'])} products")
        return data
    except Exception as e:
        print(f"✗ Error loading JSON: {e}")
        sys.exit(1)

def group_by_category(products):
    """Group products by category"""
    groups = defaultdict(list)
    for product in products:
        groups[product['category']].append(product)
    return dict(groups)

def generate_product_html(product):
    """Generate HTML for a single product card with Summary Style"""
    
    # Clean product name - remove tech suffixes
    clean_name = product['name']
    suffixes_to_remove = [' (MagFit)', ' (with Pixelsnap)', ' MagFit', ' Pixelsnap', ' MagSafe', ' Series', ' Series Pro', ' Series XT']
    for suffix in suffixes_to_remove:
        clean_name = clean_name.replace(suffix, '')
    
    # Build badge summary and material text
    specs_html = ""
    if product['category'].startswith('case'):
        badges = []
        material_parts = []
        
        # Create badges for key features - safely access specs
        specs = product.get('specs', {})
        if specs.get('magnetic'):
            badges.append('<span class="badge">🧲 Magnetic</span>')
        if specs.get('kickstand'):
            badges.append('<span class="badge">📐 Kickstand</span>')
        if specs.get('dropRating') and 'Military' in specs.get('dropRating', ''):
            badges.append('<span class="badge">🛡️ Military Grade</span>')
        elif specs.get('dropRating') and specs['dropRating'] != 'Unknown':
            badges.append(f'<span class="badge">🛡️ {specs["dropRating"]}</span>')
        
        # If no specs, use features instead
        if not badges and 'features' in product:
            for feature in product['features'][:2]:
                badges.append(f'<span class="badge">✓ {feature}</span>')
        
        # Material goes into description text
        if specs.get('material'):
            material_parts.append(specs['material'])
        elif 'material' in product:
            material_parts.append(product['material'])
        
        # Add tech info to material description if removed from title
        if 'Pixelsnap' in product['name'] or 'MagFit' in product['name'] or 'MagSafe' in product['name']:
            if 'Pixelsnap' in product['name']:
                material_parts.append('Pixelsnap compatible')
            elif 'MagFit' in product['name']:
                material_parts.append('MagFit compatible')
            elif 'MagSafe' in product['name']:
                material_parts.append('MagSafe compatible')
        
        material_text = ''
        if material_parts:
            combined_text = '. '.join(material_parts)
            material_text = f'<div class="material-text">{combined_text}</div>'
        
        # Build specs HTML with badges + material
        if badges or material_text:
            badges_html = '<div class="summary-badges">' + ''.join(badges) + '</div>' if badges else ''
            specs_html = f'<div class="specs">{badges_html}{material_text}</div>'
    
    # Build purchase links - IMPORTANT: Official Store goes LAST
    links = []
    
    # Add retailer links first
    if product['links'].get('amazon'):
        links.append(f'<a href="{product["links"]["amazon"]}" target="_blank" class="btn-secondary">Amazon</a>')
    if product['links'].get('retailer'):
        retailer_name = product['links'].get('retailerName', 'Buy Now')
        links.append(f'<a href="{product["links"]["retailer"]}" target="_blank" class="btn-secondary">{retailer_name}</a>')
    
    # Official Store goes LAST
    if product['links'].get('official'):
        links.append(f'<a href="{product["links"]["official"]}" target="_blank" class="btn-primary">Official Store</a>')
    
    links_html = '<div class="purchase-links">' + ''.join(links) + '</div>' if links else ''
    
    
    # Handle pricing display - support both 'pricing' and 'price' formats
    pricing_data = product.get('pricing') or product.get('price', {})
    msrp = pricing_data.get('msrp') or pricing_data.get('amount')
    price_display = f'${msrp}' if msrp and msrp not in ['None', None] else 'Price N/A'
    
    
    html = f"""
    <div class="product-card" data-category="{product['category']}">
        <div class="product-header">
            <h3 style="min-height: 2.6em;">
                <div class="brand-name">{product['brand']}</div>
                <div class="product-name">{clean_name}</div>
            </h3>
            <span class="price">{price_display}</span>
        </div>
        {specs_html}
        {links_html}
    </div>
    """
    
    return html

def generate_html_page(data):
    """Generate complete HTML page"""
    device = data['device']
    products = data['products']
    groups = group_by_category(products)
    
    # Generate device info section
    device_features = ''
    if device.get('criticalFeatures'):
        features_list = ''.join([f'<li>{f}</li>' for f in device['criticalFeatures']])
        device_features = f'<ul class="features-list">{features_list}</ul>'
    
    charging_info = ''
    if device.get('chargingSpecs'):
        specs = device['chargingSpecs']
        charging_info = '<div class="charging-specs">'
        if specs.get('wired'):
            charging_info += f'<span><strong>Wired:</strong> {specs["wired"]}</span>'
        if specs.get('wireless'):
            charging_info += f'<span><strong>Wireless:</strong> {specs["wireless"]}</span>'
        charging_info += '</div>'
    
    # Generate category sections - ONLY CASES
    category_order = ['case-official', 'case-rugged', 'case-everyday', 'case-premium', 'case-clear', 'case-eco', 'case-slim']
    category_titles = {
        'case-official': '📦 Official Cases',
        'case-rugged': '🛡️ Rugged Cases',
        'case-everyday': '📱 Everyday Cases',
        'case-premium': '✨ Premium Cases',
        'case-clear': '🔍 Clear Cases',
        'case-eco': '🌱 Eco Cases',
        'case-slim': '📏 Slim Cases'
    }
    
    categories_html = ''
    for category in category_order:
        if category in groups and groups[category]:
            title = category_titles.get(category, category)
            products_html = ''.join([generate_product_html(p) for p in groups[category]])
            categories_html += f"""
            <section class="category-section" id="{category}">
                <h2>{title}</h2>
                <div class="products-grid">
                    {products_html}
                </div>
            </section>
            """
    
    device_slug = device['model'].lower().replace(' ', '-')
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{device['brand']} {device['model']} Accessories Guide - ARC</title>
    <link rel="stylesheet" href="../../public/css/style.css">
    <link rel="stylesheet" href="../../public/css/guide.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo"><a href="../../index.html">ARC</a></div>
            <div class="sticky-title" id="stickyTitle">{device['brand']} {device['model']} Accessories Guide</div>
            <ul>
                <li><a href="../../index.html">All Devices</a></li>
                <li><a href="https://github.com/StarlightDaemon/ARC" target="_blank">GitHub</a></li>
            </ul>
        </nav>
    </header>

    <main class="guide-container">
        <div class="guide-header">
            <h1>{device['brand']} {device['model']} Accessories Guide</h1>
            <p class="guide-intro">Comprehensive guide to cases, screen protectors, chargers, and accessories with verified purchase links and pricing.</p>
            
            <div class="device-info-wrapper">
                <button class="device-toggle">
                    <span class="toggle-icon">▶</span>
                    <span>Device Highlights</span>
                </button>
                <div class="device-info collapsed" id="deviceInfo">
                    {device_features}
                    {charging_info}
                </div>
            </div>
        </div>

        <div class="filter-bar">
            <button class="filter-btn active" data-filter="all">All ({len(products)})</button>
            {"".join([f'<button class="filter-btn" data-filter="{cat}">{category_titles.get(cat, cat).split()[1]} ({len(groups[cat])})</button>' for cat in category_order if cat in groups and groups[cat]])}
        </div>

        {categories_html}

        <section class="related-accessories">
            <h2>📋 Other Accessories</h2>
            <div class="accessory-links">
                <a href="#screen-protectors" class="accessory-link">
                    <span class="icon">🔲</span>
                    <span class="label">Screen Protectors</span>
                    <span class="status">Coming Soon</span>
                </a>
                <a href="#chargers" class="accessory-link">
                    <span class="icon">⚡</span>
                    <span class="label">Chargers & Cables</span>
                    <span class="status">Coming Soon</span>
                </a>
                <a href="#mounts" class="accessory-link">
                    <span class="icon">🚗</span>
                    <span class="label">Mounts & Stands</span>
                    <span class="status">Coming Soon</span>
                </a>
                <a href="#audio" class="accessory-link">
                    <span class="icon">🎧</span>
                    <span class="label">Audio Accessories</span>
                    <span class="status">Coming Soon</span>
                </a>
            </div>
        </section>

        <footer class="footer">
            <p>Last updated: {data['metadata'].get('lastUpdated', 'N/A')} | Maintained by <a href="https://github.com/StarlightDaemon" target="_blank">StarlightDaemon</a></p>
            <p>Research powered by Multi-LLM workflow (Gemini + Sonar)</p>
        </footer>
    </main>

    <script src="../../public/js/guide.js"></script>
    <script>
        // Scoped event listeners - avoid global namespace pollution
        (function() {{
            // Device Highlights toggle
            const toggleBtn = document.querySelector('.device-toggle');
            if (toggleBtn) {{
                toggleBtn.addEventListener('click', function() {{
                    const info = document.getElementById('deviceInfo');
                    const toggle = this.querySelector('.toggle-icon');
                    if (info && toggle) {{
                        info.classList.toggle('collapsed');
                        toggle.textContent = info.classList.contains('collapsed') ? '▶' : '▼';
                    }}
                }});
            }}
            
            // Sticky title on scroll - triggers when main title is hidden
            const stickyTitle = document.getElementById('stickyTitle');
            const mainTitle = document.querySelector('.guide-header h1');
            
            if (stickyTitle && mainTitle) {{
                window.addEventListener('scroll', function() {{
                    const titleRect = mainTitle.getBoundingClientRect();
                    // Show sticky title as soon as main title goes above viewport
                    if (titleRect.bottom < 0) {{
                        stickyTitle.classList.add('visible');
                    }} else {{
                        stickyTitle.classList.remove('visible');
                    }}
                }});
            }}
        }})();
    </script>
</body>
</html>"""
    
    return html

def generate_html_file(json_path):
    """Main generation logic"""
    data = load_research_data(json_path)
    
    # Generate HTML
    html_content = generate_html_page(data)
    
    # Create output file
    device_slug = data['device']['model'].lower().replace(' ', '-')
    brand_slug = data['device']['brand'].lower()
    output_dir = Path(__file__).parent.parent.parent / 'phones' / brand_slug
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / f"{device_slug}.html"
    output_file.write_text(html_content)
    
    print(f"\n✅ Generated HTML page:")
    print(f"   {output_file}\n")
    
    return str(output_file)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 generate-html.py <path-to-json>')
        print('Example: python3 generate-html.py ../../data/researched/OnePlus-13.json')
        sys.exit(1)
    
    generate_html_file(sys.argv[1])
