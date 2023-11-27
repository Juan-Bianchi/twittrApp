import { Follow } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { FollowRepository, FollowRepositoryImpl } from '@domains/follow/repository';
import { FollowDTO, FollowInputDTO } from '@domains/follow/dto';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NotFoundException } from '@utils';

let repository: FollowRepository;

let mockCtx: MockContext
let ctx: Context
let follow1: Follow;
let follow2: Follow;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new FollowRepositoryImpl(mockCtx.prisma)
    follow1 = { id: '23e0ee80-5b2b-4dd7-b31d-80a91156ae95',
        followerId: '83538af2-24e4-4435-bc36-a049183828d8',
        followedId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: null,
    }
    follow2 = { id: '24833729-82fa-44ad-bb90-1ad0e11c73b1',
        followerId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        followedId: '83538af2-24e4-4435-bc36-a049183828d8',
        createdAt: new Date('2023-11-18 19:28:40.065'),
        updatedAt: new Date('2023-11-18 19:59:59.701'),
        deletedAt: new Date('2023-11-22 19:59:59.701'),
    }
})


describe('getFollowById', ()=> {
    it('should get a follow relationship by id', async () => {
        expect.assertions(1);

        mockCtx.prisma.follow.findFirst.mockResolvedValue(follow1);
        const expected = new FollowDTO(follow1)
        const recieved = await repository.getFollowById('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        expect(recieved).toEqual(expected)
    });

    it('should get a null as the id is not found', async () => {
        expect.assertions(1);

        mockCtx.prisma.follow.findFirst.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getFollowById('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        expect(recieved).toEqual(expected)
    });
})


describe('getFollowId', ()=> {
    it('should get th id of follow relationship by follower id and followed id', async () => {
        expect.assertions(1);

        mockCtx.prisma.follow.findFirst.mockResolvedValue(follow1);
        const expected = new FollowDTO(follow1)
        const recieved = await repository.getFollowId('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected.id)
    });

    it('should get a null as the id is not found', async () => {
        expect.assertions(1);

        mockCtx.prisma.follow.findFirst.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getFollowId('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });
})


describe('followUser', ()=> {
    it('should perform a logic creation of a "deleted" follow', async () => {
        expect.assertions(2);
        
        jest.spyOn(repository, 'getFollowId').mockResolvedValue('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        mockCtx.prisma.follow.update.mockResolvedValue(follow1);
        const expected = new FollowDTO(follow1);
        const recieved = await repository.followUser(new FollowInputDTO('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0'))
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

    it('should create a new follow', async () => {
        expect.assertions(2);
        
        jest.spyOn(repository, 'getFollowId').mockResolvedValue(null)
        mockCtx.prisma.follow.create.mockResolvedValue(follow1);
        const expected = new FollowDTO(follow1);
        const recieved = await repository.followUser(new FollowInputDTO('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0'))
        expect(expected.id).toEqual(recieved.id)
        expect(expected.createdAt).toEqual(recieved.createdAt)
    });

    it('should handle if a known prisma error is thrown', async () => {
        expect.assertions(1);
        
        jest.spyOn(repository, 'getFollowId').mockImplementation( async ()=> {
            throw new PrismaClientKnownRequestError('Database error',{
                code: 'P2022',
                meta: { target: ['email'] },
                clientVersion: '2.19.0'
            });
        })
        mockCtx.prisma.follow.update.mockResolvedValue(follow1);
        await expect(repository.followUser(new FollowInputDTO('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0'))).rejects.toThrow(NotFoundException)
    });

    it('should handle if an unknown error is thrown', async () => {
        expect.assertions(1);
        
        jest.spyOn(repository, 'getFollowId').mockImplementation( async ()=> {
            throw new Error('unknown error')
        })
        mockCtx.prisma.follow.update.mockResolvedValue(follow1);
        await expect(repository.followUser(new FollowInputDTO('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0'))).rejects.toThrow(Error)
    });
})

describe('unfollowUser', ()=> {
    it('should unfollow a user given the follow id', async () => {
        expect.assertions(2);

        mockCtx.prisma.follow.update.mockResolvedValue(follow2);
        const expected = new FollowDTO(follow2)
        const recieved = await repository.unfollowUser('23e0ee80-5b2b-4dd7-b31d-80a91156ae95')
        expect(recieved).toEqual(expected)
        expect(recieved.deletedAt).toEqual(expected.deletedAt)
    });
})

describe('getFollowed', ()=> {
    it('should get all follow relationships of a followed user', async () => {
        expect.assertions(1);

        mockCtx.prisma.follow.findMany.mockResolvedValue([follow2]);
        const expected = [new FollowDTO(follow2)]
        const recieved = await repository.getFollowed('3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });
})
