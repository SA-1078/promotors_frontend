import { useRoutes } from 'react-router-dom';
import { appRoutes } from './routes/app.routes';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const routes = useRoutes(appRoutes);
  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}
