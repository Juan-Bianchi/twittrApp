/**
 * @swagger
 * components:
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
