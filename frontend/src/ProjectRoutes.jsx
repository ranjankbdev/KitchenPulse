import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './pages/auth/SignUp.jsx';
import SignIn from './pages/auth/SingIn.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import HomePage from './pages/HomePage.jsx';
import ManageShop from './pages/ManageShop.jsx';

function ProjectRoutes() {
  const { userData } = useSelector((state) => state.user);

  const routes = useRoutes([
    // Public routes (only when NOT logged in)
    {
      path: '/signup',
      element: !userData ? <SignUp /> : <Navigate to="/" replace />,
    },
    {
      path: '/signin',
      element: !userData ? <SignIn /> : <Navigate to="/" replace />,
    },
    {
      path: '/forgot-password',
      element: !userData ? <ForgotPassword /> : <Navigate to="/" replace />,
    },

    // Protected route (only when logged in)
    {
      path: '/',
      element: userData ? <HomePage /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/vendor/shop/new',
      element: userData ? <ManageShop /> : <Navigate to="/sign-in" replace />,
    },
    {
      path: '/vendor/shop/edit',
      element: userData ? <ManageShop mode="edit" /> : <Navigate to="/sign-in" replace />,
    },

    // Optional
    {
      path: '*',
      element: <Navigate to={userData ? '/' : '/signin'} replace />,
    },
  ]);
  return routes;
}

export default ProjectRoutes;
