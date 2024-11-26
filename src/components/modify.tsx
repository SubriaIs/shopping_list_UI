import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Button, CircularProgress, TextField, Snackbar, List, ListItem, IconButton, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';

const LOCAL_STORAGE_KEY = "shoppingLists";

const Modify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shoppingListId = location.state?.shoppingListId;

  const [shoppingList, setShoppingList] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [shoppingListName, setShoppingListName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // New state to store products
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    quantity: '',
    unit: '',
    purchase: false
  });

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
      setShoppingListName(foundList.shoppingListName);
      setDescription(foundList.description);
      setLoading(false);

      if (foundList.userGroup?.groupId) {
        fetchGroupMembers(foundList.userGroup.groupId);
        fetchAllUsers(foundList.userGroup.createdByUser.userId); // Pass creator's userId to filter it out
      }

      // Fetch products for the shopping list
      fetchProducts(foundList.shoppingListId);
    } else {
      const fetchShoppingList = async () => {
        try {
          const response = await axiosInstance.get(`/shoppingList/id/${shoppingListId}`, {
            headers: { shouldAddAuthHeader: true },
          });
          setShoppingList(response.data);
          setShoppingListName(response.data.shoppingListName);
          setDescription(response.data.description);
          setLoading(false);

          if (response.data.userGroup?.groupId) {
            fetchGroupMembers(response.data.userGroup.groupId);
            fetchAllUsers(response.data.userGroup.createdByUser.userId);
          }

          // Fetch products for the shopping list
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
    try {
      const response = await axiosInstance.get(`/group/member/groupId/${groupId}`, {
        headers: { shouldAddAuthHeader: true },
      });
      setGroupMembers(response.data);
    } catch (err) {
      console.error('Error fetching group members:', err);
    }
  };

  const fetchAllUsers = async (creatorUserId: number) => {
    try {
      const response = await axiosInstance.get(`/user`, {
        headers: { shouldAddAuthHeader: true },
      });
      const users = response.data.filter((user: any) => user.userId !== creatorUserId);
      setAllUsers(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
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
      //setError('Failed to load products.');
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId || !shoppingList?.userGroup?.groupId) return;

    try {
      await axiosInstance.post(
        `/group/member`,
        {
          userGroup: { groupId: shoppingList.userGroup.groupId },
          user: { userId: selectedUserId },
        },
        { headers: { shouldAddAuthHeader: true } }
      );

      setSuccessMessage('User added to group successfully.');
      fetchGroupMembers(shoppingList.userGroup.groupId);
      setSelectedUserId(null);
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member.');
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      await axiosInstance.delete(`/group/member/id/${memberId}`, {
        headers: { shouldAddAuthHeader: true },
      });
      setGroupMembers((prevMembers) => prevMembers.filter((member) => member.groupMemberShipId !== memberId));
      setSuccessMessage('Member removed successfully.');
    } catch (err) {
      console.error('Error deleting group member:', err);
      setError('Failed to delete group member.');
    }
  };

  const handleUpdateShoppingList = async () => {
    if (!shoppingListName.trim() || !description.trim()) {
      setError('Both name and description are required.');
      return;
    }

    try {
      await axiosInstance.patch(
        `/shoppingList/id/${shoppingListId}`,
        { shoppingListName, description },
        { headers: { shouldAddAuthHeader: true } }
      );

      setSuccessMessage('Shopping list updated successfully!');
      setError(null);
    } catch (err) {
      console.error('Error updating shopping list:', err);
      setError('Failed to update the shopping list.');
    }
  };

  const availableUsers = allUsers.filter(
    (user) => !groupMembers.some((member) => member.user.userId === user.userId)
  );

  const handleProductChange = (productId: number, field: string, value: any) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.shoppingListProductId === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const handleUpdateProduct = async (productId: number, updatedProduct: any) => {
    try {
      await axiosInstance.patch(`/shoppingList/product/id/${productId}`, updatedProduct,
        { headers: { shouldAddAuthHeader: true } });
      setSuccessMessage('Product updated successfully!');
      // Update the product in the state immediately after successful patch
      setProducts((prev) =>
        prev.map((product) =>
          product.shoppingListProductId === productId ? updatedProduct : product
        )
      );
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      // Perform the API call to delete the product
      await axiosInstance.delete(`/shoppingList/product/id/${productId}`, {
        headers: { shouldAddAuthHeader: true }
      });

      // Success message
      setSuccessMessage('Product deleted successfully!');

      // Remove the deleted product from the local state
      setProducts((prev) =>
        prev.filter((product) => product.shoppingListProductId !== productId)
      );
    } catch (err) {
      // Error handling
      setError('Failed to delete product.');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.productName || !newProduct.quantity || !newProduct.unit) {
      setError('Product name, quantity, and unit are required.');
      return;
    }

    try {
      console.log(newProduct);
      const response = await axiosInstance.post(
        '/shoppingList/product',
        {
          "shoppingList": {
            "shoppingListId" : shoppingListId
        },
        "productName": newProduct.productName,
        "quantity": newProduct.quantity,
        "unit": newProduct.unit,
        "purchase": false
      },
        { headers: { shouldAddAuthHeader: true } }
      );
      setSuccessMessage('Product added successfully!');
      setProducts((prev) => [...prev, response.data]);
      setNewProduct({ productName: '', quantity: '', unit: '', purchase: false });
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  const handleViewShoppingList = (shoppingListId: number) => {
    navigate('/view', { state: { shoppingListId } });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton color="primary" onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={2}>
          Modify Shopping List
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          color="primary"
          onClick={() => handleViewShoppingList(shoppingListId)}
          startIcon={<VisibilityIcon />}  // Adds the edit icon to the button
        >
          View Mode
        </Button>
      </Box>

      {/* Shopping List Name and Description */}
      <TextField
        label="Shopping List Name"
        variant="outlined"
        fullWidth
        value={shoppingListName}
        onChange={(e) => setShoppingListName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdateShoppingList} sx={{ mt: 2 }}>
        Update Shopping List
      </Button>

      {/* Group Members */}
      <Box mt={3}>
      <Typography variant="h5" style={{ marginTop: '24px' }}>
        Creator: {shoppingList?.userGroup?.createdByUser?.userName} - {shoppingList?.userGroup?.createdByUser?.email}
      </Typography>
        <Typography variant="h6">Shared with: </Typography>
        <List>
          {groupMembers.map((member) => (
            <ListItem key={member.groupMemberShipId}>
              <Typography>{member.user.userName}</Typography>
              <IconButton color="secondary" onClick={() => handleDeleteMember(member.groupMemberShipId)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-select-label">Add User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value as number)}
          >
            {availableUsers.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddMember}>
          Add User
        </Button>
      </Box>

      {/* Products */}
      <Box mt={3} mr={2}>
        <Typography variant="h6">Products</Typography>
        <List>
          {(!products || products.length === 0) ? (
            <Typography variant="body1" color="textSecondary">
              No products added yet.
            </Typography>
          ) : (
            products.map((product) => (
              <ListItem key={product.shoppingListProductId}>
                <TextField
                  label="Product Name"
                  value={product.productName}
                  onChange={(e) => handleProductChange(product.shoppingListProductId, 'productName', e.target.value)}
                  sx={{ mr: 2 }}
                />
                <TextField
                  label="Quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(product.shoppingListProductId, 'quantity', e.target.value)}
                  sx={{ mr: 2 }}
                />
                <TextField
                  label="Unit"
                  value={product.unit}
                  onChange={(e) => handleProductChange(product.shoppingListProductId, 'unit', e.target.value)}
                  sx={{ mr: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox checked={product.purchase} onChange={(e) => handleProductChange(product.shoppingListProductId, 'purchase', e.target.checked)} />}
                  label="Purchased"
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" color="primary" onClick={() => handleUpdateProduct(product.shoppingListProductId, product)} sx={{ mr: 2 }}>
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.shoppingListProductId)}>
                  Delete
                </Button>
              </ListItem>
            ))
          )}
        </List>


        {/* Add New Product */}
        <Box mt={2}>
          <Typography variant="h6">Add New Product</Typography>
          <TextField
            label="Product Name"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Unit"
            value={newProduct.unit}
            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Snackbar for success/error */}
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={3000}
        onClose={() => { setSuccessMessage(null); setError(null); }}
        message={successMessage || error}
      />
    </Box>
  );
};

export default Modify;
