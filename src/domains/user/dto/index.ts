import { IsBoolean, IsString } from "class-validator"


export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.hasPrivateProfile = user.hasPrivateProfile
    this.profilePicture = user.profilePicture;
  }

  id: string
  name: string | null
  createdAt: Date
  hasPrivateProfile: boolean
  profilePicture: string | null
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.username = user.username
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}

export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.hasPrivateProfile = user.hasPrivateProfile
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  hasPrivateProfile: boolean
  profilePicture: string | null
}

export class ChangePrivacyInputDTO {
  @IsBoolean()
    hasPrivateProfile!: boolean
}

export class ProfilePictureNameDTO {
  @IsString()
    name!: string
}
