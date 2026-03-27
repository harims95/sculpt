FROM node:20-alpine AS base
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY packages/spec/package.json ./packages/spec/
COPY packages/db/package.json ./packages/db/
COPY packages/workshop/package.json ./packages/workshop/

# Install all dependencies (skip postinstall — schema not copied yet)
RUN npm install --ignore-scripts

# Copy source
COPY packages/spec/ ./packages/spec/
COPY packages/db/ ./packages/db/
COPY packages/workshop/ ./packages/workshop/

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build packages in order
RUN cd packages/spec && npx tsc
RUN cd packages/db && npx tsc
RUN cd packages/workshop && npx tsc

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/spec/dist ./packages/spec/dist
COPY --from=base /app/packages/spec/package.json ./packages/spec/
COPY --from=base /app/packages/db/dist ./packages/db/dist
COPY --from=base /app/packages/db/package.json ./packages/db/
COPY --from=base /app/packages/db/prisma ./packages/db/prisma
COPY --from=base /app/packages/workshop/dist ./packages/workshop/dist
COPY --from=base /app/packages/workshop/package.json ./packages/workshop/
COPY --from=base /app/package.json ./

EXPOSE 3001

CMD ["node", "packages/workshop/dist/server.js"]
