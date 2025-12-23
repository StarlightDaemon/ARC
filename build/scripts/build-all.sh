#!/bin/bash
# Master build script - Generates all site pages

echo "🔨 Building ARC Website..."
echo ""

# Generate device pages from JSON
echo "📱 Generating device pages..."
for json_file in data/researched/*.json; do
    if [[ ! "$json_file" =~ PLACEHOLDER ]]; then
        echo "  Processing: $(basename $json_file)"
        python3 build/scripts/generate-html.py "$json_file"
    fi
done

echo ""
echo "📄 Generating index page..."
python3 build/scripts/generate-index.py

echo ""
echo "✅ Build complete!"
echo "   View at: http://localhost:8000"
