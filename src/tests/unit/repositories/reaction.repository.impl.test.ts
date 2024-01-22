import {  Reaction } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { ReactionRepository, ReactionRepositoryImpl } from '@domains/reaction/repository';
import { ReactionCreationDTO, ReactionDTO } from '@domains/reaction/dto';

let repository: ReactionRepository;

let mockCtx: MockContext
let ctx: Context
let reaction1: Reaction;
let reaction2: Reaction;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new ReactionRepositoryImpl(mockCtx.prisma)
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
})


describe('getReactionByPostIdUserIdAndType', ()=> {
    it('should get a reaction array given a type and a post id', async () => {
        expect.assertions(1);

        mockCtx.prisma.reaction.findFirst.mockResolvedValue(reaction1);
        const expected = new ReactionDTO(reaction1)
        const recieved = await repository.getReactionByPostIdUserIdAndType('921cce9e-cfe6-4636-a0ca-9df133d38527', '83538af2-24e4-4435-bc36-a049183828d8', 'LIKE')
        expect(recieved).toEqual(expected)
    });

    it('should get a null as the post id is not found', async () => {
        expect.assertions(1);

        mockCtx.prisma.reaction.findFirst.mockResolvedValue(null);
        const expected = null
        const recieved = await repository.getReactionByPostIdUserIdAndType('23e0ee80-5b2b-4dd7-b31d-80a91156ae95','oooo', 'LIKE')
        expect(recieved).toEqual(expected)
    });
})


describe('getReactionByPostIdAndUserId', ()=> {
    it('should get a reaction array given a user id and a post id', async () => {
        expect.assertions(1);

        mockCtx.prisma.reaction.findMany.mockResolvedValue([reaction1]);
        const expected = [new ReactionDTO(reaction1)]
        const recieved = await repository.getReactionByPostIdAndUserId('921cce9e-cfe6-4636-a0ca-9df133d38527', '83538af2-24e4-4435-bc36-a049183828d8')
        expect(recieved).toEqual(expected)
    });

    it('should get an empty array as the post id or the user id are not found', async () => {
        expect.assertions(1);

        mockCtx.prisma.reaction.findMany.mockResolvedValue([]);
        const expected: Reaction[] = []
        const recieved = await repository.getReactionByPostIdAndUserId('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });
})


describe('deleteReaction', ()=> {
    it('should delete a reaction given a reaction id', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.reaction.delete.mockResolvedValue(reaction1);
        const expected = new ReactionDTO(reaction1);
        const recieved = await repository.deleteReaction('3cdb42b2-c12f-4bdd-bf45-1143033898fb')
        expect(expected.id).toEqual(recieved.id)
    });

})

describe('createReaction', ()=> {
    it('should create a reaction', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.reaction.create.mockResolvedValue(reaction1);
        const expected = new ReactionDTO(reaction1);
        const recieved = await repository.createReaction(new ReactionCreationDTO('921cce9e-cfe6-4636-a0ca-9df133d38527', '83538af2-24e4-4435-bc36-a049183828d8','LIKE'))
        expect(expected.id).toEqual(recieved.id)
    });

})

describe('getReactionsByUserId', ()=> {
    it('should get all reactions by user id', async () => {
        expect.assertions(2);
        
        mockCtx.prisma.reaction.findMany.mockResolvedValue([reaction1, reaction2]);
        const expected = [new ReactionDTO(reaction1), new ReactionDTO(reaction2)];
        const recieved = await repository.getReactionsByUserId('83538af2-24e4-4435-bc36-a049183828d8')
        expect(expected).toHaveLength(2)
        expect(expected).toEqual(recieved)
    });

})