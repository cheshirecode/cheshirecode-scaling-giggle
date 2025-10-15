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

VENDOR_REACT_COUNT=$(ls -1 dist/assets/vendor-react*.js 2>/dev/null | wc -l | tr -d ' ')
if [ "$VENDOR_REACT_COUNT" -eq 1 ]; then
  echo "✅ Single React bundle detected"
else
  echo "❌ ERROR: Found $VENDOR_REACT_COUNT React bundles (should be 1)"
  echo "   This indicates multiple React instances that will cause hooks to fail!"
  exit 1
fi

# Check for state management bundle (jotai)
if ls dist/assets/vendor-state*.js 1> /dev/null 2>&1; then
  echo "✅ State management bundle (jotai) included"
else
  echo "❌ ERROR: State management bundle not found!"
  echo "   jotai may not be in production dependencies"
  exit 1
fi

# Check for data bundle (swr)
if ls dist/assets/vendor-data*.js 1> /dev/null 2>&1; then
  echo "✅ Data fetching bundle (swr) included"
else
  echo "⚠️  WARNING: Data fetching bundle not found"
fi

# Check for routing bundle (wouter)
if ls dist/assets/vendor-routing*.js 1> /dev/null 2>&1; then
  echo "✅ Routing bundle (wouter) included"
else
  echo "⚠️  WARNING: Routing bundle not found"
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

