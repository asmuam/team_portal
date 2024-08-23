import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";

/*
  File proteksi halaman ganti password dari pengguna yang tidak memiliki kode reset password

  @params key: String => kode verifikasi reset password
*/

const ChangePasswordAuth = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const location = useLocation();

  return !key ? (
    <Navigate to={"/"} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ChangePasswordAuth;
