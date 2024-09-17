# Use an official Node runtime as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application's code
COPY . .

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port the app runs on
EXPOSE $PORT

# Define the command to run the app using environment variables
CMD ["npm", "run", "start"]