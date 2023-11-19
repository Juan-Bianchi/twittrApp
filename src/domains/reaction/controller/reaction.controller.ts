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
 *               $ref: '#/components/schemas/NotFoundException'
 *     ConflictException:
 *       description: There is a conflict because it is impossible to perform the request due to the objects state.
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictException'
 *   schemas:  
 *     ReactionDTO:
 *       type: object
 *       required:
 *         - postId
 *         - userId
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto generated id of the reaction
 *         postId:
 *           type: string
 *           description: The post id being reacted
 *         userId:
 *           type: string
 *           description: The id of the user reacting
 *         type:
 *           type: string
 *           enum: [LIKE, RETWEET]
 *           description: The reaction type
 *       example:
 *         id: 3cdb42b2-c12f-4bdd-bf45-1143033898fb
 *         postId: 921cce9e-cfe6-4636-a0ca-9df133d38527
 *         userId: 83538af2-24e4-4435-bc36-a049183828d8
 *         type: LIKE
 *     ReactionInputDTO:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [LIKE, RETWEET]
 *           description: The reaction type
 *       example:
 *         type: LIKE
 *     ReactionCreationDTO:
 *       type: object
 *       required:
  *         - postId
 *         - userId
 *         - type
 *       properties:
 *         postId:
 *           type: string
 *           description: The post id being reacted
 *         userId:
 *           type: string
 *           description: The id of the user reacting
 *         type:
 *           type: string
 *           enum: [LIKE, RETWEET]
 *           description: The reaction type
 *       example:
 *         id: 3cdb42b2-c12f-4bdd-bf45-1143033898fb
 *         postId: 921cce9e-cfe6-4636-a0ca-9df133d38527
 *         userId: 83538af2-24e4-4435-bc36-a049183828d8
 *         type: LIKE
 */

/**
 * @swagger
 * tags:
 *   name: Reaction
 *   description: The reactions managing API
 * /api/reaction/{post_id} :
 *   post:
 *     summary: creates a new comment and stores it in the database
 *     security:
 *       - bearerAuth: []
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id I want to react on
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ReactionInputDTO'
 *     responses:
 *       201:
 *         description: The reaction has been created and stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReactionDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       409:
 *         $ref: '#/components/responses/ConflictException'
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
 *   delete:
 *     summary: deletes the reaction of the given post
 *     security:
 *       - bearerAuth: []
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id od the post from where I want to delete the transaction
 *     responses:
 *       200:
 *         description: The reaction has been deleted
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       403:
 *         $ref: '#/components/responses/ForbiddenException'
 *       500:
 *         description: Internal server error
 * api/reaction/likes/by_user/{user_id} :
 *   get:
 *     summary: brings from the database all the likes from posts of a given user
 *     security:
 *       - bearerAuth: []
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user who recieved the likes
 *     responses:
 *       200:
 *         description: All requested likes have been brougth.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReactionDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 * api/reaction/retweets/by_user/{user_id} :
 *   get:
 *     summary: brings from the database all the retweets from posts of a given user
 *     security:
 *       - bearerAuth: []
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the user who recieved the retweets
 *     responses:
 *       200:
 *         description: All requested retweets have been brougth.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReactionDTO'
 *       404:
 *         $ref: '#/components/responses/NotFoundException'
 *       500:
 *         description: Internal server error
 */


import { Router, Request, Response } from "express";
import { ReactionService, ReactionServiceImpl } from "../service";
import { ReactionRepositoryImpl } from "../repository";
import { BodyValidation, db } from "@utils";
import { UserRepositoryImpl } from "@domains/user/repository";
import { PostRepositoryImpl } from "@domains/post/repository";
import { ReactionInputDTO, ReactionCreationDTO, ReactionDTO } from "../dto";

import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

export const reactionRouter = Router();
const reactionService: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db), 
                                                                 new UserRepositoryImpl(db),
                                                                new PostRepositoryImpl(db));

reactionRouter.post('/:post_id', BodyValidation(ReactionInputDTO), async (req: Request, res: Response) => {
    const {post_id: postId} = req.params;
    const {userId} = res.locals.context;
    const {type} = req.body;

    const reaction : ReactionDTO = await reactionService.createReaction(new ReactionCreationDTO(postId, userId, type))

    res.status(HttpStatus.CREATED).json(reaction);
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
    const {post_id: postId} = req.params;
    const {userId} = res.locals.context;
    const {type} = req.body;

    const reaction: ReactionDTO = await reactionService.deleteReaction(postId, userId, type);

    res.status(HttpStatus.OK).json(reaction);
})

reactionRouter.get('/likes/by_user/:user_id', async(req: Request, res: Response) => {
    const {user_id: userId} = req.params

    const reactions: ReactionDTO[] = await reactionService.getLikesByUserId(userId);

    res.status(HttpStatus.OK).json(reactions);
})

reactionRouter.get('/retweets/by_user/:user_id', async(req: Request, res: Response) => {
    const {user_id: userId} = req.params

    const reactions: ReactionDTO[] = await reactionService.getRetweetsByUserId(userId);

    res.status(HttpStatus.OK).json(reactions);
})

