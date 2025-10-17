#!/bin/bash
set -e

echo "🔍 Validating production build..."
echo ""

# Build the app
echo "📦 Building production bundle..."
npm run build > /dev/null 2>&1 || {
  echo "❌ Build failed!"
  exit 1
}
echo "✅ Build completed"
echo ""

# Check for critical dependencies in bundle
echo "🔎 Checking for required dependencies in bundle..."

# Check bundling strategy: manual chunks (vendor-*) or unified bundle (index-*)
VENDOR_REACT_COUNT=$(ls -1 dist/assets/vendor-react*.js 2>/dev/null | wc -l | tr -d ' ')
INDEX_COUNT=$(ls -1 dist/assets/index-*.js 2>/dev/null | wc -l | tr -d ' ')

if [ "$VENDOR_REACT_COUNT" -eq 1 ]; then
  echo "✅ Single React bundle detected (manual chunking)"
  BUNDLING="manual"
elif [ "$INDEX_COUNT" -eq 1 ]; then
  echo "✅ Single unified bundle detected (default chunking)"
  BUNDLING="unified"

  # Verify React is in the bundle
  if grep -q "react" dist/assets/index-*.js 2>/dev/null; then
    echo "✅ React included in unified bundle"
  else
    echo "❌ ERROR: React not found in bundle"
    exit 1
  fi
else
  echo "❌ ERROR: Invalid bundle structure"
  echo "   Expected: 1 vendor-react OR 1 index bundle"
  echo "   Found: $VENDOR_REACT_COUNT vendor-react, $INDEX_COUNT index"
  exit 1
fi

# For manual chunking, verify other vendor bundles
if [ "$BUNDLING" = "manual" ]; then
  if ls dist/assets/vendor-state*.js 1> /dev/null 2>&1; then
    echo "✅ State management bundle (jotai) included"
  else
    echo "❌ ERROR: State management bundle not found!"
    exit 1
  fi

  if ls dist/assets/vendor-data*.js 1> /dev/null 2>&1; then
    echo "✅ Data fetching bundle (swr) included"
  fi

  if ls dist/assets/vendor-routing*.js 1> /dev/null 2>&1; then
    echo "✅ Routing bundle (wouter) included"
  fi
fi

echo ""

# Check bundle size
BUNDLE_SIZE=$(du -sh dist | awk '{print $1}')
ASSETS_SIZE=$(du -sh dist/assets | awk '{print $1}')
echo "📊 Bundle sizes:"
echo "   Total: $BUNDLE_SIZE"
echo "   Assets: $ASSETS_SIZE"

echo ""
echo "✅ Build validation complete!"
echo ""
echo "💡 Next: Run 'npm run preview' to test locally at http://localhost:4173"

