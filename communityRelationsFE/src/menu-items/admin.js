import {IconUserPlus, IconUserCog, IconTrash} from '@tabler/icons-react'

const icons = {
  IconUserPlus,
  IconUserCog,
  IconTrash
};
const admin ={
id: 'admin-tools',
  title: 'Admin Tools',
  type: 'group',
  children: [
    {
      id: 'register-user',
      title: 'Register User',
      type: 'item',
      url: '/register',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'user-panel',
      title: 'View Users',
      type: 'item',
      url: '/userpanel',
      icon: icons.IconUserCog,
      breadcrumbs: false
    },
    {
      id: 'user-logs',
      title: 'User Logs',
      type: 'item',
      url: '/userlogs',
      icon: icons.IconUserCog,
      breadcrumbs: false
    },
    {
      id: 'request-logs',
      title: 'Request Logs',
      type: 'item',
      url: '/request-logs',
      icon: icons.IconUserCog,
      breadcrumbs: false
    },

  ]
}

export default admin;