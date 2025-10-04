'use client';

import { Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Check if we need to scroll to a specific section after navigation
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    console.log('Checking for section to scroll to:', scrollToSection);
    if (scrollToSection) {
      // Clear the stored section
      sessionStorage.removeItem('scrollToSection');
      
      // Wait a bit for the page to fully load, then scroll
      setTimeout(() => {
        const element = document.querySelector(scrollToSection);
        console.log('Found element to scroll to:', element);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Scrolled to section:', scrollToSection);
        }
      }, 100);
    }
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Profile Image */}
            <div className="mb-8">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="/portfolio.jpeg"
                  alt="Prashant Kumar Mishra - Portfolio Photo"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-xl"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Hi, I'm <span className="text-blue-600">Prashant Kumar Mishra</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Software Developer passionate about creating innovative solutions and building scalable applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/projects"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                View My Work
              </Link>
              <a
                href="/resume.pdf"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Me
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                I'm a passionate software developer with expertise in full-stack development. 
                I enjoy creating innovative solutions and building scalable applications that 
                make a difference.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With experience in modern web technologies, I focus on writing clean, 
                efficient code and delivering exceptional user experiences.
              </p>
              
              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'].map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              {/* Profile Image in About Section */}
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src="/portfolio.jpeg"
                    alt="Prashant Kumar Mishra"
                    fill
                    className="rounded-full object-cover border-3 border-blue-200 shadow-lg"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Let's Connect</h3>
              <div className="space-y-4">
                <a
                  href="mailto:prshntmishra033@gmail.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Mail size={20} />
                  prshntmishra033@gmail.com
                </a>
                <a
                  href="tel:+91-9899683318"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Phone size={20} />
                  +91-9899683318
                </a>
                <a
                  href="https://www.linkedin.com/in/prashantkm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Linkedin size={20} />
                  LinkedIn Profile
                </a>
                <a
                  href="https://github.com/prashantkmishra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Github size={20} />
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Let's Work Together
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and exciting projects. 
            Let's discuss how we can bring your ideas to life.
          </p>
          <a
            href="mailto:prshntmishra033@gmail.com"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Mail size={20} />
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}