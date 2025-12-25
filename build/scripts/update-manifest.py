#!/usr/bin/env python3
"""
Auto-generate devices.json manifest from data directory
Scans data/researched/ and creates manifest with all devices
"""
import json
from pathlib import Path
from datetime import datetime


def scan_devices(data_dir: Path) -> list:
    """Scan data/researched/ for device folders."""
    devices = []
    
    for device_dir in data_dir.iterdir():
        if not device_dir.is_dir():
            continue
        
        # Skip template and multi-LLM dirs
        if device_dir.name in ['DEVICE-TEMPLATE'] or 'MultiLLM' in device_dir.name:
            continue
        
        # Load product data
        n8n_file = device_dir / 'n8n-products.json'
        if not n8n_file.exists():
            continue
        
        try:
            data = json.loads(n8n_file.read_text())
            products = data.get('products', [])
            
            if not products:
                continue
            
            # Create device entry
            device_name = data.get('device', device_dir.name.replace('-', ' ').title())
            brand = device_name.split()[0]
            
            devices.append({
                'slug': device_dir.name,
                'name': device_name,
                'brand': brand.lower(),
                'product_count': len(products),
                'status': 'complete',
                'data_file': f'data/researched/{device_dir.name}/n8n-products.json',
                'html_file': f'phones/{brand.lower()}/{device_dir.name}.html'
            })
        except Exception as e:
            print(f"⚠️  Skipped {device_dir.name}: {e}")
            continue
    
    # Sort by brand then name
    devices.sort(key=lambda d: (d['brand'], d['name']))
    return devices


def main():
    project_root = Path(__file__).parent.parent.parent
    data_dir = project_root / 'data' / 'researched'
    output_file = project_root / 'data' / 'devices.json'
    
    print(f"📂 Scanning: {data_dir}")
    devices = scan_devices(data_dir)
    
    manifest = {
        'last_updated': datetime.now().isoformat(),
        'total_devices': len(devices),
        'total_products': sum(d['product_count'] for d in devices),
        'devices': devices
    }
    
    output_file.write_text(json.dumps(manifest, indent=2))
    
    print(f"✅ Manifest updated: {output_file}")
    print(f"   📱 {manifest['total_devices']} devices")
    print(f"   📦 {manifest['total_products']} total products")
    
    for device in devices:
        print(f"   - {device['name']}: {device['product_count']} products")


if __name__ == '__main__':
    main()
