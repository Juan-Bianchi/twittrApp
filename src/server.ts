import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'


import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import { text } from 'stream/consumers'

const app = express()


// Swagger setup
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Twitter API with Swagger",
      version: "0.1.0",
      description:
        "This is a Restful API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./**/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

app.use(express.text()) //  PRUEBA, LUEGO ELIMINAR

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

app.use('/api', router)

app.use(ErrorHandling)

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})
