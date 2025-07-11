
import { lazy, useEffect, useState } from 'react';
// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import { elements } from 'chart.js';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //



const AuthenticationRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <LoginPage />
    },
  ]
};

export default AuthenticationRoutes;
