/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:   
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     ForbiddenException:
 *       description: This exception is thrown when user tries to complete a forbbiden action.
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbbidenException'
 *     NotFoundException:
 *       description: Not found entity
 *       content:
 *           application/json:
 *             schema:
 *               code:
 *                 type: number
 *                 description: The Http error code
 *               message:
 *                 type: string
 *                 description: The error message
 *               error:
 *                 type: object
 *                 description: An object where you can set the error code by providing it when it is thrown
 *   schemas:  
 *     CreateCommentInputDTO:
 *       type: object
 *       required:
 *         - content
 *         - postCommentedId
 *       properties:
 *         content:
 *           type: string
 *           description: The content typed by the user who creates the comment.
 *         images:
 *           type: array
 *           format: string[]
 *           description: An array with the images' URLs located on cloud
 *         postCommentedId:
 *           type: string
 *           description: The commented post id 
 *       example:
 *         content: 'This is just an example of a comment for swagger documentation'
 *         postCommentedId: d695dec1-87cd-421e-9698-fde62d6ece2f
 */

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The comments managing API
 * /api/comment/by_user/{user_id} :
 *   get:
 *     summary: brings from the database all the latest comments made by a user
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id of the author of the comments
 *     responses:
 *       200:
 *         description: All requested comments have been brougth.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 * /api/comment/{postId} :
 *   get:
 *     summary: brings from the database all the comments of a given post 
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id used for getting comments related
 *     responses:
 *       200:
 *         description: The post has been brougth
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 * /api/comment/ :
 *   post:
 *     summary: creates a new comment and stores it in the database
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateCommentInputDTO'
 *     responses:
 *       201:
 *         description: The comment has been created and stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       P1001:
 *         description: This exception is thrown by prisma if the query engine returns a known error related to the request - for example, a unique constraint violation
 *         content:
 *           application/json:
 *             schema:
 *               code:
 *                 type: string
 *                 description: prisma specific error code
 *               meta: 
 *                 type: object
 *                 description: Additional information about the error
 *               message:
 *                 type: string
 *                 description: The error message
 *               clientVersion:
 *                 type: string
 *                 description: Version of Prisma Client
 *       500:
 *         description: Internal server error
 * /api/comment/{commentId} :
 *   delete:
 *     summary: deletes the selected comment
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id I want to delete
 *     responses:
 *       200:
 *         description: The comment has been deleted
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       403:
 *         $ref: '#/components/responses/ForbiddenException'
 *       500:
 *         description: Internal server error
 */


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

commentRouter.get('/by_user/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { user_id: authorId } = req.params

    const comments = await service.getCommentsByAuthor(userId, authorId)

    return res.status(HttpStatus.OK).json(comments)
})

commentRouter.get('/:postId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const { limit: limString, before, after } = req.query as Record<string, string>
    const limit: number = Number(limString)
  
    const commments: PostDTO[] = await service.getCommentByPostIdCursorPaginated(postId, userId, {limit , before, after})
  
    return res.status(HttpStatus.OK).json(commments)
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