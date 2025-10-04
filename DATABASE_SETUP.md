# 🗄️ PostgreSQL Database Integration Complete!

Your portfolio application is now connected to the external PostgreSQL database.

## ✅ What Was Configured

### Database Connection
- **Host**: 210.79.129.8
- **Port**: 5432
- **Database**: portfolio-data
- **User**: postgres
- **SSL Mode**: prefer
- **Connection Timeout**: 10 seconds

### Files Added/Updated

1. **`.env.local`** - Database connection string
   ```
   DATABASE_URL="postgresql://postgres:***@210.79.129.8:5432/portfolio-data?connect_timeout=10&sslmode=prefer"
   ```

2. **`prisma/schema.prisma`** - Database schema with:
   - BlogPost model
   - Course model
   - CourseCurriculum model
   - CourseEnrollment model
   - ContactSubmission model
   - Analytics model
   - PaymentStatus enum

3. **`src/lib/db.ts`** - Prisma client initialization

4. **`src/app/api/blog/route.ts`** - Blog API endpoints (GET, POST)

5. **`src/app/api/blog/[id]/route.ts`** - Single blog post endpoint

6. **`package.json`** - Added Prisma dependencies and scripts:
   ```json
   "@prisma/client": "^6.16.3",
   "pg": "^8.16.3",
   "prisma": "^6.16.3"
   ```

7. **`docker-compose.yml`** - Updated with DATABASE_URL

## 📊 Database Schema

### Tables Created

#### blog_posts
- id, title, content, excerpt
- author, publishedAt, updatedAt
- readTime, category, tags
- published, slug (unique)

#### courses
- id, title, description, price
- duration, level, category
- instructor, image, featured
- published, createdAt, updatedAt

#### course_curriculum
- id, courseId, title, duration, order

#### course_enrollments
- id, courseId, name, email, phone
- experience, motivation
- paymentStatus, paymentIntentId
- enrolledAt, updatedAt

#### contact_submissions
- id, name, email, subject, message
- createdAt, responded

#### analytics
- id, event, data (JSON), createdAt

## 🚀 How to Use

### Local Development

```bash
# 1. Ensure environment variable is set
source .env.local

# 2. Start development server
npm run dev
```

### With Docker

```bash
# Development mode
npm run docker:dev

# Production mode
npm run docker:prod
```

The DATABASE_URL is now embedded in docker-compose.yml for both modes.

## 🛠️ Available Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Prisma Studio
Access at: http://localhost:5555
```bash
source .env.local && npm run db:studio
```

## 📡 API Endpoints

### Blog Posts

#### GET /api/blog
Get all blog posts (published only)
```javascript
// Example
fetch('/api/blog')
  .then(res => res.json())
  .then(data => console.log(data.posts));

// With category filter
fetch('/api/blog?category=Development')
```

#### POST /api/blog
Create a new blog post
```javascript
fetch('/api/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Blog Post',
    content: '<p>Post content...</p>',
    excerpt: 'Short description',
    category: 'Development',
    tags: ['React', 'Next.js']
  })
})
```

#### GET /api/blog/[id]
Get a single blog post by ID
```javascript
fetch('/api/blog/1')
  .then(res => res.json())
  .then(data => console.log(data.post));
```

## 🔐 Security Notes

### Environment Variables
- ✅ Database password is stored in `.env.local` (gitignored)
- ✅ Docker containers receive DATABASE_URL as environment variable
- ✅ Connection uses SSL when available (sslmode=prefer)

### Best Practices
- Never commit `.env.local` to git
- Use different credentials for production
- Enable SSL certificate validation in production
- Implement API authentication for write operations
- Add rate limiting for public endpoints

## 🧪 Testing Database Connection

### Test with Prisma Studio
```bash
source .env.local && npx prisma studio
```

### Test with Node.js
Create a test file `test-db.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany();
  console.log('Blog posts:', posts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:
```bash
source .env.local && node test-db.js
```

## 📝 Next Steps

### 1. Add More API Endpoints
Create APIs for:
- Courses (`/api/courses`)
- Enrollments (`/api/enrollments`)
- Contact form (`/api/contact`)
- Analytics (`/api/analytics`)

### 2. Update Frontend Components
Modify pages to fetch data from APIs instead of static data:
- Blog listing page
- Course catalog
- Admin dashboard

### 3. Add Seed Data
Create `prisma/seed.ts` to populate initial data:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.create({
    data: {
      title: 'Welcome Post',
      content: 'Hello world!',
      slug: 'welcome-post',
      category: 'General',
      tags: [],
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `npx prisma db seed`

### 4. Implement Authentication
For admin features:
- Use NextAuth.js
- Protect write endpoints
- Add user roles

### 5. Add Database Migrations
For production, use migrations instead of `db push`:
```bash
npx prisma migrate dev --name init
npx prisma migrate deploy  # For production
```

## 🐛 Troubleshooting

### Connection Refused
```bash
# Check if database is accessible
ping 210.79.129.8

# Test PostgreSQL connection
psql -h 210.79.129.8 -p 5432 -U postgres -d portfolio-data
```

### SSL Certificate Issues
If you need SSL certificates:
1. Place certificates in a secure location
2. Update DATABASE_URL with certificate paths:
   ```
   ?sslmode=require&sslcert=/path/to/cert&sslkey=/path/to/key
   ```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Schema Out of Sync
```bash
source .env.local && npx prisma db push
```

### Environment Variable Not Found
```bash
# Check if .env.local exists
cat .env.local

# Source it before running commands
source .env.local && npm run dev
```

## 📊 Database Management

### Backup
```bash
# Using pg_dump
pg_dump -h 210.79.129.8 -p 5432 -U postgres portfolio-data > backup.sql
```

### Restore
```bash
psql -h 210.79.129.8 -p 5432 -U postgres portfolio-data < backup.sql
```

### View Tables
```bash
psql -h 210.79.129.8 -p 5432 -U postgres -d portfolio-data

# Inside psql:
\dt              # List tables
\d blog_posts    # Describe table
SELECT * FROM blog_posts;
```

## 🎉 Success!

Your portfolio is now connected to PostgreSQL with:
- ✅ External database connection (210.79.129.8)
- ✅ Prisma ORM configured
- ✅ Database schema synced
- ✅ Blog API endpoints created
- ✅ Docker integration updated
- ✅ Development environment ready

### Quick Test

1. Start the app:
   ```bash
   npm run dev
   ```

2. Create a blog post:
   - Visit: http://localhost:3000/blog/write
   - Fill in the form
   - Click "Publish Post"

3. View in database:
   ```bash
   source .env.local && npx prisma studio
   ```
   - Open: http://localhost:5555
   - Check `blog_posts` table

---

**Database Status**: ✅ Connected & Ready  
**Schema Version**: 1.0.0  
**Last Updated**: October 4, 2025

Need help? Check the troubleshooting section above!

