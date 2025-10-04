# Portfolio Website - Prashant Kumar Mishra

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
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod

## 📋 Prerequisites

### Option 1: Local Development
- Node.js 18+ installed
- npm or yarn package manager

### Option 2: Docker (Recommended)
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🛠️ Installation

### Option A: Run with Docker (Recommended) 🐳

**Quick Start with Secure Password:**
```bash
# Clone the repository
git clone <repository-url>
cd portfolio-website

# Start development server (will prompt for password)
npm run docker:dev

# When prompted, enter PostgreSQL password:
# 🔐 Enter PostgreSQL password: ********

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

📖 **Full documentation:**
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Complete Docker guide
- [SECURE_SETUP.md](./SECURE_SETUP.md) - Secure password handling
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration

---

### Option B: Run Locally (Without Docker)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── blog/              # Blog pages
│   │   │   ├── [id]/         # Individual blog post
│   │   │   └── write/        # Write new blog post
│   │   ├── courses/           # Course pages
│   │   │   └── [id]/         # Individual course detail
│   │   ├── projects/          # Projects showcase
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navigation.tsx     # Navigation bar
│   │   ├── Footer.tsx         # Footer component
│   │   └── RichTextEditor.tsx # TipTap editor
│   └── lib/                   # Utility functions
│       ├── storage.ts         # LocalStorage utilities
│       └── config.ts          # App configuration
├── public/                    # Static assets
│   ├── portfolio.jpeg        # Profile image
│   └── resume.pdf           # Resume file
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
└── next.config.ts          # Next.js config
```

## 🎨 Customization

### Update Personal Information

1. **Edit `src/app/page.tsx`**: Update your name, bio, skills, and contact information
2. **Replace `public/portfolio.jpeg`**: Add your own profile photo
3. **Replace `public/resume.pdf`**: Add your resume
4. **Edit `src/components/Footer.tsx`**: Update footer links and information

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
4. Publish the post (stored in localStorage)

### Add Courses

Edit `src/app/courses/page.tsx` to add or modify courses:
- Course title and description
- Price and duration
- Learning outcomes
- Curriculum

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Features in Detail

### Navigation
- Smooth scrolling to sections on home page
- Responsive mobile menu
- Active link highlighting

### Blog System
- Rich text editor with formatting options
- Category and tag filtering
- Read time estimation
- Responsive design

### Course Catalog
- Featured courses section
- Category filtering
- Detailed course pages with curriculum
- Contact-based enrollment

### Admin Dashboard
- Simple statistics overview
- Content management interface

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
3. Deploy automatically

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

## 📝 Data Storage

Currently, the application uses **localStorage** for:
- Blog posts
- Course enrollments (if added)
- User preferences

For production use with multiple users, consider integrating:
- A database (PostgreSQL, MongoDB)
- A CMS (Contentful, Sanity)
- A backend API

## 🤝 Contributing

Feel free to fork this repository and customize it for your own portfolio!

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Prashant Kumar Mishra**
- Email: prshntmishra033@gmail.com
- Phone: +91-9899683318
- LinkedIn: [prashantkm](https://www.linkedin.com/in/prashantkm/)
- GitHub: [prashantkmishra](https://github.com/prashantkmishra)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- TipTap for the rich text editor
- Lucide for the beautiful icons

---

Made with ❤️ by Prashant Kumar Mishra
