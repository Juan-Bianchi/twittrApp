import { Message } from '@prisma/client';
import { Context, MockContext, createMockContext } from '../../../context';
import { MessageRepository, MessageRepositoryImpl } from '@domains/message/repository';
import { MessageDTO } from '@domains/message/dto';

let repository: MessageRepository;

let mockCtx: MockContext
let ctx: Context
let message1: Message;
let message2: Message;

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    repository = new MessageRepositoryImpl(mockCtx.prisma)
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
    it('should save a new message', async () => {
        expect.assertions(1);

        mockCtx.prisma.message.create.mockResolvedValue(message1);
        const expected = new MessageDTO(message1)
        const recieved = await repository.saveMessage('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'test')
        expect(recieved).toEqual(expected)
    });
})


describe('getMessages', ()=> {
    it('should get all messages of a chat between to users', async () => {
        expect.assertions(1);
        
        mockCtx.prisma.message.findMany.mockResolvedValue([message1, message2]);
        const expected = [new MessageDTO(message1), new MessageDTO(message2)];
        const recieved = await repository.getMessages('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
        expect(expected).toEqual(recieved)
    });
})
