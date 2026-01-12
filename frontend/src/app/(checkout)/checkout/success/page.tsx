'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Package, 
  Mail, 
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#f0abfc', '#fbbf24'],
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We're preparing your skincare essentials.
        </p>

        {/* Order Details Card */}
        <Card className="p-6 mb-8 text-left">
          <div className="flex items-center justify-between pb-4 border-b mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-semibold text-gray-900">{orderNumber}</p>
            </div>
            <Package className="w-8 h-8 text-teal-600" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Confirmation Email</p>
                <p className="text-sm text-gray-500">
                  A confirmation email has been sent with your order details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-500">
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Tracking</p>
                <p className="text-sm text-gray-500">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/account/orders">
              View Order Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/products">
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <p className="text-sm text-gray-500 mt-8">
          Need help?{' '}
          <Link href="/contact" className="text-teal-600 hover:text-teal-700">
            Contact our support team
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
