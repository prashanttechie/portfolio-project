// Simple localStorage-based storage system for demo purposes
// In a real application, you would use a proper database

export interface Enrollment {
  id: string;
  courseId: number;
  courseName: string;
  studentName: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  enrollmentDate: string;
  status: 'enrolled' | 'paid' | 'completed' | 'dropped';
  totalPaid: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
}

class Storage {
  private getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Enrollment methods
  getEnrollments(): Enrollment[] {
    return this.getFromStorage<Enrollment>('enrollments');
  }

  addEnrollment(enrollment: Omit<Enrollment, 'id' | 'enrollmentDate' | 'status' | 'totalPaid'>): Enrollment {
    const enrollments = this.getEnrollments();
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: Date.now().toString(),
      enrollmentDate: new Date().toISOString(),
      status: 'enrolled',
      totalPaid: 0
    };
    
    enrollments.push(newEnrollment);
    this.saveToStorage('enrollments', enrollments);
    return newEnrollment;
  }

  updateEnrollmentStatus(id: string, status: Enrollment['status'], totalPaid?: number): void {
    const enrollments = this.getEnrollments();
    const index = enrollments.findIndex(e => e.id === id);
    
    if (index !== -1) {
      enrollments[index].status = status;
      if (totalPaid !== undefined) {
        enrollments[index].totalPaid = totalPaid;
      }
      this.saveToStorage('enrollments', enrollments);
    }
  }

  // Blog post methods
  getBlogPosts(): BlogPost[] {
    return this.getFromStorage<BlogPost>('blogPosts');
  }

  addBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt' | 'status'>): BlogPost {
    const posts = this.getBlogPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    posts.push(newPost);
    this.saveToStorage('blogPosts', posts);
    return newPost;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): void {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      this.saveToStorage('blogPosts', posts);
    }
  }

  deleteBlogPost(id: string): void {
    const posts = this.getBlogPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    this.saveToStorage('blogPosts', filteredPosts);
  }

  // Analytics methods
  getEnrollmentStats() {
    const enrollments = this.getEnrollments();
    
    return {
      total: enrollments.length,
      enrolled: enrollments.filter(e => e.status === 'enrolled').length,
      paid: enrollments.filter(e => e.status === 'paid').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      dropped: enrollments.filter(e => e.status === 'dropped').length,
      totalRevenue: enrollments.reduce((sum, e) => sum + e.totalPaid, 0)
    };
  }

  getCourseStats() {
    const enrollments = this.getEnrollments();
    const courseStats = new Map();
    
    enrollments.forEach(enrollment => {
      const courseId = enrollment.courseId;
      if (!courseStats.has(courseId)) {
        courseStats.set(courseId, {
          courseId,
          courseName: enrollment.courseName,
          enrollments: 0,
          revenue: 0
        });
      }
      
      const stats = courseStats.get(courseId);
      stats.enrollments++;
      stats.revenue += enrollment.totalPaid;
    });
    
    return Array.from(courseStats.values());
  }
}

export const storage = new Storage();
