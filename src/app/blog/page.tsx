'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === 'all' 
          ? '/api/blog' 
          : `/api/blog?category=${selectedCategory}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && data.posts) {
          setBlogPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, [selectedCategory]);

  const categories = ['all', 'Development', 'Technology', 'Performance', 'Career', 'Tutorial'];
  const featuredPosts = blogPosts.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughts on software development, tech trends, and career growth
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-lg font-medium transition-colors duration-200
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>


        {/* No Posts Message */}
        {blogPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No blog posts found for this category</p>
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-6">
                    <span className="inline-block bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-blue-100 mb-4 text-sm line-clamp-3">{post.excerpt || 'No excerpt available'}</p>
                    <div className="flex items-center justify-between text-blue-200 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="block w-full bg-white text-blue-600 text-center px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Blog Posts */}
        {blogPosts.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 bg-indigo-700 text-white rounded-lg p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest articles, tutorials, and course updates directly in your inbox.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
