import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('userInfo');
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to='/' />;
  }
  console.log("******************",isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
