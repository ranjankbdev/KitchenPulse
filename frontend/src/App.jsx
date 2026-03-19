import ProjectRoutes from './ProjectRoutes.jsx';
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx';

function App() {
  useGetCurrentUser();

  return <ProjectRoutes />;
}

export default App;