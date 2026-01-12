import { test, expect } from '@playwright/test';

test.describe('Checkout Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing cart state by going to cart first
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
  });

  test('complete checkout flow - browse, add to cart, checkout', async ({ page }) => {
    // Step 1: Go to products page
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    // Verify products page loaded
    await expect(page.locator('h1')).toContainText(/products|shop/i);
    
    // Step 2: Click on first product to go to product detail
    const productCard = page.locator('[data-testid="product-card"]').first();
    
    // If no test id, try clicking on product link
    const productLink = page.locator('a[href^="/products/"]').first();
    if (await productLink.count() > 0) {
      await productLink.click();
    } else {
      await productCard.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    // Verify on product detail page
    const url = page.url();
    expect(url).toContain('/products/');
    
    // Step 3: Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")');
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    await addToCartButton.click();
    
    // Wait for cart update (might show toast or update cart icon)
    await page.waitForTimeout(1000);
    
    // Step 4: Go to cart
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    // Verify cart has items
    const emptyCartMessage = page.locator('text=Your cart is empty');
    const hasEmptyCart = await emptyCartMessage.count() > 0;
    
    if (hasEmptyCart) {
      // If cart is empty, the add to cart didn't work - fail with helpful message
      throw new Error('Cart is empty after adding product. Check Add to Cart functionality.');
    }
    
    // Verify checkout button exists
    const checkoutButton = page.locator('a:has-text("Checkout"), button:has-text("Checkout"), a:has-text("Proceed to Checkout")');
    await expect(checkoutButton).toBeVisible();
    
    // Step 5: Go to checkout
    await checkoutButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify on checkout page
    expect(page.url()).toContain('/checkout');
    
    // Step 6: Fill shipping information
    await page.fill('input[name="firstName"], input[placeholder*="First"]', 'Test');
    await page.fill('input[name="lastName"], input[placeholder*="Last"]', 'User');
    await page.fill('input[name="email"], input[placeholder*="Email"], input[type="email"]', 'test@example.com');
    await page.fill('input[name="phone"], input[placeholder*="Phone"]', '0821234567');
    await page.fill('input[name="address"], input[placeholder*="Address"]', '123 Test Street');
    await page.fill('input[name="city"], input[placeholder*="City"]', 'Cape Town');
    await page.fill('input[name="postalCode"], input[placeholder*="Postal"], input[placeholder*="ZIP"]', '8001');
    
    // Click continue/next
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Next")');
    await continueButton.click();
    await page.waitForTimeout(500);
    
    // Step 7: Select delivery method (if on delivery step)
    const deliveryOption = page.locator('input[type="radio"][name*="delivery"], [data-testid*="delivery"], label:has-text("Standard")');
    if (await deliveryOption.count() > 0) {
      await deliveryOption.first().click();
      await continueButton.click();
      await page.waitForTimeout(500);
    }
    
    // Step 8: Fill payment information
    const cardNumberInput = page.locator('input[name="cardNumber"], input[placeholder*="Card number"], input[placeholder*="4242"]');
    if (await cardNumberInput.count() > 0) {
      await cardNumberInput.fill('4242424242424242');
      await page.fill('input[name="cardName"], input[placeholder*="Name on card"]', 'Test User');
      await page.fill('input[name="expiry"], input[placeholder*="MM/YY"]', '12/28');
      await page.fill('input[name="cvv"], input[placeholder*="CVV"], input[placeholder*="CVC"]', '123');
      
      await continueButton.click();
      await page.waitForTimeout(500);
    }
    
    // Step 9: Place order (review step)
    const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button:has-text("Pay")');
    await expect(placeOrderButton).toBeVisible({ timeout: 10000 });
    await placeOrderButton.click();
    
    // Step 10: Verify order success
    await page.waitForURL(/success|confirmation|thank-you/i, { timeout: 30000 });
    
    // Verify success message
    const successMessage = page.locator('text=/order.*confirmed|thank you|success/i');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    console.log('✅ E2E Checkout test completed successfully!');
  });

  test('product page loads and displays product info', async ({ page }) => {
    // Go directly to a known product
    await page.goto('/products/skinceuticals-ce-ferulic');
    await page.waitForLoadState('networkidle');
    
    // Verify product details are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")')).toBeVisible();
  });

  test('cart shows empty state when no items', async ({ page }) => {
    // Clear localStorage to ensure empty cart
    await page.evaluate(() => localStorage.clear());
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    // Should show empty cart message
    await expect(page.locator('text=/empty|no items/i')).toBeVisible();
  });
});
