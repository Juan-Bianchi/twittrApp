import { PostDTO } from "@domains/post/dto"
import { CursorPagination } from "@types"
import { CreateCommentInputDTO } from "./dto"

export interface CommentService {
    createComment: (userId: string, data: CreateCommentInputDTO) => Promise<PostDTO>
    deleteComment: (userId: string, commentId: string) => Promise<void>
    getCommentById: (userId: string, commentId: string) => Promise<PostDTO>
    getLatestComments: (userId: string, options: CursorPagination) => Promise<PostDTO[]>
    getCommentsByAuthor: (userId: string, authorId: string) => Promise<PostDTO[]>
}