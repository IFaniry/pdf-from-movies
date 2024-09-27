# Integrate with the `https://developer.themoviedb.org/` API to create a movie pdf documents generator.


## Requirements:
 * typescript only
 * use any HTTP framework you like
 * use any lib/api/custom way to generate PDFs
 * the project should be configurable with environment variables
 * push everything to your GitHub

### Create a http server with the following endpoints:

1. GET `/movies`

Should return a generated pdf document with a list of movies taken from GET `https://api.themoviedb.org/3/movie/popular` endpoint. 
This document should contain the following information about each movie from response:
```
{{ title }} // (hyperlink to the next /movies/:movie_id endpoint)
{{ release_date }}
{{ vote_average }}
```

2. GET `/movies/:id`

Should return a pdf document with information about the movie taken from GET `https://api.themoviedb.org/3/movie/{movie_id}` endpoint. 
This document should contain the following information about the movie:
```
{{ title }} 
{{ release_date }} 
{{ vote_average }} 
{{ poster_image }}  // <img/> use poster_path from response 
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
