import { Router, Request, Response } from "express";
import { ReactionService, ReactionServiceImpl } from "../service";
import { ReactionRepositoryImpl } from "../repository";
import { BodyValidation, db } from "@utils";
import { UserRepositoryImpl } from "@domains/user/repository";
import { PostRepositoryImpl } from "@domains/post/repository";
import { ReactionInputDTO, ReactionCreationDTO } from "../dto";

export const reactionRouter = Router();
const reactionService: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db), 
                                                                 new UserRepositoryImpl(db),
                                                                new PostRepositoryImpl(db));

reactionRouter.post('/:post_id', BodyValidation(ReactionInputDTO), async (req: Request, res: Response) => {
    const {post_id: postId} = req.params;
    const {userId} = res.locals.context;
    const {type} = req.body;

    reactionService.createReaction(new ReactionCreationDTO(postId, userId, type))
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
    const {post_id: postId} = req.params;
    const {userId} = res.locals.context;
    const {type} = req.body;

    reactionService.deleteReaction(postId, userId, type)
})

