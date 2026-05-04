import ProjectRoutes from './ProjectRoutes.jsx';
import useCurrentUser from './hooks/useCurrentUser.jsx';
import useGeolocation from './hooks/useGeolocation.jsx';
import useSocket from './hooks/useSocket.jsx';

function App() {
  useCurrentUser();
  useGeolocation();
  useSocket();

  return <ProjectRoutes />;
}

export default App;
