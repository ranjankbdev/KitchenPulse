import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './pages/auth/SignUp.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import HomePage from './pages/HomePage.jsx';
import ManageShop from './pages/ManageShop.jsx';
import ManageItem from './pages/ManageItem.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import ShopPage from './pages/ShopPage.jsx';

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
      element: userData ? <CartPage /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/checkout',
      element: userData ? <CheckoutPage /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/shop/:shopId',
      element: userData ? <ShopPage /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/order/confirmation',
      element: userData ? <OrderConfirmation /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/orders',
      element: userData ? <OrdersPage /> : <Navigate to="/signin" replace />,
    },
    {
      path: '/orders/:orderId/track',
      element: userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />,
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
