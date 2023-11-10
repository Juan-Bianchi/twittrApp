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

