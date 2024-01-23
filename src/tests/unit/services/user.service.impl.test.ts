import { User } from '@prisma/client';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { UserDTO, UserViewDTO } from '@domains/user/dto';
import { Context, MockContext, createMockContext } from '../../../context';
import { UserService, UserServiceImpl } from '@domains/user/service';
import { ConflictException, NotFoundException } from '@utils';
import { S3Service } from '@utils/S3/s3.service';
import { S3ServiceImpl } from '@utils/S3/s3.service.impl';

let service: UserService;
let mockRepository: UserRepository;
let mockS3Service: S3Service;

let mockCtx: MockContext
let ctx: Context
let user1: User;
let user2: User;


beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    mockRepository = new UserRepositoryImpl(mockCtx.prisma)
    mockS3Service = new S3ServiceImpl()
    service = new UserServiceImpl(mockRepository, mockS3Service)
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
})


describe('getByUsernameCursorPaginated', ()=> {
    it('should get all users by username, no limit and order given', async () => {
        expect.assertions(2);
        
        jest.spyOn(mockRepository, 'getByUsernameOffsetPaginated').mockResolvedValue([new UserViewDTO({...user1, follows: [], followers: []}), new UserViewDTO({...user2, follows: [], followers: []})])
        const expected = [new UserViewDTO({...user1, follows: [], followers: []}), new UserViewDTO({...user2, follows: [], followers: []})]
        const recieved = await service.getByUsernameOffsetPaginated('userJuan', {})
        expect(recieved).toHaveLength(2)
        expect(recieved[0].id).toEqual(expected[0].id)
    });
})


describe('getPublicOrFollowedUser', ()=> {
    it('should get the user as it is being followed or has public profile', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getByIdPublicOrFollowed').mockResolvedValue(new UserViewDTO({...user1, follows: [], followers: []}))
        const expected = new UserViewDTO({...user1, follows: [], followers: []})
        const recieved = await service.getPublicOrFollowedUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getByIdPublicOrFollowed').mockResolvedValue(null);
        await expect(service.getPublicOrFollowedUser('83538af2-24e4-4435-bc36-a049183828d8', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });
})

describe('getUser', ()=> {
    it('should get the user by the provided id', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(new UserViewDTO({...user1, follows: [], followers: []}))
        const expected = new UserViewDTO({...user1, follows: [], followers: []})
        const recieved = await service.getUser('3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toEqual(expected)
    });

    it('should throw an exception if user id is not correct', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'getById').mockResolvedValue(null);
        await expect(service.getUser('3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(NotFoundException)
    });
})


describe('deleteUser', ()=> {
    it('should delete the user to whom belongs the provided id', async () => {
        
        jest.spyOn(mockRepository, 'delete').mockResolvedValue(new UserDTO(user1))
        await service.deleteUser('83538af2-24e4-4435-bc36-a049183828d8') 

        expect(mockRepository.delete).toHaveBeenCalled
    });
})

describe('getUserRecommendations', ()=> {
    it('should get all users by username, no limit and order given', async () => {
        expect.assertions(2);
        
        jest.spyOn(mockRepository, 'getRecommendedUsersPaginated').mockResolvedValue([new UserDTO(user1), new UserDTO(user2)])
        const expected = [new UserDTO(user1), new UserDTO(user2)]
        const recieved = await service.getUserRecommendations('userJuan', {})
        expect(recieved).toHaveLength(2)
        expect(recieved[0].id).toEqual(expected[0].id)
    });
})

describe('getPreSignedURL', ()=> {
    it('should get the pre signed url to upload the profile picture in the cloud', async () => {
        expect.assertions(1);
        
        const expected = 'name'
        jest.spyOn(mockS3Service, 'getSignedURL').mockResolvedValue(expected)
        const recieved = await service.getPreSignedGetURL('name','3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toContain(expected)
    });

    it('should throw an exception if the image name is not provided', async () => {
        expect.assertions(1);
        
        await expect(service.getPreSignedGetURL('','3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(ConflictException)
    });
})


describe('changeUserPrivacy', ()=> {
    it('should update user privacy', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'changeUserPrivacy').mockResolvedValue(new UserDTO(user1))
        const expected = (new UserDTO(user1)).hasPrivateProfile
        const recieved = await service.changeUserPrivacy('3ac84483-20f1-47f3-8be1-43ab2db46ad0',true)

        expect(recieved.hasPrivateProfile).toEqual(expected)
    });
})

describe('updateProfilePicture', ()=> {
    it('should update the profile picture', async () => {
        expect.assertions(1);
        
        jest.spyOn(mockRepository, 'updateProfilePicture').mockResolvedValue(new UserDTO(user1))
        const expected = 'name'
        jest.spyOn(mockS3Service, 'getSignedURL').mockResolvedValue(expected)
        const recieved = await service.updateUserProfilePicture('name','3ac84483-20f1-47f3-8be1-43ab2db46ad0')

        expect(recieved).toBeDefined();
    });

    it('should throw an exception if the image name is not provided', async () => {
        expect.assertions(1);
        
        await expect(service.updateUserProfilePicture('','3ac84483-20f1-47f3-8be1-43ab2db46ad0')).rejects.toThrow(ConflictException)
    });
})