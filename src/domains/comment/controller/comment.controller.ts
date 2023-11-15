import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { CommentService } from '../service/comment.service'
import { CommentServiceImpl } from '../service/comment.service.impl'
import { PostRepositoryImpl } from '@domains/post/repository'
import { UserRepositoryImpl } from '@domains/user/repository'
import { CommentRepositoryImpl } from '../repository'
import { CreateCommentInputDTO } from '../dto'
import { PostDTO } from '@domains/post/dto'

export const commentRouter = Router()

const service: CommentService = new CommentServiceImpl(new CommentRepositoryImpl(db), 
                                                       new PostRepositoryImpl(db),
                                                       new UserRepositoryImpl(db));

/*commentRouter.get('/', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { limit, before, after } = req.query as Record<string, string>
  
    const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })
  
    return res.status(HttpStatus.OK).json(posts)
})
*/

commentRouter.get('/:postId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const { limit: limString, before, after } = req.query as Record<string, string>
    const limit: number = Number(limString)
  
    const commments: PostDTO[] = await service.getByPostIdCursorPaginated(userId, postId, {limit , before, after})
  
    return res.status(HttpStatus.OK).json(commments)
})
  
commentRouter.get('/by_user/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { user_id: authorId } = req.params

    const comments = await service.getCommentsByAuthor(userId, authorId)

    return res.status(HttpStatus.OK).json(comments)
})

commentRouter.post('/', BodyValidation(CreateCommentInputDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const data = req.body
  
    const post = await service.createComment(userId, data)
  
    return res.status(HttpStatus.CREATED).json(post)
})

commentRouter.delete('/:commentId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { commentId } = req.params
  
    await service.deleteComment(userId, commentId)
  
    return res.status(HttpStatus.OK).send(`Deleted comment ${commentId}`)
})