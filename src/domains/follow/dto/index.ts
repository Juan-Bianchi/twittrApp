export class followDTO {

    id: string | undefined;
    followerId: string;
    followedId: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    deletedAt: Date | undefined;


    constructor(followerId: string, followedId: string, createdAt?: Date, updatedAt?: Date, id?: string, deletedAt?: Date) {
       this.createdAt = createdAt;
       this.deletedAt = deletedAt;
       this.followedId = followedId;
       this.followerId = followerId;
       this.updatedAt = updatedAt;
       this.id = id;
    }
}