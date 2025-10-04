# Portfolio Website

A modern, responsive portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Home Page**: Introduction with profile image, skills showcase, and contact information
- **Projects Showcase**: Display of portfolio projects with descriptions and links
- **Blog Platform**: 
  - Blog listing with categories and featured posts
  - Individual blog post pages with syntax highlighting
  - Rich text editor for creating new blog posts
- **Courses Section**:
  - Course catalog with detailed information
  - Course detail pages with curriculum and learning outcomes
  - Contact-based enrollment system
- **Admin Dashboard**: Simple dashboard for managing content
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional design with smooth animations

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL with Prisma ORM
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod

## 📋 Prerequisites

### Option 1: Local Development
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (optional, for full features)

### Option 2: Docker (Recommended)
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🛠️ Installation

### Option A: Run with Docker (Recommended) 🐳

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-project

# Start development server (will prompt for database password)
npm run docker:dev

# OR start production server
npm run docker:prod
```

Access at: **http://localhost:3000**

**Available Docker Commands:**
```bash
npm run docker:dev      # Start development (prompts for password)
npm run docker:prod     # Start production (prompts for password)
npm run docker:build    # Build Docker images
npm run docker:stop     # Stop all containers
npm run docker:clean    # Stop containers and clean up
```

📖 **Docker Documentation:**
See docker-compose.yml and Dockerfile for configuration details.

---

### Option B: Run Locally (Without Docker)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd portfolio-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Create .env.local file
   echo 'DATABASE_URL="postgresql://user:password@localhost:5432/dbname"' > .env.local
   ```

4. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio-project/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── blog/              # Blog pages
│   │   ├── courses/           # Course pages
│   │   ├── projects/          # Projects showcase
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navigation.tsx     # Navigation bar
│   │   ├── Footer.tsx         # Footer component
│   │   ├── RichTextEditor.tsx # TipTap editor
│   │   └── VisitorTracker.tsx # Analytics tracker
│   └── lib/                   # Utility functions
│       ├── storage.ts         # Storage utilities
│       ├── config.ts          # App configuration
│       └── db.ts              # Database client
├── prisma/                    # Prisma schema and migrations
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Production Docker image
├── Dockerfile.dev             # Development Docker image
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind CSS config
└── next.config.ts           # Next.js config
```

## 🎨 Customization

### Update Personal Information

1. **Edit `src/app/page.tsx`**: Update your name, bio, skills, and contact information
2. **Edit `src/components/Navigation.tsx`**: Update navigation name
3. **Edit `src/components/Footer.tsx`**: Update footer information
4. **Replace `public/portfolio.jpeg`**: Add your own profile photo
5. **Replace `public/resume.pdf`**: Add your resume

### Configure Database

1. Update `.env` or `.env.local` with your database credentials
2. Run `npm run db:push` to sync the schema
3. Use `npm run db:studio` to manage data with Prisma Studio

### Add Projects

Edit `src/app/projects/page.tsx` to add your projects with:
- Title and description
- Technologies used
- Live demo and GitHub links
- Project images

### Add Blog Posts

1. Navigate to `/blog/write` in the application
2. Use the rich text editor to create content
3. Add title, excerpt, category, and tags
4. Publish the post

### Add Courses

1. Navigate to `/courses/create` in the application
2. Fill in course details
3. Add curriculum items
4. Publish the course

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🐳 Docker Commands

- `npm run docker:dev` - Start development with Docker
- `npm run docker:prod` - Start production with Docker
- `npm run docker:build` - Build Docker images
- `npm run docker:stop` - Stop all containers
- `npm run docker:clean` - Stop and clean up containers

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)
- Large screens (1280px and up)

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (DATABASE_URL)
4. Deploy automatically

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables

### Deploy with Docker

1. Build the production image:
   ```bash
   docker build -t portfolio-app:latest .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:3000 -e DATABASE_URL="your_db_url" portfolio-app:latest
   ```

## 🔒 Security

- Environment variables are used for sensitive data
- `.env` and `.env.local` files are gitignored
- Database credentials are never committed to version control
- Use strong passwords for production databases
- Enable SSL for production database connections

## 📝 Database Schema

The application uses PostgreSQL with the following main tables:
- `BlogPost` - Blog posts with content and metadata
- `Course` - Course catalog with details
- `CourseCurriculum` - Course modules and lessons
- `CourseEnrollment` - Student enrollments
- `ContactSubmission` - Contact form submissions
- `Analytics` - Visitor tracking and analytics
- `User` - Admin users for authentication

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Prisma client not found
```bash
npm run db:generate
```

### Database connection failed
- Check DATABASE_URL in `.env.local`
- Verify database is running
- Check firewall settings

### Docker build fails
```bash
# Clean rebuild
npm run docker:clean
docker system prune -a
npm run docker:build
```

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- TipTap for the rich text editor
- Lucide for the beautiful icons

---

Made with ❤️ by Prashant Kumar Mishra
