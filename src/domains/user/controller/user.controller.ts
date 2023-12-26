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
 *         profilePicture:
 *           type: string
 *           description: it shows the AWS S3 signed URL where the profile picture is stored
 *       example:
 *         id: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         name: falseName
 *         createdAt: 2023-11-03 17:40:35.567
 *         hasPrivateProfile: false
 *         profilePicture: null
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
 *         profilePicture:
 *           type: string
 *           description: it shows the AWS S3 signed URL where the profile picture is stored
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
 *         profilePicture: null
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
 *     ProfilePictureNameDTO:
 *       type: object
 *       required: 
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: the name of the image archive
 *       example:
 *         name: example.jpg
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The users managing API
 * /api/user/ :
 *   get:
 *     summary: given a user id brings all public users and followed ones 
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description: All users have been brougth.
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
 *               $ref: '#/components/schemas/UserViewDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 * /api/user/getSignedURL :
 *   get:
 *     summary: brings the pre-signed AWS S3 Url to upload a profile picture
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       201:
 *         description: The url has been brougth
 *         content:
 *           application/json:
 *             schema:
 *               url: 
 *                 type: string
 *       409:
 *         $ref: '#/components/responses/ConflictException' 
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
 *       201:
 *         description: The user has been brougth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException' 
 *       500:
 *         description: Internal server error
 * /api/user/by_username/{username} :
 *   get:
 *     summary: brings from the database all users with the same username
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The user name of the users I want to get
 *     responses:
 *       201:
 *         description: Users have been brougth
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserViewDTO'
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
 * /api/user/profilePicture :
 *   post:
 *     summary: save the url of the user profile picture
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProfilePictureNameDTO'
 *     responses:
 *       200:
 *         description: The url of the user profile picture has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       409:
 *         $ref: '#/components/responses/ConflictException' 
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
import { ChangePrivacyInputDTO, ProfilePictureNameDTO, UserDTO, UserViewDTO } from '../dto'

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

userRouter.get('/getPutSignedURL', async(req: Request, res: Response) => {
  const { name } = req.body;
  const { userId } = res.locals.context;

  const url: string = await service.getPreSignedPutURL(name, userId);

  return res.status(HttpStatus.CREATED).json(url);
})

userRouter.get('/getSignedURL', async(req: Request, res: Response) => {
  const { name } = req.body;
  const { userId } = res.locals.context;

  const url: string = await service.getPreSignedGetURL(name, userId);

  return res.status(HttpStatus.CREATED).json(url);
})


userRouter.get('/by_username', async (req: Request, res: Response) => {
  const { limit, skip, username } = req.query as Record<string, string>
  const users: UserViewDTO[] = await service.getByUsernameOffsetPaginated(username, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
})


userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const { userId } = res.locals.context

  const user = await service.getPublicOrFollowedUser(userId, otherUserId)

  return res.status(HttpStatus.OK).json(user)
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

userRouter.post('/profilePicture', BodyValidation(ProfilePictureNameDTO), async(req: Request, res: Response) => {
  const { name } = req.body;
  const { userId } = res.locals.context;

  const url: string = await service.updateUserProfilePicture(name, userId);

  return res.status(HttpStatus.OK).json(url);
})
