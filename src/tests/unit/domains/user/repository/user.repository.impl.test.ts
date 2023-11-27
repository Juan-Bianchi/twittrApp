import { User } from '@prisma/client';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { UserDTO, UserViewDTO } from '@domains/user/dto';
import { Context, MockContext, createMockContext } from '../../../../../context';
import { SignupInputDTO } from '@domains/auth/dto';

let repository: UserRepository;

let mockCtx: MockContext
let ctx: Context
let user1: User;
let user2: User;


beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new UserRepositoryImpl(mockCtx.prisma)
    user1 = { id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        name: null,
        email: 'challenge_prueba_juan@outlook.com',
        username: 'userJuan',
        password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        hasPrivateProfile: false,
        profilePicture: 'https://twittr-bucket.s3.us-east-2.amazonaws.com/3ac84483-20f1-47f3-8be1-43ab2db46ad0/octocat.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQDYKWU4CSKTCR6XB%2F20231118%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20231118T195959Z&X-Amz-Expires=900&X-Amz-Signature=42927fcc54c17ca0ddc22dfeb78100d0a5d93644412b34d106a178cd7143d2de&X-Amz-SignedHeaders=host&x-id=GetObject'
    }
    user2 = { id: '83538af2-24e4-4435-bc36-a049183828d8',
        name: null,
        email: 'challenge_prueba_juan1@outlook.com',
        username: 'userJuan2',
        password: '$2b$10$6spdr8KoxcOe7261tn9sweSMwojuHfdzqNiCMIsiosYKeOwBuxIPy',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        hasPrivateProfile: true,
        profilePicture: null,
    }
})


describe('create', ()=> {
    it('should create a new user', async () => {
        expect.assertions(2);
        
        mockCtx.prisma.user.create.mockResolvedValue(user1);
        const expected = new UserDTO(user1);
        const recieved = await repository.create(new SignupInputDTO("challenge_prueba_juan@outlook.com", "userJuan", "Aa12345@"))
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

})

describe('getByUsernameCursorPaginated', ()=> {
    it('should get all users by username, no limit and order given', async () => {
        expect.assertions(2);
        let users: User[] = [];
        for(let i = 0; i < 10; i++) {
            user1.id = String(i+1);
            users.push(user1);
        }

        mockCtx.prisma.user.findMany.mockResolvedValue(users);
        const expected = users.map(user => new UserViewDTO(user))
        const recieved = await repository.getByUsernameCursorPaginated('userJuan', {})
        expect(recieved).toHaveLength(10)
        expect(recieved[0].id).toEqual(expected[0].id)
    });

    it('should get all users by username, paginated and ordered by id ASC', async () => {
        expect.assertions(2);
        let users: User[] = [];
        for(let i = 1; i < 6; i++) {
            user1.id = String(i+1);
            users.push({...user1});
        }
        mockCtx.prisma.user.findMany.mockResolvedValue(users);
        const recieved = await repository.getByUsernameCursorPaginated('userJuan', {limit: 5, after: '1'})
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual('2')
    })

    it('should get all users by username, paginated and ordered by id DESC', async () => {
        expect.assertions(2);
        let users: User[] = [];
        for(let i = 6; i > 1; i--) {
            user1.id = String(i-1);
            users.push({...user1});
        }
        mockCtx.prisma.user.findMany.mockResolvedValue(users);
        const recieved = await repository.getByUsernameCursorPaginated('userJuan', {limit: 6, before: '6'})
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual('5')
    })
})


describe('getByIdPublicOrFollowed', ()=> {
    it('should get the user as it is being followed or has public profile', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findUnique.mockResolvedValue({... user1});
        const expected = new UserViewDTO(user1)
        const recieved = await repository.getByIdPublicOrFollowed('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });

    it('should not get the user as it has private profile and is not followed', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findUnique.mockResolvedValue({... user2});
        const expected = null
        const recieved = await repository.getByIdPublicOrFollowed('3ac84483-20f1-47f3-8be1-43ab2db46ad0', '83538af2-24e4-4435-bc36-a049183828d8')

        expect(recieved).toEqual(expected)
    });
})