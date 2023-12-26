import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async getByUsernameOffsetPaginated(username: string, options: OffsetPagination) : Promise<UserViewDTO[]> {
    return this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        username: {
          contains: username
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ],
      include: {
        followers: true,
        follows: true
      }
    }).then(users => users.map(user => new UserViewDTO(user)))
  }

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getByIdPublicOrFollowed (userId: string, otherUserId: string): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: otherUserId
      },
      include: {
        followers: true,
        follows: true
      }
    })
    if(user) {
      if(!user.hasPrivateProfile ||
         user.id.includes(userId) ||
         user.followers.some(follow => follow.followerId.includes(userId))) {
          
        return new UserViewDTO(user)
      }
    }
    return null;
  }

  async getById (userId: string): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        follows: true,
        followers: true,
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async delete (userId: any): Promise<UserDTO> {
    const user = await this.db.user.delete({
      where: {
        id: userId
      }
    })
    return new UserDTO(user);
  }

  async getRecommendedUsersPaginated (userId: string, options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        NOT: {
          OR: [
            {
              followers: {
                some: {
                  followerId: userId,
                  deletedAt: null
                }
              }
            },
            {
              id: userId
            }
          ]
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new ExtendedUserDTO(user))
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
