import { FollowDTO, FollowInputDTO } from "../dto";
import { FollowRepository } from "../repository";
import { FollowService } from "./follow.service";
import { UserRepository } from "@domains/user/repository";
import {  UserViewDTO } from "@domains/user/dto";
import { ConflictException, NotFoundException } from "@utils";


export class FollowServiceImpl implements FollowService {

    constructor(private readonly followRep: FollowRepository, private readonly userRep: UserRepository) { }   // con esto realizo la inyeccion automaticamente

    async followUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const user: UserViewDTO | null = await this.userRep.getById(followedId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const id: string | null = await this.followRep.getFollowId(followerId, followedId)
        if(!id) {
            throw new NotFoundException('follow')
        }
        let follow: FollowDTO | null = await this.followRep.getFollowById(id) as FollowDTO;
        if(!follow.deletedAt){
            throw new ConflictException('ALREADY_FOLLOWING_USER')
        }
        const followInput: FollowInputDTO = new FollowInputDTO(followerId, followedId)

        return await this.followRep.followUser(followInput);
    }

    async unfollowUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const user: UserViewDTO | null = await this.userRep.getById(followedId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const id: string | null = await this.followRep.getFollowId(followerId, followedId)
        let follow: FollowDTO | null;
        if(!id) {
            throw new NotFoundException('follow')
        }
        else{
            follow = await this.followRep.getFollowById(id) as FollowDTO;
            if(follow.deletedAt){
                throw new ConflictException('ALREADY_NOT_FOLLOWING')
            }
        }
        return await this.followRep.unfollowUser(id);
    }

    async isFollowing(followerId: string, followedId: string): Promise<boolean> {
        const user: UserViewDTO | null = await this.userRep.getById(followedId);
        if(!user) {
            throw new NotFoundException('user');
        }
        const id: string | null = await this.followRep.getFollowId(followerId, followedId)
        return id? true: false;
    }

}