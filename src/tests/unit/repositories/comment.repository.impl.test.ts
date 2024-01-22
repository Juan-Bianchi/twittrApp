import { Post, Reaction } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { CommentRepository, CommentRepositoryImpl } from '@domains/comment/repository';

let repository: CommentRepository;

let mockCtx: MockContext
let ctx: Context
let comment1: Post;
let comment2: Post;
let comment3: any;


beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new CommentRepositoryImpl(mockCtx.prisma)
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
})


describe('create', ()=> {
    it('should create a new comment', async () => {
        expect.assertions(2);
        
        mockCtx.prisma.post.create.mockResolvedValue(comment1);
        const expected = new PostDTO(comment1);
        const recieved = await repository.create('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {content: 'this is another test twitt.', images: [], postCommentedId: '921cce9e-cfe6-4636-a0ca-9df133d38527'})
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });
})

describe('getById', ()=> {
    it('should get the comment by the provided id', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.post.findFirst.mockResolvedValue({... comment1});
        const expected = new PostDTO(comment1)
        const recieved = await repository.getById('f1989782-88f9-4055-99fc-135611c1992a', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });

    it('should return null as the id provided is not valid', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.post.findFirst.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getById('921cce9e-cfe6-4636-a0ca-9df133d38527', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });
})


describe('delete', ()=> {
    it('should delete the comment with the provided', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.post.delete.mockResolvedValue({...comment1});
        const expected = new PostDTO(comment1)
        const provided = await repository.delete('f1989782-88f9-4055-99fc-135611c1992a') 

        expect(provided).toEqual(expected)
    });
})


describe('getByAuthorId', ()=> {
    it('should get all comments, by author id', async () => {
        expect.assertions(2);

        mockCtx.prisma.post.findMany.mockResolvedValue([comment1, comment2]);
        const expected = [new PostDTO(comment1), new PostDTO(comment2)]
        const recieved = await repository.getByAuthorId('3ebbfea7-3ae5-411c-aae8-049ff04db067', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(2)
        expect(recieved[0].id).toEqual(expected[0].id)
    });
})

describe('getByPostIdCursorPaginated', ()=> {
    it('should get all comments of a given post, no limit and order given', async () => {
        expect.assertions(2);
        let comments: Post[] = [];
        for(let i = 0; i < 10; i++) {
            comment3.id = String(i+1);
            comments.push(comment3);
        }

        mockCtx.prisma.post.findMany.mockResolvedValue(comments);
        const expected = comments.map(comment => new ExtendedPostDTO({...comment, 
            author: { id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
                        name: null,
                        email: 'challenge_prueba_juan@outlook.com',
                        username: 'userJuan',
                        password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
                        createdAt: new Date('2023-11-18 19:28:40.065'),
                        hasPrivateProfile: true,
                        profilePicture: 'url'
                    },
            qtyComments: 0,
            qtyLikes: 0,
            qtyRetweets: 0,
            comments: [],
            reactions: []
        }
        ))
        const recieved = await repository.getByPostIdCursorPaginated('30eed46e-294e-4547-ae37-749728575bda', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', {})
        expect(recieved).toHaveLength(10)
        expect(recieved[0].id).toEqual(expected[0].id)
    });

    it('should get all comments, paginated and ordered by id ASC', async () => {
        expect.assertions(2);
        let comments: Post[] = [];
        for(let i = 0; i < 5; i++) {
            comment3.id = String(i+1);
            comments.push(comment3);
        }
        mockCtx.prisma.post.findMany.mockResolvedValue(comments);
        const expected = comments.map(post => new ExtendedPostDTO({...post, 
            author: { id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
                        name: null,
                        email: 'challenge_prueba_juan@outlook.com',
                        username: 'userJuan',
                        password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
                        createdAt: new Date('2023-11-18 19:28:40.065'),
                        hasPrivateProfile: true,
                        profilePicture: 'url'
                    },
            qtyComments: 0,
            qtyLikes: 0,
            qtyRetweets: 0,
            comments: [],
            reactions: []
        }
        ))
        const recieved = await repository.getByPostIdCursorPaginated('30eed46e-294e-4547-ae37-749728575bda', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', {limit: 5, after: '1'})
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual(expected[0].id)
    })

    it('should get all comments by username, paginated and ordered by id DESC', async () => {
        expect.assertions(2);
        let comments: Post[] = [];
        for(let i = 6; i > 1; i--) {
            comment3.id = String(i-1);
            comments.push({... comment3});
        }
        mockCtx.prisma.post.findMany.mockResolvedValue(comments);
        const recieved = await repository.getByPostIdCursorPaginated('30eed46e-294e-4547-ae37-749728575bda', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', {limit: 6, before: '6'})
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual('5')
    })
})