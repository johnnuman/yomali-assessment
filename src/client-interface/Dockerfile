# Use an official Node.js runtime as a parent image
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies using npm
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Build the Nuxt.js app
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Serve the application in production mode using nuxt start
CMD ["npm", "run", "start"]