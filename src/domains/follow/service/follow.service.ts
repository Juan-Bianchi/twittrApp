import { followDTO } from "../dto";

export interface followService {
    followUser(followerId: string, followedId: string): Promise<followDTO>;
    unfollowUser(followerId: string, followedId: string): Promise<followDTO>;
}