# Calendar

Calendar written in TypeScript & NestJS as a semester project for the course 7VBAP at University of Ostrava.

## Development

```
yarn
yarn start:dev
```

## Production

```
docker build -t nest-calendar .
docker run -p80:3000 --name nest-calendar nest-calendar
```

## API

API is documented using Swagger. You can access it on `/api` route.
