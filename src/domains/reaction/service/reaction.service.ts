import { ReactionDTO, ReactionCreationDTO, ReactionType } from "../dto";

export interface ReactionService {
    createReaction: (reactionInput: ReactionCreationDTO) => Promise<ReactionDTO>;
    getReactionsByUserId: (userId: string) => Promise<ReactionDTO []>;
    deleteReaction: (reactionId: string, userId: string, type: ReactionType) => Promise<ReactionDTO>;
}