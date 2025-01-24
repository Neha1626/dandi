'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  BeakerIcon,
  DocumentTextIcon,
  CommandLineIcon,
  DocumentIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[280px]`}
      >
        {/* Personal Dropdown */}
        <div className="mb-6">
          <button className="w-full px-4 py-2 flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <span className="font-medium">Personal</span>
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboards"
                className={`px-4 py-2 flex items-center gap-3 rounded-lg ${
                  isActive('/dashboards')
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="px-4 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <UserIcon className="w-5 h-5" />
                <span>My Account</span>
              </Link>
            </li>
            <li>
              <Link
                href="/assistant"
                className="px-4 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <BeakerIcon className="w-5 h-5" />
                <span>Research Assistant</span>
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="px-4 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Research Reports</span>
              </Link>
            </li>
            <li>
              <Link
                href="/playground"
                className="px-4 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <CommandLineIcon className="w-5 h-5" />
                <span>API Playground</span>
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="px-4 py-2 flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group"
              >
                <DocumentIcon className="w-5 h-5" />
                <span>Documentation</span>
                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3h6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
} 