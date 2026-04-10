import ProjectRoutes from './ProjectRoutes.jsx';
import useCurrentUser from './hooks/useCurrentUser.jsx';
import useGeolocation from './hooks/useGeoLocation.jsx';

function App() {
  useCurrentUser();
  useGeolocation();

  return <ProjectRoutes />;
}

export default App;
