import { FollowDTO, FollowInputDTO } from "../dto";
import { FollowRepository } from "../repository";
import { FollowService } from "./follow.service";
import { UserRepository } from "@domains/user/repository";
import { UserDTO } from "@domains/user/dto";
import { ConflictException, NotFoundException } from "@utils";


export class FollowServiceImpl implements FollowService {

    constructor(private readonly followRep: FollowRepository, private readonly userRep: UserRepository) { }   // con esto realizo la inyeccion automaticamente

    async followUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const user: UserDTO | null = await this.userRep.getById(followedId);
        if(!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }
        const id: string | null = await this.followRep.getFollowId(followerId, followedId)
        let follow: FollowDTO | null;
        if(id) {
            follow = await this.followRep.getFollowById(id) as FollowDTO;
            if(!follow.deletedAt){
                throw new ConflictException('USER_IS_ALREADY_FOLLOWING')
            }
        }
        const followInput: FollowInputDTO = new FollowInputDTO(followerId, followedId)

        return await this.followRep.followUser(followInput);
    }

    async unfollowUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const user: UserDTO | null = await this.userRep.getById(followedId);
        if(!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }
        const id: string | null = await this.followRep.getFollowId(followerId, followedId)
        let follow: FollowDTO | null;
        if(!id) {
            throw new NotFoundException('THERE_IS_NOT_A_FOLLOWING_RELATIONSHIP')
        }
        else{
            follow = await this.followRep.getFollowById(id) as FollowDTO;
            if(follow.deletedAt){
                throw new ConflictException('THERE_IS_NOT_A_FOLLOWING_RELATIONSHIP')
            }
        }
        return await this.followRep.unfollowUser(id);
    }

}