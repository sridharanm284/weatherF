# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose the port that the application will run on (assuming it's 3000 for a typical React app)
EXPOSE 3000

# Command to start your application
CMD ["npm", "start"]
