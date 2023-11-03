import { FollowDTO, FollowInputDTO } from "../dto";

export interface FollowRepository {
    getFollowed(user: string): Promise<FollowDTO[]>;
    getFollowers(user: string): Promise<FollowDTO[]>;
    followUser(user: FollowInputDTO): Promise<FollowDTO>;
    unfollowUser(followId: string): Promise<FollowDTO>;
    getFollowId(followerId: string, followedId: string): Promise<string |null>;
    getFollowById(followId: string): Promise<FollowDTO | null>
}