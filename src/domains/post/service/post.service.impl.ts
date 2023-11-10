import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { UserRepositoryImpl } from '@domains/user/repository'
import { UserDTO } from '@domains/user/dto'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository,
               private readonly userRep: UserRepositoryImpl) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId, userId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const author: UserDTO | null= await this.userRep.getById(userId);
    if(!author) {
      throw new NotFoundException('user')
    }
    const post = await this.repository.getById(postId, userId)
    if (!post){
      throw new NotFoundException('post')
    } 
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const author: UserDTO | null= await this.userRep.getById(userId);
    if(!author) {
      throw new NotFoundException('user')
    }
    const posts: PostDTO[] = await this.repository.getPublicOrFollowedByDatePaginated(options, userId);
    if(!posts.length){
      throw new NotFoundException('posts');
    } 
    return posts;
  }

  async getPostsByAuthor (userId: string, authorId: string): Promise<PostDTO[]> {
    const author: UserDTO | null= await this.userRep.getById(authorId);
    if(!author) {
      throw new NotFoundException('user')
    }
    const posts: PostDTO[] = await this.repository.getByAuthorId(authorId, userId);
    if(!posts.length) {
      throw new NotFoundException('posts')
    }

    return posts;
  }
}
