import { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { appRoutes } from './routes/app.routes';
import ScrollToTop from './components/ScrollToTop';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import InactivityWarningModal from './components/modals/InactivityWarningModal';

const WARNING_TIME = 10 * 60 * 1000; 
const LOGOUT_TIME = 15 * 60 * 1000;  
const WARNING_DURATION = LOGOUT_TIME - WARNING_TIME; 

export default function App() {
  const routes = useRoutes(appRoutes);
  const [showWarning, setShowWarning] = useState(false);

  const { resetActivity } = useInactivityTimeout({
    warningTime: WARNING_TIME,
    logoutTime: LOGOUT_TIME,
    onWarning: () => setShowWarning(true),
    onLogout: () => {
      setShowWarning(false);
    }
  });

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetActivity();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    window.location.href = '/login';
  };

  return (
    <>
      <ScrollToTop />
      {routes}
      <InactivityWarningModal
        isOpen={showWarning}
        remainingSeconds={Math.floor(WARNING_DURATION / 1000)}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogoutNow}
      />
    </>
  );
}
