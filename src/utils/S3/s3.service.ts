import { S3CommandType } from "./s3.service.impl";

export interface S3Service {
  getSignedURL(commandType: S3CommandType, userId: string, imgName: string ): Promise<string>;
}