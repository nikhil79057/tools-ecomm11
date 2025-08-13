# SkillSync - E-commerce Success Partner

A comprehensive SaaS platform providing powerful tools for e-commerce sellers to boost their online business success.

## 🚀 Features

### For Sellers
- **Keyword Research & Backend Formatter**: Research keywords for Amazon and Flipkart with search volume estimates
- **Competitor Analysis**: Analyze competitor products and pricing strategies
- **Product Listing Optimizer**: Optimize your product listings for better visibility
- **Sales Analytics Dashboard**: Track your sales performance and trends
- **Subscription Management**: Easy tool subscription and billing management
- **Email Notifications**: Automated welcome emails and invoice delivery

### For Admins
- **User Management**: Complete control over seller accounts and subscriptions
- **Tool Management**: Create, edit, and manage available tools
- **CMS System**: Edit landing page content via WYSIWYG editor
- **Analytics & Reporting**: Track MRR, churn rate, and usage trends
- **Manual Invoicing**: Generate and send custom invoices
- **Payment Processing**: Handle Razorpay webhooks and payment events

## 🛠️ Technology Stack

- **Frontend**: React.js (JavaScript) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MySQL (Hostinger)
- **Authentication**: JWT with refresh tokens
- **Payments**: Razorpay integration
- **Email**: Nodemailer for automated emails
- **PDF Generation**: PDFKit for invoices and reports

## 📋 Prerequisites

- Node.js 18+ 
- MySQL database (Hostinger recommended)
- Razorpay account
- SMTP email service (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd SkillSync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Database Setup
```bash
# Run the database migration
npm run db:migrate
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration (MySQL on Hostinger)
DB_HOST=your-hostinger-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=skillsync
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
RAZORPAY_PLAN_ID=your-razorpay-plan-id

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Hostinger MySQL Setup

1. **Create Database**:
   - Log in to your Hostinger control panel
   - Go to MySQL Databases
   - Create a new database named `skillsync`
   - Note down the database credentials

2. **Configure Connection**:
   - Update your `.env` file with the Hostinger MySQL credentials
   - Use the provided host, username, password, and database name

### Razorpay Setup

1. **Create Account**:
   - Sign up at [Razorpay](https://razorpay.com)
   - Complete KYC verification

2. **Get API Keys**:
   - Go to Settings > API Keys
   - Generate new API keys
   - Add them to your `.env` file

3. **Create Plan** (Optional):
   - Create a subscription plan in Razorpay dashboard
   - Add the plan ID to your `.env` file

4. **Configure Webhooks**:
   - Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `subscription.activated`, `subscription.cancelled`

### Email Setup

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in SMTP_PASS

2. **Other SMTP Services**:
   - Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS accordingly

## 📁 Project Structure

```
SkillSync/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── lib/           # Utilities
├── server/                # Node.js backend
│   ├── middleware/        # Authentication middleware
│   ├── services/          # Business logic services
│   └── routes.js          # API routes
├── scripts/               # Database migration scripts
├── shared/                # Shared schemas (legacy)
└── env.example            # Environment configuration template
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Tools
- `GET /api/tools` - Get all available tools
- `POST /api/tools/:toolId/subscribe` - Subscribe to tool

### Keyword Research
- `POST /api/keyword-research` - Research keywords
- `GET /api/keyword-research/history` - Get research history
- `POST /api/keyword-research/export` - Export as CSV

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions/:id/cancel` - Cancel subscription

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/tools` - Get all tools
- `POST /api/admin/tools` - Create new tool

### CMS
- `GET /api/cms/:section` - Get CMS content
- `PUT /api/cms/:section` - Update CMS content (Admin only)

## 🔐 Default Admin Account

After running the migration, a default admin account is created:

- **Email**: `admin@skillsync.com`
- **Password**: `admin123`

**Important**: Change the default password after first login!

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Update `FRONTEND_URL` to your production domain
- Ensure all API keys and secrets are properly configured

### Hostinger Deployment
1. Upload your code to Hostinger
2. Set up Node.js hosting
3. Configure environment variables
4. Set up domain and SSL certificate

## 📊 Monitoring & Analytics

The application includes built-in monitoring:
- Request logging
- Error tracking
- Usage statistics
- Payment analytics

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Input validation
- SQL injection prevention
- CORS configuration
- Helmet security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@skillsync.com
- Documentation: [Add your docs URL]
- Issues: [GitHub Issues URL]

## 🔄 Updates & Maintenance

- Regular security updates
- Database backups
- Performance monitoring
- Feature updates

---

**SkillSync** - Empowering e-commerce success through intelligent tools and analytics.
