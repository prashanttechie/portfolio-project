import Link from 'next/link';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Prashant Kumar Mishra</h3>
            <p className="text-gray-300 mb-4">
              Passionate software developer with expertise in full-stack development, 
              creating innovative solutions and building scalable applications.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:prshntmishra033@gmail.com"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
              <a
                href="tel:+91-9899683318"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Phone size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/prashantkm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/prashantkmishra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>prshntmishra033@gmail.com</p>
              <p>+91-9899683318</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prashant Kumar Mishra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
