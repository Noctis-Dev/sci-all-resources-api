import { ProcessResourceEvent } from '../../application/use_cases/ProcessResourceEvent.ts';
import { S3Service } from '../../infrastructure/storage/S3Service.ts';
import { MongoResourceRepository } from '../../infrastructure/db/MongoResourceRepository.ts';
import { ResourceService } from '../../domain/services/ResourceService.ts';
import { Buffer } from 'node:buffer';

const s3Service = new S3Service();
const resourceRepository = new MongoResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const processResourceEvent = new ProcessResourceEvent(resourceService, s3Service);

export const handleResourceEvent = async (event: any) => {
  const { profilePicture, usuario_uuid } = event;
  const fileContent = Buffer.from(profilePicture, 'base64'); // Decodifica base64 a Buffer
  await processResourceEvent.execute(fileContent, usuario_uuid);
};
