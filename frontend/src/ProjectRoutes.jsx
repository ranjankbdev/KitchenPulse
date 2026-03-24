import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './pages/auth/SignUp.jsx';
import SignIn from './pages/auth/SingIn.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import HomePage from './pages/HomePage.jsx';
import ManageShop from './pages/ManageShop.jsx';
import ManageItem from './pages/ManageItem.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

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
      path: '/cart',
      element: userData ? <CartPage /> : <Navigate to="/sign-in" replace />,
    },
    {
      path: '/checkout',
      element: userData ? <CheckoutPage /> : <Navigate to="/sign-in" replace />,
    },
    {
      path: '/vendor/shop/new',
      element: userData ? <ManageShop /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/vendor/shop/edit',
      element: userData ? <ManageShop mode="edit" /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/vendor/shop/items/new',
      element: userData ? <ManageItem /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/vendor/shop/items/:itemId/edit',
      element: userData ? <ManageItem mode="edit" /> : <Navigate to="/signin" replace />,
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
