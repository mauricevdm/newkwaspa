'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Gift,
  LogOut,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store';

// Mock data
const recentOrders = [
  {
    id: 'ORD-001234',
    date: '2024-01-15',
    status: 'delivered',
    total: 2450,
    items: 3,
    image: '/products/serum-1.jpg',
  },
  {
    id: 'ORD-001189',
    date: '2024-01-02',
    status: 'delivered',
    total: 1899,
    items: 2,
    image: '/products/moisturizer-1.jpg',
  },
];

const accountMenuItems = [
  { icon: Package, label: 'My Orders', href: '/account/orders', badge: '2' },
  { icon: Heart, label: 'Wishlist', href: '/account/wishlist', badge: '5' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', href: '/account/payment' },
  { icon: Bell, label: 'Notifications', href: '/account/notifications' },
  { icon: Gift, label: 'Rewards', href: '/account/rewards', badge: '150 pts' },
];

export default function AccountDashboard() {
  const { user, logout } = useAuthStore();

  // Use mock user if not authenticated
  const displayUser = user || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            {/* Profile Header */}
            <div className="text-center pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {displayUser.firstName?.[0]}{displayUser.lastName?.[0]}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900">
                {displayUser.firstName} {displayUser.lastName}
              </h2>
              <p className="text-sm text-gray-500">{displayUser.email}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">Gold Member</span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="py-4 space-y-1">
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-4 border-t">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-8">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {displayUser.firstName}!
                </h1>
                <p className="text-teal-100">
                  Your skin is looking great! Ready for your next routine refresh?
                </p>
              </div>
              <Sparkles className="w-12 h-12 text-teal-200" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-teal-200 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-teal-200 text-sm">Reward Points</p>
                <p className="text-2xl font-bold">150</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-teal-200 text-sm">Saved Items</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/skin-analysis">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-600">
                      AI Skin Analysis
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get personalized recommendations
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                </div>
              </Card>
            </Link>
            <Link href="/routine-builder">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-600">
                      Build Your Routine
                    </h3>
                    <p className="text-sm text-gray-500">
                      Customize your skincare regimen
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.items} items • {new Date(order.date).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      R{order.total.toLocaleString()}
                    </p>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Skin Profile */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Skin Profile</h2>
              <Button variant="outline" size="sm">
                Update Profile
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Skin Type</p>
                <p className="font-medium text-gray-900">Combination</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Primary Concerns</p>
                <p className="font-medium text-gray-900">Hydration, Aging</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Sensitivity</p>
                <p className="font-medium text-gray-900">Low</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Last Analysis</p>
                <p className="font-medium text-gray-900">2 weeks ago</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
