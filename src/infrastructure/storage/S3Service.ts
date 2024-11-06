import type { Buffer } from 'node:buffer';
import process from 'node:process';
import AWS from 'npm:aws-sdk';

export class S3Service {
  private s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async upload(fileContent: Buffer, fileName: string): Promise<string> {
    const params = {
      Bucket: 'bucket-name',
      Key: fileName,
      Body: fileContent,
      ContentType: 'image/jpeg',
    };
    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }
}
