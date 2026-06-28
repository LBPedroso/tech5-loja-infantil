FROM node:18-bullseye-slim

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --production

# Copiar código compilado
COPY dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
