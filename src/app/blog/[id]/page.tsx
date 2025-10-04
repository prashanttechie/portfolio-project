'use client';

import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface BlogPostData {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface BlogPostProps {
  params: Promise<{ id: string }>;
}

export default function BlogPost({ params }: BlogPostProps) {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        
        // Fetch from API
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch post');
        }
        
        setPost(data.post);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Blog Post Content */}
        <article className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-6 space-x-4">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.length > 0 ? (
                post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No tags</span>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </article>

        {/* Related Articles (Placeholder) */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">More Articles</h2>
          <div className="text-center">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Articles →
            </Link>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest articles, tutorials, and course updates directly in your inbox.
          </p>
          <form className="max-w-sm mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
