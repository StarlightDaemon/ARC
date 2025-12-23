#!/usr/bin/env python3
"""
Index Page Generator
Auto-generates index.html from devices.json
"""

import json
from pathlib import Path
from datetime import datetime

def load_devices():
    """Load device manifest"""
    with open('data/devices.json', 'r') as f:
        return json.load(f)

def generate_device_card(device):
    """Generate HTML for a single device card"""
    features_html = ''.join([
        f'<span>{feature}</span>' 
        for feature in device['features']
    ])
    
    return f"""
            <a href="{device['path']}" class="phone-guide-card" data-brand="{device['brand'].lower()}">
                <div class="phone-card-header">
                    <span class="brand-badge">{device['brand']}</span>
                    <h3>{device['model']}</h3>
                </div>
                <div class="phone-features">
                    {features_html}
                </div>
                <div class="phone-stats">
                    <span>{device['icon']} {device['productCount']} products</span>
                </div>
            </a>"""

def generate_index_page(data):
    """Generate complete index.html"""
    
    devices_html = '\n'.join([generate_device_card(d) for d in data['devices']])
    
    # Get unique brands for filter buttons
    brands = sorted(set(d['brand'] for d in data['devices']))
    filter_buttons = '\n'.join([
        f'                <button class="filter-btn" data-brand="{brand.lower()}">{brand}</button>'
        for brand in brands
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Comprehensive phone accessory guides - cases, screen protectors, chargers, and more with verified purchase links.">
    <title>ARC - Phone Accessory Guides</title>
    <link rel="stylesheet" href="public/css/style.css">
    <link rel="stylesheet" href="public/css/guide.css">
    <style>
        /* Phone Guide Cards - Dark Theme */
        .phone-guide-card {{
            background: #252525;
            border: 1px solid #3a3a3a;
            padding: 1.5rem;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }}

        .phone-guide-card:hover {{
            transform: translateY(-4px);
            border-color: #06a0ff;
            text-decoration: none;
        }}

        .phone-card-header {{
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }}

        .brand-badge {{
            display: inline-block;
            padding: 0.35rem 0.85rem;
            background: #06a0ff;
            color: #000;
            font-size: 0.75rem;
            font-weight: 600;
            align-self: flex-start;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .phone-card-header h3 {{
            font-size: 1.35rem;
            font-weight: 600;
            color: #ffffff;
            margin: 0;
        }}

        .phone-features {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            font-size: 0.85rem;
        }}

        .phone-features span {{
            background: #2a2a2a;
            color: #d0d0d0;
            padding: 0.4rem 0.75rem;
        }}

        .phone-stats {{
            display: flex;
            gap: 0.75rem;
            font-size: 0.85rem;
            color: #808080;
            padding-top: 0.5rem;
            border-top: 1px solid #3a3a3a;
        }}

        @media (max-width: 640px) {{
            .products-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>

<body>
    <header>
        <nav>
            <div class="logo"><a href="index.html">ARC</a></div>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>

    <main class="guide-container">
        <div class="guide-header">
            <h1>ARC</h1>
            <p class="guide-intro">
                Accessory Research Catalog - Comprehensive guides for flagship phones with verified purchase links, pricing, and detailed product research.
            </p>
        </div>

        <div class="filter-bar">
            <button class="filter-btn active" data-brand="all">All ({data['metadata']['totalDevices']})</button>
{filter_buttons}
        </div>

        <div class="products-grid">
{devices_html}
        </div>
    </main>

    <footer class="footer">
        <p>Last updated: {data['metadata']['lastUpdated']} | Maintained by ARC</p>
    </footer>

    <script src="public/js/guide.js"></script>
    <script>
        // Scoped filter functionality
        (function() {{
            const filterBtns = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.phone-guide-card');

            filterBtns.forEach(btn => {{
                btn.addEventListener('click', function() {{
                    // Update active button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const brand = this.getAttribute('data-brand');

                    // Filter cards
                    cards.forEach(card => {{
                        if (brand === 'all' || card.getAttribute('data-brand') === brand) {{
                            card.style.display = 'flex';
                        }} else {{
                            card.style.display = 'none';
                        }}
                    }});
                }});
            }});
        }})();
    </script>
</body>

</html>"""
    
    return html

def main():
    """Main entry point"""
    print("📱 Generating index.html from devices.json...")
    
    # Load data
    data = load_devices()
    print(f"✓ Found {data['metadata']['totalDevices']} devices")
    
    # Generate HTML
    html = generate_index_page(data)
    
    # Update metadata
    data['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    
    # Write files
    with open('index.html', 'w') as f:
        f.write(html)
    print("✓ Generated index.html")
    
    # Update devices.json with new timestamp
    with open('data/devices.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("✓ Updated devices.json timestamp")
    
    print(f"\n✅ Index page generated successfully!")
    print(f"   Devices: {data['metadata']['totalDevices']}")
    print(f"   Total products: {data['metadata']['totalProducts']}")

if __name__ == "__main__":
    main()
