import { Post, Reaction, User } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { CommentRepository, CommentRepositoryImpl } from '@domains/comment/repository';
import { CommentService, CommentServiceImpl } from '@domains/comment/service';
import { PostRepository, PostRepositoryImpl } from '@domains/post/repository';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { ForbiddenException, NotFoundException } from '@utils';
import { UserViewDTO } from '@domains/user/dto';

let service: CommentService;
let mockRepository: CommentRepository;
let postMockRepository: PostRepository;
let userMockRepository: UserRepository;

let mockCtx: MockContext
let ctx: Context
let comment1: Post;
let comment2: Post;
let comment3: any;
let user: User;
let post: Post;


beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    mockRepository = new CommentRepositoryImpl(mockCtx.prisma)
    userMockRepository = new UserRepositoryImpl(mockCtx.prisma)
    postMockRepository = new PostRepositoryImpl(mockCtx.prisma)
    service = new CommentServiceImpl(mockRepository, postMockRepository, userMockRepository)
    comment1 = { id: 'f1989782-88f9-4055-99fc-135611c1992a',
        authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: true,
        postCommentedId: '921cce9e-cfe6-4636-a0ca-9df133d38527'
    }
    comment2 = { id: '64b3fb58-b612-4af0-9916-f84a5439fb4e',
        authorId: '3ebbfea7-3ae5-411c-aae8-049ff04db067',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: true,
        postCommentedId: '30eed46e-294e-4547-ae37-749728575bda'
    }
    comment3 = { id: 'd695dec1-87cd-421e-9698-fde62d6ece2f',
        authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: true,
        postCommentedId: '30eed46e-294e-4547-ae37-749728575bda',
        author: { id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
            name: null,
            email: 'challenge_prueba_juan@outlook.com',
            username: 'userJuan',
            password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
            createdAt: new Date('2023-11-18 19:28:40.065'),
            updatedAt: new Date('2023-11-18 19:59:59.701'),
            deletedAt: null,
            hasPrivateProfile: true,
            profilePicture: 'url'
        },
        comments: <Comment[]>([]),
        reactions: <Reaction[]>([{ id: '3cdb42b2-c12f-4bdd-bf45-1143033898fb',
            postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
            userId: '83538af2-24e4-4435-bc36-a049183828d8',
            type: 'LIKE',
        },
        { id: '3cdb42b2-c12f-4bdd-bf45-114303389888',
            postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
            userId: '83538af2-24e4-4435-bc36-a04918382877',
            type: 'RETWEET',
        }]),
        qtyComments: 0,
        qtyLikes: 1,
        qtyRetweets: 1
    }
    user = { id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        name: null,
        email: 'challenge_prueba_juan@outlook.com',
        username: 'userJuan',
        password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        hasPrivateProfile: true,
        profilePicture: 'url'
    }
    post = { id: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: false,
        postCommentedId: null
    }
})


describe('create', ()=> {
    it('should create a new comment', async () => {
        expect.assertions(2);
        
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(
            new ExtendedPostDTO({...post,
                author: user,
                qtyComments: 0,
                qtyLikes: 0,
                qtyRetweets: 0,
                comments: [],
                reactions: []})
        );
        jest.spyOn(mockRepository, 'create').mockResolvedValue(new PostDTO(comment1));
        const expected = new PostDTO(comment1);
        const recieved = await service.createComment('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {content: 'this is another test twitt.', images: [], postCommentedId: '921cce9e-cfe6-4636-a0ca-9df133d38527'})
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

    it('should throw an exception if post id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.createComment('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {content: 'this is another test twitt.', images: [], postCommentedId: '921cce9e-cfe6-4636-a0ca-9df133d38527'})).rejects.toThrow(NotFoundException)
    });
})


describe('getCommentById', ()=> {
    it('should get the comment by the provided id', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}));
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(new PostDTO(comment1));
        const expected = new PostDTO(comment1)
        const recieved = await service.getCommentById('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')

        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getCommentById('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if comment id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}));
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(null)
        await expect(service.getCommentById('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')).rejects.toThrow(NotFoundException)
    });
})


describe('delete', ()=> {
    it('should delete the comment with the provided id', async () => {
        
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(new PostDTO(comment1))
        jest.spyOn(mockRepository, 'delete').mockResolvedValue(new PostDTO(comment1))
        await service.deleteComment('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a') 
        expect(mockRepository.delete).toHaveBeenCalled
    });

    it('should throw an exception if comment id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(null);
        await expect(service.deleteComment('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if user is not the author of the comment', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(new PostDTO(comment1))
        jest.spyOn(mockRepository, 'delete').mockResolvedValue(new PostDTO(comment1))
        await expect(service.deleteComment('wrong', 'f1989782-88f9-4055-99fc-135611c1992a')).rejects.toThrow(ForbiddenException)
    });
})


describe('getCommentsByAuthor', ()=> {
    it('should get all comments, by author id', async () => {
        expect.assertions(2);

        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}));
        jest.spyOn(mockRepository, 'getByAuthorId').mockResolvedValue([new PostDTO(comment1), new PostDTO(comment2)])
        const expected = [new PostDTO(comment1), new PostDTO(comment2)]
        const recieved = await service.getCommentsByAuthor('3ebbfea7-3ae5-411c-aae8-049ff04db067', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(2)
        expect(recieved[0].id).toEqual(expected[0].id)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getCommentsByAuthor('3ebbfea7-3ae5-411c-aae8-049ff04db067', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });
})

describe('getCommentByPostIdCursorPaginated', ()=> {
    it('should get all comments of a given post', async () => {
        expect.assertions(2);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(
            new ExtendedPostDTO({...post,
                author: user,
                qtyComments: 0,
                qtyLikes: 0,
                qtyRetweets: 0,
                comments: [],
                reactions: []})
        );
        jest.spyOn(mockRepository, 'getByPostIdCursorPaginated').mockResolvedValue([new ExtendedPostDTO(comment3)])

        const expected = [ new ExtendedPostDTO(comment3) ]
        const recieved = await service.getCommentByPostIdCursorPaginated('30eed46e-294e-4547-ae37-749728575bda', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', {})
        expect(recieved).toHaveLength(1)
        expect(recieved[0].id).toEqual(expected[0].id)
    });

    it('should throw an exception if post id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getCommentByPostIdCursorPaginated('30eed46e-294e-4547-ae37-749728575bda', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', {})).rejects.toThrow(NotFoundException)
    });
})