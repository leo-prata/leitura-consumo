
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=build /app /app

ENV GEMINI_API_KEY=${GEMINI_API_KEY}

EXPOSE 3001

CMD ["npm", "start"]