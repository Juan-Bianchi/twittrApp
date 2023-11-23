import { PrismaClient } from "@prisma/client";
import { MessageRepository } from "./message.repository";
import { MessageDTO } from "../dto";

export class MessageRepositoryImpl implements MessageRepository {

    constructor(private readonly db: PrismaClient){}

    async saveMessage(from: string, to: string, body: string) : Promise<MessageDTO>{
        const message = await this.db.message.create({
            data: {
                from,
                to,
                body,
            }
        })
        return new MessageDTO(message);
    }


    async getMessages(from: string, to: string): Promise<MessageDTO[]> {
        const messages = await this.db.message.findMany({
            where: {
                OR: [
                    {
                        from,
                        to
                    },
                    {
                        from: to,
                        to: from
                    }
                ]
            },
            orderBy: {
                date: 'asc'
            }
        }).then(messags => messags.map(message => new MessageDTO(message)));

        return messages;
    }
}