import { Resource } from '../entities/Resource.ts';

export interface ResourceRepository {
  save(resource: Resource): Promise<void>;
}
