import { OffsetPagination } from '@types';
import { UserDTO, UserViewDTO } from '../dto';

export interface UserService {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>;
  deleteUser: (userId: string) => Promise<void>;
  getUser: (userId: string) => Promise<UserViewDTO>;
  getPublicOrFollowedUser: (userId: string, otherUserId: string) => Promise<UserViewDTO | null>;
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
  getPreSignedGetURL: (imgName: string, userId: string) => string | PromiseLike<string>;
  getPreSignedPutURL: (imgName: string, userId: string) => Promise<string>;
  updateUserProfilePicture: (imgName: string, userId: string) => Promise<string>;
  getByUsernameOffsetPaginated: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>;
}
