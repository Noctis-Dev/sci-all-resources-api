import { ResourceRepository } from '../../domain/repositories/ResourceRepository.ts';
import { Resource } from '../../domain/entities/Resource.ts';
import ResourceModel from './mongooseConnection.ts';

export class MongoResourceRepository implements ResourceRepository {
  async save(resource: Resource): Promise<void> {
    await new ResourceModel(resource).save();
  }

  async findByOwnerUUID(ownerUUID: string): Promise<Resource[]> {
    const normalizedUUID = ownerUUID.trim(); // Elimina espacios en blanco
    console.log("Consultando MongoDB con owner_uuid:", normalizedUUID); // Log del UUID normalizado
    const result = await ResourceModel.find({ owner_uuid: normalizedUUID });
    console.log("Resultado de MongoDB:", result);
    return result;
  }

  async findByType(resourceType: string): Promise<Resource[]> {
    return await ResourceModel.find({ resource_type: resourceType.toUpperCase() }); // asegurarse que esto coincida con el formato del tipo en la DB
  }
  
}



