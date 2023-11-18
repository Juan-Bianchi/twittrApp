import { SignupInputDTO } from '@domains/auth/dto'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string, otherUserId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  updateProfilePicture: (userId: string, profilePicture: string)=> Promise<UserDTO>
  getByUsernameCursorPaginated: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
}
