import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async getByUsernameCursorPaginated(username: string, options: CursorPagination) : Promise<UserViewDTO[]> {
    return this.db.user.findMany({
      cursor: options.after? { id: options.after }: options.before? { id: options.before }: undefined,
      take: options.limit?(options.after? options.limit: -options.limit): undefined,
      skip: options.after? 1: options.before? 1: undefined,
      where: {
        username
      },
      orderBy: [
        {
          username: 'asc'
        },
        {
          id: 'asc'
        }
      ]
    }).then(users => users.map(user => new UserViewDTO(user)))
  }

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async changeUserPrivacy(userId: string, hasPrivateProfile: boolean) : Promise<UserDTO> {
    return this.db.user.update({
      where: {
        id: userId
      },
      data: {
        hasPrivateProfile: hasPrivateProfile
      }
    })
  }

  async updateProfilePicture(userId: string, profilePicture: string): Promise<UserDTO> {
    return this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture
      }
    })
  }
}
