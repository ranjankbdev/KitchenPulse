import ProjectRoutes from './ProjectRoutes.jsx';
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx';
import useGeoLocation from './hooks/useGeoLocation.jsx';

function App() {
  useGetCurrentUser();
  useGeoLocation();

  return <ProjectRoutes />;
}

export default App;
