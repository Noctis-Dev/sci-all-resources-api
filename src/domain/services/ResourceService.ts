import { ResourceRepository } from '../repositories/ResourceRepository.ts';
import { Resource } from '../entities/Resource.ts';

export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async createResource(resource: Resource): Promise<void> {
    await this.resourceRepository.save(resource);
  }

  async getResourcesByOwnerUUID(ownerUUID: string): Promise<Resource[]> {
    console.log('Buscando recursos para owner_uuid:', ownerUUID); // Log del UUID recibido
    const resources = await this.resourceRepository.findByOwnerUUID(ownerUUID);
    console.log('Recursos obtenidos del repositorio:', resources); // Log del resultado
    return resources;
  }

  async getResourcesByType(resourceType: string): Promise<Resource[]> {
    return await this.resourceRepository.findByType(resourceType);
  }
}

