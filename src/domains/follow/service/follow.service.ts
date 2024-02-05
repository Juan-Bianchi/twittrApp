import { FollowDTO } from '../dto';

export interface FollowService {
  followUser: (followerId: string, followedId: string) => Promise<FollowDTO>;
  unfollowUser: (followerId: string, followedId: string) => Promise<FollowDTO>;
  isFollowing: (followerId: string, followedId: string) => Promise<boolean>;
}
