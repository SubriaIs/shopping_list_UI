import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Signup = () => {

  const navigate = useNavigate();

  const [joinUsername, setUserName] = useState("");
  const [joinEmail, setEmail] = useState("");
  const [joinPassword, setPassword] = useState("");
  const [joinPhonenumber, setPhoneNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // Validate phone number length between 10 to 15 digits
    const regex = /^\d{10,15}$/;
    return regex.test(phone);
  };

  const validatePassword = (password: string) => {
    // Password should be at least 8 characters long
    return password.length >= 8;
  };

  const handleRegister = async () => {
    // Reset error messages
    setErrorMessage("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");

    // Validate inputs
    if (!joinUsername || !joinEmail || !joinPassword || !joinPhonenumber) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!validateEmail(joinEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    if (!validatePhoneNumber(joinPhonenumber)) {
      setPhoneError("Phone number should be between 10 and 15 digits.");
      return;
    }

    if (!validatePassword(joinPassword)) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/user`,
        {
          userName: joinUsername,
          email: joinEmail,
          phoneNumber: joinPhonenumber,
          password: joinPassword,
        },
        {
          headers: {
            shouldAddAuthHeader: false,
          },
        }
      );
      setSuccessMessage("New User is created. Please wait...");
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      console.log("User created:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Error creating user. Please try again.");
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
          <Typography variant="h5">Signup</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={joinUsername}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={joinEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError} // Highlight the field if there's an error
                  helperText={emailError} // Display the error message under the field
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phonenumber"
                  label="Phone Number"
                  id="phonenumber"
                  value={joinPhonenumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={!!phoneError} // Highlight the field if there's an error
                  helperText={phoneError} // Display the error message under the field
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={joinPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError} // Highlight the field if there's an error
                  helperText={passwordError} // Display the error message under the field
                />
              </Grid>
            </Grid>
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success" variant="body2" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Join
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
