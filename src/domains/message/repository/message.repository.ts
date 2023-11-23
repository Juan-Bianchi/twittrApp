import { MessageDTO } from "../dto";

export interface MessageRepository {
    saveMessage(from: string, to: string, body: string) : Promise<MessageDTO>
    getMessages(from: string, to: string): Promise<MessageDTO[]>
}