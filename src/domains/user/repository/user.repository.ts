import { SignupInputDTO } from '@domains/auth/dto'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  changeUserPrivacy: (userId: string, hasPrivateProfile: boolean) => Promise<UserDTO>
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<UserDTO>
  getRecommendedUsersPaginated: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>
  getByIdPublicOrFollowed (userId: string, otherUserId: string): Promise<UserViewDTO | null>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  updateProfilePicture: (userId: string, profilePicture: string)=> Promise<UserDTO>
  getByUsernameOffsetPaginated: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
}
