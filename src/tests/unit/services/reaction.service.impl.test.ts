import {  Post, Reaction, User } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { ReactionRepository, ReactionRepositoryImpl } from '@domains/reaction/repository';
import { ReactionCreationDTO, ReactionDTO } from '@domains/reaction/dto';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { PostRepository, PostRepositoryImpl } from '@domains/post/repository';
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';

let mockRepository: ReactionRepository;
let userMockRepository: UserRepository;
let postMockRepository: PostRepository;
let service: ReactionService;


let mockCtx: MockContext
let ctx: Context
let reaction1: Reaction;
let reaction2: Reaction;
let user: User;
let post: Post;
let reactionCreation: ReactionCreationDTO;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    mockRepository = new ReactionRepositoryImpl(mockCtx.prisma)
    userMockRepository = new UserRepositoryImpl(mockCtx.prisma)
    postMockRepository = new PostRepositoryImpl(mockCtx.prisma)
    service = new ReactionServiceImpl(mockRepository, userMockRepository, postMockRepository)
    reaction1 = { id: '3cdb42b2-c12f-4bdd-bf45-1143033898fb',
        postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        userId: '83538af2-24e4-4435-bc36-a049183828d8',
        type: 'LIKE',
    }
    reaction2 = { id: '3cdb42b2-c12f-4bdd-bf45-114303389888',
        postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        userId: '83538af2-24e4-4435-bc36-a04918382877',
        type: 'RETWEET',
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
    reactionCreation = {
        postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        userId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        type: 'LIKE'
    }
})



describe('deleteReaction', ()=> {
    it('should delete a reaction given a reaction id', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(post);
        jest.spyOn(mockRepository, 'getReactionByPostIdUserIdAndType').mockResolvedValue(reaction1)
        jest.spyOn(mockRepository, 'deleteReaction').mockResolvedValue(reaction1)
        const expected = new ReactionDTO(reaction1);
        const recieved = await service.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'LIKE')
        expect(expected.id).toEqual(recieved.id)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'LIKE')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if post id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'LIKE')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if user is not the owner of the post', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(post);
        await expect(service.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb', 'wrong', 'LIKE')).rejects.toThrow(ForbiddenException)
    });

    it('should throw an exception if reaction does not exist', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(post);
        jest.spyOn(mockRepository, 'getReactionByPostIdUserIdAndType').mockResolvedValue(null)
        await expect(service.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'LIKE')).rejects.toThrow(NotFoundException)
    });

})

describe('createReaction', ()=> {
    it('should create a reaction', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(post);
        jest.spyOn(mockRepository, 'getReactionByPostIdAndUserId').mockResolvedValue(null)
        jest.spyOn(mockRepository, 'createReaction').mockResolvedValue(reaction1)
        const expected = new ReactionDTO(reaction1);
        const recieved = await service.createReaction(new ReactionCreationDTO(reactionCreation.postId, reactionCreation.userId, reactionCreation.type))
        expect(expected.id).toEqual(recieved.id)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.createReaction(reactionCreation)).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if post id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.createReaction(reactionCreation)).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if post id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(postMockRepository, 'getById').mockResolvedValue(post);
        jest.spyOn(mockRepository, 'getReactionByPostIdAndUserId').mockResolvedValue(reaction1)
        await expect(service.createReaction(reactionCreation)).rejects.toThrow(ConflictException)
    });

})


describe('getRetweetsByUserId', ()=> {
    it('should get all retweets by user id', async () => {
        expect.assertions(2);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(mockRepository, 'getReactionsByUserId').mockResolvedValue([reaction1, reaction2])
        const expected = [new ReactionDTO(reaction2)];
        const recieved = await service.getRetweetsByUserId('83538af2-24e4-4435-bc36-a049183828d8')
        expect(expected).toHaveLength(1)
        expect(expected).toEqual(recieved)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getRetweetsByUserId('83538af2-24e4-4435-bc36-a049183828d8')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if the user has not made any reaction of the given type', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(mockRepository, 'getReactionsByUserId').mockResolvedValue([])
        await expect(service.getRetweetsByUserId('83538af2-24e4-4435-bc36-a049183828d8')).rejects.toThrow(NotFoundException)
    });

})


describe('getLikesByUserId', ()=> {
    it('should get all retweets by user id', async () => {
        expect.assertions(2);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(mockRepository, 'getReactionsByUserId').mockResolvedValue([reaction1, reaction2])
        const expected = [new ReactionDTO(reaction1)];
        const recieved = await service.getLikesByUserId('83538af2-24e4-4435-bc36-a049183828d8')
        expect(expected).toHaveLength(1)
        expect(expected).toEqual(recieved)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getLikesByUserId('83538af2-24e4-4435-bc36-a049183828d8')).rejects.toThrow(NotFoundException)
    });

    it('should throw an exception if the user has not made any reaction of the given type', async () => {
        expect.assertions(1);
        
        jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
        jest.spyOn(mockRepository, 'getReactionsByUserId').mockResolvedValue([])
        await expect(service.getLikesByUserId('83538af2-24e4-4435-bc36-a049183828d8')).rejects.toThrow(NotFoundException)
    });

})