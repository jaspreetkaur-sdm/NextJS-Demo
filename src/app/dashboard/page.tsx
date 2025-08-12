'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../../components/ui/Button';
import { BarChartComponent, PieChartComponent, LineChartComponent, AreaChartComponent } from '../../components/ui/Charts';
import { format } from 'date-fns';
import Link from 'next/link';

interface DashboardData {
  overview: {
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    featuredProducts: number;
    lowStockProducts: number;
    recentProducts: number;
  };
  inventory: {
    totalValue: number;
    averagePrice: number;
    totalQuantity: number;
  };
  categoryDistribution: Array<{
    name: string;
    productCount: number;
    totalQuantity: number;
    categoryValue: number;
  }>;
  priceRanges: Array<{
    range: string;
    count: number;
    totalQuantity: number;
  }>;
  topProducts: Array<{
    name: string;
    price: number;
    quantity: number;
    totalValue: number;
    categoryName: string;
  }>;
  lowStockProducts: Array<{
    name: string;
    quantity: number;
    sku: string;
    categoryName: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    productsCreated: number;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/analytics');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You need to be signed in to view this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button onClick={refreshData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare chart data
  const categoryChartData = dashboardData.categoryDistribution.map(cat => ({
    name: cat.name,
    value: cat.productCount,
  }));

  const priceRangeChartData = dashboardData.priceRanges.map(range => ({
    name: range.range,
    value: range.count,
  }));

  const monthlyTrendData = dashboardData.monthlyTrend
    .reverse()
    .map(item => ({
      name: format(new Date(item.month), 'MMM yyyy'),
      value: item.productsCreated,
    }));

  const inventoryValueData = dashboardData.categoryDistribution.map(cat => ({
    name: cat.name,
    value: cat.categoryValue,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                E-commerce Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Welcome back, {session.user?.name || 'Admin'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={refreshData} variant="outline" size="sm">
                🔄 Refresh
              </Button>
              <Link href="/admin/products" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Manage Products
              </Link>
              <Link href="/admin/categories" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                Manage Categories
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  📦
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.totalProducts}
                </p>
                <p className="text-xs text-green-600">
                  {dashboardData.overview.activeProducts} active
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  🏷️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.totalCategories}
                </p>
                <p className="text-xs text-blue-600">
                  {dashboardData.overview.featuredProducts} featured products
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inventory Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${dashboardData.inventory.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-600">
                  {dashboardData.inventory.totalQuantity} items
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {dashboardData.overview.lowStockProducts}
                </p>
                <p className="text-xs text-red-600">
                  Requires attention
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Products by Category
            </h3>
            <PieChartComponent data={categoryChartData} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Price Range Distribution
            </h3>
            <BarChartComponent data={priceRangeChartData} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Monthly Product Creation Trend
            </h3>
            <LineChartComponent data={monthlyTrendData} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Inventory Value by Category
            </h3>
            <AreaChartComponent data={inventoryValueData} />
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Top Products by Value
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Product
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.categoryName} • Qty: {product.quantity}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${product.totalValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.price} each
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Low Stock Alert
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Product
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.lowStockProducts.length > 0 ? (
                    dashboardData.lowStockProducts.slice(0, 5).map((product, index) => (
                      <tr key={index}>
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.categoryName} • SKU: {product.sku}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.quantity === 0 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {product.quantity} left
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-500">
                        🎉 All products are well stocked!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
