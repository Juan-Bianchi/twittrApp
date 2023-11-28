import { CursorPagination, OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: string) => Promise<UserViewDTO>
  getPublicOrFollowedUser (userId: string, otherUserId: string): Promise<UserViewDTO | null>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  getPreSignedURL(imgName: string, userId: string): Promise<string>
  updateUserProfilePicture: (imgName: string, userId: string) => Promise<string>
  getByUsernameCursorPaginated: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
}
