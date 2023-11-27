import { Follow, User } from '@prisma/client';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '@domains/user/dto';
import { Context, MockContext, createMockContext } from '../../../context';
import { SignupInputDTO } from '@domains/auth/dto';

let repository: UserRepository;

let mockCtx: MockContext
let ctx: Context
let user1: User;
let user2: User;
let user3: any;


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
        hasPrivateProfile: true,
        profilePicture: 'url'
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
    user3 = { id: '83538af2-24e4-4435-bc36-a049183828d8',
        name: null,
        email: 'challenge_prueba_juan1@outlook.com',
        username: 'userJuan2',
        password: '$2b$10$6spdr8KoxcOe7261tn9sweSMwojuHfdzqNiCMIsiosYKeOwBuxIPy',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
        hasPrivateProfile: true,
        profilePicture: null,
        followers: <Follow[]>([{ id: '23e0ee80-5b2b-4dd7-b31d-80a91156ae95',
            followerId: '83538af2-24e4-4435-bc36-a049183828d8',
            followedId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
            createdAt: new Date('2023-11-18 19:48:50.212'),
            updatedAt: new Date('2023-11-18 19:48:50.212'),
            deletedAt: null
        }])
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
        
        mockCtx.prisma.user.findUnique.mockResolvedValue(user3);
        const expected = new UserViewDTO(user3 as UserViewDTO)
        const recieved = await repository.getByIdPublicOrFollowed('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });

    it('should not get the user as it has private profile and is not followed', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findUnique.mockResolvedValue(user3);
        const expected = null
        const recieved = await repository.getByIdPublicOrFollowed('3ac84483-20f1-47f3-8be1-43ab2db46ad0', '83538af2-24e4-4435-bc36-a049183828d8')

        expect(recieved).toEqual(expected)
    });
})

describe('getById', ()=> {
    it('should get the user by the provided id', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findUnique.mockResolvedValue({... user1});
        const expected = new UserViewDTO(user1)
        const recieved = await repository.getById('83538af2-24e4-4435-bc36-a049183828d8')

        expect(recieved).toEqual(expected)
    });

    it('should return null as the id provided is not valid', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findUnique.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getById('3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });
})


describe('delete', ()=> {
    it('should delete the user to whom belongs the provided id', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.delete.mockResolvedValue({... user1});
        const expected = new UserDTO(user1)
        const provided = await repository.delete('83538af2-24e4-4435-bc36-a049183828d8') 

        expect(provided).toEqual(expected)
    });
})

describe('getRecommendedUsersPaginated', ()=> {
    it('should get all users by username, no limit and order given', async () => {
        expect.assertions(2);
        let users: User[] = [];
        for(let i = 0; i < 10; i++) {
            user1.id = String(i+1);
            users.push(user1);
        }

        mockCtx.prisma.user.findMany.mockResolvedValue(users);
        const expected = users.map(user => new UserViewDTO(user))
        const recieved = await repository.getRecommendedUsersPaginated('userJuan', {})
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
        const recieved = await repository.getRecommendedUsersPaginated('userJuan', {limit: 5, skip: 1})
        expect(recieved).toHaveLength(5)
        expect(recieved[0].id).toEqual('2')
    })
})

describe('getByEmailOrUsername', ()=> {
    it('should get the user by their email or username', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findFirst.mockResolvedValue(user2);
        const expected = new ExtendedUserDTO(user2)
        const recieved = await repository.getByEmailOrUsername('challenge_prueba_juan1@outlook.com','userJuan2')

        expect(recieved).toEqual(expected)
    });

    it('should not get the user as neither username nor email have been found', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.user.findFirst.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getByEmailOrUsername('555@555.com', '555')

        expect(recieved).toEqual(expected)
    });
})


describe('changeUserPrivacy', ()=> {
    it('should update user privacy', async () => {
        expect.assertions(1);
        mockCtx.prisma.user.update.mockResolvedValue(user1);
        const expected = new UserDTO(user1)
        const recieved = await repository.changeUserPrivacy('3ac84483-20f1-47f3-8be1-43ab2db46ad0',true)

        expect(recieved.hasPrivateProfile).toEqual(true)
    });
})

describe('updateProfilePicture', ()=> {
    it('should update user privacy', async () => {
        expect.assertions(1);
        mockCtx.prisma.user.update.mockResolvedValue(user1);
        const expected = new UserDTO(user1)
        const recieved = await repository.updateProfilePicture('3ac84483-20f1-47f3-8be1-43ab2db46ad0','url')

        expect(recieved.profilePicture).toEqual(expected.profilePicture)
    });
})