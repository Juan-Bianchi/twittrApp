import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  getPublicOrFollowedByDatePaginated (options: CursorPagination, userId: string): Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string, userId: string) => Promise<PostDTO | null>
  getByAuthorId (authorId: string, userId: string): Promise<ExtendedPostDTO[]>
}
