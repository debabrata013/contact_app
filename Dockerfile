FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables with default values
ENV MONGODB_URI=mongodb://localhost:27017/contact-app

# Skip build during image creation - we'll build at runtime
# This avoids Clerk authentication issues during build

# Expose the port the app will run on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
