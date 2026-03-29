import ProjectRoutes from './ProjectRoutes.jsx';
import useCurrentUser from './hooks/useCurrentUser.jsx';
import useGeolocation from './hooks/useGeoLocation.jsx';
import useMyOrders from './hooks/useMyOrders.jsx';

function App() {
  useCurrentUser();
  useGeolocation();
  useMyOrders();

  return <ProjectRoutes />;
}

export default App;
