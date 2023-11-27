import { PrismaClient, ReactionType } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        isAComment: false,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getPublicOrFollowedByDatePaginated (options: CursorPagination, userId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      include: {
        author: true,
        comments: true,
        reactions: true
      },
      where : {
        isAComment: false,
        author: {
          OR: [
            {
              followers: {
                some: {
                  followerId: userId
                }
              }
            },
            {
              hasPrivateProfile: false
            }
          ]
        }
      },
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => {
      return new ExtendedPostDTO(
        {
          id: post.id,
          authorId: post.authorId,
          content: post.content,
          images: post.images,
          createdAt: post.createdAt,
          isAComment: post.isAComment,
          author: post.author,
          qtyComments: post.comments.length,
          qtyLikes: post.reactions.filter(react => react.type === ReactionType.LIKE).length,
          qtyRetweets: post.reactions.filter(react => react.type === ReactionType.RETWEET).length,
        }
      )
    })
  }

  async delete (postId: string): Promise<PostDTO> {
    return await this.db.post.delete({
      where: {
        id: postId
      }
    }).then(post => new PostDTO(post))
  }

  async getById (postId: string, userId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findFirst({
      where: {
        id: postId,
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

  async getByAuthorId (authorId: string, userId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
          authorId,
          isAComment: false,
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
        }
      },
      include: {
        author: true,
        comments: true,
        reactions: true
      }   
    })
    return posts.map(post =>{
      return new ExtendedPostDTO(
        {
          id: post.id,
          authorId: post.authorId,
          content: post.content,
          images: post.images,
          createdAt: post.createdAt,
          isAComment: post.isAComment,
          author: post.author,
          qtyComments: post.comments.length,
          qtyLikes: post.reactions.filter(react => react.type === ReactionType.LIKE).length,
          qtyRetweets: post.reactions.filter(react => react.type === ReactionType.RETWEET).length,
        }
      )
    })
  }
}
