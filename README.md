# Shopping List Frontend  

A React-based frontend application for managing shopping lists. The application offers features like creating, editing, and sharing shopping lists, real-time notifications, user profiles, and an intuitive interface.  

---

## Features  

### User Account  
- **Sign Up**  
  - Create an account by entering your username, email, phone number, and password.  
  - Press "JOIN" to complete the registration.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Signup.png)
- **Login**  
  - Log in using your registered email and password by clicking the "Login" button.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Login.png)
---

### Shopping List Management  
- **Create a Shopping List**  
  - Add a new shopping list by clicking the "Create New" button. Provide a name and description.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Create_ShoppingList.png)
- **View All Shopping Lists**  
  - Access all your shopping lists on the dashboard.  
  - Use the search functionality to filter lists by name.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/View_dashboard.png)
- **Edit a Shopping List**  
  - Click "MODIFY" to update list name, description, and product details.  
  - Add/remove products, change product details (name, quantity, purchased status, unit), and manage shared members.  
  - Switch between "EDIT MODE" and "VIEW MODE" for flexibility.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Edit_ShoppingList.png)
- **View Specific Shopping List**  
  - Access detailed list information, including creator, shared members, and product details.  
  - Filter products by name or switch back to "EDIT MODE" for updates.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/View_ShoppingList.png)
- **Delete a Shopping List**  
  - Click "REMOVE" to delete a shopping list. Confirm deletion, and a success message will be shown.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Delete_ShoppingList.png)
---

### Sharing Shopping Lists  
- **Share a Shopping List**  
  - Share lists with registered users by selecting them from a dropdown menu while editing.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Edit_ShoppingList.png)
- **Access Shared Shopping Lists**  
  - Can view, manage or delete shared lists. it accessible on the dashboard.  

---

### Profile  
- **Profile Management**  
  - View your details (username, email, phone number).  
  - Update your password via the profile section.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Profile.png)
---

### Notifications  
- **Real-Time Notifications**  
  - Access notifications by clicking the bell icon to view updates on shared lists and activities.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Notification.png)
---

### Auto-Sync and Manual Refresh  
- **Auto-Sync**  
  - Automatically reload lists every 30 seconds for the latest updates.  

- **Refresh Now**  
  - Click "REFRESH NOW" to manually reload the page.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/AutoSync.png)
---

### Logging Out  
- **Logout**  
  - Click the "Logout" button in the top-right corner to securely exit the application.  
![Shopping List App Screenshot](https://raw.githubusercontent.com/SubriaIs/shopping_list_UI/refs/heads/master/public/Logout.png)
---

## Installation  

### Prerequisites  
- **For Local Setup**  
  - Node.js (v16+) and npm must be installed.  
- **For Docker Deployment**  
  - Docker installed on your machine.  

---

### Steps to Run Locally  (way 1)

1. Clone the repository:  
   ```bash  
   git clone https://github.com/SubriaIs/shopping_list_UI
2. **Navigate to the project directory:**
    ```bash
    cd shopping_list_UI
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Start the application:**
    ```bash
    npm start
    ```

5. **Access the application at:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Docker Deployment (way 2)

To run the application using Docker, follow these steps:

1. **Pull the Docker image:**
    ```bash
    docker pull subriais/shopping_list_ui:latest
    ```

2. **Run the container:**
    ```bash
    docker run -d -p 3000:3000 subriais/shopping_list_ui:latest
    ```

---

### Configuration

- Ensure the backend is running before using the frontend.
- Possible to clone the backend repository from:  
   ```bash  
   git clone https://github.com/SubriaIs/shopping_list
- Update the **API base URL** in the `.env` file or the configuration file if needed:
    ```bash
    REACT_APP_API_BASE_URL=http://hostaddress:8082/v1
    ```

---

## License

This project is licensed under the MIT License.
