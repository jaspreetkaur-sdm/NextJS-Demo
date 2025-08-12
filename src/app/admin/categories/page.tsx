'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    imageUrl: '',
    isActive: true,
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?limit=50');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: '',
          description: '',
          slug: '',
          imageUrl: '',
          isActive: true,
        });
      } else {
        setError(result.error || 'Failed to save category');
      }
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      imageUrl: category.imageUrl || '',
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
      } else {
        setError(result.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  if (loading) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600\"></div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50 dark:bg-gray-900 p-6\">
      <div className=\"max-w-7xl mx-auto\">
        {/* Header */}
        <div className=\"mb-8\">
          <div className=\"flex items-center justify-between\">
            <div>
              <h1 className=\"text-3xl font-bold text-gray-900 dark:text-white\">
                Categories Management
              </h1>
              <p className=\"text-gray-600 dark:text-gray-300 mt-2\">
                Manage your product categories
              </p>
            </div>
            <div className=\"flex gap-4\">
              <Link
                href=\"/admin/products\"
                className=\"bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors\"
              >
                Manage Products
              </Link>
              <Button
                onClick={() => setShowForm(!showForm)}
                className=\"bg-blue-600 hover:bg-blue-700\"
              >
                {showForm ? 'Cancel' : 'Add Category'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6\">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className=\"bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8\">
            <h2 className=\"text-xl font-semibold mb-4 text-gray-900 dark:text-white\">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className=\"space-y-4\">
              <div className=\"grid md:grid-cols-2 gap-4\">
                <Input
                  label=\"Name\"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
                
                <Input
                  label=\"Slug\"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className=\"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2\">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className=\"w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white\"
                  rows={3}
                />
              </div>

              <Input
                label=\"Image URL\"
                type=\"url\"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />

              <div className=\"flex items-center gap-2\">
                <input
                  type=\"checkbox\"
                  id=\"isActive\"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className=\"rounded border-gray-300 text-blue-600 focus:ring-blue-500\"
                />
                <label htmlFor=\"isActive\" className=\"text-sm text-gray-700 dark:text-gray-300\">
                  Active
                </label>
              </div>

              <div className=\"flex gap-4\">
                <Button type=\"submit\" className=\"bg-blue-600 hover:bg-blue-700\">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button
                  type=\"button\"
                  variant=\"outline\"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    setFormData({
                      name: '',
                      description: '',
                      slug: '',
                      imageUrl: '',
                      isActive: true,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Table */}
        <div className=\"bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden\">
          <div className=\"p-6 border-b border-gray-200 dark:border-gray-700\">
            <h2 className=\"text-lg font-medium text-gray-900 dark:text-white\">
              Categories ({categories.length})
            </h2>
          </div>
          
          <div className=\"overflow-x-auto\">
            <table className=\"min-w-full divide-y divide-gray-200 dark:divide-gray-700\">
              <thead className=\"bg-gray-50 dark:bg-gray-700\">
                <tr>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
                    Name
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
                    Slug
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
                    Status
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
                    Created
                  </th>
                  <th className=\"px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider\">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className=\"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700\">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <div>
                        <div className=\"text-sm font-medium text-gray-900 dark:text-white\">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className=\"text-sm text-gray-500 dark:text-gray-400\">
                            {category.description.length > 50 
                              ? `${category.description.substring(0, 50)}...`
                              : category.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white\">
                      {category.slug}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400\">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-right text-sm font-medium\">
                      <div className=\"flex justify-end gap-2\">
                        <button
                          onClick={() => handleEdit(category)}
                          className=\"text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300\"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className=\"text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300\"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {categories.length === 0 && (
              <div className=\"text-center py-8 text-gray-500 dark:text-gray-400\">
                No categories found. Create your first category to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
