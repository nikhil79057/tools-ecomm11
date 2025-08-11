# KeywordPro - Professional Keyword Research SaaS

## Overview

KeywordPro is a comprehensive SaaS platform that provides professional keyword research tools for Amazon and Flipkart sellers. The application follows a subscription-based model where users can access micro-tools for ₹5 per tool per month, billed annually. The platform includes a public marketing website, seller dashboard, admin portal, and specialized keyword research functionality with AI-powered insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with structured error handling and logging middleware

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Key Tables**: 
  - Users (with Replit Auth integration)
  - Tools (subscription-based micro-tools)
  - Subscriptions (user tool access management)
  - Keyword research data and usage statistics
  - CMS content for editable landing page sections

### Authentication & Authorization
- **Primary Auth**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Role-based Access**: Admin and seller user roles with route protection
- **Security**: JWT tokens, secure cookies, and CSRF protection

### Key Features Architecture
- **Multi-tenant Design**: Role-based access with admin portal and seller dashboard
- **Subscription Management**: Tool-based subscription system with usage tracking
- **Keyword Research Tool**: Platform-specific research (Amazon/Flipkart) with export capabilities
- **CMS Integration**: Editable landing page content through admin interface
- **Analytics Dashboard**: Usage statistics and subscription metrics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **express**: Web application framework
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Frontend build tool with HMR support
- **TypeScript**: Static type checking across full stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Payment Integration (Planned)
- **Razorpay**: Payment processing for subscriptions and invoicing
- **PDF Generation**: Document creation for invoices and reports
- **Email Service**: Transactional emails via Nodemailer or SendGrid

### Database & Infrastructure
- **Neon**: Serverless PostgreSQL hosting
- **Replit**: Development environment and deployment platform
- **Session Storage**: PostgreSQL-based session persistence

The application is designed as a monorepo with shared TypeScript types and utilities between client and server, enabling type safety across the full stack while maintaining clear separation of concerns.