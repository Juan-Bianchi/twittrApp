/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostInputDTO:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content typed by the user who creates the post.
 *         images:
 *           type: array
 *           format: string[]
 *           description: An array with the images' URLs located on cloud
 *       example:
 *         content: 'This is just an example of a post for swagger documentation'
 *     PostDTO:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - content
 *         - images
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         authorId:
 *           type: string
 *           description: The id of the author of the post
 *         content:
 *           type: string
 *           description: The body of the post tweeted
 *         images:
 *           type: array
 *           format: string[]
 *           description: An array with the images' URLs located on cloud.
 *         createdAt:
 *           type: object
 *           format: date
 *           description: The post creation date. 
 *       example:
 *         id: 64688fc8-b7aa-4778-9d01-72535af2c906
 *         authorId: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         content: this is another test twitt for swagger
 *         images: []
 *         createdAt: 2023-11-06 18:20:20.755
 *     ExtendedPostDTO:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - content
 *         - images
 *         - createdAt
 *         - author
 *         - qtyComments
 *         - qtyLikes
 *         - qtyRetweets
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         authorId:
 *           type: string
 *           description: The id of the author of the post
 *         content:
 *           type: string
 *           description: The body of the post tweeted
 *         images:
 *           type: array
 *           format: string[]
 *           description: An array with the images' URLs located on cloud
 *         createdAt:
 *           type: object
 *           format: date
 *           description: The post creation date. 
 *         author:
 *           type: object
 *           format: ExtendedUserDTO
 *           description: The user who created the post, with all their propierties
 *         qtyComments:
 *           type: number
 *           description: The amount of comments of the post
 *         qtyLikes:
 *           type: number
 *           description: The amount of likes the post recieved
 *         qtyRetweets:
 *           type: number
 *           description: The amount of retweets the post recieved
 *       example:
 *         id: 64688fc8-b7aa-4778-9d01-72535af2c906
 *         authorId: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         content: 'this is another test twitt for swagger'
 *         images: []
 *         createdAt: '2023-11-06 18:20:20.755'
 *         author:
 *           id: '50e5c468-c8b3-4e83-b2ee-94507c409bb3'
 *           name: 'John Doe'
 *           createdAt: '2023-11-03 17:40:35.567'
 *           hasPrivateProfile: false
 *           email: swaggerEmail@mail.com
 *           password: 'fakePass123'
 *           userName: swaggerUser
 *           qtyComments: 10
 *           qtyLikes: 10
 *           qtyRetweets: 10
 */

import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { UserRepositoryImpl } from '@domains/user/repository'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db), 
                             new UserRepositoryImpl(db))

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await service.getPostsByAuthor(userId, authorId)

  return res.status(HttpStatus.OK).json(posts)
})

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
