import { Follow, User } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { FollowRepository, FollowRepositoryImpl } from '@domains/follow/repository';
import { FollowDTO } from '@domains/follow/dto';
import { ConflictException, NotFoundException } from '@utils';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { UserViewDTO } from '@domains/user/dto';

let mockRepository: FollowRepository;
let userMockRepository: UserRepository;
let service: FollowService;

let mockCtx: MockContext
let ctx: Context
let follow1: Follow;
let follow2: Follow;
let user: User;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    mockRepository = new FollowRepositoryImpl(mockCtx.prisma)
    userMockRepository = new UserRepositoryImpl(mockCtx.prisma)
    service = new FollowServiceImpl(mockRepository, userMockRepository)
    follow1 = { id: '23e0ee80-5b2b-4dd7-b31d-80a91156ae95',
        followerId: '83538af2-24e4-4435-bc36-a049183828d8',
        followedId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: new Date('2023-11-18 19:59:59.701'),
    }
    follow2 = { id: '24833729-82fa-44ad-bb90-1ad0e11c73b1',
        followerId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        followedId: '83538af2-24e4-4435-bc36-a049183828d8',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
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
})


describe('followUser', ()=> {
    it('should make the user follow an unfollowed user', async () => {
        expect.assertions(2);
        
        jest.spyOn(mockRepository, 'followUser').mockResolvedValue(new FollowDTO(follow1))
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        jest.spyOn(mockRepository, 'getFollowById').mockResolvedValue(new FollowDTO(follow1))
        const expected = new FollowDTO(follow1);
        const recieved = await service.followUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0',)
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

    it('should throw an exception if followed id is not valid', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null)
        await expect(service.followUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if there user is already following', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        jest.spyOn(mockRepository, 'getFollowById').mockResolvedValue(new FollowDTO(follow2))
        await expect(service.followUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(ConflictException)
    });
})

describe('unfollowUser', ()=> {
    it('should make the user unfollow an followed user', async () => {
        expect.assertions(2);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        jest.spyOn(mockRepository, 'getFollowById').mockResolvedValue(follow2)
        jest.spyOn(mockRepository, 'unfollowUser').mockResolvedValue(new FollowDTO(follow2))
        const expected = new FollowDTO(follow2);
        const recieved = await service.unfollowUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0',)
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

    it('should throw an exception if followed id is not valid', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null)
        await expect(service.unfollowUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if there not a follow relationship', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue(null)
        await expect(service.unfollowUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if there user is already not following', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        jest.spyOn(mockRepository, 'getFollowById').mockResolvedValue(new FollowDTO(follow1))
        await expect(service.unfollowUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(ConflictException)
    });
})


describe('isFollowing', ()=> {
    it('should return a true if the user is following another user', async () => {
        expect.assertions(1);

        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        const expected = true
        const recieved = await service.isFollowing('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });

    it('should return a false if the user is not following another user', async () => {
        expect.assertions(1);

        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user, follows: [], followers: []}))
        jest.spyOn(mockRepository, 'getFollowId').mockResolvedValue(null)
        const expected = false
        const recieved = await service.isFollowing('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if followed id is not valid', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null)
        await expect(service.isFollowing('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });
})
