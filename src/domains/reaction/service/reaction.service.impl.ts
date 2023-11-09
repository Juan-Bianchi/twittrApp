import { ForbiddenException, NotFoundException } from "@utils";
import { ReactionCreationDTO, ReactionDTO, ReactionType } from "../dto";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { UserRepository } from "@domains/user/repository";
import { UserDTO } from "@domains/user/dto";
import { PostRepository } from "@domains/post/repository";
import { PostDTO } from "@domains/post/dto";

export class ReactionServiceImpl implements ReactionService {

    constructor(private readonly reactionRep:ReactionRepository, 
                private readonly userRep: UserRepository,
                private readonly postRep: PostRepository) {}

    async createReaction(reactionCreation: ReactionCreationDTO): Promise<ReactionDTO> {
        const user: UserDTO | null = await this.userRep.getById(reactionCreation.userId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const post: PostDTO | null = await this.postRep.getById(reactionCreation.postId, reactionCreation.userId);
        if(!post) {
            throw new NotFoundException('post');
        }
        return this.reactionRep.createReaction(reactionCreation);
    }


    async getReactionsByUserId(userId: string): Promise<ReactionDTO[]> {
        const user: UserDTO | null = await this.userRep.getById(userId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const reactions: ReactionDTO[] = await this.reactionRep.getReactionsByUserId(userId);
        if(!reactions.length) {
            throw new NotFoundException('reactions');
        }

        return reactions;
    }


    async deleteReaction(postId: string, userId: string, type: ReactionType): Promise<ReactionDTO> {
        const user: UserDTO | null = await this.userRep.getById(userId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const post: PostDTO | null = await this.postRep.getById(postId, user.id);
        if(!post) {
            throw new NotFoundException('post')
        }
        if(!post.authorId.includes(userId)) {
            throw new ForbiddenException();
        }
        const reaction: ReactionDTO | null= await this.reactionRep.getReactionByPostIdAndType(postId, type);
        if(!reaction || !reaction.id) {
            throw new NotFoundException('reaction')
        }
        
        return this.reactionRep.deleteReaction(reaction.id);
    }

}