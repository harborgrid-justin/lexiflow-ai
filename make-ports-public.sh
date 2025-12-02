#!/bin/bash
# Make Docker container ports public in GitHub Codespaces

echo "🔓 Making ports public in Codespaces..."

# Check if running in Codespaces
if [ -z "$CODESPACE_NAME" ]; then
    echo "❌ Not running in GitHub Codespaces"
    exit 1
fi

# Make port 3000 (frontend) public
echo "Making port 3000 (frontend) public..."
gh codespace ports visibility 3000:public -c "$CODESPACE_NAME" 2>/dev/null || echo "⚠️  Port 3000 may already be public"

# Make port 3001 (backend API) public
echo "Making port 3001 (backend API) public..."
gh codespace ports visibility 3001:public -c "$CODESPACE_NAME" 2>/dev/null || echo "⚠️  Port 3001 may already be public"

# Make port 5432 (PostgreSQL) private (security)
echo "Making port 5432 (PostgreSQL) private for security..."
gh codespace ports visibility 5432:private -c "$CODESPACE_NAME" 2>/dev/null || echo "⚠️  Port 5432 may already be private"

echo ""
echo "✅ Port visibility configured!"
echo ""
echo "📋 Current port status:"
gh codespace ports -c "$CODESPACE_NAME"

echo ""
echo "🌐 Access URLs:"
echo "   Frontend: https://${CODESPACE_NAME}-3000.app.github.dev"
echo "   Backend:  https://${CODESPACE_NAME}-3001.app.github.dev"
echo "   API Docs: https://${CODESPACE_NAME}-3001.app.github.dev/api/docs"
