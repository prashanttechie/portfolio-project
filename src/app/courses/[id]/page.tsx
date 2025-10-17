'use client';

import { useState, useEffect } from 'react';
import { Clock, Users, Play, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EnrollmentModal from '@/components/EnrollmentModal';

interface CourseCurriculumItem {
  id: number;
  title: string;
  duration: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  instructor?: string | null;
  image?: string | null;
  featured: boolean;
  curriculum: CourseCurriculumItem[];
}

interface CourseDetailProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const { id } = await params;
        
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Course not found');
          }
          throw new Error('Failed to fetch course');
        }
        
        const data = await response.json();
        setCourse(data.course);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 text-red-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Course</h2>
          <p className="text-lg">{error || 'Course not found'}</p>
          <Link href="/courses" className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const savings = course.price * 0.20;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/courses" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
            {course.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₹{course.price.toLocaleString()}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{(course.price + savings).toLocaleString()}
            </span>
            <span className="text-lg font-semibold text-green-600">
              Save ₹{savings.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Enroll Now - Pay ₹{course.price.toLocaleString('en-IN')}
          </button>
        </div>

        {/* Enrollment Modal */}
        {course && (
          <EnrollmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            course={{
              id: course.id,
              title: course.title,
              price: course.price,
            }}
          />
        )}

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Course Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Play size={20} className="text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </div>
                      <span className="text-gray-600 text-sm">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!course.curriculum || course.curriculum.length === 0) && (
              <div className="bg-white rounded-lg shadow p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                <p className="text-gray-600">No curriculum modules available yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Instructor */}
            {course.instructor && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                <p className="text-xl font-bold text-gray-900">{course.instructor}</p>
                <p className="text-gray-600 text-sm">Expert Instructor</p>
              </div>
            )}

            {/* Certification */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Award size={40} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate of Completion</h3>
              <p className="text-gray-700 text-sm">
                Receive a verifiable certificate upon successful completion of the course.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
