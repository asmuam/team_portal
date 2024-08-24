import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/use-auth.js";
import { array } from "prop-types";
import ForbiddenView from "../../views/error/forbidden-view.js";

/*
  File untuk proteksi halaman yang memerlukan login dari pengguna yang belum login

  @state auth: pemanggilan global state
  @state location: url yang diproteksi
*/

const RequiredAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.role?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <ForbiddenView
      message={
        "Mohon login menggunakan akun dengan role Pemilik untuk mengakses halaman ini."
      }
    />
  ) : (
    <Navigate to={"/"} state={{ from: location }} replace />
  );
};

RequiredAuth.propTypes = {
  allowedRoles: array,
};

export default RequiredAuth;
