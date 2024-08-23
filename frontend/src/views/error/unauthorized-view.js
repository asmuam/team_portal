import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

/**
 * Komponen view ketika pengguna yang belum login mencoba mengakses halaman yang terproteksi
 *
 * @returns {component}
 */

const UnauthorizedView = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: "auto",
            display: "flex",
            minHeight: "100vh",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/error/unauthorized_401.svg"
            sx={{
              mx: "auto",
              height: { xs: 250, sm: 350 },
            }}
          />

          <Box sx={{ my: 5 }} component={"div"}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Anda tidak memiliki otorisasi menggunakan sistem ini!
            </Typography>

            <Typography sx={{ color: "text.secondary" }}>
              Mohon untuk login terlebih dahulu sebelum menggunakan menu di
              sistem ini!
            </Typography>
          </Box>

          <Button onClick={handleClick} size="large" variant="contained">
            Halaman Login
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UnauthorizedView;
