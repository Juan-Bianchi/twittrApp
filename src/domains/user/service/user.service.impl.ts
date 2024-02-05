import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { UserDTO, UserViewDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';
import { ConflictException } from '../../../utils/errors';
import { S3Service } from '@utils/S3/s3.service';
import { S3CommandType } from '@utils/S3/s3.service.impl';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository, private readonly s3Service: S3Service) {}

  async getByUsernameOffsetPaginated(username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    return await this.repository.getByUsernameOffsetPaginated(username, options);
  }

  async changeUserPrivacy(userId: string, hasPrivateProfile: boolean): Promise<UserDTO> {
    return await this.repository.changeUserPrivacy(userId, hasPrivateProfile);
  }

  async getUser(userId: string): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException('user');

    return user;
  }

  async getPublicOrFollowedUser(userId: string, otherUserId: string): Promise<UserViewDTO> {
    const user = await this.repository.getByIdPublicOrFollowed(userId, otherUserId);
    if (!user) throw new NotFoundException('user');

    return user;
  }

  async getUserRecommendations(userId: string, options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.repository.getRecommendedUsersPaginated(userId, options);

    return users;
  }

  async deleteUser(userId: any): Promise<void> {
    await this.repository.delete(userId);
  }

  async getPreSignedPutURL(imgName: string, userId: string): Promise<string> {
    try {
      if (!imgName) {
        throw new ConflictException();
      }
      const clientUrl: string = await this.s3Service.getSignedURL(S3CommandType.PUT_OBJECT, userId, imgName);

      return clientUrl;
    } catch (err) {
      throw new ConflictException('NOT_ABLE_TO_CREATE_PRESIGNED_URL');
    }
  }

  async getPreSignedGetURL(imgName: string, userId: string): Promise<string> {
    try {
      if (!imgName) {
        throw new ConflictException();
      }
      const clientUrl: string = await this.s3Service.getSignedURL(S3CommandType.GET_OBJECT, userId, imgName);

      return clientUrl;
    } catch (err) {
      throw new ConflictException('NOT_ABLE_TO_CREATE_PRESIGNED_URL');
    }
  }

  async updateUserProfilePicture(imgName: string, userId: string): Promise<string> {
    try {
      if (!imgName) {
        throw new ConflictException();
      }
      const imageURL: string = await this.s3Service.getSignedURL(S3CommandType.GET_OBJECT, userId, imgName);
      await this.repository.updateProfilePicture(userId, `${userId}/${imgName}`);

      return imageURL;
    } catch (err) {
      throw new ConflictException('NOT_ABLE_TO_RETRIEVE_SIGNED_URL');
    }
  }
}
