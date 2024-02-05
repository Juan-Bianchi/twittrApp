import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ExtendedUserDTO } from '@domains/user/dto';
import { ReactionDTO } from '@domains/reaction/dto';

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content!: string;

  @IsOptional()
  @MaxLength(4)
  images?: string[];
}

export class PostDTO {
  constructor(post: PostDTO) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.content = post.content;
    this.images = post.images;
    this.createdAt = post.createdAt;
    this.isAComment = post.isAComment;
  }

  id: string;
  authorId: string;
  content: string;
  images: string[];
  createdAt: Date;
  isAComment: boolean;
}

export class ExtendedPostDTO extends PostDTO {
  constructor(post: ExtendedPostDTO) {
    super(post);
    this.author = post.author;
    this.comments = post.comments;
    this.reactions = post.reactions;
    this.qtyComments = post.qtyComments;
  }

  author!: ExtendedUserDTO;
  qtyComments!: number;
  qtyLikes!: number;
  qtyRetweets!: number;
  comments!: PostDTO[];
  reactions!: ReactionDTO[];
}
