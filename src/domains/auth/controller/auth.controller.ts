/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:   
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     ConflictException:
 *       description: There is a conflict because it is impossible to perform the request due to the objects state.
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictException'
 *     NotFoundException:
 *       description: Not found entity.
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundException'
 *     UnauthorizedException: 
 *       description: User not authorized beacause there is an authentication problem
 *       content:
 *          application/json:
 *             schema:
 *                $ref: '#/components/schemas/UnauthorizedException'
 *   schemas:
 *     TokenDTO:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: The token generated when a user logs in.
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MGU1YzQ2OC1jOGIzLTRlODMtYjJlZS05NDUwN2M0MDliYjMiLCJpYXQiOjE2OTkyOTQ2NzYsImV4cCI6MTY5OTM4MTA3Nn0.AhwPibfXLsdtxO4-w6n6aC_DV5H7YUDN6QDu4kC7Yl4
 *     SignupInputDTO:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user wich is signing up
 *         username:
 *           type: string
 *           description: The username of the person who is signing up
 *         password:
 *           type: string
 *           description: the password of the new user
 *       example:
 *         email: swaggerUser@mail.com
 *         username: newSwaggerUSer
 *         password: Swagger123
 *     LoginInputDTO:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user wich is signing up
 *         username:
 *           type: string
 *           description: The username of the person who is signing up
 *         password:
 *           type: string
 *           description: the password of the new user
 *       example:
 *         email: swaggerUser@mail.com
 *         username: newSwaggerUSer
 *         password: Swagger123
 *     UnauthorizedException:
 *       type: object
 *       required:
 *         - code
 *         - message
 *         - error
 *       properties:
 *         code:
 *           type: number
 *           description: The Http error code
 *         message:
 *           type: string
 *           description: The error message
 *         error:
 *           type: object
 *           description: An object where you can set the error code by providing it when it is thrown
 *       example:
 *         code: 403
 *         message: Forbidden action
 *         error: NOT_VALID_TOKEN
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The posts managing API
 * /api/auth/signup :
 *   post:
 *     summary: creates a new user
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SignupInputDTO'
 *     responses:
 *       201:
 *         description: The user has been created and stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenDTO'
 *       409:
 *         $ref: '#/components/responses/ConflictException'       
 *       500:
 *         description: Internal server error
 * /api/auth/login :
 *   post:
 *     summary: login a user
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginInputDTO'
 *     responses:
 *       200:
 *         description: The user has logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenDTO'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedException'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error   
 */


import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { UserRepositoryImpl } from '@domains/user/repository'

import { AuthService, AuthServiceImpl } from '../service'
import { LoginInputDTO, SignupInputDTO } from '../dto'

export const authRouter = Router()

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db))

authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.signup(data)

  return res.status(HttpStatus.CREATED).json(token)
})

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body
  const token = await service.login(data)

  return res.status(HttpStatus.OK).json(token)
})

authRouter.get('/checkUser', async (req: Request, res: Response) => {
  const {email, username} = req.query as Record<string, string>

  await service.checkUser(email, username);

  return res.status(HttpStatus.OK)
})

authRouter.post('/validate', (req: Request, res: Response) => {

  const [_bearer, token] = (req.headers.authorization)?.split(' ') ?? []
  return res.status(HttpStatus.OK).json(token)
})
