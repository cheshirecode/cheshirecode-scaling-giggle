#!/bin/bash
set -e

echo "Building main application..."
npm run build

echo "Building Storybook..."
npm run build-storybook

echo "Moving Storybook to dist/_storybook..."
mkdir -p dist/_storybook
cp -r storybook-static/* dist/_storybook/

echo "Build complete! ✅"
echo "  - Main app: dist/"
echo "  - Storybook: dist/_storybook/"

