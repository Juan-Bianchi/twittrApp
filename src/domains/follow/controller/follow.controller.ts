import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'
import { FollowService, FollowServiceImpl } from '../service';
import { followRepositoryImpl } from '../repository';
import { UserRepositoryImpl } from '@domains/user/repository';
import { FollowDTO } from '../dto';

export const followRouter = Router();

const followService: FollowService = new FollowServiceImpl(new followRepositoryImpl(db), new UserRepositoryImpl(db))

followRouter.put('/follow/:user_id', async (req: Request, res: Response) => {
    const {userId: followerID} = res.locals.context;
    const {user_id: followedID} = req.params;

    const newFollow: FollowDTO = await followService.followUser(followerID, followedID);

    res.status(201).json(newFollow);
})

followRouter.patch('/unfollow/:user_id', async (req:Request, res: Response) => {
    const {userId: followerID} = res.locals.context;
    const {user_id: followedID} = req.params;

    const unfollowed: FollowDTO = await followService.unfollowUser(followerID, followedID);

    res.status(200).json(unfollowed);
} )





