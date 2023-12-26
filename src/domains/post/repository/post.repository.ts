import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getPublicOrFollowedByDatePaginated (options: CursorPagination, userId: string): Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<PostDTO>
  getById: (postId: string, userId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId (authorId: string, userId: string): Promise<ExtendedPostDTO[]>
}
