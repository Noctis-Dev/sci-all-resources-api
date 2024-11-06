import { ResourceService } from '../../domain/services/ResourceService.ts';
import { S3Service } from '../../infrastructure/storage/S3Service.ts';
import { Buffer } from "node:buffer";

export class ProcessResourceEvent {
  constructor(
    private resourceService: ResourceService,
    private s3Service: S3Service
  ) {}

  async execute(profilePicture: Buffer, usuario_uuid: string): Promise<void> {
    const fileName = `profile-pictures/${usuario_uuid}.jpg`;
    const url = await this.s3Service.upload(profilePicture, fileName);

    await this.resourceService.createResource(usuario_uuid, url, 'profilePicture');
  }
}
