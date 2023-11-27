import { PrismaClient } from "@prisma/client";
import { ReactionCreationDTO, ReactionDTO, ReactionType } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient){}
    
    async getReactionByPostIdUserIdAndType(postId: string, userId: string, type: ReactionType): Promise<ReactionDTO | null> {
        const reaction = await this.db.reaction.findFirst({
            where: {
                postId: postId,
                type: type,
                userId
            }
        })
        if(!reaction) {
            return reaction
        }

        return new ReactionDTO(reaction);
    }

    async getReactionByPostIdAndUserId(postId: string, userId: string): Promise<ReactionDTO | null> {
        const reaction = await this.db.reaction.findFirst({
            where: {
                postId,
                userId
            }
        })
        if(!reaction) {
            return reaction
        }

        return new ReactionDTO(reaction);
    }

    async deleteReaction(reactionId: string): Promise<ReactionDTO>{
        return this.db.reaction.delete({
            where: {
                id: reactionId
            }
        }).then(reaction => new ReactionDTO(reaction))
    }

    async createReaction(reactionCreation: ReactionCreationDTO): Promise<ReactionDTO>{
        return this.db.reaction.create({
            data: {
                postId: reactionCreation.postId,
                userId: reactionCreation.userId,
                type: reactionCreation.type
            }
        }).then(reaction => new ReactionDTO(reaction))
    }

    async getReactionsByUserId(userId: string): Promise<ReactionDTO[]>{
        return this.db.reaction.findMany({
            where: {
                userId
            }
        }).then(reactions => reactions.map(reaction => new ReactionDTO(reaction)))
    }

}