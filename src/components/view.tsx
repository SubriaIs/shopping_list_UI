import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, CircularProgress, List, ListItem, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosInstance from '../api/axiosInstance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

const LOCAL_STORAGE_KEY = "shoppingLists";

const View = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shoppingListId = location.state?.shoppingListId;

  const [shoppingList, setShoppingList] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (!shoppingListId) {
      navigate('/home');
      return;
    }

    const savedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
    let foundList = null;

    if (savedLists) {
      const parsedLists = JSON.parse(savedLists);
      foundList = parsedLists.find((list: any) => list.shoppingListId === shoppingListId);
    }

    if (foundList) {
      setShoppingList(foundList);
      setLoading(false);
      fetchGroupMembers(foundList.userGroup?.groupId);
      fetchProducts(foundList.shoppingListId);
    } else {
      const fetchShoppingList = async () => {
        try {
          const response = await axiosInstance.get(`/shoppingList/id/${shoppingListId}`, {
            headers: { shouldAddAuthHeader: true },
          });
          setShoppingList(response.data);
          setLoading(false);
          fetchGroupMembers(response.data.userGroup?.groupId);
          fetchProducts(response.data.shoppingListId);
        } catch (err) {
          console.error('Error fetching shopping list:', err);
          setError('Failed to load the shopping list.');
          setLoading(false);
        }
      };
      fetchShoppingList();
    }
  }, [shoppingListId, navigate]);

  const fetchGroupMembers = async (groupId: number) => {
    if (!groupId) return;

    try {
      const response = await axiosInstance.get(`/group/member/groupId/${groupId}`, {
        headers: { shouldAddAuthHeader: true },
      });
      setGroupMembers(response.data);
    } catch (err) {
      console.error('Error fetching group members:', err);
    }
  };

  const fetchProducts = async (shoppingListId: number) => {
    try {
      const response = await axiosInstance.get(`/shoppingList/product/shoppingListId/${shoppingListId}`, {
        headers: { shouldAddAuthHeader: true },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleModifyShoppingList = (shoppingListId: number) => {
    navigate('/modify', { state: { shoppingListId } });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton color="primary" onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={2}>
          View Shopping List
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          color="primary"
          onClick={() => handleModifyShoppingList(shoppingListId)}
          startIcon={<EditIcon />}  // Adds the edit icon to the button
        >
          Edit Mode
        </Button>
      </Box>
      {/* Shopping List Information */}
      <Typography variant="h5">Shopping List Name: {shoppingList?.shoppingListName}</Typography>
      <Typography variant="body1" color="textSecondary">
        Description: {shoppingList?.description}
      </Typography>

      {/* Created By Section */}
      <Box mt={2}>
        <Typography variant="h6">Created By</Typography>
        <Typography variant="body1" color="textSecondary">
          {shoppingList?.userGroup?.createdByUser?.userName} - {shoppingList?.userGroup?.createdByUser?.email}
        </Typography>
      </Box>

      {/* Shared With Section */}
      <Box mt={2}>
        <Typography variant="h6">Shared With</Typography>
        <List>
          {groupMembers.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No other members in this group.
            </Typography>
          ) : (
            groupMembers.map((member) => (
              <ListItem key={member.groupMemberShipId}>
                <Typography>
                  {member.user.userName} - {member.user.email}
                </Typography>
              </ListItem>
            ))
          )}
        </List>
      </Box>


      {/* Products Section */}
       {/* Filter Input */}
       <Box mt={3} mb={2}>
        <TextField
          label="Filter Products"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={handleFilterChange}
        />
      </Box>
      {/* Products Table */}
      <Box mt={3}>
        <Typography variant="h6">Products</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Purchased</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No products added yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.shoppingListProductId}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      {product.purchase ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Error Handling */}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default View;
