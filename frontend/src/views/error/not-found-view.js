import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import useAuth from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";

// Tampilan ketika path tidak ditemukan

const NotFoundView = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!auth.user) navigate("/");
    else navigate(-1);
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
            src="/error/not_found_404.svg"
            sx={{
              mx: "auto",
              height: { xs: 250, sm: 350 },
            }}
          />

          <Box sx={{ my: 5 }} component={"div"}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Halaman tidak ditemukan!
            </Typography>

            <Typography sx={{ color: "text.secondary" }}>
              Maaf, halaman yang Anda minta tidak ditemukan. Tolong cek kembali
              URL Anda.
            </Typography>
          </Box>

          <Button onClick={handleClick} size="large" variant="contained">
            Kembali
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default NotFoundView;
