'use client';

import { useState, useEffect } from 'react';
import { Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  featured: boolean;
  image?: string | null;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? '/api/courses' 
        : `/api/courses?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Web Development', 'Backend Development', 'Full-Stack Development', 'Frontend Development', 'Mobile Development', 'DevOps', 'Data Science'];
  const featuredCourses = courses.filter(course => course.featured);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
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
            Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your potential with our expert-led courses in web development, software engineering, and more.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-5 py-2 rounded-full text-lg font-medium transition-colors duration-200
                ${selectedCategory === category.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* No Courses Message */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courses available at the moment</p>
          </div>
        )}

        {/* Featured Courses Section */}
        {featuredCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-6">
                    <span className="inline-block bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      Featured
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    <p className="text-blue-100 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Clock size={18} />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Users size={18} />
                        <span className="text-sm">{course.level}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-6">
                      ₹{course.price.toLocaleString()}
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses Grid */}
        {courses.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="text-sm">{course.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{course.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-indigo-700 text-white rounded-lg p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Need Custom Training for Your Team?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We offer tailored training programs for companies looking to upskill their development teams.
            Contact us to discuss your specific needs and get a custom quote.
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
