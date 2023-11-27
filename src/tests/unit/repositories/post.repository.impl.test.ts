import { Post, Reaction } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { PostRepository, PostRepositoryImpl } from '@domains/post/repository';
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';

let repository: PostRepository;

let mockCtx: MockContext
let ctx: Context
let post1: Post;
let post2: Post;
let post3: any;


beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new PostRepositoryImpl(mockCtx.prisma)
    post1 = { id: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: false,
        postCommentedId: null
    }
    post2 = { id: '30eed46e-294e-4547-ae37-749728575bda',
        authorId: '3ebbfea7-3ae5-411c-aae8-049ff04db067',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: false,
        postCommentedId: null
    }
    post3 = { id: 'd695dec1-87cd-421e-9698-fde62d6ece2f',
        authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        content: 'this is another test twitt.',
        images: [],
        createdAt: new Date('2023-11-18 20:01:44.733'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        isAComment: false,
        postCommentedId: null,
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
    it('should create a new post', async () => {
        expect.assertions(2);
        
        mockCtx.prisma.post.create.mockResolvedValue(post1);
        const expected = new PostDTO(post1);
        const recieved = await repository.create('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {content: 'this is another test twitt.', images: []})
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });
})

describe('getPublicOrFollowedByDatePaginated', ()=> {
    it('should get all post, no limit and order given', async () => {
        expect.assertions(2);
        let posts: Post[] = [];
        for(let i = 0; i < 10; i++) {
            post3.id = String(i+1);
            posts.push(post3);
        }

        mockCtx.prisma.post.findMany.mockResolvedValue(posts);
        const expected = posts.map(post => new ExtendedPostDTO({...post, 
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
            qtyRetweets: 0 }
        ))
        const recieved = await repository.getPublicOrFollowedByDatePaginated({}, '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(10)
        expect(recieved[0].id).toEqual(expected[0].id)
    });

    it('should get all posts, paginated and ordered by id ASC', async () => {
        expect.assertions(2);
        let posts: Post[] = [];
        for(let i = 0; i < 5; i++) {
            post3.id = String(i+1);
            posts.push(post3);
        }
        mockCtx.prisma.post.findMany.mockResolvedValue(posts);
        const expected = posts.map(post => new ExtendedPostDTO({...post, 
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
            qtyRetweets: 0 }
        ))
        const recieved = await repository.getPublicOrFollowedByDatePaginated({limit: 5, after: '1'}, '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual(expected[0].id)
    })

    it('should get all posts by username, paginated and ordered by id DESC', async () => {
        expect.assertions(2);
        let posts: Post[] = [];
        for(let i = 6; i > 1; i--) {
            post3.id = String(i-1);
            posts.push({... post3});
        }
        mockCtx.prisma.post.findMany.mockResolvedValue(posts);
        const recieved = await repository.getPublicOrFollowedByDatePaginated({limit: 6, before: '6'}, '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual('5')
    })
})

describe('getById', ()=> {
    it('should get the post by the provided id', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.post.findFirst.mockResolvedValue({... post1});
        const expected = new PostDTO(post1)
        const recieved = await repository.getById('921cce9e-cfe6-4636-a0ca-9df133d38527', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

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
    it('should delete the post with the provided', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.post.delete.mockResolvedValue({... post1});
        const expected = new PostDTO(post1)
        const provided = await repository.delete('83538af2-24e4-4435-bc36-a049183828d8') 

        expect(provided).toEqual(expected)
    });
})


describe('getByAuthorId', ()=> {
    it('should get all post, by author id', async () => {
        expect.assertions(2);

        mockCtx.prisma.post.findMany.mockResolvedValue([post3]);
        const expected = [post3].map(post => new ExtendedPostDTO({...post, 
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
            qtyLikes: 1,
            qtyRetweets: 1 }
        ))
        const recieved = await repository.getByAuthorId('3ebbfea7-3ae5-411c-aae8-049ff04db067', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toHaveLength(1)
        expect(recieved[0].id).toEqual(expected[0].id)
    });
})