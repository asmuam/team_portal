import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/use-auth.js";

/*
  File untuk proteksi halaman yang tidak memerlukan login dari pengguna yang sudah login

  @state auth: pemanggilan global state
  @state location: url yang diproteksi
*/

const RequiredNonAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.user ? (
    <Navigate to={"/admin"} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default RequiredNonAuth;
