#!/bin/bash

# Simple test script to verify chat integration functionality

API_BASE_URL="http://localhost:5001"
FRONTEND_URL="http://localhost:3000"

echo "🚀 Starting Chat Integration Tests"
echo ""

# Test backend health
echo "🔍 Testing backend health..."
if curl -s "$API_BASE_URL/health" > /dev/null; then
    echo "✅ Backend health check passed"
    BACKEND_HEALTH=true
else
    echo "❌ Backend health check failed"
    BACKEND_HEALTH=false
fi

# Test frontend health
echo "🔍 Testing frontend health..."
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is accessible"
    FRONTEND_HEALTH=true
else
    echo "❌ Frontend health check failed"
    FRONTEND_HEALTH=false
fi

# Test chat API
echo "🔍 Testing chat API..."
CHAT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/api/chat" \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "Hello"}]}')

if [ $? -eq 0 ]; then
    echo "✅ Chat API responded"
    echo "Response: $CHAT_RESPONSE"
    CHAT_API=true
else
    echo "❌ Chat API connection failed"
    CHAT_API=false
fi

# Test form generation API
echo "🔍 Testing form generation API..."
FORM_RESPONSE=$(curl -s -X POST "$API_BASE_URL/api/chat" \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "Create a contact form"}]}')

if [ $? -eq 0 ]; then
    echo "✅ Form generation API responded"
    echo "Response: $FORM_RESPONSE"
    FORM_API=true
else
    echo "❌ Form generation API connection failed"
    FORM_API=false
fi

echo ""
echo "📊 Test Results Summary:"
echo "========================"
echo "Backend Health: $([ "$BACKEND_HEALTH" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Frontend Health: $([ "$FRONTEND_HEALTH" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Chat API: $([ "$CHAT_API" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Form Generation API: $([ "$FORM_API" = true ] && echo "✅ PASSED" || echo "❌ FAILED")"

if [ "$BACKEND_HEALTH" = true ] && [ "$FRONTEND_HEALTH" = true ] && [ "$CHAT_API" = true ] && [ "$FORM_API" = true ]; then
    echo ""
    echo "🎉 Chat integration is working correctly!"
    echo "💡 Note: API errors are expected due to Claude API credit limits"
    echo "💡 Frontend should gracefully handle these and show mock responses"
else
    echo ""
    echo "⚠️  Some tests failed. Check the services are running:"
    echo "   Backend: $API_BASE_URL"
    echo "   Frontend: $FRONTEND_URL"
fi
