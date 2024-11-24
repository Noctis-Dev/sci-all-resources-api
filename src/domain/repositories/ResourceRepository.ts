// src/domain/repositories/ResourceRepository.ts
import { Resource } from '../entities/Resource.ts';

export interface ResourceRepository {
  save(resource: Resource): Promise<void>;
  findByOwnerUUID(ownerUUID: string): Promise<Resource[]>;
  findByType(resourceType: string): Promise<Resource[]>; 
}
