// assets
import { 
  IconDashboard,
  IconCategory,
  IconClipboardText,
  IconBook 
 } from '@tabler/icons-react';

// constant
const icons = { 
  IconDashboard,
  IconCategory,
  IconClipboardText,
  IconBook 
  };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'report',
      title: 'Reports',
      type: 'item',
      url: '/report',
      icon: icons.IconClipboardText,
      breadcrumbs: false
    },
    {
      id: 'category-view',
      title: 'Category',
      type: 'item',
      url: '/category',
      icon: icons.IconCategory,
      breadcrumbs: false
    },

  ]
};

export default dashboard;
