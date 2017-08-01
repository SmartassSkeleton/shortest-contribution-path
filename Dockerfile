FROM node:7-alpine

# Install app dependencies
COPY package.json /server/package.json
RUN cd /server; yarn install

# Copy app source
COPY . /server

# Set work directory to /server
WORKDIR /server

# start command as per package.json
CMD ["npm", "start"]
