import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConflictException } from "../../../utils/errors";


export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getByUsernameOffsetPaginated (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    
    return await this.repository.getByUsernameOffsetPaginated(username, options);
  }

  async changeUserPrivacy(userId: string, hasPrivateProfile: boolean): Promise<UserDTO> {

    return await this.repository.changeUserPrivacy(userId, hasPrivateProfile);
  }

  async getUser (userId: string): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')

    return user
  }

  async getPublicOrFollowedUser (userId: string, otherUserId: string): Promise<UserViewDTO> {
    const user = await this.repository.getByIdPublicOrFollowed(userId, otherUserId)
    if (!user) throw new NotFoundException('user')

    return user
  }

  async getUserRecommendations (userId: string, options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.repository.getRecommendedUsersPaginated(userId, options)
    
    return users
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async getPreSignedPutURL(imgName: string, userId: string): Promise<string> {
    const region = process.env.AWS_REGION
    const bucket = process.env.AWS_BUCKET

    try {
        if(!imgName) {
          throw new ConflictException();
        }
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: `${userId}/${imgName}` });

        const clientUrl:string = await getSignedUrl(client, command, { expiresIn: 3600 });

        return clientUrl;
    } 
    catch (err) {
        throw new ConflictException('NOT_ABLE_TO_CREATE_PRESIGNED_URL')
    }
  }

  async getPreSignedGetURL(imgName: string, userId: string): Promise<string> {
    const region = process.env.AWS_REGION
    const bucket = process.env.AWS_BUCKET

    try {
        if(!imgName) {
          throw new ConflictException()
        }
        const client = new S3Client({ region });
        const command = new GetObjectCommand({ Bucket: bucket, Key: `${imgName}` });

        const clientUrl:string = await getSignedUrl(client, command, { expiresIn: 3600 });

        return clientUrl;
    } 
    catch (err) {
        throw new ConflictException('NOT_ABLE_TO_CREATE_PRESIGNED_URL')
    }
  }

  async updateUserProfilePicture(imgName: string, userId: string): Promise<string> {
    const region = process.env.AWS_REGION
    const bucket = process.env.AWS_BUCKET
    
    try {
        if(!imgName) {
          throw new ConflictException()
        }
        const client = new S3Client({ region });
        const command = new GetObjectCommand({ Bucket: bucket, Key: `${userId}/${imgName}` });

        const imageURL: string = await getSignedUrl(client, command, { expiresIn: 3600 });
        this.repository.updateProfilePicture(userId, `${userId}/${imgName}`);
        return imageURL;
    }
    catch (err) {
      throw new ConflictException('NOT_ABLE_TO_RETRIEVE_SIGNED_URL')
    }
  }
}
