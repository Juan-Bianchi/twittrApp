import { followDTO } from "../dto";
import { followService } from "./follow.service";

export class followServiceImpl implements followService {

    followUser(followerId: string, followedId: string): Promise<followDTO> {
        throw new Error("Method not implemented.");
    }

    unfollowUser(followerId: string, followedId: string): Promise<followDTO> {
        throw new Error("Method not implemented.");
    }

}