import { User } from '@prisma/client';
import { MockContext, createMockContext } from '../../../context';
import { ConflictException, NotFoundException, UnauthorizedException } from '@utils';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { ExtendedUserDTO, UserDTO } from '@domains/user/dto';
import { AuthService, AuthServiceImpl } from '@domains/auth/service';
import { SignupInputDTO } from '@domains/auth/dto';

let userMockRepository: UserRepository;
let service: AuthService;

let mockCtx: MockContext;
let user: User;
let signupData: SignupInputDTO;

beforeEach(() => {
  mockCtx = createMockContext();
  userMockRepository = new UserRepositoryImpl(mockCtx.prisma);
  service = new AuthServiceImpl(userMockRepository);

  user = {
    id: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
    name: null,
    email: 'challenge_prueba_juan@outlook.com',
    username: 'userJuan',
    password: '$2b$10$ELibz83CogxQ91eLYH9qHOxUrvEBSClBVYm0wOpy/zRwvCUoSOUo.',
    createdAt: new Date('2023-11-18 19:28:40.065'),
    updatedAt: new Date('2023-11-18 19:59:59.701'),
    deletedAt: null,
    hasPrivateProfile: true,
    profilePicture: 'url',
  };

  signupData = {
    email: 'challenge_prueba_juan@outlook.com',
    username: 'userJuan',
    password: 'Aa12345@',
  };
});

describe('signup', () => {
  it('should register a new user', async () => {
    jest.spyOn(userMockRepository, 'getByEmailOrUsername').mockResolvedValue(null);
    jest.spyOn(userMockRepository, 'create').mockResolvedValue(new UserDTO(user));

    const result = await service.signup(signupData);
    expect(result.token).toBeDefined();
  });

  it('should throw an exception if username or email have been already used', async () => {
    expect.assertions(1);

    jest.spyOn(userMockRepository, 'getByEmailOrUsername').mockResolvedValue(new ExtendedUserDTO(user));
    await expect(service.signup(signupData)).rejects.toThrow(ConflictException);
  });
});

describe('login', () => {
  it('should login a user', async () => {
    jest.spyOn(userMockRepository, 'getByEmailOrUsername').mockResolvedValue(new ExtendedUserDTO(user));

    const result = await service.login(signupData);
    expect(result.token).toBeDefined();
  });

  it('should throw an exception if username and email do not belong to any user', async () => {
    expect.assertions(1);

    jest.spyOn(userMockRepository, 'getByEmailOrUsername').mockResolvedValue(null);
    await expect(service.login(signupData)).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception if password is not correct', async () => {
    expect.assertions(1);

    jest
      .spyOn(userMockRepository, 'getByEmailOrUsername')
      .mockResolvedValue({ ...new ExtendedUserDTO(user), password: 'wrong' });
    await expect(service.login(signupData)).rejects.toThrow(UnauthorizedException);
  });
});
