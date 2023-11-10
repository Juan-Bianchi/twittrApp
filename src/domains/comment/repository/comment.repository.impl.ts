import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { CommentRepository } from '.'
import { PostDTO } from '../../post/dto'
import { CreateCommentInputDTO } from '../dto'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreateCommentInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        isAComment: true,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async getPublicOrFollowedByDatePaginated (options: CursorPagination, userId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where : {
        isAComment: true,
        OR: [
          {
            author: {
              followers: {
                some: {
                  followerId: userId
                }
              }
            } 
          },
          {
            author: {
              hasPrivateProfile: false
            }
          }
        ]
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string, userId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findFirst({
      where: {
        id: postId,
        isAComment: true,
        author: {
          OR: [
            {
              hasPrivateProfile: false
            },
            {
              followers: {
                some: {
                  followerId: userId
                }
              }
            },
            {
              id: userId, 
            }
          ]
        }
            
      },
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string, userId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
          authorId,
          isAComment: true,
          author: {
            OR: [
              {
                hasPrivateProfile: false
              },
              {
                followers: {
                  some: {
                    followerId: userId
                  }
                }
              },
              {
                id: userId
              }
            ]
        },
      }      
    })
    return posts.map(post => new PostDTO(post))
  }
}
