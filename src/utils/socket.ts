import { io } from "@server";
import jwt from 'jsonwebtoken';
import { Constants } from "./constants";
import { UnauthorizedException } from "./errors";
import { MessageServiceImpl } from "@domains/message/service";
import { MessageRepositoryImpl } from "@domains/message/repository";
import { db } from '@utils'
import { FollowServiceImpl } from "@domains/follow/service";
import { FollowRepositoryImpl } from "@domains/follow/repository";
import { UserRepositoryImpl } from "@domains/user/repository";
import { MessageDTO, SocketChat } from "@domains/message/dto";

type MyToken = {
    userId: string
    iat: number
    exp: number
}

const followRep: FollowRepositoryImpl = new FollowRepositoryImpl(db);
const messageRep:  MessageRepositoryImpl = new MessageRepositoryImpl(db);
const userRep: UserRepositoryImpl = new UserRepositoryImpl(db);
const followServ: FollowServiceImpl = new FollowServiceImpl(followRep, userRep);

const service: MessageServiceImpl = new MessageServiceImpl(messageRep, followServ)

io.use((socket: SocketChat, next) => {
    const token: string = socket.handshake.auth.token as string;
    jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
        if (err) throw new UnauthorizedException('INVALID_TOKEN')
        if(decoded) {
            const {userId} = decoded as MyToken
            socket.userId = userId;
        }
    })
    next()
})

io.on('connection', (socket: SocketChat) => {

    console.log(`user: ${socket.userId} is connected`);

    socket.on('load chat', async (data) => {
        const { from, to } = data;
        const messages: MessageDTO[] = await service.loadChat(from, to);

        const room: string = [from, to].sort().join('&&&&');
        socket.join(room);
        socket.to(room).emit('allMessages', messages)
    })

    socket.on('chat message', async (data) => {
        const { from, to, body } = data
        const room: string = [from, to].sort().join('&&&&');
        const message: MessageDTO = await service.saveMessage(from, to, body);

        socket.to(room).emit('message', message)
    })

    socket.on('disconnect', () => {
        console.log(`user: ${socket.userId} has left all rooms and has been disconnected`);
    });
});
