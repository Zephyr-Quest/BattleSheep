FROM node:16.13.2-stretch-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

# For production
# RUN npm ci --only=

COPY . .
RUN chmod +x wait_for_db.sh

EXPOSE 4200

CMD [ "node", "index.js" ]