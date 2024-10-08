import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert, Paper, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { api } from "../utils/axios";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "70vh",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  backgroundColor: "#6C63FF",
  color: "#fff",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#5a52e3",
  },
}));

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk melacak loading
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading ke true ketika tombol diklik
    setError(""); // Reset error sebelum melakukan permintaan

    try {
      const response = await api.post("/login", { username, password });

      if (response.status === 200) {
        const result = response.data;
        onLogin(result);
        navigate("/explorer");
      } else {
        setError(response.data.message || "Login failed"); // Set error jika status bukan 200
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password"); // Pesan kesalahan khusus untuk status 401
      } else {
        setError("An error occurred during login"); // Pesan kesalahan umum
      }
    } finally {
      setIsLoading(false); // Set loading ke false setelah operasi selesai
    }
  };

  return (
    <Root>
      <StyledPaper elevation={6}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Selamat Datang
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          Silahkan Login Dengan Akun Anda
        </Typography>
        <Form onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <SubmitButton type="submit" fullWidth variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </SubmitButton>
        </Form>
      </StyledPaper>
    </Root>
  );
};

export default Login;
