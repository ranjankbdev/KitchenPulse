import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { memo } from 'react';

const GlobalToaster = memo(() => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover
    theme="dark"
  />
));

export default GlobalToaster;
