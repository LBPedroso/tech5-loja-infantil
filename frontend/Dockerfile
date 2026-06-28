FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# ========== Stage 2: Runtime ==========
FROM node:18-alpine

WORKDIR /app

# Instalar serve para servir build estático
RUN npm install -g serve

# Copiar build do estágio anterior
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
