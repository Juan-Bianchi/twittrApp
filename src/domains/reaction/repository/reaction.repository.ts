import { ReactionDTO, ReactionCreationDTO, ReactionType } from '../dto';

export interface ReactionRepository {
  createReaction: (reactionCreation: ReactionCreationDTO) => Promise<ReactionDTO>;
  getReactionsByUserId: (userId: string) => Promise<ReactionDTO[]>;
  deleteReaction: (reactionId: string) => Promise<ReactionDTO>;
  getReactionByPostIdUserIdAndType: (postId: string, userId: string, type: ReactionType) => Promise<ReactionDTO | null>;
  getReactionByPostIdAndUserId: (postId: string, userId: string) => Promise<ReactionDTO[]>;
}
