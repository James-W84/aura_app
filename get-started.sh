#!/bin/bash
# Aura MVP - Getting Started Script
# Run this to quickly start development

set -e

echo "🚀 Aura MVP - Quick Start"
echo "========================"
echo ""

# Check if in correct directory
if [ ! -d "api" ] || [ ! -d "mobile" ]; then
    echo "❌ Error: Run this from the aura_app root directory"
    echo "   cd /path/to/aura_app"
    exit 1
fi

# Backend Setup
echo "📦 Setting up Backend..."
cd api
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps > /dev/null 2>&1
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

# Verify database
if [ ! -f "prisma/dev.db" ]; then
    echo "📊 Initializing database..."
    npx prisma migrate dev --name init > /dev/null 2>&1
    npm run prisma:seed > /dev/null 2>&1
    echo "✅ Database ready with 20 sample prompts"
else
    echo "✅ Database already initialized"
fi

# Type check
npm run build > /dev/null 2>&1
echo "✅ Backend TypeScript verified"

cd ..

# Mobile Setup
echo ""
echo "📱 Setting up Mobile..."
cd mobile
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps > /dev/null 2>&1
    echo "✅ Mobile dependencies installed"
else
    echo "✅ Mobile dependencies already installed"
fi

# Type check
npm run build > /dev/null 2>&1
echo "✅ Mobile TypeScript verified"

cd ..

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "🎬 To start development:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd api"
echo "    npm run dev"
echo "    # Server: http://localhost:5000"
echo ""
echo "  Terminal 2 (Mobile):"
echo "    cd mobile"
echo "    npm start"
echo "    # Scan QR or press 'i' for iOS"
echo ""
echo "📚 Documentation:"
echo "  - README.md (full setup guide)"
echo "  - QUICK_REFERENCE.md (quick lookup)"
echo "  - BUILD_STATUS.md (project overview)"
echo ""
echo "🧪 Test the flow:"
echo "  1. Swipe right on a prompt"
echo "  2. Write text (auto-saves)"
echo "  3. Tap Finish"
echo "  4. See entry in History"
echo ""
echo "🚀 Ready to build! Good luck!"
echo ""
