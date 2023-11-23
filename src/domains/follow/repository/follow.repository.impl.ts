import { Follow, PrismaClient } from "@prisma/client";
import { FollowDTO, FollowInputDTO } from "../dto";
import { FollowRepository } from "./follow.repository";

import { NotFoundException } from "@utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export class FollowRepositoryImpl implements FollowRepository {

    constructor (private readonly db: PrismaClient) {}


    async getFollowById(followId: string): Promise<FollowDTO | null> {
        const follow: Follow | null =  await this.db.follow.findFirst({
            where: {
                id: followId,
            }
        });

        if(!follow) {
            return null;
        }

        return new FollowDTO(follow);
    }

    async getFollowId(followerId: string, followedId: string): Promise<string | null> {
        const follow: Follow | null =  await this.db.follow.findFirst({
            where: {
                followedId: followedId,
                followerId: followerId
            }
        });

        if(!follow) {
            return null;
        }

        return follow.id;
    }

    async followUser(user: FollowInputDTO): Promise<FollowDTO> {
        try{
            const followId = await this.getFollowId(user.followerId, user.followedId);
            let follow: Follow;
            if(followId){
                follow = await this.db.follow.update({
                    where: {
                        id: followId
                    },
                    data: {
                        deletedAt: null
                    },
                })
            }
            else{
                follow = await this.db.follow.create({
                    data: {
                        followerId: user.followerId,
                        followedId: user.followedId,
                    },
                })
            }
            return new FollowDTO(follow);
        }
        catch(error) {
            if(error instanceof PrismaClientKnownRequestError)
                throw new NotFoundException('follow');
            throw error;
        }
        
    }

    async unfollowUser(followId: string): Promise<FollowDTO> {

        return await this.db.follow.update({
            where: {
                id: followId
            },
            data: {
                deletedAt: new Date()
            }
        }).then(follow => new FollowDTO(follow))

    }

    async getFollowed(userId: string): Promise<FollowDTO[]> {
        const followArr: Follow[] =  await this.db.follow.findMany({
            where: {
                followerId: userId,
            }
        })

        return followArr.map(follow => new FollowDTO(follow));
    }

}