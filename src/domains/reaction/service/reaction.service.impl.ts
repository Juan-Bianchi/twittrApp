import { ConflictException, ForbiddenException, NotFoundException } from '@utils';
import { ReactionCreationDTO, ReactionDTO, ReactionType } from '../dto';
import { ReactionRepository } from '../repository';
import { ReactionService } from './reaction.service';
import { UserRepository } from '@domains/user/repository';
import { UserViewDTO } from '@domains/user/dto';
import { PostRepository } from '@domains/post/repository';
import { PostDTO } from '@domains/post/dto';

export class ReactionServiceImpl implements ReactionService {
  constructor(
    private readonly reactionRep: ReactionRepository,
    private readonly userRep: UserRepository,
    private readonly postRep: PostRepository
  ) {}

  async createReaction(reactionCreation: ReactionCreationDTO): Promise<ReactionDTO> {
    const user: UserViewDTO | null = await this.userRep.getById(reactionCreation.userId);
    if (!user) {
      throw new NotFoundException('user');
    }
    const post: PostDTO | null = await this.postRep.getById(reactionCreation.postId, reactionCreation.userId);
    if (!post) {
      throw new NotFoundException('post');
    }
    const previousReaction = await this.reactionRep.getReactionByPostIdUserIdAndType(
      reactionCreation.postId,
      reactionCreation.userId,
      reactionCreation.type
    );
    if (previousReaction) {
      throw new ConflictException('USER_HAS_ALREADY_REACTED_TO_THIS_POST');
    }

    return await this.reactionRep.createReaction(reactionCreation);
  }

  async getRetweetsByUserId(userId: string): Promise<ReactionDTO[]> {
    const user: UserViewDTO | null = await this.userRep.getById(userId);
    if (!user) {
      throw new NotFoundException('user');
    }
    const reactions: ReactionDTO[] = (await this.reactionRep.getReactionsByUserId(userId)).filter(
      (reaction) => reaction.type === 'RETWEET'
    );
    if (!reactions.length) {
      throw new NotFoundException('reactions');
    }

    return reactions;
  }

  async getLikesByUserId(userId: string): Promise<ReactionDTO[]> {
    const user: UserViewDTO | null = await this.userRep.getById(userId);
    if (!user) {
      throw new NotFoundException('user');
    }
    const reactions: ReactionDTO[] = (await this.reactionRep.getReactionsByUserId(userId)).filter(
      (reaction) => reaction.type === 'LIKE'
    );
    if (!reactions.length) {
      throw new NotFoundException('reactions');
    }

    return reactions;
  }

  async deleteReaction(postId: string, userId: string, type: ReactionType): Promise<ReactionDTO> {
    const user: UserViewDTO | null = await this.userRep.getById(userId);
    if (!user) {
      throw new NotFoundException('user');
    }
    const post: PostDTO | null = await this.postRep.getById(postId, user.id);
    if (!post) {
      throw new NotFoundException('post');
    }
    const reaction: ReactionDTO | null = await this.reactionRep.getReactionByPostIdUserIdAndType(postId, userId, type);
    if (!reaction?.id) {
      throw new NotFoundException('reaction');
    }
    if (!reaction.userId.includes(userId)) {
      throw new ForbiddenException();
    }

    return await this.reactionRep.deleteReaction(reaction.id);
  }
}
