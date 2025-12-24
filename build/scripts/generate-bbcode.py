#!/usr/bin/env python3
"""
BBCode Generator for Accessory Guides
Converts JSON research data to XDA forum-ready BBCode files
"""

import json
import sys
import os
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

def generate_product_bbcode(product):
    """Generate BBCode for a single product"""
    bbcode = f"[B]{product['brand']} {product['name']}[/B] - ${product['pricing']['msrp']}\n"
    
    # Specs (only for cases)
    if product['category'].startswith('case'):
        specs = []
        if product['specs'].get('alertSlider') is not None:
            specs.append(f"Alert Slider: {'Yes' if product['specs']['alertSlider'] else 'No'}")
        if product['specs'].get('magnetic') is not None:
            specs.append(f"Magnetic: {'Yes' if product['specs']['magnetic'] else 'No'}")
        if product['specs'].get('kickstand') is not None:
            specs.append(f"Kickstand: {'Yes' if product['specs']['kickstand'] else 'No'}")
        if product['specs'].get('material'):
            specs.append(f"Material: {product['specs']['material']}")
        drop_rating = product['specs'].get('dropRating', '')
        if drop_rating and drop_rating != 'N/A' and 'Standard' not in drop_rating:
            specs.append(f"Protection: {drop_rating}")
        
        if specs:
            bbcode += f"• {' | '.join(specs)}\n"
    
    # Links
    links = []
    if product['links'].get('official'):
        links.append(f"[URL={product['links']['official']}]Official[/URL]")
    if product['links'].get('amazon'):
        links.append(f"[URL={product['links']['amazon']}]Amazon[/URL]")
    if product['links'].get('retailer'):
        retailer_name = product['links'].get('retailerName', 'Retailer')
        links.append(f"[URL={product['links']['retailer']}]{retailer_name}[/URL]")
    
    if links:
        bbcode += f"• Buy: {' | '.join(links)}\n"
    
    return bbcode

def generate_intro(data):
    """Generate intro post"""
    device = data['device']
    products = data['products']
    
    bbcode = f"[CENTER][SIZE=6][B]{device['brand']} {device['model']} Accessories Guide[/B][/SIZE][/CENTER]\n\n"
    bbcode += f"[B]Welcome to the comprehensive accessories guide for the {device['brand']} {device['model']}![/B]\n\n"
    bbcode += "This guide covers cases, screen protectors, chargers, and more - all with verified purchase links and up-to-date pricing.\n\n"
    
    # Device highlights
    if device.get('criticalFeatures'):
        bbcode += "[B]Device Highlights:[/B]\n"
        for feature in device['criticalFeatures']:
            bbcode += f"• {feature}\n"
        bbcode += "\n"
    
    # Charging specs
    if device.get('chargingSpecs'):
        bbcode += "[B]Charging:[/B]\n"
        if device['chargingSpecs'].get('wired'):
            bbcode += f"• Wired: {device['chargingSpecs']['wired']}\n"
        if device['chargingSpecs'].get('wireless'):
            bbcode += f"• Wireless: {device['chargingSpecs']['wireless']}\n"
        bbcode += "\n"
    
    # Table of contents
    groups = group_by_category(products)
    bbcode += "[B]Guide Contents:[/B]\n"
    if groups.get('case-official'):
        bbcode += f"📦 Official Cases ({len(groups['case-official'])})\n"
    if groups.get('case-rugged'):
        bbcode += f"🛡️ Rugged Cases ({len(groups['case-rugged'])})\n"
    if groups.get('case-everyday'):
        bbcode += f"📱 Everyday Cases ({len(groups['case-everyday'])})\n"
    if groups.get('case-premium'):
        bbcode += f"✨ Premium Cases ({len(groups['case-premium'])})\n"
    if groups.get('screen-protector'):
        bbcode += f"🔲 Screen Protectors ({len(groups['screen-protector'])})\n"
    if groups.get('charger'):
        bbcode += f"⚡ Chargers ({len(groups['charger'])})\n"
    
    bbcode += f"\n[I]Last updated: {data['metadata']['researchDate']}[/I]\n"
    
    return bbcode

def generate_category_post(category_name, products):
    """Generate a category post"""
    category_titles = {
        'case-official': 'Official Cases',
        'case-rugged': 'Rugged Cases',
        'case-everyday': 'Everyday Cases',
        'case-premium': 'Premium/Slim Cases',
        'screen-protector': 'Screen Protectors',
        'charger': 'Chargers'
    }
    
    title = category_titles.get(category_name, category_name)
    bbcode = f"[SIZE=5][B]{title}[/B][/SIZE]\n\n"
    
    for product in products:
        bbcode += generate_product_bbcode(product) + "\n"
    
    return bbcode

def generate_bbcode_files(json_path):
    """Main generation logic"""
    data = load_research_data(json_path)
    groups = group_by_category(data['products'])
    
    # Create output directory
    device_slug = data['device']['model'].lower().replace(' ', '-')
    brand_slug = data['device']['brand'].lower()
    output_dir = Path(__file__).parent.parent.parent / 'data' / brand_slug / device_slug / 'output'
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"✓ Created output directory: {output_dir}")
    
    files = []
    
    # Generate intro post
    intro_content = generate_intro(data)
    intro_path = output_dir / 'post-01-intro.bbcode'
    intro_path.write_text(intro_content)
    files.append('post-01-intro.bbcode')
    print("✓ Generated intro post")
    
    # Generate category posts
    post_num = 2
    category_order = ['case-official', 'case-rugged', 'case-everyday', 'case-premium', 'screen-protector', 'charger']
    
    for category in category_order:
        if category in groups and groups[category]:
            content = generate_category_post(category, groups[category])
            filename = f"post-{post_num:02d}-{category}.bbcode"
            filepath = output_dir / filename
            filepath.write_text(content)
            files.append(filename)
            print(f"✓ Generated {category} post ({len(groups[category])} products)")
            post_num += 1
    
    print(f"\n✅ Generated {len(files)} BBCode files in:")
    print(f"   {output_dir}\n")
    
    return str(output_dir)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 generate-bbcode.py <path-to-json>')
        print('Example: python3 generate-bbcode.py ../../data/researched/OnePlus-13.json')
        sys.exit(1)
    
    generate_bbcode_files(sys.argv[1])
