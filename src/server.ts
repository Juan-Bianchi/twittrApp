import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { Constants, NodeEnv, Logger } from '@utils';
import { router } from '@router';
import { ErrorHandling } from '@utils/errors';
import { createServer, Server } from 'http';
import { specs } from '@utils/swagger';
import { useSocketIo } from '@utils/socket';

const app = express();
const server: Server = createServer(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')); // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()); // Parse cookies

console.log(Constants.CORS_WHITELIST)
// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
  })
);

app.use('/api', router);

app.use(ErrorHandling);

export const listeningServer  = server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});

const io = useSocketIo(listeningServer);

app.set('socket.io', io);
