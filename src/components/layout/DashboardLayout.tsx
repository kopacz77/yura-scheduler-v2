'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Overview } from '@/components/admin/Overview';
import { BarChart, CalendarDays, Users, CreditCard, Settings } from 'lucide-react';
import Link from 'next/link';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Overview',
    content: <Overview />
  },
  {
    icon: <CalendarDays className="h-4 w-4" />,
    label: 'Schedule',
    content: <div>Schedule Content</div>
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Students',
    content: <div>Students Content</div>
  },
  {
    icon: <CreditCard className="h-4 w-4" />,
    label: 'Payments',
    content: <div>Payments Content</div>
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    content: <div>Settings Content</div>
  }
];

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex h-16 items-center px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-500 p-1.5">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">YM Movement</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                activeTab === item.label
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold mb-6">{activeTab}</h1>
          {navItems.find(item => item.label === activeTab)?.content}
        </div>
      </main>
    </div>
  );
}