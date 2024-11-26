import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { User } from '../../models/user';
import { logout } from '../../slices/authSlice';
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from 'react-router-dom';


const LOCAL_STORAGE_LOGGED_USER_KEY = "loggedUser";

const Home_Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  const getLoggedUser = async () => {
    try {
      const response = await axiosInstance.get('/user/logged', {
        headers: {
          shouldAddAuthHeader: true,
        },
      });

      if(response.data){
        localStorage.setItem(LOCAL_STORAGE_LOGGED_USER_KEY, JSON.stringify(response.data));
        console.log('Logged User:', response.data);
        setLoggedUser(response.data);

        // Call fetch notifications once loggedUser is set
        getNotifications(response.data.userId);
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

  const getNotifications = async (userId: number) => {
    if (userId) {
      try {
        const response = await axiosInstance.get(`/notification/user/${userId}`, {
          headers: {
            shouldAddAuthHeader: true,
          },
        });
        console.log('Notifications:', response.data);
        //setNotifications(response.data);
        const reversedNotifications = [...response.data].reverse();
        setNotifications(reversedNotifications);
        setNotificationCount(response.data.length); // Set the notification count
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    getLoggedUser(); // Fetch the logged user on component mount
  }, []); // Empty dependency array ensures it runs only once

  const handleLogoutClick = () => {
    dispatch(logout());
    setLoggedUser(null);
    navigate('/login');
  };

  const handleProfile = () => {
    console.log("Navigating to profile page...");
    navigate('/profile');
  };


  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Shopping List - Hello, {loggedUser?.userName || 'Loading...'}
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit">Home</Button>
          <Button onClick={handleProfile} color="inherit">Profile</Button>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Welcome, {loggedUser?.email || 'Loading...'}
          </Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={notificationCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationMenuAnchorEl}
            open={Boolean(notificationMenuAnchorEl)}
            onClose={handleNotificationMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem key={index} onClick={handleNotificationMenuClose}>
                  <Box>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.createdAt).toLocaleString()} {/* Format the date */}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleNotificationMenuClose}>
                No notifications available
              </MenuItem>
            )}
          </Menu>
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileMenuAnchorEl}
            open={isProfileMenuOpen}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMobileMenuClose}>Home</MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>About</MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>Services</MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>Contact</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Home_Navbar;
