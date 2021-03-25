FROM node:14.16.0

WORKDIR /opt/app
COPY package.json pnpm-lock.yaml* ./
RUN npm cache clean -- force && npm install -g pnpm
RUN pnpm install

COPY . /opt/app
RUN pnpm run client:build

ENV PORT 80
EXPOSE 80

CMD ["pnpm", "run", "run"]