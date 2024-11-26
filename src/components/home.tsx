import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Snackbar,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Home_Navbar from './sub-components/navbar';
import axiosInstance from '../api/axiosInstance';

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/350?text=No+Shopping+List";
const LOCAL_STORAGE_KEY = "shoppingLists";

const ShoppingList = () => {

  const navigate = useNavigate();

  const [shoppingLists, setShoppingLists] = useState<any[]>(() => {
    const savedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [newListDescription, setNewListDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchShoppingLists = async () => {
    try {
      const response = await axiosInstance.get('/shoppingList/user/all', {
        headers: { shouldAddAuthHeader: true },
      });

      if (response.data) {
        setShoppingLists(response.data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToggle = () => setAutoSync((prev) => !prev);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchShoppingLists();
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewListName('');
    setNewListDescription('');
    setError('');
  };

  const handleCreateShoppingList = async () => {
    if (!newListName.trim() || !newListDescription.trim()) {
      setError('Both fields are required!');
      return;
    }

    try {
      await axiosInstance.post(
        '/shoppingList',
        { shoppingListName: newListName, description: newListDescription },
        { headers: { shouldAddAuthHeader: true } }
      );

      handleCloseModal();
      fetchShoppingLists();
      setSuccessMessage(newListName + ' : Shopping list is created successfully!');
      setOpenAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteShoppingList = async (shoppingListId: number) => {
    if (!shoppingListId) {
      setError('ShoppingList Id field is required!');
      return;
    }

    try {
      await axiosInstance.delete(`/shoppingList/id/${shoppingListId}`, {
        headers: { shouldAddAuthHeader: true },
      });

      fetchShoppingLists();
      setSuccessMessage('Shopping list is deleted successfully!');
      setOpenAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModifyShoppingList = (shoppingListId: number) => {
    navigate('/modify', { state: { shoppingListId } });
  };

  const handleViewShoppingList = (shoppingListId: number) => {
    navigate('/view', { state: { shoppingListId } });
  };

  useEffect(() => {
    const savedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLists) {
      setLoading(false);
    } else {
      fetchShoppingLists();
    }

    let intervalId: NodeJS.Timeout | undefined;
    if (autoSync) {
      intervalId = setInterval(fetchShoppingLists, 15000); // Sync every 15 seconds if autoSync is true
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoSync]);

  const filteredShoppingLists = shoppingLists.filter((list) =>
    list.shoppingListName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Home_Navbar />
      <Typography variant="h3" gutterBottom>Welcome to SL</Typography>

      <Box display="flex" justifyContent="flex-start" p={1}>
        <Autocomplete
          freeSolo
          value={searchTerm}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
          options={shoppingLists.map((list) => list.shoppingListName)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              fullWidth
              sx={{ width: '100%', height: 50 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm ? <Button onClick={() => setSearchTerm('')}>Clear</Button> : null}
                  </InputAdornment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Typography variant="body1" color="primary">{option}</Typography>
            </li>
          )}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" p={2} flexDirection="column" alignItems="flex-end">
        <FormControlLabel
          control={<Switch checked={autoSync} onChange={handleSyncToggle} color="primary" />}
          label="Auto Sync"
        />
        {!autoSync && (
          <Button variant="contained" color="primary" onClick={handleManualRefresh} style={{ marginTop: 8 }}>
            Refresh Now
          </Button>
        )}
        <IconButton color="primary" onClick={handleOpenModal} style={{ marginTop: 16 }}>
          <AddCircleIcon fontSize="large" /> Create New
        </IconButton>
      </Box>

      <div style={{ padding: '16px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          filteredShoppingLists.length > 0 ? (
            <Grid container spacing={2}>
              {filteredShoppingLists.map((list) => (
                <Grid item xs={12} sm={6} md={4} key={list.shoppingListId}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {list.shoppingListName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {list.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created At: {new Date(list.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => handleViewShoppingList(list.shoppingListId)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleModifyShoppingList(list.shoppingListId)}
                      >
                        Modify
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleDeleteShoppingList(list.shoppingListId)}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
              <img src={DEFAULT_IMAGE_URL} alt="No Shopping List" style={{ maxWidth: '200px', marginBottom: '16px' }} />
              <Typography variant="body1" color="textSecondary">
                No shopping lists available. Create a new list to get started.
              </Typography>
            </Box>
          )
        )}
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create New Shopping List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shopping List Name"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            error={!newListName.trim()}
            helperText={newListName.trim() ? '' : 'Name is required'}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            error={!newListDescription.trim()}
            helperText={newListDescription.trim() ? '' : 'Description is required'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancel</Button>
          <Button onClick={handleCreateShoppingList} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
        message={successMessage}
      />
    </>
  );
};

export default ShoppingList;
