# Next.js Secure Demo Application

A modern, secure, and modular Next.js application built with TypeScript, featuring authentication, database integration, and comprehensive security measures.

## 🚀 Features

### Security
- ✅ Comprehensive security headers (CSP, XSS protection, etc.)
- ✅ Rate limiting middleware
- ✅ Input validation with Zod
- ✅ Password hashing with bcryptjs
- ✅ JWT token management
- ✅ CORS protection
- ✅ ESLint security plugin
- ✅ Environment variable validation

### Authentication
- ✅ NextAuth.js integration
- ✅ Credential-based authentication
- ✅ Google OAuth support
- ✅ Session management
- ✅ Protected routes

### Architecture
- ✅ Modular folder structure
- ✅ Type-safe development with TypeScript
- ✅ Database integration with raw PostgreSQL
- ✅ Reusable UI components
- ✅ Form validation with React Hook Form
- ✅ Tailwind CSS for styling

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Protected pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database configuration
│   ├── utils/            # Helper functions
│   ├── validations/      # Schema validations
│   └── constants/        # App constants
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── middleware/           # Next.js middleware
└── styles/               # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_demo"
NEXTAUTH_SECRET="your-secure-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-here"
# ... other variables
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize database tables:
```bash
npm run db:init
```

3. (Optional) Seed the database with demo users:
```bash
npm run db:seed
```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run db:init` - Initialize database tables
- `npm run db:seed` - Seed database with demo users
- `npm run db:reset` - Reset database (manual process)

## 🔐 Security Features

### Headers
- Content Security Policy (CSP)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- X-XSS-Protection
- Strict Transport Security (HTTPS)
- Referrer Policy

### Authentication
- Secure password hashing (bcrypt)
- JWT token validation
- Session management
- OAuth integration
- Protected route middleware

### Input Validation
- Zod schema validation
- XSS prevention
- SQL injection prevention
- Rate limiting

## 🗃️ Database Schema

The application uses raw PostgreSQL with custom models:

- **users**: User accounts with roles and authentication data
- **accounts**: OAuth account linking for social login
- **sessions**: Session management for NextAuth.js
- **verification_tokens**: Email verification and password reset tokens

## 🎨 UI Components

Built with Tailwind CSS and includes:
- Button variants with loading states
- Form inputs with error handling
- Responsive layouts
- Dark mode support (configurable)

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Raw PostgreSQL with pg driver
- **Authentication**: NextAuth.js with custom adapter
- **Validation**: Zod
- **Forms**: React Hook Form
- **Security**: Helmet, CORS, Rate Limiting
