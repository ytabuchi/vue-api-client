# vue-api-client

vue.js API client webapp

## Build

```sh
docker build -t ytabuchi/vue-api-client .
```


## Run

```sh
docker run -d --rm --name vue --network mysql-network -p 8081:80 ytabuchi/vue-api-client
```

