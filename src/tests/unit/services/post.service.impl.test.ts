import { Post, Reaction, User } from '@prisma/client';
import { MockContext, createMockContext } from '../../../context';
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { PostRepository, PostRepositoryImpl } from '@domains/post/repository';
import { UserRepository, UserRepositoryImpl } from '@domains/user/repository';
import { ForbiddenException, NotFoundException } from '@utils';
import { UserViewDTO } from '@domains/user/dto';
import { PostService, PostServiceImpl } from '@domains/post/service';

let service: PostService;
let mockRepository: PostRepository;
let userMockRepository: UserRepository;

let mockCtx: MockContext;
let post1: Post;
let post3: any;
let user: User;

beforeEach(() => {
  mockCtx = createMockContext();
  mockRepository = new PostRepositoryImpl(mockCtx.prisma);
  userMockRepository = new UserRepositoryImpl(mockCtx.prisma);
  service = new PostServiceImpl(mockRepository, userMockRepository);
  post1 = {
    id: '921cce9e-cfe6-4636-a0ca-9df133d38527',
    authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
    content: 'this is another test twitt.',
    images: [],
    createdAt: new Date('2023-11-18 20:01:44.733'),
    updatedAt: new Date('2023-11-18 19:59:59.701'),
    deletedAt: null,
    isAComment: false,
    postCommentedId: null,
  };
  post3 = {
    id: 'd695dec1-87cd-421e-9698-fde62d6ece2f',
    authorId: '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
    content: 'this is another test twitt.',
    images: [],
    createdAt: new Date('2023-11-18 20:01:44.733'),
    updatedAt: new Date('2023-11-18 19:59:59.701'),
    deletedAt: null,
    isAComment: false,
    postCommentedId: null,
    author: {
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
    },
    comments: [] as Comment[],
    reactions: [
      {
        id: '3cdb42b2-c12f-4bdd-bf45-1143033898fb',
        postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        userId: '83538af2-24e4-4435-bc36-a049183828d8',
        type: 'LIKE',
      },
      {
        id: '3cdb42b2-c12f-4bdd-bf45-114303389888',
        postId: '921cce9e-cfe6-4636-a0ca-9df133d38527',
        userId: '83538af2-24e4-4435-bc36-a04918382877',
        type: 'RETWEET',
      },
    ] as Reaction[],
    qtyComments: 0,
    qtyLikes: 1,
    qtyRetweets: 1
  }
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
});

describe('createPost', () => {
  it('should create a new post', async () => {
    expect.assertions(2);

    jest.spyOn(mockRepository, 'create').mockResolvedValue(new PostDTO(post1));
    const expected = new PostDTO(post1);
    const recieved = await service.createPost('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {
      content: 'this is another test twitt.',
      images: [],
    });
    expect(expected.id).toEqual(recieved.id);
    expect(expected.createdAt).toEqual(recieved.createdAt);
  });
});

describe('getPost', () => {
  it('should get the post by the provided id', async () => {
    expect.assertions(1);

    jest
      .spyOn(userMockRepository, 'getById')
      .mockResolvedValue(new UserViewDTO({ ...user, follows: [], followers: [] }));
    jest.spyOn(mockRepository, 'getById').mockResolvedValue(new ExtendedPostDTO(post3));
    const expected = new ExtendedPostDTO(post3);
    const recieved = await service.getPost(
      '3ac84483-20f1-47f3-8be1-43ab2db46ad0',
      'd695dec1-87cd-421e-9698-fde62d6ece2f'
    );

    expect(recieved).toEqual(expected);
  });

  it('should throw an exception if user id is not correct', async () => {
    expect.assertions(1);

    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
    await expect(
      service.getPost('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception if post id is not correct', async () => {
    expect.assertions(1);

    jest
      .spyOn(userMockRepository, 'getById')
      .mockResolvedValue(new UserViewDTO({ ...user, follows: [], followers: [] }));
    jest.spyOn(mockRepository, 'getById').mockResolvedValue(null);
    await expect(
      service.getPost('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'f1989782-88f9-4055-99fc-135611c1992a')
    ).rejects.toThrow(NotFoundException);
  });
});

describe('delete', () => {
  it('should delete the post with the provided id', async () => {
    jest.spyOn(mockRepository, 'getById').mockResolvedValue(new ExtendedPostDTO(post3));
    jest.spyOn(mockRepository, 'delete').mockResolvedValue(new PostDTO(post3));
    await service.deletePost('3ac84483-20f1-47f3-8be1-43ab2db46ad0', 'd695dec1-87cd-421e-9698-fde62d6ece2f');
    expect(mockRepository.delete).toHaveBeenCalled();
  });

  it('should throw an exception if post id is not correct', async () => {
    expect.assertions(1);

    jest.spyOn(mockRepository, 'getById').mockResolvedValue(null);
    await expect(
      service.deletePost('3ac84483-20f1-47f3-8be1-43ab2db46ad0', '921cce9e-cfe6-4636-a0ca-9df133d38527')
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception if user is not the author of the post', async () => {
    expect.assertions(1);

    jest.spyOn(mockRepository, 'getById').mockResolvedValue(new ExtendedPostDTO(post3));
    jest.spyOn(mockRepository, 'delete').mockResolvedValue(new PostDTO(post3));
    await expect(service.deletePost('wrong', 'd695dec1-87cd-421e-9698-fde62d6ece2f')).rejects.toThrow(
      ForbiddenException
    );
  });
});

describe('getPostsByAuthor', () => {
  it('should get all posts, by author id', async () => {
    expect.assertions(2);

    jest
      .spyOn(userMockRepository, 'getById')
      .mockResolvedValue(new UserViewDTO({ ...user, follows: [], followers: [] }));
    jest.spyOn(mockRepository, 'getByAuthorId').mockResolvedValue([new ExtendedPostDTO(post3)]);
    const expected = [new PostDTO(post3)];
    const recieved = await service.getPostsByAuthor(
      '3ebbfea7-3ae5-411c-aae8-049ff04db067',
      '3ac84483-20f1-47f3-8be1-43ab2db46ad0'
    );
    expect(recieved).toHaveLength(1);
    expect(recieved[0].id).toEqual(expected[0].id);
  });

  it('should throw an exception if user id is not correct', async () => {
    expect.assertions(1);

    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
    await expect(
      service.getPostsByAuthor('3ebbfea7-3ae5-411c-aae8-049ff04db067', '3ac84483-20f1-47f3-8be1-43ab2db46ad0')
    ).rejects.toThrow(NotFoundException);
  });
});

describe('getLatestPosts', () => {
  it('should get all posts of a given user', async () => {
    expect.assertions(2);
    jest
      .spyOn(userMockRepository, 'getById')
      .mockResolvedValue(new UserViewDTO({ ...user, follows: [], followers: [] }));
    jest.spyOn(mockRepository, 'getPublicOrFollowedByDatePaginated').mockResolvedValue([new ExtendedPostDTO(post3)]);

    const expected = [new ExtendedPostDTO(post3)];
    const recieved = await service.getLatestPosts('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {});
    expect(recieved).toHaveLength(1);
    expect(recieved[0].id).toEqual(expected[0].id);
  });

  it('should throw an exception if user id is not correct', async () => {
    expect.assertions(1);

    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);
    await expect(service.getLatestPosts('3ac84483-20f1-47f3-8be1-43ab2db46ad0', {})).rejects.toThrow(NotFoundException);
  });
});
