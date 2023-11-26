import { MessageService } from "./message.service";
import { MessageRepository } from "../repository";
import { FollowService } from "@domains/follow/service";
import { ConflictException, ForbiddenException, NotFoundException } from "@utils";
import { MessageDTO } from "../dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export class MessageServiceImpl implements MessageService {
    constructor(private readonly repository: MessageRepository,
                private readonly followService: FollowService){}

    async loadChat(from: string, to: string): Promise<MessageDTO[]> {
        try {
            if(!from || !to) {
                throw new ConflictException('PARAMETERS_ARE_UNDEFINED')
            }
            const senderIsFollowing: boolean = await this.followService.isFollowing(from, to);
            const recieverIsFollowing: Boolean = await this.followService.isFollowing(to, from);
            if(!senderIsFollowing || !recieverIsFollowing) {
                throw new NotFoundException('message');
            }
            const messages = await this.repository.getMessages(from, to);
            
            return messages;
        }
        catch(error) {
            if( error instanceof NotFoundException || 
                error instanceof ConflictException) {
                console.error(error.message)
            }
            console.log(error)
            return [];
        }
        
    }

    async saveMessage(from: string, to: string, body: string): Promise<MessageDTO | undefined> {
        try {
            const senderIsFollowing: boolean = await this.followService.isFollowing(from, to);
            const recieverIsFollowing: boolean = await this.followService.isFollowing(to, from);
            if(!senderIsFollowing || !recieverIsFollowing) {
                throw new ForbiddenException();
            }
            const message: MessageDTO = await this.repository.saveMessage(from, to, body);
            return message;
        }
        catch(error) {
            if( error instanceof ForbiddenException || 
                error instanceof PrismaClientKnownRequestError) {
                console.error(error.message)
            }
            console.log(error)
        }
    }
}