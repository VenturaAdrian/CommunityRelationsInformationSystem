// assets
import { 
  IconDeviceIpadPlus, 
  IconHistory, 
 IconFileReport,
  IconBrandFacebook ,

} from '@tabler/icons-react';



// constant
const icons = {
  IconDeviceIpadPlus,
  IconHistory,
  IconBrandFacebook,
 IconFileReport,

};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'tools',
  title: 'Tools',
  type: 'group',
  children: [
    {
      id: 'add-form-request',
      title: 'Add Request',
      type: 'item',
      url: '/addform',
      icon: icons.IconDeviceIpadPlus,
      breadcrumbs: false
    },
    {
      id: 'pending',
      title: 'Pending Requests',
      type: 'item',
      url: '/pending',
      icon: icons. IconFileReport,
      breadcrumbs: false
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history',
      icon: icons.IconHistory,
      breadcrumbs: false
    },
    
    
    

  ]
};

export default pages;
