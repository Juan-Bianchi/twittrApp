import { followDTO } from "../dto";

export interface followRepository {
    getFollowed(user: string): Promise<followDTO[]>;
    getFollowers(user: string): Promise<followDTO[]>;
}