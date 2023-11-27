import { Message } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { MessageRepository, MessageRepositoryImpl } from '@domains/message/repository';
import { MessageDTO } from '@domains/message/dto';
import { MessageService, MessageServiceImpl } from '@domains/message/service';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';
import { FollowRepository, FollowRepositoryImpl } from '@domains/follow/repository';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';

let mockRepository: MessageRepository;
let followMockRepository: FollowRepository;
let userMockRepository: UserRepository;
let followMockService: FollowService
let service: MessageService;

let mockCtx: MockContext
let ctx: Context
let message1: Message;
let message2: Message;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    mockRepository = new MessageRepositoryImpl(mockCtx.prisma)
    followMockRepository = new FollowRepositoryImpl(mockCtx.prisma)
    userMockRepository = new UserRepositoryImpl(mockCtx.prisma)
    followMockService = new FollowServiceImpl(followMockRepository, userMockRepository)
    service = new MessageServiceImpl(mockRepository, followMockService);

    message1 = { id: '1d3b7816-8c3f-42de-813a-3778871a2235',
        from: '83538af2-24e4-4435-bc36-a049183828d8',
        to: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        body: 'test',
        date: new Date('2023-11-18 19:59:59.701'),
    }
    message2 = { id: '25e7fc8f-0e8c-4cdd-9c46-8636fd772277',
        from: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
        to: '83538af2-24e4-4435-bc36-a049183828d8',
        body: 'test',
        date: new Date('2023-11-18 19:59:59.701'),
    }
})


describe('saveMessage', ()=> {
    it('should save the message', async () => {
        expect.assertions(1);
        
        jest.spyOn(followMockService, 'isFollowing').mockResolvedValue(true)
        jest.spyOn(mockRepository, 'saveMessage').mockResolvedValue(new MessageDTO(message1))
        const expected = new MessageDTO(message1)
        const recieved = await service.saveMessage('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'test')
        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if there is at minimum a missing parameter', async () => {
        expect.assertions(1);
        
        await expect(service.saveMessage('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', '')).rejects.toThrow(ConflictException)
    });

    it('should throw an exception if users are not following each other', async () => {
        expect.assertions(1);
        jest.spyOn(followMockService, 'isFollowing').mockResolvedValue(false)
        await expect(service.saveMessage('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'test')).rejects.toThrow(ForbiddenException)
    });
})


describe('loadChat', ()=> {
    it('should load the chat', async () => {
        expect.assertions(1);
        
        jest.spyOn(followMockService, 'isFollowing').mockResolvedValue(true)
        jest.spyOn(mockRepository, 'getMessages').mockResolvedValue([new MessageDTO(message1), new MessageDTO(message2)])
        const expected = [new MessageDTO(message1), new MessageDTO(message2)]
        const recieved = await service.loadChat('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if there is at minimum a missing parameter', async () => {
        expect.assertions(1);
        
        await expect(service.loadChat('83538af2-24e4-4435-bc36-a049183828d8', '')).rejects.toThrow(ConflictException)
    });

    it('should throw an exception if users are not following each other', async () => {
        expect.assertions(1);
        jest.spyOn(followMockService, 'isFollowing').mockResolvedValue(false)
        await expect(service.loadChat('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });
})