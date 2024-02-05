import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { CursorPagination } from '@types';
import { CreateCommentInputDTO } from '../dto';

export interface CommentRepository {
  create: (userId: string, data: CreateCommentInputDTO) => Promise<PostDTO>;
  delete: (postId: string) => Promise<PostDTO>;
  getById: (postId: string, userId: string) => Promise<PostDTO | null>;
  getByAuthorId: (authorId: string, userId: string) => Promise<PostDTO[]>;
  getByPostIdCursorPaginated: (
    postCommentedId: string,
    userId: string,
    options: CursorPagination
  ) => Promise<ExtendedPostDTO[]>;
}
