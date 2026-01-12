'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  Check,
  Lock,
  ShoppingBag,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review';

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    province: 'Gauteng',
    postalCode: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    saveCard: false,
  });

  const deliveryOptions = [
    { id: 'standard', label: 'Standard Delivery', price: 99, days: '3-5 business days' },
    { id: 'express', label: 'Express Delivery', price: 199, days: '1-2 business days' },
    { id: 'overnight', label: 'Overnight Delivery', price: 349, days: 'Next business day' },
  ];

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryMethod)!;
  const subtotal = getSubtotal();
  const orderTotal = subtotal + selectedDelivery.price;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products before checking out</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => index < currentStepIndex && setCurrentStep(step.id)}
                disabled={index > currentStepIndex}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  index === currentStepIndex
                    ? 'bg-teal-600 text-white'
                    : index < currentStepIndex
                    ? 'bg-teal-100 text-teal-700 cursor-pointer hover:bg-teal-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
                <span className="hidden sm:inline font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    index < currentStepIndex ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Shipping Address
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        placeholder="Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        placeholder="+27 12 345 6789"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Input
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <Input
                        value={shippingData.apartment}
                        onChange={(e) => setShippingData({ ...shippingData, apartment: e.target.value })}
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Input
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        placeholder="Johannesburg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <select
                        value={shippingData.province}
                        onChange={(e) => setShippingData({ ...shippingData, province: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option>Gauteng</option>
                        <option>Western Cape</option>
                        <option>KwaZulu-Natal</option>
                        <option>Eastern Cape</option>
                        <option>Free State</option>
                        <option>Limpopo</option>
                        <option>Mpumalanga</option>
                        <option>North West</option>
                        <option>Northern Cape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <Input
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        placeholder="2000"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Delivery Step */}
            {currentStep === 'delivery' && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Delivery Method
                  </h2>
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          deliveryMethod === option.id
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={deliveryMethod === option.id}
                            onChange={() => setDeliveryMethod(option.id)}
                            className="w-5 h-5 text-teal-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.days}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(option.price)}
                        </p>
                      </label>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Details
                    </h2>
                    <Lock className="w-5 h-5 text-green-600" />
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="flex gap-2 mb-6">
                    <button className="flex-1 p-3 border-2 border-teal-600 rounded-lg bg-teal-50">
                      <CreditCard className="w-6 h-6 mx-auto text-teal-600" />
                      <p className="text-xs mt-1 text-teal-700">Card</p>
                    </button>
                    <button className="flex-1 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                      <img src="/payment/payfast.svg" alt="PayFast" className="h-6 mx-auto" />
                      <p className="text-xs mt-1 text-gray-500">PayFast</p>
                    </button>
                    <button className="flex-1 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                      <img src="/payment/snapscan.svg" alt="SnapScan" className="h-6 mx-auto" />
                      <p className="text-xs mt-1 text-gray-500">SnapScan</p>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <Input
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <Input
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        placeholder="JANE SMITH"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <Input
                          value={paymentData.expiry}
                          onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <Input
                          type="password"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          placeholder="•••"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={paymentData.saveCard}
                        onChange={(e) => setPaymentData({ ...paymentData, saveCard: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <label htmlFor="saveCard" className="text-sm text-gray-600">
                        Save card for future purchases
                      </label>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Shipping Summary */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}{shippingData.apartment && `, ${shippingData.apartment}`}<br />
                    {shippingData.city}, {shippingData.province} {shippingData.postalCode}<br />
                    {shippingData.phone}
                  </p>
                </Card>

                {/* Delivery Summary */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Delivery Method</h3>
                    <button
                      onClick={() => setCurrentStep('delivery')}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {selectedDelivery.label} - {selectedDelivery.days}
                  </p>
                </Card>

                {/* Payment Summary */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-600">
                      •••• •••• •••• {paymentData.cardNumber.slice(-4) || '0000'}
                    </p>
                  </div>
                </Card>

                {/* Items Summary */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className={currentStepIndex === 0 ? 'invisible' : ''}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {currentStep === 'review' ? (
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Place Order - ${formatPrice(orderTotal)}`
                )}
              </Button>
            ) : (
              <Button onClick={goToNextStep}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Items Preview */}
            <div className="space-y-3 pb-4 border-b">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{item.name}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{items.length - 3} more items
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 py-4 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{formatPrice(selectedDelivery.price)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">
                {formatPrice(orderTotal)}
              </span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 p-3 bg-gray-50 rounded-lg">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Secure SSL Checkout</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
