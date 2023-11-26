import { MessageDTO } from "../dto";

export interface MessageService {
    saveMessage(from: string, to: string, body: string): Promise<MessageDTO | undefined>
    loadChat(from: string, to: string): Promise<MessageDTO[]>
} 