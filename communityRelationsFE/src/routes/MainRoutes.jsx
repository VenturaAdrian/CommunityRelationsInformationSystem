import { lazy, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import axios from 'axios';
import config from 'config';
import { elements } from 'chart.js';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

const DifferentDevice = Loadable(lazy(() => import('../views/pages/banner/differentdevice')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AddForm = Loadable(lazy(() => import('../views/forms/addforms')));
const History = Loadable(lazy(() => import('../views/history')));
const Reports = Loadable(lazy(() => import('../views/report/report')));
const Review = Loadable(lazy(() => import('../views/history/review')));
const EditForm = Loadable(lazy(() => import('../views/forms/editform')));
const Pending = Loadable(lazy(() => import('../views/history/pending')));
const Register = Loadable(lazy(() => import('../views/pages/authentication/Register')));
const UserPanel = Loadable(lazy(() => import('../views/pages/admin/userspanel')));
const UserEdit = Loadable(lazy(() => import('../views/pages/admin/useredit')));
const UserLogs = Loadable(lazy(() => import('../views/pages/admin/userslogs')));
const RequestLogs = Loadable(lazy(() => import('../views/forms/requestlogs')));
const Category = Loadable(lazy(() => import('../views/categories')));
const CategoryTable = Loadable(lazy(() => import('../views/categories/categorytable')));
const ViewRequest = Loadable(lazy(() => import('../views/categories/viewrequest')));
const AdminPage = Loadable(lazy(() => import('../views/pages/admin')));
const FAQ = Loadable(lazy(() => import('views/pages/banner/faq')));


// ==============================|| MAIN ROUTING ||============================== //

const RoleAccess = () => {

    if(localStorage.getItem("user") === null){
        return <Navigate to="/"replace/>;
    }else{
        return <MainLayout/>
    }
}

const MainRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault/>,
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: 'addform',
      element: <AddForm />
    },
    {
      path: 'history',
      element: <History />
    },
    {
      path: 'report',
      element: <Reports />
    },
    {
      path: 'review',
      element: <Review />
    },
    {
      path: 'edit',
      element: <EditForm />
    },
    {
      path: 'register',
      element: <Register />
    },
    {
      path: 'pending',
      element: <Pending />
    },
    {
      path: 'userpanel',
      element: <UserPanel />
    },
    {
      path: 'usereditpanel',
      element: <UserEdit />
    },
    {
      path: 'userlogs',
      element: <UserLogs />
    },
    {
      path: 'request-logs',
      element: <RequestLogs />
    },
    {
      path: 'category',
      element: <Category/>
    },
    {
      path: 'category-table',
      element: <CategoryTable/>
    },
    {
      path: 'view-request',
      element: <ViewRequest/>
    },
    {
      path:'admin-tools',
      element:<AdminPage/>
    },
    {
      path:'frequently-asked-questions',
      element: <FAQ/>
    }

  ]
};

export default MainRoutes;
