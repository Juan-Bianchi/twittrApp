import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto';
import { PostRepository } from '../repository';
import { PostService } from '.';
import { validate } from 'class-validator';
import { ForbiddenException, NotFoundException } from '@utils';
import { CursorPagination } from '@types';
import { UserRepository } from '@domains/user/repository';
import { UserViewDTO } from '@domains/user/dto';

export class PostServiceImpl implements PostService {
  constructor(private readonly repository: PostRepository, private readonly userRep: UserRepository) {}

  async createPost(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data);
    return await this.repository.create(userId, data);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId, userId);
    if (!post) throw new NotFoundException('post');
    if (post.authorId !== userId) throw new ForbiddenException();
    await this.repository.delete(postId);
  }

  async getPost(userId: string, postId: string): Promise<ExtendedPostDTO> {
    const author: UserViewDTO | null = await this.userRep.getById(userId);
    if (!author) {
      throw new NotFoundException('user');
    }
    const post = await this.repository.getById(postId, userId);
    if (!post) {
      throw new NotFoundException('post');
    }
    return post;
  }

  async getLatestPosts(userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const author: UserViewDTO | null = await this.userRep.getById(userId);
    if (!author) {
      throw new NotFoundException('user');
    }
    const posts: ExtendedPostDTO[] = await this.repository.getPublicOrFollowedByDatePaginated(options, userId);

    return posts;
  }

  async getPostsByAuthor(userId: string, authorId: string): Promise<ExtendedPostDTO[]> {
    const author: UserViewDTO | null = await this.userRep.getById(authorId);
    if (!author) {
      throw new NotFoundException('user');
    }
    const posts: ExtendedPostDTO[] = await this.repository.getByAuthorId(authorId, userId);

    return posts;
  }
}
