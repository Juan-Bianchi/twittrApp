import { io } from "@server";
import jwt from 'jsonwebtoken';
import { Constants } from "./constants";
import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from "./errors";
import { MessageServiceImpl } from "@domains/message/service";
import { MessageRepositoryImpl } from "@domains/message/repository";
import { db } from '@utils'
import { FollowServiceImpl } from "@domains/follow/service";
import { FollowRepositoryImpl } from "@domains/follow/repository";
import { UserRepositoryImpl } from "@domains/user/repository";
import { MessageDTO, SocketChat } from "@domains/message/dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type MyToken = {
    userId: string
    iat: number
    exp: number
}

const followRep: FollowRepositoryImpl = new FollowRepositoryImpl(db);
const messageRep:  MessageRepositoryImpl = new MessageRepositoryImpl(db);
const userRep: UserRepositoryImpl = new UserRepositoryImpl(db);
const followServ: FollowServiceImpl = new FollowServiceImpl(followRep, userRep);

const service: MessageServiceImpl = new MessageServiceImpl(messageRep, followServ);

io.use((socket: SocketChat, next) => {
    try {
        const token: string = socket.handshake.auth.token as string;
        jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
            if (err) throw new UnauthorizedException('INVALID_TOKEN')
            if(decoded) {
                const {userId} = decoded as MyToken
                socket.userId = userId;
            }
        })
    
        next()
    }
    catch(error) {
        if(error instanceof UnauthorizedException) {
            console.error(error.code)
        }
        socket.disconnect()
    }
})

io.on('connection', (socket: SocketChat) => {
    console.log(`user: ${socket.userId} is connected`);

    socket.on('load chat', async (data) => {
        const { from, to } = data;
        const room: string = [from, to].sort().join('&&&&');
        try {
            console.log('loading chat')
            const clientsInRoom = io.sockets.adapter.rooms.get(room);
            console.log(clientsInRoom)
            if (!clientsInRoom || !clientsInRoom.has(socket.id)) {
                socket.join(room);            
            }
            const messages: MessageDTO[] = await service.loadChat(from, to);
            io.to(room).emit('allMessages', messages)
        }
        catch(error) {
            if( error instanceof NotFoundException || 
                error instanceof ConflictException ) {
                    console.error(error.message)
            }
            console.log(error)
            io.to(room).emit('allMessages', [])
        }
    })

    socket.on('chat message', async (data) => {
        const { from, to, body } = data
        const room: string = [from, to].sort().join('&&&&');
        try{
            const message: MessageDTO | undefined = await service.saveMessage(from, to, body);
            io.to(room).emit('message', message)
        }
        catch(error) {
            if( error instanceof ForbiddenException || 
                error instanceof PrismaClientKnownRequestError) {
                console.error(error.message)
            }
            console.log(error)
            io.to(room).emit('message', null);
        }
    })

    socket.on("connect_error", (err) => {
        console.log(err.message); // prints the message associated with the error
    });

    socket.on('disconnect', () => {
        console.log(`user: ${socket.userId} has left all rooms and has been disconnected`);
    });
});
