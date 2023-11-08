/**
 * @swagger
 * components:
 *   schemas:
 *     FollowDTO:
 *       type: object
 *       required:
 *         - followerId
 *         - followedId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the follow
 *         followerId:
 *           type: string
 *           description: The id of a user who is following another user
 *         followedId:
 *           type: string
 *           description: The id of the user who is being followed
 *         createdAt:
 *           type: object
 *           format: date
 *           description: The creation date of the follow relationship
 *         updatedAt:
 *           type: object
 *           format: date
 *           description: The date of the update of this relationship
 *         deletedAt:
 *           type: object
 *           format: date
 *           description: The date registered when there is not more following relationship
 *       example:
 *         id: f46436d1-fb45-4fed-aa6a-0f70ce69902d
 *         followerId: 50e5c468-c8b3-4e83-b2ee-94507c409bb3
 *         followedId: 8293d882-27d9-4e5f-a8a5-79856a5dc460
 *         createdAt: 2023-11-03 18:18:16.763
 *         updatedAt: 2023-11-03 19:14:23.145
 *         deletedAt: null
 */


import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'
import { FollowService, FollowServiceImpl } from '../service';
import { FollowRepositoryImpl } from '../repository';
import { UserRepositoryImpl } from '@domains/user/repository';
import { FollowDTO } from '../dto';

export const followRouter = Router();

const followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db), new UserRepositoryImpl(db))

followRouter.put('/follow/:user_id', async (req: Request, res: Response) => {
    const {userId: followerID} = res.locals.context;
    const {user_id: followedID} = req.params;

    const newFollow: FollowDTO = await followService.followUser(followerID, followedID);

    res.status(HttpStatus.CREATED).json(newFollow);
})

followRouter.patch('/unfollow/:user_id', async (req:Request, res: Response) => {
    const {userId: followerID} = res.locals.context;
    const {user_id: followedID} = req.params;

    const unfollowed: FollowDTO = await followService.unfollowUser(followerID, followedID);

    res.status(HttpStatus.ACCEPTED).json(unfollowed);
} )





