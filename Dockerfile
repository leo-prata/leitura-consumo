# Etapa 1: Construção da imagem
FROM node:18 AS build

# Diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código TypeScript (se necessário)
RUN npm run build

# Etapa 2: Execução da aplicação
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia as dependências instaladas e o código compilado
COPY --from=build /app /app

# Define a variável de ambiente para a chave da API
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

# Expõe a porta que a aplicação usa
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]