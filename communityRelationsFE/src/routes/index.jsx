import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';
import AuthLogin from '../views/pages/auth-forms/AuthLogin'


// ==============================|| ROUTING RENDER ||============================== //


const router = createBrowserRouter([AuthenticationRoutes,
                                        {path: '/', 
                                        element: <AuthLogin/>,
                                    } ,
                                     MainRoutes],{basename: import.meta.env.VITE_APP_BASE_NAME});



export default router;
