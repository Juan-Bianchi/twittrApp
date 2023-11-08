# Twitter example

In this example you'll find an already setted up express server with some existing endpoints, authentication, error handling and more.

## Setup

- Install [Git](https://git-scm.com/), [Docker](https://www.docker.com/), [Node v18](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/) and [Direnv](https://direnv.net/)
- Clone this repository
- Create a copy of [.envrc template](./.envrc.template) into `.envrc`
- Verify that you hooked [direnv into your shell](https://direnv.net/docs/hook.html)
- Run:
  ```
  direnv allow
  ```
- Run:
  ```
  docker compose up
  ```
- You're ready to go!

## Useful tools

- An API test tool, you can use the curl command or [Postman](https://www.postman.com/)
- A Database IDE, you can use [PgAdmin](https://www.pgadmin.org/), [Postico](https://eggerapps.at/postico2/), [DataGrip](https://www.jetbrains.com/datagrip/)

## Stack

### Express

Express is a fast, minimalist web framework for Node.js, it provides a way to serve content in a server. You can serve API requests, static content (like a compiled react app) or both.

You can have a server running with as little as 10 lines of code.

```
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

[Express Docs](https://expressjs.com/en/4x/api.html)

### Prisma

Prisma is an ORM (object-relational mapping) that it's purpose is to map SQL tables and columns into typescript types, in order to be able to query a database without the need of using SQL.

[Prisma Docs](https://www.prisma.io/docs)

## Code Structure

For every class inside the domain (Repository and Services) we create interface, and use dependency injection in the Controller.

We create Data Transfer Objects (DTOs) to abstract from database representation of an entity.

The structure is based on the [Three Layered Architecture](https://dev.to/blindkai/backend-layered-architecture-514h)

```
├── src
│   ├── domains
│   │   ├── domain_x
│   │   │   ├── controller
│   │   │   │   ├── index.ts
│   │   │   │   └── domain_x.controller.ts
│   │   │   ├── dto
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── repository
│   │   │   │   ├── index.ts
│   │   │   │   ├── domain_x.repository.impl.ts
│   │   │   │   └── domain_x.repository.ts
│   │   │   └── service
│   │   │       ├── index.ts
│   │   │       ├── domain_x.service.impl.ts
│   │   │       └── domain_x.service.ts
│   │   └── ...
│   ├── router
│   │   └── index.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
|   |   ├── index.ts
│   │   └── ...
│   ├── server.ts
```

## Endpoints

### Health

Endpoints for checking server health

- `GET api/health`

### Auth

Endpoints for user authentication

- `POST api/auth/login`
- `POST api/auth/signup`

### User

Endpoints for getting user information

- `GET api/user` returns recomended users paginated
- `GET api/user/me` returns information about the logged user
- `GET api/user/:user_id` returns information about an user by id
- `DELETE api/user` deletes the logged user

### Post

Endpoints for getting post information

- `GET api/post` returns post feed paginated
- `GET api/post/:post_id` returns a post by id
- `GET api/post/by_user/:user_id` returns all user posts by id
- `POST api/post` creates a post
- `DELETE api/post/:post_id` deletes a post by id

## Tasks

Fork this repository and complete the tasks. Then create a PR and start with your tasks.

- ✅ There's an unused table `Follow` that stores follows between users. Create a new `follower` domain (with it's own controller, service and repositories) that has two new endpoints `POST /api/follower/follow/:user_id` and `POST /api/follower/unfollow/:user_id`.
- ✅ All users are currently public, meaning that i can see tweets from anyone, without having to follow them. Add the ability for users to have private profiles and store it in the User table. Update the `GET api/post` to return only posts with public account authors or private account authors that the user follows.
- ✅ Update the `GET api/post/:post_id` and `GET api/post/by_user/:user_id` to throw a 404 error if the author has a private account and the user does not follow them.
- ✅ The frontend team needs to integrate with the server, but they don't know what endpoints you have available or what they do. Document the API using [Swagger](https://blog.logrocket.com/documenting-express-js-api-swagger/)
- [ ] Add the ability to react to a post (like and retweet) both should be stored in the same table and using the endpoints `POST api/reaction/:post_id` and `DELETE api/reaction/:post_id`.
- [ ] Add the ability to comment in posts, a comment should be stored as a post, but still be able to query posts and comments separately.
- [ ] Create endpoints to query retweets, likes and comments by user id and put them in their respective domains.
- [ ] Users do not currently have a profile picture. Integrate with AWS S3 to store user profile pictures and post pictures. Careful! Do not receive images in your endpoints. Make use of S3 Pre-signed URLs. Update the UserDTO to include the profile image. You can use a public S3 bucket as it doesn't contain private data.
- [ ] Update  `GET api/user/me` and `GET api/user`  to return `UserViewDTO`.
- [ ] Create endpoint `GET api/comment/:post_id` to get comments by post. Add Cursor Based Pagination (You can see how it works [here](./src/types/index.ts)). It should return `ExtendedPostDTO` and sorted by reactions.
- [ ] Create endpoint `GET api/user/by_username/:username` to return a list of `UserViewDTO`  of those users that their usernames are included in `:username`. Add pagination.
- [ ] Update `GET api/post` and `GET api/post/by_user/:user_id` to return a list of `ExtendedPostDTO`.
- [ ] Update `GET api/user/:user_id` to return `UserViewDTO`. Also return if the user follows the one making the request.
- [ ] Using [SocketIO](https://socket.io/) create an authenticated websocket to create a real-time chat between users only if they follow eachother. Also messages should be stored in the database to keep the chat history.
- [ ] Search for a testing framework and create some unit tests. Make a CI/CD pipeline using gitlab actions to run those tests.

