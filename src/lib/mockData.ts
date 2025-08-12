// Mock data for the e-commerce admin interface

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  categoryId?: number;
  categoryName?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AnalyticsData {
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalValue: number;
    lowStockProducts: number;
  };
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  priceRanges: Array<{
    range: string;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    products: number;
  }>;
  inventoryValue: Array<{
    month: string;
    value: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    value: number;
  }>;
  lowStockAlerts: Array<{
    id: number;
    name: string;
    quantity: number;
    category: string;
  }>;
}

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    isActive: true,
    productCount: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel items',
    isActive: true,
    productCount: 23,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and gardening supplies',
    isActive: true,
    productCount: 18,
    createdAt: '2024-01-17T09:45:00Z',
    updatedAt: '2024-01-17T09:45:00Z',
  },
  {
    id: 4,
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials',
    isActive: false,
    productCount: 8,
    createdAt: '2024-01-18T16:10:00Z',
    updatedAt: '2024-01-20T11:25:00Z',
  },
  {
    id: 5,
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment and fitness gear',
    isActive: true,
    productCount: 12,
    createdAt: '2024-01-19T13:30:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    slug: 'wireless-bluetooth-headphones',
    price: 199.99,
    comparePrice: 249.99,
    sku: 'WBH-001',
    quantity: 45,
    categoryId: 1,
    categoryName: 'Electronics',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    name: 'Smartphone Case',
    description: 'Protective case for smartphones with kickstand',
    slug: 'smartphone-case',
    price: 24.99,
    sku: 'SPC-002',
    quantity: 120,
    categoryId: 1,
    categoryName: 'Electronics',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-21T11:15:00Z',
    updatedAt: '2024-01-21T11:15:00Z',
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    description: '100% organic cotton t-shirt in various colors',
    slug: 'cotton-t-shirt',
    price: 29.99,
    comparePrice: 39.99,
    sku: 'CTS-003',
    quantity: 5,
    categoryId: 2,
    categoryName: 'Clothing',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-22T14:20:00Z',
  },
  {
    id: 4,
    name: 'Denim Jeans',
    description: 'Classic straight-fit denim jeans',
    slug: 'denim-jeans',
    price: 79.99,
    sku: 'DJ-004',
    quantity: 0,
    categoryId: 2,
    categoryName: 'Clothing',
    isActive: false,
    isFeatured: false,
    createdAt: '2024-01-23T16:45:00Z',
    updatedAt: '2024-01-25T09:30:00Z',
  },
  {
    id: 5,
    name: 'Garden Watering Can',
    description: 'Large capacity watering can for gardens',
    slug: 'garden-watering-can',
    price: 34.99,
    sku: 'GWC-005',
    quantity: 25,
    categoryId: 3,
    categoryName: 'Home & Garden',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-24T12:10:00Z',
    updatedAt: '2024-01-24T12:10:00Z',
  },
  {
    id: 6,
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with USB charging port',
    slug: 'led-desk-lamp',
    price: 59.99,
    sku: 'LDL-006',
    quantity: 8,
    categoryId: 3,
    categoryName: 'Home & Garden',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-25T15:30:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
  },
  {
    id: 7,
    name: 'Programming Guide',
    description: 'Complete guide to modern web development',
    slug: 'programming-guide',
    price: 49.99,
    sku: 'PG-007',
    quantity: 15,
    categoryId: 4,
    categoryName: 'Books',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-26T09:20:00Z',
    updatedAt: '2024-01-26T09:20:00Z',
  },
  {
    id: 8,
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap',
    slug: 'yoga-mat',
    price: 39.99,
    sku: 'YM-008',
    quantity: 3,
    categoryId: 5,
    categoryName: 'Sports & Fitness',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-27T11:40:00Z',
    updatedAt: '2024-01-27T11:40:00Z',
  },
  {
    id: 9,
    name: '4K USB Webcam',
    description: 'High-definition webcam for video conferencing',
    slug: '4k-usb-webcam',
    price: 129.99,
    comparePrice: 159.99,
    sku: '4KW-009',
    quantity: 32,
    categoryId: 1,
    categoryName: 'Electronics',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-28T13:15:00Z',
    updatedAt: '2024-01-28T13:15:00Z',
  },
  {
    id: 10,
    name: 'Running Shoes',
    description: 'Lightweight running shoes for all terrains',
    slug: 'running-shoes',
    price: 89.99,
    sku: 'RS-010',
    quantity: 2,
    categoryId: 5,
    categoryName: 'Sports & Fitness',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-29T10:25:00Z',
    updatedAt: '2024-01-29T10:25:00Z',
  },
];

// Mock User
export const mockUser: User = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
};

// Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
  overview: {
    totalProducts: mockProducts.length,
    totalCategories: mockCategories.filter(c => c.isActive).length,
    totalValue: mockProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    lowStockProducts: mockProducts.filter(p => p.quantity <= 10 && p.quantity > 0).length,
  },
  categoryDistribution: [
    { name: 'Electronics', value: 4, color: '#8884d8' },
    { name: 'Clothing', value: 2, color: '#82ca9d' },
    { name: 'Home & Garden', value: 2, color: '#ffc658' },
    { name: 'Books', value: 1, color: '#ff7c7c' },
    { name: 'Sports & Fitness', value: 2, color: '#8dd1e1' },
  ],
  priceRanges: [
    { range: '$0-25', count: 1 },
    { range: '$26-50', count: 4 },
    { range: '$51-100', count: 3 },
    { range: '$101-200', count: 2 },
    { range: '$200+', count: 0 },
  ],
  monthlyTrend: [
    { month: 'Jan', products: 10 },
    { month: 'Feb', products: 8 },
    { month: 'Mar', products: 12 },
    { month: 'Apr', products: 15 },
    { month: 'May', products: 18 },
    { month: 'Jun', products: 22 },
  ],
  inventoryValue: [
    { month: 'Jan', value: 12500 },
    { month: 'Feb', value: 15200 },
    { month: 'Mar', value: 18900 },
    { month: 'Apr', value: 22100 },
    { month: 'May', value: 25800 },
    { month: 'Jun', value: 28300 },
  ],
  topProducts: [
    {
      id: 2,
      name: 'Smartphone Case',
      category: 'Electronics',
      price: 24.99,
      quantity: 120,
      value: 2998.80,
    },
    {
      id: 9,
      name: '4K USB Webcam',
      category: 'Electronics',
      price: 129.99,
      quantity: 32,
      value: 4159.68,
    },
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 199.99,
      quantity: 45,
      value: 8999.55,
    },
    {
      id: 5,
      name: 'Garden Watering Can',
      category: 'Home & Garden',
      price: 34.99,
      quantity: 25,
      value: 874.75,
    },
    {
      id: 7,
      name: 'Programming Guide',
      category: 'Books',
      price: 49.99,
      quantity: 15,
      value: 749.85,
    },
  ],
  lowStockAlerts: [
    {
      id: 3,
      name: 'Cotton T-Shirt',
      quantity: 5,
      category: 'Clothing',
    },
    {
      id: 6,
      name: 'LED Desk Lamp',
      quantity: 8,
      category: 'Home & Garden',
    },
    {
      id: 8,
      name: 'Yoga Mat',
      quantity: 3,
      category: 'Sports & Fitness',
    },
    {
      id: 10,
      name: 'Running Shoes',
      quantity: 2,
      category: 'Sports & Fitness',
    },
  ],
};

// Utility functions for mock data operations
export class MockDataService {
  private static nextProductId = Math.max(...mockProducts.map(p => p.id)) + 1;
  private static nextCategoryId = Math.max(...mockCategories.map(c => c.id)) + 1;

  // Products
  static getProducts(filters?: {
    search?: string;
    categoryId?: number;
    limit?: number;
  }): Product[] {
    let products = [...mockProducts];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.sku?.toLowerCase().includes(search)
      );
    }

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.limit) {
      products = products.slice(0, filters.limit);
    }

    return products;
  }

  static getProduct(id: number): Product | undefined {
    return mockProducts.find(p => p.id === id);
  }

  static createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...data,
      id: this.nextProductId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockProducts.push(newProduct);
    this.updateCategoryProductCount();
    return newProduct;
  }

  static updateProduct(id: number, data: Partial<Product>): Product | null {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockProducts[index] = updatedProduct;
    this.updateCategoryProductCount();
    return updatedProduct;
  }

  static deleteProduct(id: number): boolean {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;

    mockProducts.splice(index, 1);
    this.updateCategoryProductCount();
    return true;
  }

  // Categories
  static getCategories(): Category[] {
    return [...mockCategories];
  }

  static getCategory(id: number): Category | undefined {
    return mockCategories.find(c => c.id === id);
  }

  static createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Category {
    const newCategory: Category = {
      ...data,
      id: this.nextCategoryId++,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCategories.push(newCategory);
    return newCategory;
  }

  static updateCategory(id: number, data: Partial<Category>): Category | null {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = {
      ...mockCategories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockCategories[index] = updatedCategory;
    return updatedCategory;
  }

  static deleteCategory(id: number): boolean {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) return false;

    // Remove category reference from products
    mockProducts.forEach(product => {
      if (product.categoryId === id) {
        product.categoryId = undefined;
        product.categoryName = undefined;
      }
    });

    mockCategories.splice(index, 1);
    return true;
  }

  // Analytics
  static getAnalytics(): AnalyticsData {
    // Recalculate with current data
    const activeCategories = mockCategories.filter(c => c.isActive);
    const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockProducts = mockProducts.filter(p => p.quantity <= 10 && p.quantity > 0);

    return {
      ...mockAnalytics,
      overview: {
        totalProducts: mockProducts.length,
        totalCategories: activeCategories.length,
        totalValue,
        lowStockProducts: lowStockProducts.length,
      },
      lowStockAlerts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        category: p.categoryName || 'Uncategorized',
      })),
    };
  }

  // User
  static getUser(): User {
    return mockUser;
  }

  // Helper methods
  private static updateCategoryProductCount() {
    mockCategories.forEach(category => {
      category.productCount = mockProducts.filter(p => p.categoryId === category.id).length;
    });
  }

  // Check if slug exists
  static isSlugExists(slug: string, excludeId?: number, type: 'product' | 'category' = 'product'): boolean {
    if (type === 'product') {
      return mockProducts.some(p => p.slug === slug && p.id !== excludeId);
    } else {
      return mockCategories.some(c => c.slug === slug && c.id !== excludeId);
    }
  }

  // Check if SKU exists
  static isSkuExists(sku: string, excludeId?: number): boolean {
    return mockProducts.some(p => p.sku === sku && p.id !== excludeId);
  }
}

// Initialize category product counts
MockDataService['updateCategoryProductCount']();
