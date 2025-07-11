import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div>
      {/* You can include sidebar/header here */}
      <Outlet />
    </div>
  );
}