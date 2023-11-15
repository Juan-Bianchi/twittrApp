import { OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  getPreSignedURL(imgName: string, userId: string): Promise<string>
  updateUserProfilePicture: (imgName: string, userId: string) => Promise<UserDTO>
}
