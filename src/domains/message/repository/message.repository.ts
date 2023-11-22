import { MessageDTO } from "../dto";

export interface MessageRepository {
    saveMessage(userId: string, recieverId: string, body: string) : Promise<MessageDTO>
    getMessages(from: string, to: string): Promise<MessageDTO[]>
}