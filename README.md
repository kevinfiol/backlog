# backlog

`backlog` is a small application to help manage video game backlogs. I created it to host locally and serve my own purposes.

![screenshot of backlog](https://raw.githubusercontent.com/kevinfiol/backlog/master/screenshot.png)

Features:
* Game metadata & URLs from [RAWG.io](https://rawg.io)
* Game name autocomplete
* Sortable lists and sections
* Multiple user registration
* User reviews

## Build

```bash
pnpm install
pnpm run client:build
```

## Run

```bash
pnpm run run
```

## Dev

```bash
pnpm run dev
pnpm run client:dev
```

## Deploy w/ Docker
```bash
# install dependencies
pnpm install

# create *.db
pnpm run migrate

# from project directory
docker build -t kevinfiol/backlog .

# run on specified ports `8080:80` where `80` must be defined in .env file
docker run -p 8080:80 kevinfiol/backlog
```
