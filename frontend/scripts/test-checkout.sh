#!/bin/bash
# E2E Checkout Test Script
# This script verifies all pages in the checkout flow return 200 status codes

echo "🔄 Testing Dermastore Checkout Flow..."
echo "========================================"

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

test_page() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "200" ]; then
        echo "✅ $name - $status OK"
        PASS=$((PASS + 1))
    else
        echo "❌ $name - $status FAILED"
        FAIL=$((FAIL + 1))
    fi
}

echo ""
echo "Testing Pages:"
echo "--------------"

# Test all checkout flow pages
test_page "$BASE_URL" "Homepage"
test_page "$BASE_URL/products" "Products Page"
test_page "$BASE_URL/products/skinceuticals-ce-ferulic" "Product Detail"
test_page "$BASE_URL/cart" "Cart Page"
test_page "$BASE_URL/checkout" "Checkout Page"
test_page "$BASE_URL/checkout/success" "Success Page"

echo ""
echo "========================================"
echo "Results: $PASS passed, $FAIL failed"
echo "========================================"

if [ $FAIL -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "💥 Some tests failed!"
    exit 1
fi
