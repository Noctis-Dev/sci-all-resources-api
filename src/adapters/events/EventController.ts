// src/adapters/events/EventController.ts
import { ProcessResourceEvent } from '../../application/use_cases/ProcessResourceEvent.ts';
import { S3Service } from '../../infrastructure/storage/S3Service.ts';
import { MongoResourceRepository } from '../../infrastructure/db/MongoResourceRepository.ts';
import { ResourceService } from '../../domain/services/ResourceService.ts';

const s3Service = new S3Service();
const resourceRepository = new MongoResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const processResourceEvent = new ProcessResourceEvent(resourceService, s3Service);

export const handleResourceEvent = async (event: any) => {
  const { resource, resource_type, owner_type, owner_resource_type, owner_uuid } = event;

  await processResourceEvent.execute({
    resource,
    resource_type,
    owner_type,
    owner_resource_type,
    owner_uuid,
  });
};
