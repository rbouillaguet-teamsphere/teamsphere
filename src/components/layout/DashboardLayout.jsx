// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Sidebar } from './Sidebar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;