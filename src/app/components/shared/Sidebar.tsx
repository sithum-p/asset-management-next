import { ReactNode } from 'react';

interface SidebarProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkText?: string;
  children: ReactNode;
}

export function Sidebar({ title, subtitle, linkTo, linkText, children }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        {linkTo && linkText && (
          <a href={linkTo} className="text-sm text-blue-600 hover:text-blue-700 mt-2 block">
            {linkText}
          </a>
        )}
      </div>
      
      <nav className="px-4 space-y-2">
        {children}
      </nav>
    </div>
  );
}