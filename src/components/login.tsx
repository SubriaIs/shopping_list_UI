import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { login } from "../slices/authSlice";
import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { Link } from "react-router-dom";

const Login = () => {

  const dispatch = useAppDispatch();

  const [loginEmail, setEmail] = useState("");
  const [loginPassword, setPassword] = useState("");

  const handleLogin = async () => {
    if (loginEmail && loginPassword) {
      try {
        let email = loginEmail;
        let password = loginPassword;

        const resultAction = await dispatch(
          login({
            email,
            password,
          })
        ).unwrap();
        console.log(localStorage.getItem("xToken"));
      } catch (e) {
        console.error(e);
        let errorMessage = (e as Error).message;
        if(errorMessage === 'Request failed with status code 404'){
          alert("User not found!");
        }
        if(errorMessage === 'Request failed with status code 400'){
          alert("Login credentials are not filled correctly!");
        }
      }
    } else {
      //nothing
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">SL SECURE LOGIN</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={loginEmail}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/join">Don't have an account? Signup</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Grid container justifyContent={"flex-end"}>
          <Grid item>
            <Avatar sx={{ bgcolor: deepPurple[600] }}>v{process.env.REACT_APP_SL_UI_VERSION}</Avatar>
          </Grid>
        </Grid>
        <b>Subria's Released UI Version</b>
      </Container>
    </>
  );
};

export default Login;