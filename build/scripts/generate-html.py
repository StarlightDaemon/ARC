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
    """Generate HTML for a single product card"""
    # Determine badge color based on category
    badge_colors = {
        'case-official': 'bg-blue-600',
        'case-rugged': 'bg-red-600',
        'case-everyday': 'bg-green-600',
        'case-premium': 'bg-purple-600',
        'screen-protector': 'bg-yellow-600',
        'charger': 'bg-orange-600'
    }
    badge_color = badge_colors.get(product['category'], 'bg-gray-600')
    
    # Build specs list (for cases)
    specs_html = ""
    if product['category'].startswith('case'):
        specs = []
        if product['specs'].get('alertSlider') is not None:
            icon = "✓" if product['specs']['alertSlider'] else "✗"
            specs.append(f"<span>{icon} Alert Slider</span>")
        if product['specs'].get('magnetic') is not None:
            icon = "🧲" if product['specs']['magnetic'] else "❌"
            specs.append(f"<span>{icon} Magnetic</span>")
        if product['specs'].get('kickstand') is not None:
            icon = "📐" if product['specs']['kickstand'] else ""
            if icon:
                specs.append(f"<span>{icon} Kickstand</span>")
        if product['specs'].get('material'):
            specs.append(f"<span>📦 {product['specs']['material']}</span>")
        
        if specs:
            specs_html = '<div class="specs">' + ' | '.join(specs) + '</div>'
    
    # Build purchase links
    links_html = ""
    links = []
    if product['links'].get('official'):
        links.append(f'<a href="{product["links"]["official"]}" target="_blank" class="btn-primary">Official Store</a>')
    if product['links'].get('amazon'):
        links.append(f'<a href="{product["links"]["amazon"]}" target="_blank" class="btn-amazon">Amazon</a>')
    if product['links'].get('retailer'):
        retailer_name = product['links'].get('retailerName', 'Buy Now')
        links.append(f'<a href="{product["links"]["retailer"]}" target="_blank" class="btn-secondary">{retailer_name}</a>')
    
    if links:
        links_html = '<div class="purchase-links">' + ''.join(links) + '</div>'
    
    html = f"""
    <div class="product-card" data-category="{product['category']}">
        <div class="product-header">
            <h3>{product['brand']} {product['name']}</h3>
            <span class="price">${product['pricing']['msrp']}</span>
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
    
    # Generate category sections
    category_order = ['case-official', 'case-rugged', 'case-everyday', 'case-premium', 'screen-protector', 'charger']
    category_titles = {
        'case-official': '📦 Official Cases',
        'case-rugged': '🛡️ Rugged Cases',
        'case-everyday': '📱 Everyday Cases',
        'case-premium': '✨ Premium/Slim Cases',
        'screen-protector': '🔲 Screen Protectors',
        'charger': '⚡ Chargers'
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
            <div class="logo"><a href="../../public/index.html">ARC</a></div>
            <ul>
                <li><a href="../../public/index.html">Home</a></li>
                <li><a href="../index.html">{device['brand']}</a></li>
            </ul>
        </nav>
    </header>

    <main class="guide-container">
        <div class="guide-header">
            <h1>{device['brand']} {device['model']} Accessories Guide</h1>
            <p class="guide-intro">Comprehensive guide to cases, screen protectors, chargers, and accessories with verified purchase links and pricing.</p>
            
            <div class="device-info">
                <h3>Device Highlights</h3>
                {device_features}
                {charging_info}
            </div>
        </div>

        <div class="filter-bar">
            <button class="filter-btn active" data-filter="all">All ({len(products)})</button>
            {"".join([f'<button class="filter-btn" data-filter="{cat}">{category_titles[cat].split()[1]} ({len(groups[cat])})</button>' for cat in category_order if cat in groups and groups[cat]])}
        </div>

        {categories_html}

        <footer class="guide-footer">
            <p><em>Last updated: {data['metadata']['researchDate']}</em></p>
            <p>Research source: {data['metadata']['source']}</p>
        </footer>
    </main>

    <script src="../../public/js/guide.js"></script>
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
