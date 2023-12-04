# Use the official Node.js 18.18.2 image
FROM node:18.18.2-alpine3.18

# Set the environment to production
ENV NODE_ENV=development

# Create and set the working directory
WORKDIR /src

# Copy package json first to leverage docker cache
COPY package.json .

# Install dependencies
RUN npm install --only=development

# Copy all files
COPY . .

# Build for production 
RUN npm run build

# Start the app
CMD ["node", "src/index.js"]