# Stage 1: Build da aplicação React + Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências aproveitando cache de camadas
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copia o restante do código e gera o bundle de produção
COPY . .
RUN npm run build

# Stage 2: Servidor Nginx leve na porta 80 (padrão Coolify)
FROM nginx:1.27-alpine

# Remove configuração padrão e aplica configuração SPA otimizada
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
