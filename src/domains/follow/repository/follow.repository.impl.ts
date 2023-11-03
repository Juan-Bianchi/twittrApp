import { followDTO } from "../dto";
import { followRepository } from "./follow.repository";

export class followRepositoryImpl implements followRepository {

    getFollowed(user: string): Promise<followDTO[]> {
        throw new Error("Method not implemented.");
    }

    getFollowers(user: string): Promise<followDTO[]> {
        throw new Error("Method not implemented.");
    }

}