import { MessageService } from "./message.service";
import { io } from '../../../server'
import { MessageRepository } from "../repository";
import { FollowService } from "@domains/follow/service";
import { ConflictException, NotFoundException } from "@utils";
import { MessageDTO } from "../dto";


export class MessageServiceImpl implements MessageService {
    constructor(private readonly repository: MessageRepository,
                private readonly followService: FollowService){}

    async loadChat(from: string, to: string): Promise<MessageDTO[]> {
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

    async saveMessage(from: string, to: string, body: string): Promise<MessageDTO> {
        const senderIsFollowing: boolean = await this.followService.isFollowing(from, to);
        const recieverIsFollowing: boolean = await this.followService.isFollowing(to, from);
        if(!senderIsFollowing || !recieverIsFollowing) {
            throw new NotFoundException('message');
        }
        const message: MessageDTO = await this.repository.saveMessage(from, to, body);
        return message;
    }
}