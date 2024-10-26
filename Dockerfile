# Use latest Node.js version
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE ${APP_PORT}

# Start the application
CMD ["npm", "run", "dev"]
