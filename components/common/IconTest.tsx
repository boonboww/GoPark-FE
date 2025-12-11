"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Building2,
  Ticket,
  User,
  Search
} from 'lucide-react';

// Test component to verify icons are working
export default function IconTest() {
  const icons = [
    { name: 'LayoutDashboard', component: LayoutDashboard },
    { name: 'Users', component: Users },
    { name: 'BarChart3', component: BarChart3 },
    { name: 'Building2', component: Building2 },
    { name: 'Ticket', component: Ticket },
    { name: 'User', component: User },
    { name: 'Search', component: Search },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Icon Test</h2>
      <div className="grid grid-cols-4 gap-4">
        {icons.map(({ name, component: Icon }) => (
          <div key={name} className="flex flex-col items-center p-4 border rounded">
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
