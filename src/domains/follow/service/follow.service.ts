import { followDTO } from "../dto";

export interface followService {
    followUser(followerId: string, followedId: string): followDTO;
    unfollowUser(followerId: string, followedId: string): followDTO;
}