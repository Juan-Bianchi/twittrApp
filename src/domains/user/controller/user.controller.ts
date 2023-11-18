/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:   
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
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
 *     UserDTO:
 *       type: object
 *       required:
 *         - id
 *         - createdAt
 *         - hasPrivateProfile
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user name
 *         createdAt:
 *           type: object
 *           format: date
 *           description: The user creation date
 *         hasPrivateProfile:
 *           type: boolean
 *           description: it shows if user has public or private profile
 *       example:
 *         id: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         name: falseName
 *         createdAt: 2023-11-03 17:40:35.567
 *         hasPrivateProfile: false 
 *     ExtendedUserDTO:
 *       type: object
 *       required:
 *         - id
 *         - createdAt
 *         - hasPrivateProfile
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user name
 *         createdAt:
 *           type: object
 *           format: date
 *           description: The user creation date
 *         hasPrivateProfile:
 *           type: boolean
 *           description: it shows if user has public or private profile
 *         email:
 *           type: string
 *           description: The email of the user
 *         username:
 *           type: string
 *           description: The name giving inside the system
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         name: falseName
 *         createdAt: 2023-11-03 17:40:35.567
 *         hasPrivateProfile: false
 *         email: falseEmail@mail.com
 *         username: fakeUsername
 *         password: fakePass123
 *     UserViewDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the User
 *         name:
 *           type: string
 *           description: The name of the user
 *         username:
 *           type: string
 *           description: The name of the user given inside the system
 *         profilePicture:
 *           type: string
 *           description: The user picture's URL 
 *       example:
 *         id: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         name: falseName
 *         username: fakeUsername
 *         profilePicture: null
 *     ChangePrivacyInputDTO:
 *       type: object
 *       required:
 *         - hasPrivateProfile
 *       properties:
 *         hasPrivateProfile:
 *           type: boolean
 *           description: Shows if the user is going to have a public or private profile
 *       example:
 *         hasPrivateProfile: true
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The users managing API
 * /api/user/ :
 *   get:
 *     summary: brings recommended users to follow
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description: All recommended users have been brougth.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: deletes the user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The user has been deleted
 *       500:
 *         description: Internal server error
 * /api/user/me :
 *   get:
 *     summary: brings the authenticated user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The authenticated user has been brougth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 * /api/user/{userId} :
 *   get:
 *     summary: brings from the database the selected user
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user I want to get
 *     responses:
 *       200:
 *         description: The user has been brougth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException' 
 *       500:
 *         description: Internal server error
 * /api/user/privacy :
 *   patch:
 *     summary: change user privacy profile
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ChangePrivacyInputDTO'
 *     responses:
 *       200:
 *         description: The user has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException' 
 *       500:
 *         description: Internal server error  
 */

import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation, db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { ChangePrivacyInputDTO, UserDTO, UserViewDTO } from '../dto'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/getSignedURL', async(req: Request, res: Response) => {
  const { name } = req.body;
  const { userId } = res.locals.context;

  const url: string = await service.getPreSignedURL(name, userId);

  return res.status(HttpStatus.CREATED).json(url);
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const { userId } = res.locals.context

  const user = await service.getPublicOrFollowedUser(userId, otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { limit: limitString, before, after } = req.query as Record<string, string>
  const limit: number = Number(limitString);

  const users: UserViewDTO[] = await service.getByUsernameCursorPaginated(username, { limit, before, after });

  return res.status(HttpStatus.OK).json(users);
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.patch('/privacy', BodyValidation(ChangePrivacyInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { hasPrivateProfile } = req.body;

  const user = await service.changeUserPrivacy(userId, hasPrivateProfile);

  return res.status(HttpStatus.OK).json(user);
})

userRouter.post('/profilePicture', async(req: Request, res: Response) => {
  const { name } = req.body;
  const { userId } = res.locals.context;

  const user: UserDTO = await service.updateUserProfilePicture(name, userId);

  return res.status(HttpStatus.OK).json(user);
})
