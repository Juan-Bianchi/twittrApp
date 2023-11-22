import { Socket } from "socket.io";

export class MessageDTO {
    id: string | null;
    body: string;
    from: string;
    to: string;
    date: Date;

    constructor(message: MessageDTO) {
        this.body = message.body;
        this.id = message.id;
        this.from = message.from;
        this.to = message.to;
        this.date = message.date
    }
}

export interface SocketChat extends Socket {
    userId?: string
}

