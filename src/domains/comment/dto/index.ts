import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator"

export class CreateCommentInputDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(240)
      content!: string
  
    @IsOptional()
    @MaxLength(4)
      images?: string[]

    @IsString()
      postCommentedId!: string
}

