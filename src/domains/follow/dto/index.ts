export class FollowDTO {
  id: string | undefined;
  followerId: string;
  followedId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(followDTO: FollowDTO) {
    this.createdAt = followDTO.createdAt;
    this.deletedAt = followDTO.deletedAt;
    this.followedId = followDTO.followedId;
    this.followerId = followDTO.followerId;
    this.updatedAt = followDTO.updatedAt;
    this.id = followDTO.id;
  }
}

export class FollowInputDTO {
  followerId: string;
  followedId: string;

  constructor(followerId: string, followedId: string) {
    this.followedId = followedId;
    this.followerId = followerId;
  }
}
