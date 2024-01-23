import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Service } from "./s3.service";

export enum S3CommandType {
  PUT_OBJECT = 'PUT_OBJECT',
  GET_OBJECT = 'GET_OBJECT'
}

export class S3ServiceImpl implements S3Service{
  client: S3Client;
  region: string | undefined;
  bucket: string | undefined;
  

  constructor () {
    this.region = process.env.AWS_REGION;
    this.bucket = process.env.AWS_BUCKET;
    this.client = new S3Client({region: this.region})
  }

  async getSignedURL(commandType: S3CommandType, userId: string, imgName: string ) {
    const command: GetObjectCommand | PutObjectCommand = commandType === S3CommandType.GET_OBJECT?
      new GetObjectCommand({ Bucket: this.bucket, Key: `${userId}/${imgName}` }):
      new PutObjectCommand({ Bucket: this.bucket, Key: `${userId}/${imgName}` }); 

    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}