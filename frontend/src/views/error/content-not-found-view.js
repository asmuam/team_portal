import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { string } from "prop-types";

// Tampilan ketika konten yang dicari tidak ditemukn

const ContentNotFoundView = ({ message }) => {
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
            src="/error/not_found_content.svg"
            sx={{
              mx: "auto",
              height: { xs: 250, sm: 350 },
            }}
          />

          <Box sx={{ my: 5 }} component={"div"}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Transaksi tidak ditemukan!
            </Typography>

            <Typography sx={{ color: "text.secondary" }}>{message}</Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

ContentNotFoundView.propTypes = {
  message: string,
};

export default ContentNotFoundView;
