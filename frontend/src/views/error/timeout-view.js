import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

// Tampilan ketika wktu response terlalu lama

const TimeoutView = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(0);
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
            src="/error/gateway_timeout_504.svg"
            sx={{
              mx: "auto",
              height: { xs: 250, sm: 350 },
            }}
          />

          <Box sx={{ my: 5 }} component={"div"}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Gateway Timeout!
            </Typography>

            <Typography sx={{ color: "text.secondary" }}>
              Waktu loading terlalu lama, mohon periksa koneksi internet Anda!.
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

export default TimeoutView;
