'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  ChevronRight, 
  Search, 
  Filter,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock orders data
const orders = [
  {
    id: 'ORD-001234',
    date: '2024-01-15',
    status: 'delivered',
    total: 2450,
    items: [
      { name: 'Environ Focus Care Youth+ Peptide Complex', qty: 1, price: 1250 },
      { name: 'Lamelle Serra Hydrating Serum', qty: 1, price: 799 },
      { name: 'Heliocare SPF50 Gel', qty: 1, price: 401 },
    ],
    tracking: 'SAF123456789',
  },
  {
    id: 'ORD-001189',
    date: '2024-01-02',
    status: 'delivered',
    total: 1899,
    items: [
      { name: 'SkinCeuticals C E Ferulic', qty: 1, price: 1499 },
      { name: 'Cetaphil Gentle Cleanser', qty: 1, price: 400 },
    ],
    tracking: 'SAF987654321',
  },
  {
    id: 'ORD-001145',
    date: '2023-12-20',
    status: 'delivered',
    total: 3200,
    items: [
      { name: 'Environ AVST Moisturiser', qty: 1, price: 1600 },
      { name: 'Lamelle Clarity Active Cleanse', qty: 2, price: 1600 },
    ],
    tracking: 'SAF456789123',
  },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link href="/account" className="text-gray-500 hover:text-gray-700">
          Account
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">{orders.length} orders placed</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </Card>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                {/* Order Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </Badge>
                      <p className="font-semibold text-gray-900">
                        R{order.total.toLocaleString()}
                      </p>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedOrder === order.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-4 sm:p-6 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                </div>
                              </div>
                              <p className="font-medium text-gray-900">R{item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.tracking && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">Tracking Number</p>
                            <p className="font-medium text-gray-900">{order.tracking}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
