import { ReactionDTO, ReactionCreationDTO, ReactionType } from "../dto";

export interface ReactionService {
    createReaction: (reactionInput: ReactionCreationDTO) => Promise<ReactionDTO>;
    getRetweetsByUserId: (userId: string) => Promise<ReactionDTO []>;
    getLikesByUserId: (userId: string) => Promise<ReactionDTO[]>
    deleteReaction: (reactionId: string, userId: string, type: ReactionType) => Promise<ReactionDTO>;
}