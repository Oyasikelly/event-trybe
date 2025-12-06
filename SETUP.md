# EventTrybe - Setup Guide

Complete installation and deployment guide for developers.

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Resend account (for emails)
- npm or yarn package manager

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Oyasikelly/event-trybe.git
cd event-trybe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory. Use `.env.example` as a template:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eventtrybe"

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="EventTrybe <noreply@yourdomain.com>"

# Cron Job Security
CRON_SECRET="your-random-secret-key-here"
```

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET` - Same secret from local
   - `RESEND_API_KEY` - Your Resend API key
   - `EMAIL_FROM` - Your verified sender email
   - `CRON_SECRET` - Same secret from local

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically sets up cron jobs from `vercel.json`

### Database Providers

Choose a PostgreSQL provider:

- **[Vercel Postgres](https://vercel.com/storage/postgres)** - Integrated with Vercel
- **[Supabase](https://supabase.com/)** - Free tier available
- **[Neon](https://neon.tech/)** - Serverless Postgres
- **[Railway](https://railway.app/)** - Simple deployment

## 📧 Email Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your email address
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_`)
5. Add to environment variables

**Free Tier:** 100 emails/day

For production, verify your domain in Resend for better deliverability.

## 🔧 Configuration

### Cron Jobs

Event reminders run via Vercel Cron Jobs (configured in `vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```

Runs every hour to send 24h and 1h reminders.

### Database Schema

View complete schema: `prisma/schema.prisma`

**Key Models:**
- `User` - User accounts and authentication
- `Event` - Event details and configuration
- `Registration` - Event registrations and tickets
- `Notification` - User notifications

**Run Migrations:**
```bash
npx prisma migrate dev
```

**View Database:**
```bash
npx prisma studio
```

## 📁 Project Structure

```
event-trybe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── events/        # Event management
│   │   │   ├── registrations/ # Registration handling
│   │   │   └── cron/          # Scheduled jobs
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── events/           # Event-specific components
│   │   ├── layout/           # Layout components
│   │   └── profile/          # User profile components
│   ├── lib/                   # Utilities and helpers
│   │   ├── email/            # Email templates and services
│   │   ├── utils/            # Helper functions
│   │   ├── validations/      # Zod validation schemas
│   │   ├── auth.ts           # Authentication logic
│   │   └── prisma.ts         # Prisma client
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.local                 # Environment variables (not committed)
├── .env.example               # Environment template
└── vercel.json                # Vercel configuration
```

## 🧪 Testing

### Manual Testing Flow

1. **Create an event**
   - Set future date/time
   - Publish the event

2. **Register for event**
   - Use different account or incognito
   - Check confirmation email

3. **Test QR check-in**
   - Go to event check-in page
   - Scan QR code from email

4. **Test reminders**
   ```bash
   curl -X POST http://localhost:3000/api/cron/send-reminders \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### Running Tests

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (test)
npm run build
```

## 🔒 Security

- All passwords hashed with bcrypt
- Email verification required
- CRON endpoints protected with secret keys
- Environment variables for sensitive data
- CSRF protection via Next.js

## 📊 Monitoring

### Vercel Dashboard

Monitor your deployment:
- Function logs
- Cron job execution
- Error tracking
- Performance metrics

### Database Monitoring

Use Prisma Studio for database inspection:
```bash
npx prisma studio
```

## 🐛 Troubleshooting

### Common Issues

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure migrations are applied

**Email not sending:**
- Check `RESEND_API_KEY` is valid
- Verify sender email in Resend dashboard
- Check Resend rate limits

**Cron jobs not running:**
- Verify `CRON_SECRET` matches
- Check Vercel cron job logs
- Ensure `vercel.json` is committed

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

Need help? [Open an issue](https://github.com/Oyasikelly/event-trybe/issues)
