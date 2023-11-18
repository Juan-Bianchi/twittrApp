import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConflictException } from "../../../utils/errors";


export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}


  async getByUsernameCursorPaginated (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    
    return await this.repository.getByUsernameCursorPaginated(username, options);
  }

  async changeUserPrivacy(userId: string, hasPrivateProfile: boolean): Promise<UserDTO> {

    return await this.repository.changeUserPrivacy(userId, hasPrivateProfile);
  }

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')

    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async getPreSignedURL(imgName: string, userId: string): Promise<string> {
    const region: string = "us-east-2"
    const bucket: string = "twittr-bucket"

    try {
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: `${userId}/${imgName}` });

        const clientUrl:string = await getSignedUrl(client, command, { expiresIn: 3600 });

        return clientUrl;
    } 
    catch (err) {
        throw new ConflictException('NOT_ABLE_TO_CREATE_PRESIGNED_URL')
    }
  }

  async updateUserProfilePicture(imgName: string, userId: string): Promise<UserDTO> {
    const region: string = "us-east-2"
    const bucket: string = "twittr-bucket"
    
    try {
        const client = new S3Client({ region });
        const command = new GetObjectCommand({ Bucket: bucket, Key: `${userId}/${imgName}` });

        const imageURL: string = await getSignedUrl(client, command);
        return this.repository.updateProfilePicture(userId, imageURL);
    }
    catch (err) {
      throw new ConflictException('NOT_ABLE_TO_RETRIEVE_SIGNED_URL')
    }
  }
}
