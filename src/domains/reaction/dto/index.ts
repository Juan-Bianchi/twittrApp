export class ReactionDTO {
    id: string | null | undefined;
    postId: string;
    userId: string;
    type: ReactionType

    constructor(reactionDTO: ReactionDTO) {
        this.id = reactionDTO.id;
        this.postId = reactionDTO.postId;
        this.userId = reactionDTO.userId;
        this.type = reactionDTO.type;
    }
}

export class ReactionInputDTO {
    type: ReactionType;

    constructor(type: ReactionType) {
        this.type = type;
    }
}

export class ReactionCreationDTO {
    postId: string;
    userId: string;
    type: ReactionType;

    constructor(postId: string, userId:string, type: ReactionType) {
        this.type = type;
        this.postId = postId;
        this.userId = userId;
    }
}

const ReactionType: {
    LIKE: 'LIKE',
    RETWEET: 'RETWEET'
} = {
    LIKE: 'LIKE',
    RETWEET: 'RETWEET'
}

export type ReactionType = typeof ReactionType[keyof typeof ReactionType]