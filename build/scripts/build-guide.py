#!/usr/bin/env python3
"""
Build Guide - Unified Runner
Generates both BBCode and HTML from JSON research data
"""

import sys
import subprocess
from pathlib import Path

def build_guide(json_path):
    """Run both generators"""
    scripts_dir = Path(__file__).parent
    
    print("=" * 60)
    print("Building Accessory Guide")
    print("=" * 60)
    print(f"\nSource: {json_path}\n")
    
    # Run BBCode generator
    print("📝 Generating BBCode files...")
    bbcode_script = scripts_dir / "generate-bbcode.py"
    result = subprocess.run(['python3', str(bbcode_script), json_path])
    if result.returncode != 0:
        print("❌ BBCode generation failed")
        return False
    
    # Run HTML generator
    print("🌐 Generating HTML page...")
    html_script = scripts_dir / "generate-html.py"
    result = subprocess.run(['python3', str(html_script), json_path])
    if result.returncode != 0:
        print("❌ HTML generation failed")
        return False
    
    print("\n" + "=" * 60)
    print("✅ Guide generation complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Review BBCode files in data/<brand>/<device>/output/")
    print("2. Review HTML page in phones/<brand>/<device>.html")
    print("3. Copy BBCode to XDA forums")
    print("4. Test HTML page in browser\n")
    
    return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 build-guide.py <path-to-json>')
        print('Example: python3 build-guide.py ../../data/researched/OnePlus-13.json')
        sys.exit(1)
    
    success = build_guide(sys.argv[1])
    sys.exit(0 if success else 1)
