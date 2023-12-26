import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CommentService } from "./comment.service";
import { UserRepository } from "@domains/user/repository";
import { ForbiddenException, NotFoundException } from "@utils";
import { validate } from "class-validator";
import { UserViewDTO } from "@domains/user/dto";
import { CommentRepository } from "../repository";
import { CursorPagination } from "@types";
import { CreateCommentInputDTO } from "../dto";
import { PostRepository } from "@domains/post/repository";

export class CommentServiceImpl implements CommentService {
    constructor(private readonly repository: CommentRepository,
                private readonly postRep: PostRepository,
                private readonly userRep: UserRepository){}

    async getCommentById(userId: string, commentId: string): Promise<PostDTO> {
        const author: UserViewDTO | null= await this.userRep.getById(userId);
        if(!author) {
            throw new NotFoundException('user')
        }
        const comment = await this.repository.getById(commentId, userId)
        if (!comment){
        throw new NotFoundException('comment')
        } 
        return comment
    }


    async getCommentsByAuthor(userId: string, authorId: string): Promise<PostDTO[]> {
        const author: UserViewDTO | null= await this.userRep.getById(authorId);
        if(!author) {
            throw new NotFoundException('user')
        }
        const comments: PostDTO[] = await this.repository.getByAuthorId(authorId, userId);

        return comments;
    }


    async getCommentByPostIdCursorPaginated (postCommentedId: string, userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
        const post = await this.postRep.getById(postCommentedId, userId);
        if(!post) {
            throw new NotFoundException('post')
        }
        const comments: ExtendedPostDTO[] = await this.repository.getByPostIdCursorPaginated(postCommentedId, userId, options);

        return comments;
    }

    async createComment(userId: string, data: CreateCommentInputDTO): Promise<PostDTO> {
        await validate(data)
        const post: PostDTO | null = await this.postRep.getById(data.postCommentedId, userId);
        if(!post) {
            throw new NotFoundException('post');
        }
        const comment: PostDTO = await this.repository.create(userId, data);

        return comment;
    }


    async deleteComment(userId: string, commentId: string): Promise<void> {
        const comment = await this.repository.getById(commentId, userId)
        if (!comment) throw new NotFoundException('comment')
        if (comment.authorId !== userId) throw new ForbiddenException()
        await this.repository.delete(commentId)
    }
}