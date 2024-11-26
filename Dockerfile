# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app (with TypeScript)
RUN npm run build

# Expose port 3000 to the host
EXPOSE 3000

# Start the app using a static file server like serve (you can install it as a dev dependency)
# You can also use `npx` to run it directly without installing
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
