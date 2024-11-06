import { ResourceRepository } from '../repositories/ResourceRepository.ts';
import { Resource } from '../entities/Resource.ts';
import { v4 as uuidv4 } from 'npm:uuid';

export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async createResource(usuario_uuid: string, url: string, tipo_recurso: string): Promise<void> {
    const resource: Resource = {
      recurso_uuid: uuidv4(),
      usuario_uuid,
      url,
      tipo_recurso,
    };
    await this.resourceRepository.save(resource);
  }
}
