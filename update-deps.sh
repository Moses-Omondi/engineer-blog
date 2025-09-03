#!/bin/bash

# Update vulnerable dev dependencies
echo "Updating vulnerable dev dependencies..."

# Update esbuild to latest version
npm install esbuild@latest --save-dev

# Update Lighthouse CI (if needed)
npm install @lhci/cli@latest --save-dev

# Try to update live-server
npm install live-server@latest --save-dev

echo "Dependencies updated. Running audit..."
npm audit

echo "Done! Commit these changes if the audit looks better."
