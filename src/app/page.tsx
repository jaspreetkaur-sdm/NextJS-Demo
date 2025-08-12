import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Next.js Secure Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            A modern, secure, and modular Next.js application with authentication,
            database integration, and comprehensive security measures.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/categories"
              className="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Manage Categories
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔐 Security First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Rate limiting, CSRF protection, secure headers, password hashing,
                and input validation.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔑 Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                NextAuth.js with credentials and OAuth providers, protected routes,
                and session management.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🗃️ Database
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Raw PostgreSQL integration with connection pooling and
                parameterized queries.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                ⚡ Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with Next.js 15, Turbopack, TypeScript, and optimized
                for production.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🎨 Modern UI
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailwind CSS, responsive design, reusable components,
                and dark mode support.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔧 Developer Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                TypeScript, ESLint, Prettier, form validation with Zod,
                and comprehensive tooling.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Built with ❤️ using Next.js, TypeScript, and PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
