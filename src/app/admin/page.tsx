'use client';

import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, BookOpen, Briefcase, GraduationCap, Users, Eye, LogOut, Edit, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  category: string;
}

interface Course {
  id: number;
  title: string;
  price: number;
  level: string;
  category: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
}

interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VisitorStats {
  totalVisitors: number;
  visitorsLast24h: number;
  visitorsByPage: { page: string; count: number }[];
  visitorsByDevice: { device: string; count: number }[];
  visitorsByBrowser: { browser: string; count: number }[];
  visitorsByOS: { os: string; count: number }[];
  visitorsByCountry: { country: string; count: number }[];
  recentVisitors: {
    id: number;
    page: string;
    device: string | null;
    browser: string | null;
    os: string | null;
    country: string | null;
    city: string | null;
    referrer: string | null;
    visitedAt: string;
  }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  
  const [, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blogs' | 'courses' | 'projects' | 'users' | 'visitors'>('dashboard');

  // User management modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', email: '', role: 'admin', isActive: true });

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        setIsAuthenticated(true);
        fetchAllData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBlogs(), fetchCourses(), fetchProjects(), fetchAdminUsers(), fetchVisitorStats()]);
    setLoading(false);
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (response.ok) setBlogPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (response.ok) setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (response.ok) setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) setAdminUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch('/api/visitors/stats');
      const data = await response.json();
      if (response.ok) setVisitorStats(data);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const response = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Blog post deleted successfully!');
        fetchBlogs();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Course deleted successfully!');
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Project deleted successfully!');
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openUserModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ username: user.username, password: '', email: user.email || '', role: user.role, isActive: user.isActive });
    } else {
      setEditingUser(null);
      setUserForm({ username: '', password: '', email: '', role: 'admin', isActive: true });
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update user
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        
        if (response.ok) {
          alert('User updated successfully!');
          setShowUserModal(false);
          fetchAdminUsers();
        } else {
          alert('Failed to update user');
        }
      } else {
        // Create user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        
        if (response.ok) {
          alert('User created successfully!');
          setShowUserModal(false);
          fetchAdminUsers();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to create user');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred');
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('User deleted successfully!');
        fetchAdminUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Login Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            {loginError && (
              <div className="text-red-600 text-sm text-center">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your portfolio content and analytics</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Blog Posts</p>
                <p className="text-3xl font-bold text-gray-900">{blogPosts.length}</p>
              </div>
              <BookOpen className="text-blue-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <GraduationCap className="text-green-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <Briefcase className="text-purple-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Admin Users</p>
                <p className="text-3xl font-bold text-gray-900">{adminUsers.length}</p>
              </div>
              <Users className="text-orange-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Visitors</p>
                <p className="text-3xl font-bold text-gray-900">{visitorStats?.totalVisitors || 0}</p>
              </div>
              <Eye className="text-indigo-600" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {['dashboard', 'blogs', 'courses', 'projects', 'users', 'visitors'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'dashboard' | 'blogs' | 'courses' | 'projects' | 'users' | 'visitors')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Visitors (Last 24h)</h3>
                    <p className="text-4xl font-bold text-blue-600">{visitorStats?.visitorsLast24h || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
                    <div className="space-y-2">
                      {visitorStats?.visitorsByPage.slice(0, 5).map((p) => (
                        <div key={p.page} className="flex justify-between">
                          <span className="text-gray-700">{p.page}</span>
                          <span className="font-semibold">{p.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/blog/write" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Blog Post
                  </Link>
                  <Link href="/courses/create" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Create Course
                  </Link>
                  <Link href="/projects/create" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Create Project
                  </Link>
                </div>
              </div>
            )}

            {/* Blog Posts Tab - Continue from previous implementation */}
            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Manage Blog Posts</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchBlogs} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                    <Link href="/blog/write" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Create New Post
                    </Link>
                  </div>
                </div>
                {blogPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No blog posts found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blogPosts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                {post.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => deleteBlog(post.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Manage Courses</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                    <Link href="/courses/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Create New Course
                    </Link>
                  </div>
                </div>
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No courses found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {courses.map((course) => (
                          <tr key={course.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                {course.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{course.price.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.level}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => deleteCourse(course.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Manage Projects</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchProjects} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                    <Link href="/projects/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Create New Project
                    </Link>
                  </div>
                </div>
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No projects found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 line-clamp-2 max-w-md">{project.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.slice(0, 3).map((tech) => (
                                  <span key={tech} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-gray-500">+{project.technologies.length - 3} more</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Manage Admin Users</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchAdminUsers} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                    <button onClick={() => openUserModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus size={16} />
                      Create New User
                    </button>
                  </div>
                </div>
                {adminUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No admin users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {adminUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button onClick={() => openUserModal(user)} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1">
                                <Edit size={16} />
                                Edit
                              </button>
                              <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Visitors Tab */}
            {activeTab === 'visitors' && visitorStats && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Visitor Analytics</h2>
                  <button onClick={fetchVisitorStats} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>

                {/* Analytics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Visitors by Device</h3>
                    <div className="space-y-2">
                      {visitorStats.visitorsByDevice.map((d) => (
                        <div key={d.device} className="flex justify-between">
                          <span className="text-gray-700">{d.device}</span>
                          <span className="font-semibold">{d.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Visitors by Browser</h3>
                    <div className="space-y-2">
                      {visitorStats.visitorsByBrowser.map((b) => (
                        <div key={b.browser} className="flex justify-between">
                          <span className="text-gray-700">{b.browser}</span>
                          <span className="font-semibold">{b.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Visitors by OS</h3>
                    <div className="space-y-2">
                      {visitorStats.visitorsByOS.map((o) => (
                        <div key={o.os} className="flex justify-between">
                          <span className="text-gray-700">{o.os}</span>
                          <span className="font-semibold">{o.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Countries Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                  <div className="space-y-3">
                    {visitorStats.visitorsByCountry.map((c) => (
                      <div key={c.country} className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{c.country}</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Visitors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visitors</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visited At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {visitorStats.recentVisitors.map((visitor) => (
                          <tr key={visitor.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.page}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{visitor.country || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.city || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.device || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.browser || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.os || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(visitor.visitedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingUser && '(leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required={!editingUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userForm.isActive}
                    onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-900">Active</label>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
