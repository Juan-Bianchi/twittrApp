import jwt from 'jsonwebtoken';
import { Constants } from './constants';
import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from './errors';
import { MessageServiceImpl } from '@domains/message/service';
import { MessageRepositoryImpl } from '@domains/message/repository';
import { db, Logger } from '@utils';
import { FollowServiceImpl } from '@domains/follow/service';
import { FollowRepositoryImpl } from '@domains/follow/repository';
import { UserRepositoryImpl } from '@domains/user/repository';
import { MessageDTO, SocketChat } from '@domains/message/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Server } from 'socket.io';
import http from 'http'

interface MyToken {
  userId: string;
  iat: number;
  exp: number;
}

const followRep: FollowRepositoryImpl = new FollowRepositoryImpl(db);
const messageRep: MessageRepositoryImpl = new MessageRepositoryImpl(db);
const userRep: UserRepositoryImpl = new UserRepositoryImpl(db);
const followServ: FollowServiceImpl = new FollowServiceImpl(followRep, userRep);

const service: MessageServiceImpl = new MessageServiceImpl(messageRep, followServ);

export const useSocketIo = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: Constants.CORS_WHITELIST,
    },
  });
  
  io.use((socket: SocketChat, next) => {
    try {
      const [bearer, token] = (socket.handshake.auth.token as string).split(' ') ?? [];
      // Verify that the Authorization header has the expected shape
      if (!bearer || !token || bearer !== 'Bearer') throw new UnauthorizedException('MISSING_TOKEN');
      // Verify that the token is valid
      jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
        if (err) throw new UnauthorizedException('INVALID_TOKEN');
        if (decoded !== undefined) {
          const { userId } = decoded as MyToken;
          socket.userId = userId;
        }
      });
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        Logger.error(error.code);
        Logger.error(error.message);
      }
      io.emit('error', error);
      socket.disconnect();
    }
  });
  
  io.on('connection', (socket: SocketChat) => {  
    socket.on('load chat', async (data) => {

      const from: string = data.from;
      const to: string = data.to;
      const room: string = [from, to].sort((a, b) => a.localeCompare(b)).join('&&&&');
      try {
        Logger.time('loading chat');
        let clientsInRoom = io.sockets.adapter.rooms.get(room);
        while (clientsInRoom === undefined || !clientsInRoom.has(socket.id)) {
          await socket.join(room);
          clientsInRoom = io.sockets.adapter.rooms.get(room);
        }
        Logger.success(`User ${from} is connected to room ${room}`)
        const messages: MessageDTO[] = await service.loadChat(from, to);
        io.to(room).emit('allMessages', messages);
      } catch (error) {
        if (error instanceof NotFoundException || error instanceof ConflictException) {
          Logger.error(error.message);
        }
        Logger.error(error);
        io.to(room).emit('allMessages', []);
      }
    });
  
    socket.on('chat message', async (data) => {
      const { from, to, body } = data;
      const room: string = [from, to].sort((a, b) => a.localeCompare(b)).join('&&&&');
      try {
        const message: MessageDTO | undefined = await service.saveMessage(from, to, body);
        io.to(room).emit('message', message);
      } catch (error) {
        if (error instanceof ForbiddenException || error instanceof PrismaClientKnownRequestError) {
          Logger.error(error.message);
        }
        Logger.error(error);
        io.to(room).emit('message', null);
      }
    });
  
    socket.on('connect_error', (err) => {
      Logger.error(err.message); // prints the message associated with the error
    });
  
    socket.on('disconnect', () => {
      Logger.success(`user: ${socket.userId as string} has left all rooms and has been disconnected`);
    });
  });
  
  return io;
}

