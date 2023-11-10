import { OffsetPagination } from '@types'
import { UserDTO } from '../dto'

export interface UserService {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
}
