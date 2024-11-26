import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, TextField, Button } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MD5 from 'crypto-js/md5';

const LOCAL_STORAGE_LOGGED_USER_KEY = "loggedUser";

const Profile = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState<any | null>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_LOGGED_USER_KEY);
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePasswordChange = async () => {
    if (loggedUser && loggedUser.userId && newPassword && oldPassword) {
      try {
        // Validate new password length
        if (newPassword.length < 8) {
          setPasswordUpdateStatus('Password must be at least 8 characters long');
          return; // Stop execution if validation fails
        }

        // Verify if the old password entered by the user matches the hashed password
        const hashedOldPassword = getPasswordHash(oldPassword);

        if (hashedOldPassword === loggedUser.password) {
          // Proceed with updating the password if the old password is correct
          const response = await axiosInstance.patch(
            `/user/id/${loggedUser.userId}`,
            { password: newPassword },
            {
                headers: { shouldAddAuthHeader: true }
            } // Add the correct auth token
          );

          if (response.status === 200) {
            setPasswordUpdateStatus('Password updated successfully');
            // Optionally, reset the password fields after successful update
            setOldPassword('');
            setNewPassword('');
          } else {
            setPasswordUpdateStatus('Error updating password');
          }
        } else {
          setPasswordUpdateStatus('Old password is incorrect');
        }
      } catch (error: any) {
        // Handle the error and display the message from the server
        if (error.response && error.response.data && error.response.data.message) {
          setPasswordUpdateStatus(error.response.data.message); // Display server error message
        } else {
          setPasswordUpdateStatus('Error updating password');
        }
        console.error('Error:', error);
      }
    } else {
      setPasswordUpdateStatus('Please fill in all fields');
    }
  };


  // Function to hash a password using MD5
  const getPasswordHash = (password: string) => {
    return MD5(password).toString(); // Returns MD5 hash of the password
  };

  return (
    <Box p={3}>
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton color="primary" onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={2}>
          Profile
        </Typography>
      </Box>

      {/* Profile Content */}
      {loggedUser ? (
        <Box>
          <Typography variant="body1">
            <strong>Username: </strong>{loggedUser.userName}
            <br />
            <strong>Email: </strong>{loggedUser.email}
            <br />
            <strong>Phone: </strong>{loggedUser.phoneNumber}
          </Typography>

          {/* Password Change Section */}
          <Box mt={3}>
            <Typography variant="h6">Change Password</Typography>
            <TextField
              label="Old Password"
              variant="outlined"
              fullWidth
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePasswordChange}
            >
              Update Password
            </Button>
          </Box>

          {/* Password update status message */}
          {passwordUpdateStatus && (
            <Typography variant="body2" color="textSecondary" mt={2}>
              {passwordUpdateStatus}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No user data found. Please log in to view your profile.
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
