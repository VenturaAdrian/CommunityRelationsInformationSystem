import dashboard from './dashboard';
import pages from './pages';



const getMenuItems = () => {


  const items = [dashboard, pages];

  
  return { items };
};

export default getMenuItems;
