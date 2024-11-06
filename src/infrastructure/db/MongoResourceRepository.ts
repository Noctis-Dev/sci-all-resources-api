import { ResourceRepository } from '../../domain/repositories/ResourceRepository.ts';
import { Resource } from '../../domain/entities/Resource.ts';
import ResourceModel from './mongooseConnection.ts';

export class MongoResourceRepository implements ResourceRepository {
  async save(resource: Resource): Promise<void> {
    await new ResourceModel(resource).save();
  }
}
