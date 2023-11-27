import { Post, PrismaClient, ReactionType } from '@prisma/client'

import { CursorPagination } from '@types'

import { CommentRepository } from '.'
import { ExtendedPostDTO, PostDTO } from '../../post/dto'
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

    
  async delete (postId: string): Promise<PostDTO> {
    return await this.db.post.delete({
      where: {
        id: postId
      }
    }).then(comment => new PostDTO(comment))
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

  async getByPostIdCursorPaginated (postCommentedId: string, userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after? {id: options.after}: options.before? {id:options.before}: undefined,
      take: options.limit? (options.after? options.limit: -options.limit): undefined,
      skip: options.after? 1: options.before? 1: undefined,
      where: {
        postCommentedId,
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
        }
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        reactions: true,
        comments: true,
        author: true
      },
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
}
